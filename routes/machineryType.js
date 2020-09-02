const express = require('express');
const MachineryType = require('../models/machineryTypes');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

//POST api/machineryType/add
//Desc Add machinery details
router.post('/add', checkAuth, async (req, res) => {
  const { machineryType } = req.body;
  try {
    //To check whether the machineryName exists
    let machinery = await MachineryType.findOne({
      machineryType,
    });
    if (machinery) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Machinery Type already exists' }] });
    }
    //Initializing machinery object
    machinery = new MachineryType({
      machineryType,
    });

    await machinery.save();
    res.status(200).json(machinery);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/machineryType/get
//Desc View machinery types
router.get('/get', checkAuth, (req, res) => {
  try {
    MachineryType.find((err, machinery) => {
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

router.delete('/:machineryTypeId', checkAuth, async (req, res) => {
  try {
    const machineryType = await MachineryType.findById({
      _id: req.params.machineryTypeId,
    });
    if (!machineryType) {
      return res.sendStatus(404);
    }
    await machineryType.remove();
    return res.sendStatus(204);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
