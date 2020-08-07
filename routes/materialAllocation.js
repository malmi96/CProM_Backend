const express = require('express');

const MaterialAllocation = require('../models/materialAllocation');
const Material = require('../models/material');
const Project = require('../models/project');
const MaterialAllocationLog = require('../models/materialAllocationLog');

const router = express.Router();

//POST /api/materialAllocation/add
//Desc allocate materials to each project

router.post('/add', async (req, res) => {
  const { materialName, quantity, unit, projectName, date } = req.body;
  try {
    var project = await Project.findOne({ projectName: projectName });
    var material = await Material.findOne({ materialName: materialName });
    // log
    //Initializing materialAllocation object
    var materialAllocationLog = new MaterialAllocationLog({
      materialName: material._id,
      quantity: quantity,
      projectName: project._id,
      unit: unit,
      date: date,
    });
    await materialAllocationLog.save();

    // Material Allocation Schema
    //To check whether the material type exists
    var materialAllocation = await MaterialAllocation.findOne({
      materialName: material._id,
      projectName: project._id,
    });
    if (materialAllocation) {
      materialAllocation.quantity = materialAllocation.quantity + quantity;
      materialAllocation.save();
    } else {
      //Initializing materialAllocation object
      materialAllocation = new MaterialAllocation({
        materialName: material._id,
        quantity: quantity,
        projectName: project._id,
        unit: unit,
        date: date,
      });

      await materialAllocation.save();
    }
    return res.status(200).json(materialAllocationLog);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//POST /api/materialAllocation/add/materialType
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

//POST /api/materialAllocation/add/projectName
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

//GET api/materialAllocation/get
//Desc View materialAllocation info
router.get('/get', (req, res) => {
  try {
    MaterialAllocation.find((err, materialAllocation) => {
      if (err) {
        return res.send(err);
      }
      return res.json(materialAllocation);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/materialAllocation/get/:projectName

router.get('/get/:projectName', async (req, res) => {
  try {
    const project = await Project.findOne({
      projectName: req.params.projectName,
    });
    const materialAllocation = await MaterialAllocation.find({
      projectName: project._id,
    }).populate('materialName', ['materialName']);

    return res.json(materialAllocation);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/materialAllocation/get/:materialName

router.get('/get/material/:materialName', async (req, res) => {
  try {
    const material = await Material.findOne({
      materialName: req.params.materialName,
    });
    const materialAllocation = await MaterialAllocation.find({
      materialName: material._id,
    }).populate('projectName', ['projectName']);

    return res.json(materialAllocation);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/materialAllocation/log

router.get('/log', async (req, res) => {
  try {
    const materialAllocationLog = await MaterialAllocationLog.find({})
      .populate('projectName', ['projectName'])
      .populate('materialName', ['materialName']);
    return res.json(materialAllocationLog);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// delete log

router.get('/delete/:id', async (req, res) => {
  try {
    const materialAllocationLog = await MaterialAllocationLog.findByIdAndDelete(
      {
        _id: req.params.id,
      }
    );
    return res.json(materialAllocationLog);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:materialAllocationId', (req, res, next) => {
  try {
    MaterialAllocation.findById(
      req.params.materialAllocationId,
      (err, materialAllocation) => {
        if (err) {
          res.send(err);
        }
        if (materialAllocation) {
          req.materialAllocation = materialAllocation;
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
router.patch('/:materialAllocationId', (req, res) => {
  try {
    const { materialAllocation } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      materialAllocation[key] = value;
    });
    req.materialAllocation.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(materialAllocation);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:materialAllocationId', (req, res) => {
  try {
    req.materialAllocation.remove((err) => {
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
