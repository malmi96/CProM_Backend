const express = require('express');
const Material = require('../models/material');
const Supplier = require('../models/supplier');
const MaterialConsumption = require('../models/materialConsumption');
const reorderFormula = require('../businessLogics/reorderFormula');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:materialId', checkAuth, async (req, res) => {
  try {
    const material = await Material.findOne({
      _id: req.params.materialId,
    });
    const materialConsumption = await MaterialConsumption.find({
      materialName: req.params.materialId,
    });
    var totalConsumption = 0;
    materialConsumption.forEach((response) => {
      totalConsumption = response.quantity + totalConsumption;
    });
    const noOfDays = materialConsumption.length;
    const supplier = await Supplier.find();
    var totalReorderDelay = 0;
    var totalSupplyDelay = 0;

    supplier.forEach((response) => {
      totalReorderDelay = response.reorderDelay + totalReorderDelay;
    });
    supplier.forEach((response) => {
      totalSupplyDelay = response.supplyDelay + totalSupplyDelay;
    });

    const avgReorderDelay = totalReorderDelay / supplier.length;
    const avgSupplyDelay = totalSupplyDelay / supplier.length;

    const reorderLevel = reorderFormula(
      avgReorderDelay,
      avgSupplyDelay,
      totalConsumption,
      noOfDays
    );
    return res.json({
      materialName: material.materialName,
      reorderLevel: reorderLevel,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
