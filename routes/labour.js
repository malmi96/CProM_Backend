const express = require('express');
const Labour = require('../models/labour');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/labour/add
//Desc Add labour details
router.post('/add', async (req, res) => {
  const {
    labourName,
    labourType,
    labourNIC,
    labourContactNo,
    joinedDate,
    labourAddress,
  } = req.body;
  try {
    //To check whether the nic exists
    let labour = await Labour.findOne({
      labourNIC,
    });
    if (labour) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Labour already exists' }] });
    }
    //Initializing labour object
    labour = new Labour({
      labourName,
      labourType,
      labourNIC,
      labourContactNo,
      joinedDate,
      labourAddress,
    });
    await labour.save();
    res.status(200).json(labour);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/labour/get
//Desc View labour info
router.get('/get', (req, res) => {
  try {
    Labour.find((err, labour) => {
      if (err) {
        return res.send(err);
      }
      return res.json(labour);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:labourId', (req, res, next) => {
  try {
    Labour.findById(req.params.labourId, (err, labour) => {
      if (err) {
        res.send(err);
      }
      if (labour) {
        req.labour = labour;
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
router.patch('/:labourId', (req, res) => {
  try {
    const { labour } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      labour[key] = value;
    });
    req.labour.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(labour);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//DELETE

router.delete('/:labourId', (req, res) => {
  try {
    req.labour.remove((err) => {
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
