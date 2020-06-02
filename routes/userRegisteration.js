const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const Employee = require('../models/employee');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/login
//User login

router.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;
  if (userType === 'Customer') {
    try {
      const user = await Customer.findOne({
        email,
      });
      if (!user) {
        return res.status(401).json({ errors: [{ msg: 'Auth failed' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const payLoad = {
        user: {
          userId: user._id,
          userType: 'Customer',
        },
      };
      jwt.sign(
        payLoad,
        'My secret token',
        {
          expiresIn: 18000,
        },
        (err, token) => {
          if (err) throw err;
          console.log(token);
          res.status(200).json({
            token: token,
            userType: 'Customer',
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
  if (userType === 'Employee') {
    try {
      const user = await Employee.findOne({
        email,
      });
      if (!user) {
        return res.status(401).json({ errors: [{ msg: 'Auth failed' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const payLoad = {
        user: {
          userId: user._id,
          userType: user.designation,
        },
      };
      jwt.sign(
        payLoad,
        'My secret token',
        {
          expiresIn: 18000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token: token,
            userType: user.designation,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
});

//POST api/users/customer
//Desc Register customer
router.post(
  '/customer',
  [
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Please enter a password with 8 characters').isLength({
      min: 8,
    }),
  ],
  checkAuth,
  async (req, res) => {
    //error checking
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { customerName, email, nic, address, contactNo, password } = req.body;
    try {
      //To check whether the email exists
      let user = await Customer.findOne({
        email,
      });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Customer already exists' }] });
      }
      //Initializing user object
      user = new Customer({
        customerName,
        email,
        nic,
        address,
        contactNo,
        password,
      });
      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.status(200).json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//GET api/users/customer/get
//Desc View customer info
router.get('/customer/get', (req, res) => {
  try {
    Customer.find((err, customers) => {
      if (err) {
        return res.send(err);
      }
      return res.json(customers);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/customer/:customerId', (req, res, next) => {
  try {
    Customer.findById(req.params.customerId, (err, customer) => {
      if (err) {
        res.send(err);
      }
      if (customer) {
        req.customer = customer;
        return next();
      }
      return res.sendStatus(404);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PUT api/users/customer/:customerId
//Desc Update customer details
router.put('/customer/:customerId', (req, res) => {
  try {
    const { customer } = req;
    customer.customerName = req.body.customerName;
    customer.email = req.body.email;
    customer.nic = req.body.nic;
    customer.address = req.body.address;
    customer.contactNo = req.body.contactNo;
    customer.password = req.body.password;
    req.customer.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(customer);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PATCH
router.patch('/customer/:customerId', (req, res) => {
  try {
    const { customer } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      customer[key] = value;
    });
    req.customer.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(customer);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/customer/:customerId', (req, res) => {
  try {
    req.customer.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST api/users/employee
//Desc Register employee
router.post(
  '/employee',
  [
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Please enter a password with 8 characters').isLength({
      min: 8,
    }),
  ],
  checkAuth,
  async (req, res) => {
    //error checking
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const {
      employeeName,
      email,
      nic,
      address,
      contactNo,
      designation,
      password,
    } = req.body;
    try {
      //To check whether the email already exists
      let employee = await Employee.findOne({
        email,
      });
      if (employee) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Employee already exists' }] });
      }
      //Initializing employee object
      employee = new Employee({
        employeeName,
        email,
        nic,
        address,
        contactNo,
        designation,
        password,
      });
      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      employee.password = await bcrypt.hash(password, salt);

      await employee.save();
      res.status(200).json(employee);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//GET api/users/employee/get
//Desc View employee info
router.get('/employee/get', (req, res) => {
  try {
    Employee.find((err, employee) => {
      if (err) {
        return res.send(err);
      }
      return res.json(employee);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/employee/:employeeId', (req, res, next) => {
  try {
    Customer.findById(req.params.employeeId, (err, employee) => {
      if (err) {
        res.send(err);
      }
      if (employee) {
        req.employee = employee;
        return next();
      }
      return res.sendStatus(404);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PUT api/users/employee/:employeeId
//Desc Update employee details
router.put('/employee/:employeeId', (req, res) => {
  try {
    const { employee } = req;
    employee.employeeName = req.body.employeeName;
    employee.email = req.body.email;
    employee.nic = req.body.nic;
    employee.address = req.body.address;
    employee.contactNo = req.body.contactNo;
    employee.designation = req.body.designation;
    employee.password = req.body.password;
    req.employee.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(employee);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PATCH
router.patch('/employee/:employeeId', (req, res) => {
  try {
    const { employee } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      employee[key] = value;
    });
    req.employee.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(employee);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/employee/:employeeId', (req, res) => {
  try {
    req.employee.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
