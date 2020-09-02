const express = require('express');
const Labour = require('../models/labour');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { check, validationResult } = require('express-validator');

//POST api/labour/add
//Desc Add labour details
router.post('/add', checkAuth, async (req, res) => {
  const {
    labourCategory,
    labourType,
    labourName,
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
      labourCategory,
      labourType,
      labourName,
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
router.get('/get', checkAuth, (req, res) => {
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

//Get api/labour/:labourId
//Desc Get user by ID
router.get('/:labourId', checkAuth, async (req, res) => {
  try {
    Labour.findById(req.params.labourId, (err, labour) => {
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

//Get api/labour/view/:labourName
//Desc Get labour from labour Name
router.get('/view/:labourName', checkAuth, async (req, res) => {
  try {
    const labour = await Labour.find({
      labourName: req.params.labourName,
    });
    return res.json(labour);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:labourId', checkAuth, (req, res, next) => {
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
router.patch('/:labourId', checkAuth, (req, res) => {
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

router.delete('/:labourId', checkAuth, (req, res) => {
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
