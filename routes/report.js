const express = require('express');

const MaterialPayment = require('../models/materialPayments');
const UtilityPayment = require('../models/utilityPayments');
const LabourPayment = require('../models/labourWages');
const Material = require('../models/material');
const Project = require('../models/project');
const Stage = require('../models/stage');
const Supplier = require('../models/supplier');

const router = express.Router();

// Desc Get payments by the project name

router.post('/supplierReport', async (req, res) => {
  try {
    const material = await Material.findOne({
      materialName: req.body.materialName,
    });
    const materialPayment = await MaterialPayment.find({
      materialName: material._id,
    }).populate('supplierName', ['supplierName']);

    const supplierList = materialPayment.map((item) => {
      return {
        supplierName: item.supplierName.supplierName,
        unitCost: item.amount / item.quantity,
      };
    });

    return res.json(supplierList);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
