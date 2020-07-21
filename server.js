const connectdb = require('./dbconnect');
const express = require('express');

const cors = require('cors');

const app = express();
//connecting database
connectdb();
const port = 5000;

//Initialising middleware
app.use(
  express.json({
    extended: false,
  })
);

app.listen(port, () => console.log('Server Running'));
app.use(cors());

/*app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With,Content-Type,Accept,Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  next();
});*/

//Registering routes
app.use('/api/users', require('./routes/userRegisteration'));
app.use('/api/material', require('./routes/material'));
app.use('/api/project', require('./routes/project'));
app.use('/api/stage', require('./routes/stage'));
app.use('/api/labour', require('./routes/labour'));
app.use('/api/supplier', require('./routes/supplier'));
app.use('/api/machinery', require('./routes/machinery'));
app.use('/api/equipment', require('./routes/equipments'));
app.use('/api/customerPayments', require('./routes/customerPayments'));
app.use('/api/labourWages', require('./routes/labourWages'));
app.use('/api/machineryPayments', require('./routes/machineryPayments'));
app.use('/api/materialPayments', require('./routes/materialPayments'));
app.use('/api/utilityPayments', require('./routes/utilityPayments'));
app.use('/api/materialAllocation', require('./routes/materialAllocation'));
app.use('/api/materialConsumption', require('./routes/materialConsumption'));
app.use('/api/image', require('./routes/image'));
app.use('/api/otherPayments', require('./routes/otherPayments'));

app.get('/', (req, res) => res.send('API Running'));
