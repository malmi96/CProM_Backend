const express = require('express');

const MaterialConsumption = require('../models/materialConsumption');
const MaterialConsumptionLog = require('../models/materialConsumptionLog');
const MaterialAllocation = require('../models/materialAllocation');
const Material = require('../models/material');
const Project = require('../models/project');
const Stage = require('../models/stage');
const reorderFormula = require('../businessLogics/reorderFormula');

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
    let material = await Material.findOne({ materialName: materialName });
    let stage = await Stage.findOne({ stageName: stageName });
    // To save in the log
    var materialConsumptionLog = new MaterialConsumptionLog({
      materialName: material._id,
      quantity: quantity,
      unit: unit,
      projectName: project._id,
      stageName: stage._id,
      date: date,
    });

    let materialAllocation = await MaterialAllocation.findOne({
      materialName: material._id,
      projectName: project._id,
    });
    if (!materialAllocation) {
      return res.status(400).json({ errors: 'allocation' });
    }
    materialAllocation.quantity = materialAllocation.quantity - quantity;
    const reorderLevel = await reorderFormula(material._id);
    console.log(reorderLevel);
    if (materialAllocation.quantity <= reorderLevel) {
      return res.status(400).json({
        materialName: material.materialName,
        reorderLevel: 'Reorder Level is: ' + reorderLevel,
        errors: 'critical',
        msg:
          'Material Type is in Critical Level. Please Allocate Enough Materials.',
      });
    } else if (materialAllocation.quantity <= 0) {
      return res.status(400).json({
        materialName: material.stageName,
        reorderLevel: reorderLevel,
        errors: 'no',
        msg: 'No Enough Materials. Please allocate more than :' + reorderLevel,
      });
    }
    await materialAllocation.save();
    await materialConsumptionLog.save();

    //To check whether the material type exists
    let materialConsumption = await MaterialConsumption.findOne({
      projectName: project._id,
      materialName: material._id,
      stageName: stage._id,
    });
    if (materialConsumption) {
      materialConsumption.quantity = materialConsumption.quantity + quantity;
      materialConsumption.save();
    } else {
      //Initializing materialConsumption object
      materialConsumption = new MaterialConsumption({
        materialName: material._id,
        quantity: quantity,
        unit: unit,
        projectName: project._id,
        stageName: stage._id,
        date: date,
      });
      await materialConsumption.save();
    }

    res.status(200).json(materialConsumptionLog);
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
// Material Consumption by project Name
router.get('/get/:projectName', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectName: req.params.projectName,
    });
    const materialConsumption = await MaterialConsumption.find({
      projectName: project._id,
    })
      .populate('projectName', ['projectName'])
      .populate('materialName', ['materialName'])
      .populate('stageName', ['stageName']);
    return res.json(materialConsumption);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// Material Consumption by project Name and stage name
router.get('/stage/:projectName/:stageName', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectName: req.params.projectName,
    });
    const stage = await Stage.findOne({
      stageName: req.params.stageName,
    });
    const materialConsumption = await MaterialConsumption.find({
      projectName: project._id,
      stageName: stage._id,
    })
      .populate('projectName', ['projectName'])
      .populate('materialName', ['materialName'])
      .populate('stageName', ['stageName']);
    return res.json(materialConsumption);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// Material Consumption by material Name
router.get('/material/:materialName', async (req, res) => {
  try {
    const material = await Material.findOne({
      materialName: req.params.materialName,
    });
    const materialConsumption = await MaterialConsumption.find({
      materialName: material._id,
    })
      .populate('projectName', ['projectName'])
      .populate('materialName', ['materialName'])
      .populate('stageName', ['stageName']);
    return res.json(materialConsumption);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/materialConsumption/log

router.get('/log', async (req, res) => {
  try {
    const materialConsumptionLog = await MaterialConsumptionLog.find()
      .populate('projectName', ['projectName'])
      .populate('materialName', ['materialName'])
      .populate('stageName', ['stageName']);
    return res.json(materialConsumptionLog);
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
