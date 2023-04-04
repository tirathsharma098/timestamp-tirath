const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const moment = require("moment");
const helmet = require("helmet");

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.all("*", function (req, res, next) {
  res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, content-type, Authorization, Accept"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
  res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  next();
});
app.use(helmet());
app.use(express.json());
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
app.get("/api", (req, res)=> {
  const utc = moment(new Date()).format("ddd, DD MMM YYYY hh:mm:ss GMT");
  const unix = Date.now();
  res.status(200).json({unix, utc});
})
app.get("/api/:convertDate", (req, res) => {
  let convertDate = req.params.convertDate;
  const isNumberDate = Number(convertDate);
  if(isNumberDate && Number.isInteger(isNumberDate)){
    convertDate = new Date(Number(convertDate));
  }
  const isValidDate = moment(convertDate).isValid();
  if(!isValidDate)
  return res.status(400).json({error: "Date is not valid"});
  const utc = moment.utc(convertDate).format("ddd, DD MMM YYYY hh:mm:ss Z");
  const unix = moment.utc(convertDate, "x").unix();
  res.status(200).json({unix: unix*1000, utc});
});

// listen for requests :)
app.listen(PORT, function () {
  console.log('Your app is listening on port ' + PORT);
});
