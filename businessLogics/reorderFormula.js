const Material = require('../models/material');
const Supplier = require('../models/supplier');
const MaterialConsumption = require('../models/materialConsumption');
const MaterialConsumptionLog = require('../models/materialConsumptionLog');

const reorderFormula = async (materialId) => {
  const material = await Material.findOne({
    _id: materialId,
  });
  const materialConsumptionLog = await MaterialConsumptionLog.find({
    materialName: material._id,
  });

  const noOfDays = materialConsumptionLog.length;
  console.log(noOfDays);
  const supplier = await Supplier.find();
  var totalReorderDelay = 0;
  var totalSupplyDelay = 0;

  supplier.forEach((response) => {
    totalReorderDelay = response.reorderDelay + totalReorderDelay;
  });
  supplier.forEach((response) => {
    totalSupplyDelay = response.supplyDelay + totalSupplyDelay;
  });
  var totalConsumption = 0;
  materialConsumptionLog.forEach((response) => {
    totalConsumption = response.quantity + totalConsumption;
  });

  const avgReorderDelay = totalReorderDelay / supplier.length;
  console.log(avgReorderDelay);
  const avgSupplyDelay = totalSupplyDelay / supplier.length;
  console.log(avgSupplyDelay);

  const leadTime = avgReorderDelay + avgSupplyDelay;
  console.log(leadTime);
  const avgDailyUsage = totalConsumption / noOfDays;
  console.log(avgDailyUsage);
  const reorderLevel = leadTime * avgDailyUsage;
  console.log('hi');
  console.log(reorderLevel);
  return reorderLevel;
};

module.exports = reorderFormula;
