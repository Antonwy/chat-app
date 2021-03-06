const mongoose = require('mongoose');

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;


if(process.env.NODE_ENV === "production") {
  mongoose.connect(`mongodb+srv://${username}:${password}@chatdb-noqrj.mongodb.net/test?retryWrites=true`)
}else {
  mongoose.connect("mongodb://localhost:27017/chat-app")
}

var db = mongoose.connection;
db.on('error', (err) => {
  console.log(err)
});
db.once('open', function() {
  console.log("Connected to mongodb")
});