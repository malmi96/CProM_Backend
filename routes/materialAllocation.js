const express = require('express');

const MaterialAllocation = require('../models/materialAllocation');
const Material = require('../models/material');
const Project = require('../models/project');

const router = express.Router();

//POST /api/materialAllocation/add
//Desc allocate materials to each project

router.post('/add', async (req, res) => {
  const { materialType, quantity, projectName, date } = req.body;
  try {
    //To check whether the material type exists
    let material = await Material.findOne({
      materialType,
    });
    if (material) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Material Type already exists' }] });
    }
    //Initializing materialAllocation object
    materialAllocation = new MaterialAllocation({
      materialType,
      quantity,
      projectName,
      date,
    });

    await materialAllocation.save();
    res.status(200).json(materialAllocation);
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
