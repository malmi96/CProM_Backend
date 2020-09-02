const express = require('express');

const MaterialConsumption = require('../models/materialConsumption');
const Materials = require('../models/material');

const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/consumption', checkAuth, async (req, res)=>{
    try {
        const materials = await Materials.find();
        const materialConsumption = await MaterialConsumption.find().populate('materialName',['materialName']);
        var arr = materials.map(material => {
            otherArr = materialConsumption.filter(eachItem => eachItem.materialName.materialName === material.materialName);
            var totConsumption = 0;
            otherArr.forEach(i => {
                totConsumption = totConsumption + i.quantity
            })
            return {
                materialName: material.materialName,
                consumption: totConsumption
            }
        });
        res.json(arr);


    } catch (err) {
        console.log(err.message);
    res.status(500).send('Server Error');
    }
})

module.exports = router;
