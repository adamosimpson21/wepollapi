require("dotenv").config();
const express = require('express')
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error")

//handling CORS
let corsOptions = {}
if(process.env.NODE_ENV==='production'){
  corsOptions = {
    origin: 'https://wepoll.herokuapp.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
} else if(process.env.NODE_ENV==='development'){
  corsOptions = {
    origin: 'https://localhost:4000',
    optionsSuccessStatus: 200
  }
}


//Config
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



//requiring routes
const questionsRoutes = require("./routes/questions");
const itemRoutes      = require("./routes/items");
const authRoutes      = require("./routes/auth");
const userRoutes      = require("./routes/user");
const partyRoutes      = require("./routes/party");

//Using Routes
app.use("/api/questions", questionsRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/party", partyRoutes);

app.use(function(req, res, next){
  let err = new Error("Route not Found")
  err.status = 404;
  next(err)
})

app.use(errorHandler)

app.listen(port);