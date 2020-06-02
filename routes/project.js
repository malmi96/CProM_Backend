const express = require('express');
const Customer = require('../models/customer');
const Project = require('../models/project');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/project/add
//Desc Add new project
router.post('/add', async (req, res) => {
  const {
    projectName,
    projectLocation,
    projectOwner,
    startedDate,
    projectedEndingDate,
    projectStatus,
  } = req.body;
  try {
    //To check whether the project exists
    let project = await Project.findOne({
      projectName,
    });
    if (project) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Project name already exists' }] });
    }
    //Initializing project object
    project = new Project({
      projectName,
      projectLocation,
      projectOwner,
      startedDate,
      projectedEndingDate,
      projectStatus,
    });
    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/project/add/customerSearch
//Desc Searching customer with relavent nic

router.post('/add/customerSearch', async (req, res) => {
  try {
    const owner = await Customer.findOne({
      nic: req.body.nic,
    });
    if (!owner) {
      return res.status(400).json({ msg: 'No customer found' });
    }
    res.json(owner);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/project/get
//Desc View project info
router.get('/get', (req, res) => {
  try {
    Project.find((err, project) => {
      if (err) {
        return res.send(err);
      }
      return res.json(project);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:projectId', (req, res, next) => {
  try {
    Project.findById(req.params.projectId, (err, project) => {
      if (err) {
        res.send(err);
      }
      if (project) {
        req.project = project;
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
router.patch('/:projectId', (req, res) => {
  try {
    const { project } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      project[key] = value;
    });
    req.project.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(project);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:projectId', (req, res) => {
  try {
    req.project.remove((err) => {
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
