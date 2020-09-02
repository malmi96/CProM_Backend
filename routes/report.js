const express = require('express');

const MaterialPayment = require('../models/materialPayments');
const UtilityPayment = require('../models/utilityPayments');
const LabourPayment = require('../models/labourWages');
const Material = require('../models/material');
const Project = require('../models/project');
const Stage = require('../models/stage');
const Task = require('../models/tasks');
const Supplier = require('../models/supplier');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// Desc Get payments by the project name

router.post('/supplierReport', checkAuth, async (req, res) => {
  try {
    const material = await Material.findOne({
      materialName: req.body.materialName,
    });
    const materialPayment = await MaterialPayment.find({
      materialName: material._id,
    }).populate('supplierName', ['supplierName']);

    const supplierList = materialPayment.map((item) => {
      return {
        supplierName: item.supplierName.supplierName,
        unitCost: item.amount / item.quantity,
      };
    });

    return res.json(supplierList);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// Desc get project progress from project name

router.post('/progress', checkAuth, async (req,res) => {
  try{
    const project = await Project.findOne({
      projectName: req.body.projectName
    });
    const stages = await Stage.find({
      projectName: project._id
    })
    var totalTasks = 0;
    var completedTasks = [];
    var stageProgress = 0;
    var progressArr = [];
    
    let promises = stages.map(stage => Task.find({
      stageName: stage._id
    }).populate('stageName', ['stageName']));
  
  Promise.all(promises)
  .then(results => {
    console.log(results)
      results.forEach(task => {
        console.log(task)
        if(task.length === 0){
          return res.json({msg: 'No tasks have been allocated'})
        }
        else{
          totalTasks = task.length;
        const count = task.filter(t => 
          t.status === 'Completed'
        ).length;
        const value = count / totalTasks * 100;
        completedTasks.push(count);
        progressArr.push({
          stageName: task[0].stageName.stageName,
          progress: value
        });
        }
      });
      if(progressArr.length !== 0){
        console.log(progressArr);
      return res.json(progressArr);
      }
    
  });
   
}
  catch (err){
    console.log(err.message);
    res.status(500).send('Server Error');
  }
} );

module.exports = router;
