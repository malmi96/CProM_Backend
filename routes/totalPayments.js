const express = require('express');

const MaterialPayment = require('../models/materialPayments');
const UtilityPayment = require('../models/utilityPayments');
const LabourWages = require('../models/labourWages');
const Material = require('../models/material');
const Project = require('../models/project');
const Stage = require('../models/stage');
const Task = require('../models/tasks');
const Supplier = require('../models/supplier');
const MachineryPayments = require('../models/machineryPayments');

const router = express.Router();

// Desc Get total payments 

router.get('/payments', async (req, res) => {
  try {
      var totalMaterialPayments = 0
    const materialPayment = await MaterialPayment.find();
    materialPayment.forEach(payment => {
        totalMaterialPayments = totalMaterialPayments + payment.amount
    })
    var totalMachineryPayments = 0
    const machineryPayment = await MachineryPayments.find();
    machineryPayment.forEach(payment => {
        totalMachineryPayments = totalMachineryPayments + payment.amount
    })
    var totalLabourWages = 0
    const labourWages = await LabourWages.find();
    labourWages.forEach(payment => {
        totalLabourWages = totalLabourWages + payment.amount
    })
    var totalUtilityPayments = 0
    const utilityPayments = await UtilityPayment.find();
    utilityPayments.forEach(payment => {
        totalUtilityPayments = totalUtilityPayments + payment.amount
    })
    const payments = [
        {paymentType: 'Material Payments',
        amount: totalMaterialPayments},
        {paymentType: 'Machinery Payments',
        amount: totalMachineryPayments},
        {paymentType: 'Labour Payments',
        amount: totalLabourWages},
        {paymentType: 'Utility Payments',
        amount: totalUtilityPayments},
    ]
    return res.json(payments);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;