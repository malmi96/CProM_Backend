const express = require('express');

const MaterialPayment = require('../models/materialPayments');
const UtilityPayment = require('../models/utilityPayments');
const LabourPayment = require('../models/labourWages');
const Material = require('../models/material');
const Project = require('../models/project');
const Stage = require('../models/stage');
const Supplier = require('../models/supplier');

const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// Desc Get payments by the project name

router.post('/get', checkAuth, async (req, res) => {
  try {
    const project = await Project.findOne({
      projectName: req.body.projectName,
    });
    const materialPayment = await MaterialPayment.find({
      projectName: project._id,
    });
    const utilityPayment = await UtilityPayment.find({
      projectName: project._id,
    });
    const labourPayment = await LabourPayment.find({
      projectName: project._id,
    });
    var totalMaterialCost = 0;
    var totalLabourCost = 0;
    var totalUtilityCost = 0;
    materialPayment.forEach((res) => {
      totalMaterialCost = res.amount + totalMaterialCost;
    });
    utilityPayment.forEach((res) => {
      totalLabourCost = res.amount + totalLabourCost;
    });
    labourPayment.forEach((res) => {
      totalUtilityCost = res.amount + totalUtilityCost;
    });

    return res.json({
      totalMaterialCost: totalMaterialCost,
      totalLabourCost: totalLabourCost,
      totalUtilityCost: totalUtilityCost,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
