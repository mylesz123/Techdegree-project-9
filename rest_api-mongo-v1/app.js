'use strict';
/*set up middleware with ... app.use( (req, res, next) => {});  */

// load modules
const express = require('express');
const app = express();
const morgan = require('morgan'); //logger
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';
const bodyParser = require('body-parser').json; // parse incoming body of json data
const mongoose = require('mongoose');
const Schema = mongoose.Schema; //db communication, add schema
const Course = require("./models").Course;
const User = require("./models").User;
const routes = require("./routes");
const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
/*const jsonCheck = function(req, res, next) {
  if(req.body){
    console.log('what bag? ', req.body.color);
  }
  else{
    console.log('no body props on request bc json isnt here yet');
  }
  next();}; // did json come through? */

/*MIDDLEWARE*/
app.use(morgan('dev')); //status codes
app.use(bodyParser()); //function to use returned middle-ware for json body parser
//app.use(jsonCheck);

/*Mongoose config*/
mongoose.connect('mongodb://localhost:27017/fsjstd-restapi', {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', function(err) {
  console.error('connection error:', err);
});

db.once("open", function() {
  console.log("DB connection successful!");
});

// authorize user
app.use((req, res, next) => {
  const user = auth(req);
  if(user) {
    User.findOne({emailAddress: user.name}).then(data => {
      if(data) {
        return data;
      } else {
        res.status(401);
        return next(new Error("Authorization Failed"));
      }
    }).then(data => {
      bcrypt.compare(user.pass, data.password, (err, valid) => {
        if(valid) {
          req.auth = true;
          req.userId = data._id;
          req.user = user.name;
          next();
        } else {
          res.status(401);
          req.auth = false;
          return next(new Error("Enter correct password"));
        }
      });
    });
  } else {
    next();
  }
});

// lets bring in the routes
app.use('/', routes);
//app.use("/api/users", routes);
/*something missing*/

/*ERRORS*/
app.use((req, res) => {
  res.status(404).json({
    message: 'Sorry, that route was not found',
  })
}); //  404

app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  res.status(err.status || 500).json({
    message: err.message
  })
}); // global error handler

/* PORT*/
const port = process.env.PORT || 5000;

app.listen(port, function(){
	console.log("Express server is listening on port", port);
});
