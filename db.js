const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://antonwy:bo5WD4banmwiyPxk@chatdb-noqrj.mongodb.net/test?retryWrites=true')

var db = mongoose.connection;
db.on('error', (err) => {
  console.log(err)
});
db.once('open', function() {
  console.log("Connected to mongodb")
});