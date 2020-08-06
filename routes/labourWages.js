const express = require('express');

const LabourWages = require('../models/labourWages');
const Labour = require('../models/labour');
const Project = require('../models/project');
const Stage = require('../models/stage');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const { findOne } = require('../models/project');

//POST api/labourwages
//Desc add labour wages
router.post('/add', async (req, res) => {
  const {
    paymentType,
    labour,
    nic,
    projectName,
    stageName,
    paymentDate,
    amount,
    description,
  } = req.body;
  try {
    const labourName = await Labour.findOne({
      labourName: labour,
    });
    const project = await Project.findOne({
      projectName: projectName,
    });

    //Initializing labourWages object
    labourwages = new LabourWages({
      paymentType: paymentType,
      labour: labourName._id,
      nic: nic,
      projectName: project._id,
      stageName: stageName,
      paymentDate: paymentDate,
      amount: amount,
      description: description,
    });

    await labourwages.save();
    res.status(200).json(labourwages);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/labourWages/add/labour
//Desc Searching labour

router.post('/add/labour', async (req, res) => {
  try {
    const labour = await Labour.findOne({
      labourNIC: req.body.labourNIC,
    });
    if (!labour) {
      return res.status(400).json({ msg: 'No labour found' });
    }
    res.json(labour);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/labourWages/add/projectName
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

//POST /api/labourWages/add/stageName
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

//GET api/labourWages/get
//Desc View labourWages info
router.get('/get', async (req, res) => {
  try {
    const labourPayment = await LabourWages.find()
      .populate('labour', ['labourName'])
      .populate('projectName', ['projectName'])
      .populate('stageName', ['stageName'])
      .sort({ _id: -1 });
    if (!labourPayment) {
      return res.status(404);
    }
    return res.json(labourPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/labourWages/get/:id
// Desc Get labourWages by ID

router.get('/get/:id', async (req, res) => {
  try {
    const labourPayment = await LabourWages.findById({
      _id: req.params.id,
    })
      .populate('labour', ['labourName'])
      .populate('projectName', ['projectName'])
      .populate('stageName', ['stageName']);
    if (!labourPayment) {
      return res.status(404);
    }
    return res.json(labourPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:labourWagesId', async (req, res, next) => {
  try {
    const labourWages = await LabourWages.findById({
      _id: req.params.labourWagesId,
    });
    if (!labourWages) {
      return res.status(404).send('no labour');
    }
    req.labourWages = labourWages;
    return next();
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PUT
router.put('/:labourWagesId', async (req, res) => {
  try {
    const { labourWages } = req;
    const project = await Project.findOne({
      projectName: req.body.projectName,
    });
    const labour = await Labour.findOne({ labourName: req.body.labour });
    const stage = await Stage.findOne({ stageName: req.body.stageName });
    labourWages.labour = labour._id;
    labourWages.projectName = project._id;
    labourWages.nic = req.body.nic;
    labourWages.paymentDate = req.body.paymentDate;
    labourWages.paymentType = req.body.paymentType;
    labourWages.amount = req.body.amount;
    labourWages.stageName = stage._id;
    labourWages.description = req.body.description;

    await req.labourWages.save();
    return res.json(labourWages);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PATCH
router.patch('/:labourWagesId', (req, res) => {
  try {
    const { labourWages } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      labourWages[key] = value;
    });
    req.labourWages.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(labourWages);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:labourWagesId', (req, res) => {
  try {
    req.labourWages.remove((err) => {
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
