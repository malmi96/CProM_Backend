const express = require('express');
const Stage = require('../models/stage');
const Project = require('../models/project');
const Labour = require('../models/labour');
const Task = require('../models/tasks');
const StageProgress = require('../models/stageProgress');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const tasks = require('../models/tasks');

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

    let labour = await Labour.findOne({
      labourName: stageSupervisor,
    });
    if (!labour) {
      return res.status(404).json({ errors: [{ msg: 'Labour not found' }] });
    }
    let project = await Project.findOne({
      projectName: projectName,
    });
    if (!project) {
      return res.status(404).json({ errors: [{ msg: 'Project not found' }] });
    }
    //Initializing stage object
    stage = new Stage({
      stageName: stageName,
      stageSupervisor: labour._id,
      stageStartedDate: stageStartedDate,
      stageEndingDate: stageEndingDate,
      stageStatus: stageStatus,
      projectName: project._id,
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
router.get('/get', async (req, res) => {
  try {
    const stage = await Stage.find()
      .populate('stageSupervisor', ['labourName'])
      .populate('projectName', ['projectName'])
      .sort({ _id: -1 });
    if (!stage) {
      return res.status(404);
    }
    return res.json(stage);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/stage/projectID
//Desc View stages of a given project

router.get('/:projectId', async (req, res) => {
  try {
    const stages = await Stage.find({ projectName: req.params.projectId })
      .populate('stageSupervisor', ['labourName'])
      .populate('projectName', ['projectName'])
      .sort({ _id: -1 });
    if (!stages) {
      return res.status(404);
    }
    return res.json(stages);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/stage/view/projectName
//Desc View stages of a given project

router.get('/view/:projectName', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectName: req.params.projectName,
    });
    const stages = await Stage.find({ projectName: project._id })
      .populate('stageSupervisor', ['labourName'])
      .populate('projectName', ['projectName']);
    if (!stages) {
      return res.status(404);
    }
    return res.json(stages);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Desc View stages of a given project for gantt chart

router.get('/gantt/:projectName', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectName: req.params.projectName,
    });
    const stages = await Stage.find({ projectName: project._id })
      .populate('stageSupervisor', ['labourName'])
      .populate('projectName', ['projectName']);
    if (!stages) {
      return res.status(404);
    }
    var ganttArr = [];
    let promises = stages.map(stage => Task.find({
      stageName: stage._id
    }).populate('stageName', ['stageName', 'stageStartedDate',
    'stageEndingDate']));
    Promise.all(promises)
    .then(results => {
        results.forEach(task => {
          if (task.length === 0){
            return res.json({msg: 'Not allocated tasks'})
          }
          else{
            const stage = task[0].stageName;
          ganttArr.push({
            stage,
            task
          })
          }
        })
        if(ganttArr.length !== 0){
          console.log(ganttArr);
        return res.json(ganttArr);
        } 
      }
    )
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/stage/customer/id

router.get('/customer/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectOwner: req.params.id,
    });
    const stages = await Stage.find({ projectName: project._id })
      .populate('stageSupervisor', ['labourName'])
      .populate('projectName', ['projectName']);
    if (!stages) {
      return res.status(404);
    }
    return res.json(stages);
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

router.put('/:stageId', async (req, res) => {
  try {
    const { stage } = req;
    const project = await Project.findOne({
      projectName: req.body.projectName,
    });
    const labour = await Labour.findOne({ labourName: req.body.labourName });
    stage.projectName = project._id;
    stage.stageSupervisor = labour._id;
    stage.stageName = req.body.stageName;
    stage.stageStartedDate = req.body.startingDate;
    stage.stageEndingDate = req.body.endingDate;
    stage.stageStatus = req.body.status;

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

router.delete('/:stageId', async (req, res) => {
  try { 
    const stagePro = await StageProgress.findOne({
      stageName: req.stage._id
    });
    stagePro.remove();
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
