const express = require('express');

const MachineryPayment = require('../models/machineryPayments');
const Machinery = require('../models/machinery');
const Supplier = require('../models/supplier');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/machineryPayments
//Desc add machinery Payments
router.post('/add', async (req, res) => {
  const { machineryName, supplierName, date, amount, paymentType } = req.body;
  try {
    //Initializing machineryPayment object
    machineryPayment = new MachineryPayment({
      machineryName,
      supplierName,
      date,
      amount,
      paymentType,
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
router.get('/get', (req, res) => {
  try {
    MachineryPayment.find((err, machineryPayments) => {
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
