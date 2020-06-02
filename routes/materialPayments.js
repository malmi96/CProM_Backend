const express = require('express');

const MaterialPayment = require('../models/materialPayments');
const Material = require('../models/material');
const Project = require('../models/project');
const Stage = require('../models/stage');
const Supplier = require('../models/supplier');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/materialPayments
//Desc add material Payments
router.post('/add', async (req, res) => {
  const {
    materialName,
    projectName,
    stageName,
    supplierName,
    date,
    amount,
    quantityBought,
  } = req.body;
  try {
    //Initializing materialPayment object
    materialPayment = new MaterialPayment({
      materialName,
      projectName,
      stageName,
      supplierName,
      date,
      amount,
      quantityBought,
    });

    await materialPayment.save();
    res.status(200).json(materialPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/materialPayments/add/materialType
//Desc Searching materialType

router.post('/add/materialType', async (req, res) => {
  try {
    const material = await Material.findOne({
      materialType: req.body.materialType,
    });
    if (!material) {
      return res.status(400).json({ msg: 'No material type found' });
    }
    res.json(material);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/materialPayments/add/projectName
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

//POST /api/materialPayments/add/stageName
//Desc Searching stageName

router.post('/add/stageName', async (req, res) => {
  try {
    const stage = await Stage.findOne({
      stageName: req.body.stageName,
    });
    if (!stage) {
      return res.status(400).json({ msg: 'No stage found' });
    }
    res.json(stage);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/materialPayments/add/supplierName
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

//GET api/materialPayments/get
//Desc View materialPayments info
router.get('/get', (req, res) => {
  try {
    MaterialPayment.find((err, materialPayments) => {
      if (err) {
        return res.send(err);
      }
      return res.json(materialPayments);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:materialPaymentsId', (req, res, next) => {
  try {
    MaterialPayment.findById(
      req.params.materialPaymentsId,
      (err, materialPayments) => {
        if (err) {
          res.send(err);
        }
        if (materialPayments) {
          req.materialPayments = materialPayments;
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
router.patch('/:materialPaymentsId', (req, res) => {
  try {
    const { materialPayments } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      materialPayments[key] = value;
    });
    req.materialPayments.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(materialPayments);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:materialPaymentsId', (req, res) => {
  try {
    req.materialPayments.remove((err) => {
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
