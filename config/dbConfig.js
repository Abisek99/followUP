const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("MongoDB is connected");
});
connection.on("error", (error) => {
  console.log("Error in MongoDB is connection", error);
});

module.exports = mongoose;
