const express = require('express');
const Inquiry = require('../models/inquiry');
const Employee = require('../models/employee');
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
    const salesManager = await Employee.find({
      designation: 'Sales and Marketing Manager',
    });
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
      subject: 'New Customer Inquiry',
      text: `We have recieved an Inquiry. Customer details are as follows. 
      Customer Name: ${customerName}, Email: ${email}, Contact No.: ${contactNo}, Message: ${message}, Date: ${Date.now()}`,
    });
    let customermail = await transporter.sendMail({
      from: 'cpromportal@gmail.com',
      to: 'malminatasha@gmail.com',
      subject: 'Thank you for your interest',
      text: `We have recieved an Inquiry from you.`,
    });
    console.log(mail);
    console.log(customermail);
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
