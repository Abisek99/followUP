const express = require("express");
const dotenv = require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const cors = require("cors");
//const userRoutes = require("./routes/userRoute");

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//dotenv config
//dotenv.config();

//routes
//app.get("/", (req, res) => res.send("API is Running"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

//port
const port = process.env.PORT || 5000;

//listen port
app.listen(port, () => {
  console.log(`Node server started at port ${port}`);
});
