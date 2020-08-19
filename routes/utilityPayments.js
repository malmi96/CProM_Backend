const express = require('express');

const UtilityPayment = require('../models/utilityPayments');
const Project = require('../models/project');
const Stage = require('../models/stage');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/utilityPayments
//Desc add utility Payments
router.post('/add', async (req, res) => {
  const {
    paymentType,
    projectName,
    stageName,
    paymentDate,
    amount,
    description,
  } = req.body;
  try {
    const project = await Project.findOne({
      projectName: projectName,
    });
    //Initializing utilityPayment object
    utilityPayment = new UtilityPayment({
      paymentType: paymentType,
      projectName: project._id,
      stageName: stageName,
      paymentDate: paymentDate,
      amount: amount,
      description: description,
    });

    await utilityPayment.save();
    res.status(200).json(utilityPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/utilityPayments/add/projectName
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

//POST /api/utilityPayments/add/stageName
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

//GET api/utilityPayments/get
//Desc View utilityPayments info
router.get('/get', async (req, res) => {
  try {
    const utilityPayment = await UtilityPayment.find()
      .populate('projectName', ['projectName'])
      .populate('stageName', ['stageName'])
      .sort({ _id: -1 });
    if (!utilityPayment) {
      return res.status(404);
    }
    return res.json(utilityPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/utilityPayments/get/:id
// Desc Get utility payment by ID

router.get('/get/:id', async (req, res) => {
  try {
    const utilityPayment = await UtilityPayment.findById({
      _id: req.params.id,
    })
      .populate('projectName', ['projectName'])
      .populate('stageName', ['stageName']);
    if (!utilityPayment) {
      return res.status(404);
    }
    return res.json(utilityPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/utilityPayments/dailyExpenses/:date
// Desc Get utility payment by DATE

router.post('/dailyExpenses', async (req, res) => {
  try {
    const date = new Date(req.body.date);
    const payment = await UtilityPayment.find({
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

// GET api/utilityPayments/projectExpenses
// Desc Get payments by the project name

router.post('/projectExpenses', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectName: req.body.projectName,
    });
    const payment = await UtilityPayment.find({
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
router.use('/:utilityPaymentsId', (req, res, next) => {
  try {
    UtilityPayment.findById(
      req.params.utilityPaymentsId,
      (err, utilityPayments) => {
        if (err) {
          res.send(err);
        }
        if (utilityPayments) {
          req.utilityPayments = utilityPayments;
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
router.put('/:utilityPaymentsId', async (req, res) => {
  try {
    const { utilityPayments } = req;
    const project = await Project.findOne({
      projectName: req.body.projectName,
    });
    const stage = await Stage.findOne({
      stageName: req.body.stageName,
    });
    utilityPayments.projectName = project._id;
    utilityPayments.paymentDate = req.body.paymentDate;
    utilityPayments.paymentType = req.body.paymentType;
    utilityPayments.amount = req.body.amount;
    utilityPayments.stageName = stage._id;
    utilityPayments.description = req.body.description;
    req.utilityPayments.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(utilityPayments);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PATCH
router.patch('/:utilityPaymentsId', (req, res) => {
  try {
    const { utilityPayments } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      utilityPayments[key] = value;
    });
    req.utilityPayments.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(utilityPayments);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:utilityPaymentsId', (req, res) => {
  try {
    req.utilityPayments.remove((err) => {
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
