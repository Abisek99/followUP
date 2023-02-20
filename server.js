const express = require("express");
const dotenv = require("dotenv").config();
const dbConfig = require("./config/dbConfig");
//const userRoutes = require("./routes/userRoute");

//rest object
const app = express();

//middlewares
app.use(express.json());

//dotenv config
//dotenv.config();

//routes
//app.get("/", (req, res) => res.send("API is Running"));
app.use("/api/v1/user", require("./routes/userRoutes"));

//port
const port = process.env.PORT || 5000;

//listen port
app.listen(port, () => {
  console.log(`Node server started at port ${port}`);
});
