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
//const routes = require("./routes");
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

// for any routes with id
app.param('id', function(req, res, next, id){
  Course.findById(id, (err, course) => {
    req.course = course;
    return next();
  })
});
/* AUTHORIZE */
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

////////////////////////
/* ROUTES AND CRUD OPS*/
////////////////////////

/* GETTERS */
app.get("/", (req, res) => {
  res.json({
    message: 'Nothing to see here, just a REST API home page!',
  })
}); //home root route

app.get("/api/users", (req, res, next) => {
  if(req.auth) {
    User.findOne({emailAddress: req.user}).then(data => {
      res.status(200);
      res.json(data);
    });
  } else {
      res.status(401);
      return next(new Error("Authorization Failed"));
  }
}); // GET authorized user

app.get("/api/courses", (req, res) => {
  Course.find().exec((err, course) => {
    res.status(200);
    res.json(course);
  })
}); // Show courses

// Show course by id
app.get("/api/courses/:id", (req, res) => {
  Course.findOne({_id: req.params.id}).populate("user", ["firstName", "lastName"]).exec((err, course) => {
    res.status(200);
    res.json(course);
  })
});

/* POSTERS */
app.post("/api/users", (req, res, next) => {
  if(req.body.password) {
    const salty = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(req.body.password, salty);
    req.body.password = hashPass;
  }
  else {
    res.status(400);
    return next(new Error("Enter all user information."));
  }
  // if entered email address !match eRegex, throw error
  const eRegex = /^[^@]+@[^@.]+\.[a-z]+$/i;
  if(!eRegex.test(String(req.body.emailAddress).toLowerCase())) {
    return next(new Error("Enter valid email address"));
  }

  User.find({emailAddress: req.body.emailAddress}, (err, count) => {
   if(count > 0) return next(new Error("Email address is already being used"));
   User.create(req.body).then((data) => {
     res.status(201).location("/").end();
   })
   .catch((err) => {
     res.status(400).json({error: err});
   })
 });
}); //POST create new user

app.post("/api/courses", (req, res, next) => {
  if(req.auth) {
    User.findOne({emailAddress: req.user}).then(userData => {
      req.body.user = userData;
      Course.create(req.body).then(courseData => {
        res.status(201);
        res.location(`/api/courses/${courseData._id}`);
        res.end();
      })
      .catch(err => {
        res.status(400).json({error: err});
      })
    })
  }
  else {
    res.status(401);
    return next(new Error("Authorization Failed"));
  }
}); //Create new course

/*****CRUD******/
// Updating course
app.put("/api/courses/:id", (req, res, next) => {
  if(req.auth) {
    Course.find({user: req.course.user}).then(course => {
      if(JSON.stringify(req.course.user) !== JSON.stringify(req.userId)) {
        res.status(403);
        return new Error("You are not authorized, the cops have been notified");
      }
    })
    .then(err => {
      if(err) return next(err);
      req.course.update(req.body, (err, result) => {
        res.status(204).end();
      }).catch(err => {
        res.status(400).json({error: err});
      })
    })
  }
  else {
    res.status(401);
    return next(new Error("Authorization Failed"));
  }
});

// Delete course
app.delete("/api/courses/:id", (req, res, next) => {
  if(req.auth) {
    Course.find({user: req.course.user}).then(course => {
      if(JSON.stringify(req.course.user) !== JSON.stringify(req.userId)) {
        res.status(403);
        return new Error("You are not authorized, the cops have been notified");
      }
    })
    .then(err => {
      if(err) return next(err);
      req.course.remove(() => {
        res.status(204).end();
      });
    });
  }
  else {
    res.status(401);
    return next(new Error("Authorization Failed"));
  }
});

/////////////
/* ERROR0S */
/////////////
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

/* LISTEN AT PORT*/
const port = process.env.PORT || 5000;

app.listen(port, function(){
	console.log("Express server is listening on port", port);
});
