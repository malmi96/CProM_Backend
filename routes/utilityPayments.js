const express = require('express');

const UtilityPayment = require('../models/utilityPayments');
const Project = require('../models/project');
const Stage = require('../models/stage');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/utilityPayments
//Desc add utility Payments
router.post('/add', async (req, res) => {
  const { billType, projectName, stageName, billDate, amount } = req.body;
  try {
    //Initializing utilityPayment object
    utilityPayment = new UtilityPayment({
      billType,
      projectName,
      stageName,
      billDate,
      amount,
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
router.get('/get', (req, res) => {
  try {
    UtilityPayment.find((err, utilityPayments) => {
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
