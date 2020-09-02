const express = require('express');
const StageProgress = require('../models/stageProgress');
const Project = require('../models/project');
const Task = require('../models/tasks');

const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const stageProgress = require('../models/stageProgress');

//POST api/stage/add
//Desc Add new stage
router.post('/add', checkAuth, async (req, res) => {
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
    if(req.body.status === 'Completed' ){
      let completedTasks = await Task.find({
        stageName: stageName,
        status: 'Completed'
      });
      let totTasks = await Task.find({
        stageName: stageName
      });
      let stagePro = await StageProgress.findOne({
        stageName: stageName
      });
      if(completedTasks.length === 0 && !stagePro){
        let stageProgress = new StageProgress({
          stageName: stageName,
          progress: 1 / totTasks.length * 100
        })
        await stageProgress.save();
      }
      else if(completedTasks.length === 0 && stagePro){
        stagePro.progress = 1 / totTasks.length * 100;
        await stagePro.save();
      }
      else if(completedTasks.length !== 0 && !stagePro ){
        let stageProgress = new StageProgress({
          stageName: stageName,
          progress: completedTasks.length / totTasks.length * 100
        })
        await stageProgress.save();
      }
      else if( completedTasks.length !== 0 && stagePro){
        stagePro.progress = (completedTasks.length) / totTasks.length * 100;
        await stagePro.save();
      }
    }
    else{
      let completedTasks = await Task.find({
        stageName: stageName,
        status: 'Completed'
      });
      let totTasks = await Task.find({
        stageName: stageName
      });
      let stagePro = await StageProgress.findOne({
        stageName: stageName
      });
      if(stagePro){
        stagePro.progress = completedTasks.length / totTasks.length * 100;
        await stagePro.save();
      }
    }
    
    res.status(200).json(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/stageName', checkAuth, async (req, res) => {
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

router.get('/:taskId', checkAuth, async (req, res) => {
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
router.patch('/status/:taskId', checkAuth, async (req, res) => {
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
    if(req.body.status === 'Completed' ){
      let completedTasks = await Task.find({
        stageName: task.stageName,
        status: 'Completed'
      });
      let totTasks = await Task.find({
        stageName: task.stageName
      });
      let stagePro = await StageProgress.findOne({
        stageName: task.stageName
      });
      if(completedTasks.length === 0 && !stagePro){
        let stageProgress = new StageProgress({
          stageName: task.stageName,
          progress: 1 / totTasks.length * 100
        })
        await stageProgress.save();
      }
      else if(completedTasks.length === 0 && stagePro){
        stagePro.progress = 1 / totTasks.length * 100;
        await stagePro.save();
      }
      else if(completedTasks.length !== 0 && !stagePro ){
        let stageProgress = new StageProgress({
          stageName: task.stageName,
          progress: completedTasks.length / totTasks.length * 100
        })
        await stageProgress.save();
      }
      else if( completedTasks.length !== 0 && stagePro){
        stagePro.progress = (completedTasks.length) / totTasks.length * 100;
        await stagePro.save();
      }
    }
    else{
      let completedTasks = await Task.find({
        stageName: task.stageName,
        status: 'Completed'
      });
      let totTasks = await Task.find({
        stageName: task.stageName
      });
      let stagePro = await StageProgress.findOne({
        stageName: task.stageName
      });
      if(stagePro){
        stagePro.progress = completedTasks.length / totTasks.length * 100;
        await stagePro.save();
      }
    }

    return res.json(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PATCH
router.patch('/update/:taskId', checkAuth, async (req, res) => {
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
    
    if(req.body.status === 'Completed' ){
      let completedTasks = await Task.find({
        stageName: task.stageName,
        status: 'Completed'
      });
      let totTasks = await Task.find({
        stageName: task.stageName
      });
      let stagePro = await StageProgress.findOne({
        stageName: task.stageName
      });
      if(completedTasks.length === 0 && !stagePro){
        let stageProgress = new StageProgress({
          stageName: task.stageName,
          progress: 1 / totTasks.length * 100
        })
        await stageProgress.save();
      }
      else if(completedTasks.length === 0 && stagePro){
        stagePro.progress = 1 / totTasks.length * 100;
        await stagePro.save();
      }
      else if(completedTasks.length !== 0 && !stagePro ){
        let stageProgress = new StageProgress({
          stageName: task.stageName,
          progress: completedTasks.length / totTasks.length * 100
        })
        await stageProgress.save();
      }
      else if( completedTasks.length !== 0 && stagePro){
        stagePro.progress = (completedTasks.length) / totTasks.length * 100;
        await stagePro.save();
      }
    }
    else{
      let completedTasks = await Task.find({
        stageName: task.stageName,
        status: 'Completed'
      });
      let totTasks = await Task.find({
        stageName: task.stageName
      });
      let stagePro = await StageProgress.findOne({
        stageName: task.stageName
      });
      if(stagePro){
        stagePro.progress = completedTasks.length / totTasks.length * 100;
        await stagePro.save();
      }
    }

    return res.json(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/delete/:taskId', checkAuth, async (req, res) => {
  try {
    const task = await Task.findById({
      _id: req.params.taskId,
    });
    await task.remove();
    let completedTasks = await Task.find({
      stageName: task.stageName,
      status: 'Completed'
    });
    let totTasks = await Task.find({
      stageName: task.stageName
    });
    let stagePro = await StageProgress.findOne({
      stageName: task.stageName
    });
    if(stagePro){
      stagePro.progress = completedTasks.length / totTasks.length * 100;
      await stagePro.save();
    }

    return res.sendStatus(204);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
