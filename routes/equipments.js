const express = require('express');
const Equipments = require('../models/equipments');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/equipments/add
//Desc Add equipment details
router.post('/add', async (req, res) => {
  const { equipmentType, equipmentQuantity } = req.body;
  try {
    //To check whether the equipmentType exists
    let equipment = await Equipments.findOne({
      equipmentType,
    });
    if (equipment) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Equipment type already exists' }] });
    }
    //Initializing machinery object
    equipment = new Equipments({
      equipmentType,
      equipmentQuantity,
    });

    await equipment.save();
    res.status(200).json(equipment);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/equipment/get
//Desc View equipments info
router.get('/get', (req, res) => {
  try {
    Equipments.find((err, equipment) => {
      if (err) {
        return res.send(err);
      }
      return res.json(equipment);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:equipmentId', (req, res, next) => {
  try {
    Equipments.findById(req.params.equipmentId, (err, equipment) => {
      if (err) {
        res.send(err);
      }
      if (equipment) {
        req.equipment = equipment;
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
router.patch('/:equipmentId', (req, res) => {
  try {
    const { equipment } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      equipment[key] = value;
    });
    req.equipment.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(equipment);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:equipmentId', (req, res) => {
  try {
    req.equipment.remove((err) => {
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
