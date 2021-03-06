const express = require('express');

const Supplier = require('../models/supplier');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST /api/supplier/add
//Desc Add new supplier

router.post(
  '/add',
  [check('email', 'Please enter valid email').isEmail()],
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
      supplierName,
      email,
      address,
      contactNo,
      supplyDelay,
      reorderDelay,
    } = req.body;
    try {
      //To check whether the supplier name exists
      let supplier = await Supplier.findOne({
        supplierName,
      });
      if (supplier) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Supplier already exists' }] });
      }
      //Initializing supplier object
      supplier = new Supplier({
        supplierName,
        email,
        address,
        contactNo,
        supplyDelay,
        reorderDelay,
      });

      await supplier.save();
      res.status(200).json(supplier);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

//GET api/supplier/get
//Desc View supplier info
router.get('/get', checkAuth, async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ _id: -1 });
    if (!suppliers) {
      return res.status(404);
    }
    return res.json(suppliers);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/supplier/:supplierId
// Desc Get supplier by ID

router.get('/:supplierId', checkAuth, async (req, res) => {
  try {
    const supplier = await Supplier.findById({
      _id: req.params.supplierId,
    });
    if (!supplier) {
      return res.status(404);
    }
    return res.json(supplier);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:supplierId', checkAuth, (req, res, next) => {
  try {
    Supplier.findById(req.params.supplierId, (err, supplier) => {
      if (err) {
        res.send(err);
      }
      if (supplier) {
        req.supplier = supplier;
        return next();
      }
      return res.sendStatus(404);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PATCH
router.patch('/:supplierId', checkAuth, (req, res) => {
  try {
    const { supplier } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      supplier[key] = value;
    });
    req.supplier.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(supplier);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:supplierId', checkAuth, (req, res) => {
  try {
    req.supplier.remove((err) => {
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
