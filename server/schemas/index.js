const mongoose = require('mongoose');
// set up connection to MongoDB outdoor-trading database
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/bugtracker',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

module.exports = mongoose.connection;