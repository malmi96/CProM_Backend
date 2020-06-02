const express = require('express');
const Machinery = require('../models/machinery');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/machinery/add
//Desc Add machinery details
router.post('/add', async (req, res) => {
  const { machineryName, machineryType, machineryCondition } = req.body;
  try {
    //To check whether the machineryName exists
    let machinery = await Machinery.findOne({
      machineryName,
    });
    if (machinery) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Machinery name already exists' }] });
    }
    //Initializing machinery object
    machinery = new Machinery({
      machineryName,
      machineryType,
      machineryCondition,
    });

    await machinery.save();
    res.status(200).json(machinery);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/machinery/get
//Desc View machinery info
router.get('/get', (req, res) => {
  try {
    Machinery.find((err, machinery) => {
      if (err) {
        return res.send(err);
      }
      return res.json(machinery);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:machineryId', (req, res, next) => {
  try {
    Machinery.findById(req.params.machineryId, (err, machinery) => {
      if (err) {
        res.send(err);
      }
      if (machinery) {
        req.machinery = machinery;
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
router.patch('/:machineryId', (req, res) => {
  try {
    const { machinery } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      machinery[key] = value;
    });
    req.machinery.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(machinery);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:machineryId', (req, res) => {
  try {
    req.machinery.remove((err) => {
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
