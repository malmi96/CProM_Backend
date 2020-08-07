const express = require('express');
const Inquiry = require('../models/inquiry');
var nodemailer = require('nodemailer');

const router = express.Router();

// POST api/inquiry/add
// Adding an inquiry
router.post('/add', async (req, res) => {
  const { customerName, email, contactNo, message } = req.body;
  try {
    //Initializing inquiry object
    var inquiry = new Inquiry({
      customerName: customerName,
      email: email,
      contactNo: contactNo,
      message: message,
      date: Date.now(),
    });
    await inquiry.save();
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'malmi.atapattu4@aiesec.net',
        pass: 'AOYHOLQA',
      },
    });
    let mail = await transporter.sendMail({
      from: 'malmi.atapattu4@aiesec.net',
      to: 'malminatasha@gmail.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!',
    });
    console.log(mail);
    res.status(200).json(inquiry);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/inquiry/get
router.get('/get', async (req, res) => {
  try {
    const inquiry = await Inquiry.find();
    return res.status(200).json(inquiry);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
