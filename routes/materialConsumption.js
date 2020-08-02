const express = require('express');

const MaterialConsumption = require('../models/materialConsumption');
const Material = require('../models/material');
const Project = require('../models/project');
const Stage = require('../models/stage');

const router = express.Router();

//POST /api/materialConsumption/add
//Desc add material consumption in each project

router.post('/add', async (req, res) => {
  const {
    materialName,
    quantity,
    unit,
    projectName,
    stageName,
    date,
  } = req.body;
  try {
    let project = await Project.findOne({ projectName: projectName });
    let materialCheck = await Material.findOne({ materialName: materialName });
    let stageCheck = await Stage.findOne({ stageName: stageName });
    //To check whether the material type exists
    let material = await Material.findOne({
      projectName: project._id,
      materialName: materialCheck._id,
      stageName: stageCheck._id,
    });
    if (material) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Material consumption is already added' }] });
    }
    //Initializing materialConsumption object
    materialConsumption = new MaterialConsumption({
      materialName: materialCheck._id,
      quantity: quantity,
      unit: unit,
      projectName: project._id,
      stageName: stageCheck._id,
      date: date,
    });

    await materialConsumption.save();
    res.status(200).json(materialConsumption);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/materialConsumption/add/materialType
//Desc Searching materialType

router.post('/add/materialType', async (req, res) => {
  try {
    const material = await Material.findOne({
      materialType: req.body.materialType,
    });
    if (!material) {
      return res.status(400).json({ msg: 'No material type found' });
    }
    res.json(material);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/materialConsumption/add/projectName
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

//POST /api/materialConsumption/add/stageName
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

//GET api/materialConsumption/get
//Desc View materialConsumption info
router.get('/get', (req, res) => {
  try {
    MaterialConsumption.find((err, materialConsumption) => {
      if (err) {
        return res.send(err);
      }
      return res.json(materialConsumption);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:materialConsumptionId', (req, res, next) => {
  try {
    Material.findById(
      req.params.materialConsumptionId,
      (err, materialConsumption) => {
        if (err) {
          res.send(err);
        }
        if (materialConsumption) {
          req.materialConsumption = materialConsumption;
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
router.patch('/:materialConsumptionId', (req, res) => {
  try {
    const { materialConsumption } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      materialConsumption[key] = value;
    });
    req.materialConsumption.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(materialConsumption);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:materialConsumptionId', (req, res) => {
  try {
    req.materialConsumption.remove((err) => {
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
