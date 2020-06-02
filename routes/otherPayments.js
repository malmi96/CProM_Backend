const express = require('express');

const OtherPayment = require('../models/otherPayments');
const Project = require('../models/project');
const Stage = require('../models/stage');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/otherPayments
//Desc add other Payments
router.post('/add', async (req, res) => {
  const {
    billType,
    paymentInfo,
    projectName,
    stageName,
    billDate,
    amount,
  } = req.body;
  try {
    //Initializing otherPayment object
    otherPayment = new OtherPayment({
      billType,
      paymentInfo,
      projectName,
      stageName,
      billDate,
      amount,
    });

    await otherPayment.save();
    res.status(200).json(otherPayment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/otherPayments/add/projectName
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

//POST /api/otherPayments/add/stageName
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

//GET api/otherPayments/get
//Desc View otherPayments info
router.get('/get', (req, res) => {
  try {
    OtherPayment.find((err, otherPayments) => {
      if (err) {
        return res.send(err);
      }
      return res.json(otherPayments);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:otherPaymentsId', (req, res, next) => {
  try {
    OtherPayment.findById(req.params.otherPaymentsId, (err, otherPayments) => {
      if (err) {
        res.send(err);
      }
      if (otherPayments) {
        req.otherPayments = otherPayments;
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
router.patch('/:otherPaymentsId', (req, res) => {
  try {
    const { otherPayments } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      otherPayments[key] = value;
    });
    req.otherPayments.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(otherPayments);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:otherPaymentsId', (req, res) => {
  try {
    req.otherPayments.remove((err) => {
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
