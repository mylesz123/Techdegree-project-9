// 'use strict';
//
// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema; //db communication, add schema
// const Course = require("./models").Course;
// const User = require("./models").User;
// const auth = require("basic-auth");
// const bcrypt = require("bcryptjs");
//
// // for any routes with id
// router.param('id', function(req, res, next, id){
//   Course.findById(id, (err, course) => {
//     req.course = course;
//     return next();
//   })
// })
//
// // home/ root route
// router.get("/", (req, res) => {
//   res.json({
//     message: 'Nothing to see here, just a REST API home page!',
//   });
// });
//
// /* CRUD OPS */
//
// // GET authorized user
// router.get("/api/users", (req, res, next) => {
//   if(req.auth) {
//     User.findOne({emailAddress: req.user}).then(data => {
//       res.status(200);
//       res.json(data);
//     });
//   } else {
//       res.status(401);
//       return next(new Error("Authorization Failed"));
//   }
// });
//
// // POST create new user
// router.post("/api/users", (req, res, next) => {
//   if(req.body.password) {
//     const salty = bcrypt.genSaltSync(10);
//     const hashPass = bcrypt.hashSync(req.body.password, salty);
//     req.body.password = hashPass;
//   }
//   else {
//     res.status(400);
//     return next(new Error("Please Enter password."));
//   }
//   // if entered email address !match eRegex, throw error
//   const eRegex = /^[^@]+@[^@.]+\.[a-z]+$/i;
//   if(!eRegex.test(String(req.body.emailAddress).toLowerCase())) {
//     return next(new Error("Enter valid email address"));
//   }
//
//   User.find({emailAddress: req.body.emailAddress}, (err, count) => {
//    if(count > 0) return next(new Error("Email address is already being used"));
//    User.create(req.body).then((data) => {
//      res.status(201).location("/").end();
//    })
//    .catch((err) => {
//      res.status(400).json({error: err});
//    })
//  });
// }); //end post
//
// // Show courses
// router.get("/api/courses", (req, res) => {
//   Course.find().exec((err, course) => {
//     res.status(200);
//     res.json(course);
//   })
// });
//
// // Show course by id
// router.get("/api/courses/:id", (req, res) => {
//   Course.findOne({_id: req.params.id}).populate("user", ["firstName", "lastName"]).exec((err, course) => {
//     res.status(200);
//     res.json(course);
//   })
// });
//
// // Create new course
// router.post("/api/courses", (req, res, next) => {
//   if(req.auth) {
//     User.findOne({emailAddress: req.user}).then(userData => {
//       req.body.user = userData;
//       Course.create(req.body).then(courseData => {
//         res.status(201);
//         res.location(`/api/courses/${courseData._id}`);
//         res.end();
//       })
//       .catch(err => {
//         res.status(400).json({error: err});
//       })
//     })
//   }
//   else {
//     res.status(401);
//     return next(new Error("Authorization Failed"));
//   }
// });
//
// // Updating course
// router.put("/api/courses/:id", (req, res, next) => {
//   if(req.auth) {
//     Course.find({user: req.course.user}).then(course => {
//       if(JSON.stringify(req.course.user) !== JSON.stringify(req.userId)) {
//         res.status(403);
//         return new Error("You are not authorized, the cops have been notified");
//       }
//     })
//     .then(err => {
//       if(err) return next(err);
//       req.course.update(req.body, (err, result) => {
//         res.status(204).end();
//       }).catch(err => {
//         res.status(400).json({error: err});
//       })
//     })
//   }
//   else {
//     res.status(401);
//     return next(new Error("Authorization Failed"));
//   }
// });
//
// // Delete course
// router.delete("/api/courses/:id", (req, res, next) => {
//   if(req.auth) {
//     Course.find({user: req.course.user}).then(course => {
//       if(JSON.stringify(req.course.user) !== JSON.stringify(req.userId)) {
//         res.status(403);
//         return new Error("You are not authorized, the cops have been notified");
//       }
//     })
//     .then(err => {
//       if(err) return next(err);
//       req.course.remove(() => {
//         res.status(204).end();
//       });
//     });
//   }
//   else {
//     res.status(401);
//     return next(new Error("Authorization Failed"));
//   }
// });
//
// module.exports = router;
//
// /* lets bring in the routes
// app.use('/', routes);
// app.use("/api/courses", routes);
// app.use("/api/courses/:id", routes);
// something missing*/
