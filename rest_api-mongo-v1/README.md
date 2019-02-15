# Techdegree-project-9
REST api

myles, Install Node modules and get the database setup
Open a Command Prompt (on Windows) or Terminal (on Mac OS X and Linux) instance and browse to the root project folder.
Run the command npm install to install the required dependencies.
Run the command npm run seed to create your application's database and populate it with data.
Run the command npm start to run the Node.js Express application.
You can press Ctrl-C to stop the Node.js REST API.
Working on the project
The app.js file located in the root of the project folder configures Express to serve a simple REST API. You'll update this file to add your REST API routes.
You'll build your application by adding .js files to the project. Use folders as you see fit to organize your application's files.
Install and Configure Mongoose
Use npm to install Mongoose (the module is named mongoose.)
Configure Mongoose to use the fsjstd-restapi MongoDB database that you generated when setting up the project.
Write a message to the console if there's an error connecting to the database.
Write a message to the console once the connection has been successfully opened.
Create your Mongoose schema and models
Your database schema should match the following requirements:
User
_id (ObjectId, auto-generated)
firstName (String)
lastName (String)
emailAddress (String)
password (String)
Course
_id (ObjectId, auto-generated)
user (_id from the users collection)
title (String)
description (String)
estimatedTime (String)
materialsNeeded (String)
IMPORTANT NOTE: When defining models for an existing database...
Be careful when naming your models and model properties! Model names and model properties need to match the above provided names exactly. Otherwise, your database access code won't work as expected.
Create the user routes
Set up the following routes (listed in the format HTTP METHOD Route HTTP Status Code):
GET /api/users 200 - Returns the currently authenticated user
POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
Create the course routes
Set up the following routes (listed in the format HTTP METHOD Route HTTP Status Code):
GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
PUT /api/courses/:id 204 - Updates a course and returns no content
DELETE /api/courses/:id 204 - Deletes a course and returns no content
Update User and Course routes
Update the User and Course POST and PUT routes to validate that the request body contains the following required values. Return validation errors when necessary.
User
firstName
lastName
emailAddress
password
Course
title
description
Implement validations within your route handlers or your Mongoose models.
Mongoose validation gives you a rich set of tools to validate user data. See http://mongoosejs.com/docs/validation.html for more information.
Use the Express next() function in each route handler to pass any Mongoose validation errors to the global error handler.
Send validation error(s) with a400 status code to the user.
Hashing the password
Update the POST /api/users route to hash the user's password before persisting the user to the database.
For security reasons, we don't want to store user passwords in the database as clear text.
Use the bcrypt npm package to hash the user's password.
See https://github.com/kelektiv/node.bcrypt.js/ for more information.
Set up permissions to require users to be signed in
Add a middleware function that attempts to get the user credentials from the Authorization header set on the request.
You can use the basic-auth npm package to parse the Authorization header into the user's credentials.
The user's credentials will contain two values: a name value—the user's email address—and a pass value—the user's password (in clear text).
Use the user's email address to attempt to retrieve the user from the database.
If a user was found for the provided email address, then check that user's stored hashed password against the clear text password given using bcrypt.
If the password comparison succeeds, then set the user on the request so that each following middleware function has access to it.
If the password comparison fails, then return a 401 status code to the user.
Use this middleware in the following routes:
GET /api/users
POST /api/courses
PUT /api/courses/:id
DELETE /api/courses/:id
Test the routes
Postman is an application that you will use to explore and test REST APIs. We’ve provided you with a collection of Postman requests as part of the project files. Here’s how to load the provided collection into Postman:
If you haven’t already, install Postman. Links and instructions are available on their website at https://www.getpostman.com/.
Once you have Postman installed and open, click on the “Import” button in the top left hand corner of the application’s window.
In the opened dialog, click the “Choose Files” button and browse to the folder that contains your project files.
Select the RESTAPI.postman_collection.json file.
You should now see the FSJS Techdegree: REST API Project collection in the left hand pane of the main Postman window.
Be sure that your REST API is currently running (see the previous project step for details).
Click on one of the available requests to load it into a tab. Click on the Send button to issue the request to the local server.
When testing routes that require authentication, make sure to set the Authorization Type in postman to Basic Auth to enter the user's username (their email address) and password.

# If URL parameters are available within middleware, where can they be found?
-- REQ.PARAMS
#mongo relative path = /home/mylesz123/treehouse-mongo-basics

#//WATCH "BUILDING THE ANSWER ROUTES -- BUILD REST API COURSE"*/
