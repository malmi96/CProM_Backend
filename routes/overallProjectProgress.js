const express = require('express');

const Project = require('../models/project');
const Stage = require('../models/stage');
const Task = require('../models/tasks');
const StageProgress = require('../models/stageProgress');

const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// Desc get project progress from project name

router.get('/progress', checkAuth, async (req,res) => {
  try{
    
    const progressList = await StageProgress.find()
    .populate({
        path: "stageName",
        populate: {
            path: "projectName",
            select: ["projectName","projectStatus"]
        }
    });
    var details = progressList.map(item =>{
        return {
            stageId: item.stageName._id,
            stageName: item.stageName.stageName,
            progress: item.progress,
            projectId: item.stageName.projectName._id,
            projectName: item.stageName.projectName.projectName
        }
    })
    
    const projectList = await Project.find({
        projectStatus: 'Ongoing'
    })
    var resolvedArray = projectList.map(project =>{
        const arr = details.filter(eachItem => eachItem.projectName === project.projectName);
        var totprogress = 0;
        arr.forEach(i => {
            totprogress = totprogress + i.progress
        })
        const overallProgress = totprogress / 4;
        return {
            projectId: project._id,
            projectName: project.projectName,
            progress: overallProgress
        }
    })

    res.json(resolvedArray);
   
}
  catch (err){
    console.log(err.message);
    res.status(500).send('Server Error');
  }
} );

module.exports = router;
