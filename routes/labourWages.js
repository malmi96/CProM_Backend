const express = require('express');

const LabourWages = require('../models/labourWages');
const Labour = require('../models/labour');
const Project = require('../models/project');
const Stage = require('../models/stage');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/labourwages
//Desc add labour wages
router.post('/add', async (req, res) => {
  const {
    paymentType,
    labour,
    projectName,
    stageName,
    paymentDate,
    amount,
  } = req.body;
  try {
    //Initializing labourWages object
    labourwages = new LabourWages({
      paymentType,
      labour,
      projectName,
      stageName,
      paymentDate,
      amount,
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
router.get('/get', (req, res) => {
  try {
    LabourWages.find((err, labourWages) => {
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

//Implementing middleware
router.use('/:labourWagesId', (req, res, next) => {
  try {
    LabourWages.findById(req.params.labourWagesId, (err, labourWages) => {
      if (err) {
        res.send(err);
      }
      if (labourWages) {
        req.labourWages = labourWages;
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
