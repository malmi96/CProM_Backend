const express = require('express');
const Stage = require('../models/stage');
const Project = require('../models/project');
const Labour = require('../models/labour');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/stage/add
//Desc Add new stage
router.post('/add', async (req, res) => {
  const {
    stageName,
    stageSupervisor,
    stageStartedDate,
    stageEndingDate,
    stageStatus,
    projectName,
  } = req.body;
  try {
    //To check whether the stage exists
    let stage = await Stage.findOne({
      stageName,
    });
    if (stage) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Stage already exists' }] });
    }
    //Initializing stage object
    stage = new Stage({
      stageName,
      stageSupervisor,
      stageStartedDate,
      stageEndingDate,
      stageStatus,
      projectName,
    });
    await stage.save();
    res.status(200).json(stage);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/stage/add/projectName
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

//POST /api/stage/add/stageSupervisor
//Desc Searching stageSupervisor

router.post('/add/stageSupervisor', async (req, res) => {
  try {
    const supervisor = await Labour.findOne({
      labourNIC: req.body.labourNIC,
    });
    if (!supervisor) {
      return res.status(400).json({ msg: 'No labour found' });
    }
    res.json(supervisor);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/stage/get
//Desc View stage info
router.get('/get', (req, res) => {
  try {
    Stage.find((err, stage) => {
      if (err) {
        return res.send(err);
      }
      return res.json(stage);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:stageId', (req, res, next) => {
  try {
    Stage.findById(req.params.stageId, (err, stage) => {
      if (err) {
        res.send(err);
      }
      if (stage) {
        req.stage = stage;
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
router.patch('/:stageId', (req, res) => {
  try {
    const { stage } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      stage[key] = value;
    });
    req.stage.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(stage);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:stageId', (req, res) => {
  try {
    req.stage.remove((err) => {
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
