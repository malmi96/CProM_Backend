const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const Employee = require('../models/employee');
const Project = require('../models/project');
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
        return res.json({ errors: [{ msg: 'Auth failed' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
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
            userId: user._id,
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
            userId: user._id,
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
router.get('/customer/get', checkAuth, (req, res) => {
  try {
    Customer.find((err, customers) => {
      if (err) {
        return res.send(err);
      }
      return res.json(customers);
    }).sort({ _id: -1 });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Get api/users/customer/:customerId
//Desc Get user by ID
router.get('/customer/:customerId', checkAuth, async (req, res) => {
  try {
    Customer.findById(req.params.customerId, (err, customer) => {
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

//Implementing middleware
router.use('/customer/:customerId', checkAuth, (req, res, next) => {
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
router.put('/customer/:customerId', checkAuth, (req, res) => {
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
router.patch('/customer/:customerId', checkAuth, (req, res) => {
  try {
    const { customer } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    if (!req.body.password) {
      req.body.password = '';
    }
    var password = req.body.password;
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        password = hash;
        req.body.password = password;
        Object.entries(req.body).forEach((item) => {
          const key = item[0];
          const value = item[1];
          customer[key] = value;
        });
        req.customer.save((err) => {
          if (err) {
            return res.send(err);
          }
          return res.json(req.customer);
        });
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/customer/:customerId', checkAuth, async (req, res) => {
  try {
    
    const project = await Project.find({
      projectOwner: req.customer._id
    })
    console.log(project);
    if (project.length === 0){
      req.customer.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    }
    else {
      return res.json({msg: 'Cannot delete'})
    }
    
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
router.get('/employee/get', checkAuth, (req, res) => {
  try {
    Employee.find((err, employee) => {
      if (err) {
        return res.send(err);
      }
      return res.json(employee);
    }).sort({ _id: -1 });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
//Get api/users/employee/:employeeId
//Desc Get user by ID
router.get('/employee/:employeeId', checkAuth, async (req, res) => {
  try {
    Employee.findById(req.params.employeeId, (err, employee) => {
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
router.use('/employee/:employeeId', checkAuth, (req, res, next) => {
  try {
    Employee.findById(req.params.employeeId, (err, employee) => {
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
router.put('/employee/:employeeId', checkAuth, (req, res) => {
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
router.patch('/employee/:employeeId', checkAuth, (req, res) => {
  try {
    const { employee } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    if (!req.body.password) {
      req.body.password = '';
    }
    var password = req.body.password;
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        password = hash;
        req.body.password = password;
        Object.entries(req.body).forEach((item) => {
          const key = item[0];
          const value = item[1];
          employee[key] = value;
        });
        req.employee.save((err) => {
          if (err) {
            return res.send(err);
          }
          return res.json(req.employee);
        });
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/employee/:employeeId', checkAuth, (req, res) => {
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
