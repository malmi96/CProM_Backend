const express = require('express');
const Stage = require('../models/stage');
const Project = require('../models/project');
const Task = require('../models/tasks');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/stage/add
//Desc Add new stage
router.post('/add', async (req, res) => {
  const {
    stageName,
    taskName,
    startDate,
    endDate,
    status,
    projectName,
  } = req.body;
  try {
    //To check whether the stage exists
    let task = await Task.findOne({
      stageName: stageName,
      taskName: taskName,
    });
    if (task) {
      return res.status(400).json({ errors: [{ msg: 'Task already exists' }] });
    }
    //Initializing stage object
    task = new Task({
      taskName: taskName,
      stageName: stageName,
      startDate: startDate,
      endDate: endDate,
      status: status,
      projectName: projectName,
    });
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/stageName', async (req, res) => {
  try {
    const task = await Task.find({
      stageName: req.body.stageName,
    })
      .populate('stageName', ['stageName'])
      .populate('projectName', ['projectName']);
    return res.json(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:taskId', async (req, res) => {
  try {
    const task = await Task.findById({
      _id: req.params.taskId,
    });
    if (!task) {
      return res.status(404);
    }
    return res.json(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

/*router.put('/update/:taskId', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
    });
    console.log(task);
    console.log(req.body);
    task.taskName = req.body.taskName;
    task.startDate = req.body.startDate;
    task.startDate = req.body.endDate;
    task.status = req.body.status;
    console.log(task);
    await task.save();
    return res.json(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});*/

//PATCH
router.patch('/status/:taskId', async (req, res) => {
  try {
    const task = await Task.findById({
      _id: req.params.taskId,
    });
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      task[key] = value;
    });
    await task.save();
    return res.json(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PATCH
router.patch('/update/:taskId', async (req, res) => {
  try {
    const task = await Task.findById({
      _id: req.params.taskId,
    });
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      task[key] = value;
    });
    await task.save();
    return res.json(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/delete/:taskId', async (req, res) => {
  try {
    const task = await Task.findById({
      _id: req.params.taskId,
    });
    await task.remove();
    return res.sendStatus(204);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;