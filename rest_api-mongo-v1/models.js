'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*COURSE*/
const CourseSchema = new Schema({ //_id: { type: ObjectId },
  user : { type: Schema.Types.ObjectId, ref: 'User'},
  title : { type: String, required: [true, "Title is required."]},
  description : { type: String, required: [true, "Description is required."]},
  estimatedTime : { type: String, default: '19 hours' },
  materials : { type: String, default: 'Your Brain!' },
})
/*USER*/
const UserSchema = new Schema({
  firstName : { type: String, required: [true, "First name is required."]},
  lastName : { type: String, required: [true, "Last name is required."]},
  emailAddress : { type: String, required: [true, "Email address is required."]},
  password : { type: String, required: [true, "Password is required."] }
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
