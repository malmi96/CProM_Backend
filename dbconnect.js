const mongoose = require('mongoose');
const connectdb = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://admin:1234@cprom-zistc.mongodb.net/test?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    );
    console.log('Database connected!');
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectdb;
