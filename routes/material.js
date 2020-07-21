const express = require('express');

const Material = require('../models/material');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

//POST /api/material/add
//Desc add materials

router.post('/add', checkAuth, async (req, res) => {
  const { materialCategory, materialName, quantity, unit, unitCost } = req.body;
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
      quantity,
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
router.get('/get', (req, res) => {
  try {
    Material.find((err, material) => {
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

//Implementing middleware
router.use('/:materialId', (req, res, next) => {
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
router.patch('/:materialId', (req, res) => {
  try {
    const { material } = req;
    if (req.body._id) {
      delete req.body._id;
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

router.delete('/:materialId', (req, res) => {
  try {
    req.material.remove((err) => {
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
