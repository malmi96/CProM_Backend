const express = require('express');
const Machinery = require('../models/machinery');
const MachineryType = require('../models/machineryTypes');
var nodemailer = require('nodemailer');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const { check, validationResult } = require('express-validator');

//POST api/machinery/add
//Desc Add machinery details
router.post('/add', checkAuth, async (req, res) => {
  const { machineryName, machineryType, machineryCondition, date } = req.body;
  try {
    let machineryTypeCheck = await MachineryType.findOne({
      machineryType: machineryType,
    });
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
      machineryName: machineryName,
      machineryType: machineryTypeCheck._id,
      machineryCondition: machineryCondition,
      date: date,
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
router.get('/get', checkAuth, async (req, res) => {
  try {
    const machinery = await Machinery.find().populate('machineryType', [
      'machineryType',
    ]);
    return res.json(machinery);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/machinery/machineryID
//Desc View machinery by ID

router.get('/:machineryId', checkAuth, async (req, res) => {
  try {
    const machinery = await Machinery.findById({
      _id: req.params.machineryId,
    }).populate('machineryType', ['machineryType']);
    if (!machinery) {
      return res.status(404);
    }
    return res.json(machinery);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//Implementing middleware
router.use('/:machineryId', checkAuth, (req, res, next) => {
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

router.put('/:machineryId', checkAuth, async (req, res) => {
  try {
    const { machinery } = req;
    const machineryType = await MachineryType.findOne({
      machineryType: req.body.machineryType,
    });
    if (req.body.machineryCondition === 'Critical') {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'cpromportal@gmail.com',
          pass: 'CProM123',
        },
      });
      let mail = await transporter.sendMail({
        from: 'cpromportal@gmail.com',
        to: 'malminatasha@gmail.com',
        subject: 'Machinery Condition is Critical',
        text: `Machinery details are as follows. 
          Machinery Name: ${
            req.body.machineryName
          },  Date: ${new Date().toString()}`,
      });
      console.log(mail);
    }
    machinery.machineryName = req.body.machineryName;
    machinery.machineryType = machineryType._id;
    machinery.machineryCondition = req.body.machineryCondition;
    machinery.date = req.body.date;

    await req.machinery.save();
    return res.json(machinery);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//PATCH
router.patch('/:machineryId', checkAuth, (req, res) => {
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

router.delete('/:machineryId', checkAuth, (req, res) => {
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
