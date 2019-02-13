'use strict';

const mongoose = require('mongoose');

const {Schema} = mongoose;

/*COURSE*/
const CourseSchema = new Schema({ //_id: { type: ObjectId },
  user : { type: String, default: 'Fred'},
  title : { type: String, default: 'PHP Basics' },
  description : { type: String, default: 'PHP for Newbies'},
  estimatedTime : { type: String, default: '19 hours' },
  materials : { type: String, default: 'Your Brain!' },
})
/*USER*/
const UserSchema = new Schema({
  firstName : { type: String, default: 'Tattle tale'},
  lastName : { type: String, default: 'Strangler' },
  emailAddress : { type: String, default: 'strangle@gmail.com'},
  password : { type: String, default: 'butter' }
});

/* const sortCourse = function (a, b) { //order by time
  if(a.estimatedTime === b.estimatedTime){
    return b.estimatedTime - a.estimatedTime
  }
}

UserSchema.pre('save', function(next){
  this.course.sort(sortCourse);
  next()
});

*/
const Course = mongoose.model('Course', CourseSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {User, Course};
