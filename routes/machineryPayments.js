const express = require('express');

const MachineryPayment = require('../models/machineryPayments');
const Machinery = require('../models/machinery');
const Supplier = require('../models/supplier');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/machineryPayments
//Desc add machinery Payments
router.post('/add', async (req, res) => {
  const {
    machineryName,
    supplierName,
    date,
    amount,
    paymentType,
    description,
  } = req.body;
  try {
    const machinery = await Machinery.findOne({
      machineryName: machineryName,
    });
    const supplier = await Supplier.findOne({
      supplierName: supplierName,
    });

    //Initializing machineryPayment object
    machineryPayment = new MachineryPayment({
      machineryName: machinery._id,
      supplierName: supplier._id,
      date: date,
      amount: amount,
      paymentType: paymentType,
      description: description,
    });

    await machineryPayment.save();
    res.status(200).json(machineryPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/machineryPayments/add/machineryName
//Desc Searching machineryName

router.post('/add/machineryName', async (req, res) => {
  try {
    const machinery = await Machinery.findOne({
      machineryName: req.body.machineryName,
    });
    if (!machinery) {
      return res.status(400).json({ msg: 'No machinery found' });
    }
    res.json(machinery);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/machineryPayments/add/supplierName
//Desc Searching supplierName

router.post('/add/supplierName', async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      supplierName: req.body.supplierName,
    });
    if (!supplier) {
      return res.status(400).json({ msg: 'No supplier found' });
    }
    res.json(supplier);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/machineryPayments/get
//Desc View machineryPayments info
router.get('/get', async (req, res) => {
  try {
    const machineryPayment = await MachineryPayment.find()
      .populate('machineryName', ['machineryName'])
      .populate('supplierName', ['supplierName'])
      .sort({ _id: -1 });
    if (!machineryPayment) {
      return res.status(404);
    }
    return res.json(machineryPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/machineryPayments/get/:id
// Desc Get machinery payment by ID

router.get('/get/:id', async (req, res) => {
  try {
    const machineryPayment = await MachineryPayment.findById({
      _id: req.params.id,
    })
      .populate('machineryName', ['machineryName'])
      .populate('supplierName', ['supplierName']);
    if (!machineryPayment) {
      return res.status(404);
    }
    return res.json(machineryPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/machineryPayments/dailyExpenses/:date
// Desc Get machinery payment by DATE

router.post('/dailyExpenses', async (req, res) => {
  try {
    const date = new Date(req.body.date);
    const payment = await MachineryPayment.find({
      date: date,
    });
    var totalCost = 0;
    payment.forEach((res) => {
      totalCost = res.amount + totalCost;
    });
    return res.json(totalCost);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:machineryPaymentsId', (req, res, next) => {
  try {
    MachineryPayment.findById(
      req.params.machineryPaymentsId,
      (err, machineryPayments) => {
        if (err) {
          res.send(err);
        }
        if (machineryPayments) {
          req.machineryPayments = machineryPayments;
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
router.put('/:machineryPaymentsId', async (req, res) => {
  try {
    const { machineryPayments } = req;
    const machinery = await Machinery.findOne({
      machineryName: req.body.machineryName,
    });
    const supplier = await Supplier.findOne({
      supplierName: req.body.supplierName,
    });
    machineryPayments.machineryName = machinery._id;
    machineryPayments.supplierName = supplier._id;
    machineryPayments.date = req.body.date;
    machineryPayments.paymentType = req.body.paymentType;
    machineryPayments.amount = req.body.amount;
    machineryPayments.description = req.body.description;
    req.machineryPayments.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(machineryPayments);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PATCH
router.patch('/:machineryPaymentsId', (req, res) => {
  try {
    const { machineryPayments } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      machineryPayments[key] = value;
    });
    req.machineryPayments.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(machineryPayments);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:machineryPaymentsId', (req, res) => {
  try {
    req.machineryPayments.remove((err) => {
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
