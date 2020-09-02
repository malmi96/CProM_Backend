const express = require('express');

const Material = require('../models/material');
const MaterialAllocation = require('../models/materialAllocation');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

//POST /api/material/add
//Desc add materials

router.post('/add', checkAuth, async (req, res) => {
  const { materialCategory, materialName, unit, unitCost } = req.body;
  try {
    //To check whether the material type exists
    let material = await Material.findOne({
      materialName,
    });
    if (material) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Material Name already exists' }] });
    }
    //Initializing user object
    material = new Material({
      materialCategory,
      materialName,
      unit,
      unitCost,
    });

    await material.save();
    res.status(200).json(material);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/material/get
//Desc View material info
router.get('/get', checkAuth, async (req, res) => {
  try {
    const materials = await Material.find().sort({ _id: -1 });
    if (!materials) {
      return res.status(404);
    }
    return res.json(materials);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/material/materialID
//Desc View stages of a given project

router.get('/:materialId', checkAuth, async (req, res) => {
  try {
    const material = await Material.findById({ _id: req.params.materialId });
    if (!material) {
      return res.status(404);
    }
    return res.json(material);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/material/materialName
//Desc get unit names

router.get('/materialfind/:materialName', checkAuth, async (req, res) => {
  try {
    const material = await Material.findOne({
      materialName: req.params.materialName,
    });
    if (!material) {
      return res.status(404);
    }
    return res.json(material.unit);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:materialId', checkAuth, (req, res, next) => {
  try {
    Material.findById(req.params.materialId, (err, material) => {
      if (err) {
        res.send(err);
      }
      if (material) {
        req.material = material;
        return next();
      }
      return res.sendStatus(404);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PUT api/:materialId
//Desc Update material details
/*
router.put('/:materialId', (req, res) => {
  try {
    const { material } = req;
    material.materialType = req.body.materialType;
      material.quantity = req.body.quantity;
      material.unitCost = req.body.unitCost;
      material.criticalLevel = req.body.criticalLevel;
    req.material.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(material);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});*/

//PATCH
router.patch('/:materialId', checkAuth, (req, res) => {
  try {
    const { material } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    if (req.body.materialName === '') {
      delete req.body.materialName;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      material[key] = value;
    });
    req.material.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(material);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:materialId', checkAuth, async (req, res) => {
  try {
    const material = await MaterialAllocation.find({
      materialName: req.material._id
    });

    if(material.length === 0){
      req.material.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    }
    else{
      return res.json({msg: 'Material cannot be deleted'})
    }
    
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
