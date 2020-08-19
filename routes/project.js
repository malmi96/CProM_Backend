const express = require('express');
const Customer = require('../models/customer');
const Project = require('../models/project');
const Stage = require('../models/stage');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const customer = require('../models/customer');

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
    let customer = await Customer.findOne({
      customerName: projectOwner,
    });
    if (!customer) {
      return res.status(404).json({ errors: [{ msg: 'Customer not found' }] });
    }

    //Initializing project object
    project = new Project({
      projectName: projectName,
      projectLocation: projectLocation,
      projectOwner: customer._id,
      startedDate: startedDate,
      projectedEndingDate: projectedEndingDate,
      projectStatus: projectStatus,
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
router.get('/get', async (req, res) => {
  try {
    const project = await Project.find()
      .populate('projectOwner', ['customerName'])
      .sort({ _id: -1 });
    if (!project) {
      return res.status(404);
    }
    return res.json(project);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/project/:projectId
// Desc Get project by ID

router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById({
      _id: req.params.projectId,
    }).populate('projectOwner', ['customerName']);
    if (!project) {
      return res.status(404);
    }
    return res.json(project);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/project/view/:projectName
// Desc Get Customer Name from project Name

router.get('/view/:projectName', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectName: req.params.projectName,
    }).populate('projectOwner', ['customerName']);
    if (!project) {
      return res.status(404);
    }
    return res.json(project);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/project/customer/:customerId
// Desc Get Project from customer Id

router.get('/customer/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectOwner: req.params.id,
    });
    if (!project) {
      return res.status(404);
    }
    const stages = await Stage.find({
      projectName: project._id,
    });
    return res.json(project);
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

router.put('/:projectId', (req, res) => {
  try {
    const { project } = req;
    if (req.body.customerName != null) {
      Customer.findOne({ customerName: req.body.customerName }, function (
        err,
        customer
      ) {
        req.body.customerName = customer._id;
        project.projectName = req.body.projectName;
        project.projectLocation = req.body.projectLocation;
        project.projectOwner = req.body.customerName;
        project.startedDate = req.body.startingDate;
        project.projectedEndingDate = req.body.endingDate;
        project.projectStatus = req.body.status;
        console.log(req.project);
        req.project.save((err) => {
          if (err) {
            return res.send(err);
          }
          return res.json(project);
        });
      });
    }
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
    if (req.body.customerName !== null) {
      Customer.findOne({ customerName: req.body.customerName }, function (
        err,
        obj
      ) {
        req.body.customerName = obj._id;
        console.log(req.body.customerName);
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
      });
    }
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
