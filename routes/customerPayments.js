const express = require('express');
const Customer = require('../models/customer');
const CustomerPayment = require('../models/customerPayments');
const Project = require('../models/project');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/customerPayments
//Desc add customer Payments
router.post('/add', async (req, res) => {
  const {
    customerName,
    projectName,
    paymentDate,
    paymentType,
    amount,
    method,
    description,
  } = req.body;
  try {
    const project = await Project.findOne({
      projectName: projectName,
    });
    const customer = await Customer.findOne({
      customerName: customerName,
    });
    //Initializing customerPayment object
    customerPayment = new CustomerPayment({
      customerName: customer._id,
      projectName: project._id,
      paymentDate: paymentDate,
      paymentType: paymentType,
      amount: amount,
      method: method,
      description: description,
    });

    await customerPayment.save();
    res.status(200).json(customerPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/customerPayments/add/projectName
//Desc Searching projectName

router.post('/add/projectName', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectName: req.body.projectName,
    });
    if (!project) {
      return res.status(400).json({ msg: 'No project found' });
    }
    res.json(project);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/users/customerPayments/get
//Desc View customerPayments info
router.get('/get', async (req, res) => {
  try {
    const customerPayment = await CustomerPayment.find()
      .populate('customerName', ['customerName'])
      .populate('projectName', ['projectName'])
      .sort({ _id: -1 });
    if (!customerPayment) {
      return res.status(404);
    }
    return res.json(customerPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/users/customerPayments/get/:id
// Desc Get project by ID

router.get('/get/:id', async (req, res) => {
  try {
    const customerPayment = await CustomerPayment.findById({
      _id: req.params.id,
    })
      .populate('customerName', ['customerName'])
      .populate('projectName', ['projectName']);
    if (!customerPayment) {
      return res.status(404);
    }
    return res.json(customerPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:customerPaymentsId', (req, res, next) => {
  try {
    CustomerPayment.findById(
      req.params.customerPaymentsId,
      (err, customerPayments) => {
        if (err) {
          res.send(err);
        }
        if (customerPayments) {
          req.customerPayments = customerPayments;
          return next();
        }
        return res.sendStatus(404);
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PUT

router.put('/:customerPaymentsId', async (req, res) => {
  try {
    const { customerPayments } = req;
    const project = await Project.findOne({
      projectName: req.body.projectName,
    });
    const customer = await Customer.findOne({
      customerName: req.body.customerName,
    });
    customerPayments.customerName = customer._id;
    customerPayments.projectName = project._id;
    customerPayments.paymentDate = req.body.paymentDate;
    customerPayments.paymentType = req.body.paymentType;
    customerPayments.amount = req.body.amount;
    customerPayments.method = req.body.method;
    customerPayments.description = req.body.description;
    req.customerPayments.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(customerPayments);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PATCH
router.patch('/:customerPaymentsId', (req, res) => {
  try {
    const { customerPayments } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      customerPayments[key] = value;
    });
    req.customerPayments.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(customerPayments);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:customerPaymentsId', (req, res) => {
  try {
    req.customerPayments.remove((err) => {
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
