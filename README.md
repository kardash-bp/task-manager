![todo pic](https://github.com/kardash-bp/task-manager/blob/master/todo.png "Task Manager by kardash")
# Task manager 
## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Installing](#installing)
* [Launch application](#launch-application)
* [Tests](#tests)
## General info
Task manager is a sample todo application with  user authentication and authorization, automated email sending, handling file uploads, automated testing...
## Technologies
Built With:
* Node.js/Express 
* MongoDB/Mongoose 
* npm packages used for creating this app jsonwebtoken, bcryptjs, nodemailer, validator, multer...
## Installing
Clone this git repository:

**git clone https://github.com/cmevawala/nodejs-todo-app.git**

Install local npm dependencies:

**npm install**

## Launch application
To launch app in root folder create **.env** file and copy / paste:
```
PORT=3000
DB_URL=mongodb://127.0.0.1:27017/task-api
# gmail login credentials
EMAIL_USER=your username
EMAIL_PASS=your password
# jwt
JWT_SECRET=somestingrandom
```
Open terminal and type:

**npm run dev**

## Tests
For testing you can use Postman or REST client in VS Code

REST client create, login, get profile user example:&nbsp;

First create rest.http & copy / paste following code
```
###

POST http://localhost:3000/users HTTP/1.1
content-type: application/json

{
  "name": "John",
  "email": "john@sbb.rs",
   "password": "444555tj",
   "age": "33"
} 
###

POST http://localhost:3000/users/login HTTP/1.1
content-type: application/json

{
  "email": "john@sbb.rs",
  "password": "444555lj"
}
###

GET http://localhost:3000/users/me HTTP/1.1

```
 The automated tests for this system are located in tests folder, to run them just type:
 * **npm test**
 
 It will execute script "test" in package.json file
