const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://antonwy:c!=k"j!,^6M"@chatdb-noqrj.mongodb.net/test?retryWrites=true')



var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to mongodb")
});