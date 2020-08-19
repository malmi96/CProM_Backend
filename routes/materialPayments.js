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
    supplierName,
    projectName,
    quantity,
    unit,
    date,
    amount,
    description,
  } = req.body;
  try {
    const material = await Material.findOne({
      materialName: materialName,
    });
    const supplier = await Supplier.findOne({
      supplierName: supplierName,
    });
    const project = await Project.findOne({
      projectName: projectName,
    });
    //Initializing materialPayment object
    materialPayment = new MaterialPayment({
      materialName: material._id,
      supplierName: supplier._id,
      projectName: project._id,
      quantity: quantity,
      unit: unit,
      date: date,
      amount: amount,
      description: description,
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
router.get('/get', async (req, res) => {
  try {
    const materialPayment = await MaterialPayment.find()
      .populate('materialName', ['materialName'])
      .populate('supplierName', ['supplierName'])
      .sort({ _id: -1 });
    if (!materialPayment) {
      return res.status(404);
    }
    return res.json(materialPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/materialPayments/get/:id
// Desc Get material payment by ID

router.get('/get/:id', async (req, res) => {
  try {
    const materialPayment = await MaterialPayment.findById({
      _id: req.params.id,
    })
      .populate('materialName', ['materialName'])
      .populate('supplierName', ['supplierName'])
      .populate('projectName', ['projectName']);
    if (!materialPayment) {
      return res.status(404);
    }
    return res.json(materialPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/materialPayments/dailyExpenses/:date
// Desc Get material payment by DATE

router.post('/dailyExpenses', async (req, res) => {
  try {
    const date = new Date(req.body.date);
    const payment = await MaterialPayment.find({
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

// GET api/materialPayments/projectExpenses
// Desc Get payments by the project name

router.post('/projectExpenses', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectName: req.body.projectName,
    });
    const payment = await MaterialPayment.find({
      projectName: project._id,
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

//PUT
router.put('/:materialPaymentsId', async (req, res) => {
  try {
    const { materialPayments } = req;
    const material = await Material.findOne({
      materialName: req.body.materialName,
    });
    const supplier = await Supplier.findOne({
      supplierName: req.body.supplierName,
    });
    const project = await Project.findOne({
      projectName: req.body.projectName,
    });
    materialPayments.materialName = material._id;
    materialPayments.supplierName = supplier._id;
    materialPayments.projectName = project._id;
    materialPayments.quantity = req.body.quantity;
    materialPayments.unit = req.body.unit;
    materialPayments.date = req.body.date;
    materialPayments.amount = req.body.amount;
    materialPayments.description = req.body.description;
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
