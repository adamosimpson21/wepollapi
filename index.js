require("dotenv").config();
const express = require('express')
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error")

//handling CORS
// const corsOptions = {
//   origin: 'https://wepoll.herokuapp.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

//Config
// app.use(cors(corsOptions));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



//requiring routes
const questionsRoutes = require("./routes/questions");
const otherRoutes     = require("./routes/other");
const itemRoutes      = require("./routes/items");
const authRoutes      = require("./routes/auth");
const userRoutes      = require("./routes/user");

//Using Routes
app.use("/api/questions", questionsRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/", otherRoutes);

app.use(function(req, res, next){
  let err = new Error("You're in the express app")
  err.status = 404;
  next(err)
})

app.use(errorHandler)

app.listen(port, function(){
  console.log("WePoll Server started!" + port);
});