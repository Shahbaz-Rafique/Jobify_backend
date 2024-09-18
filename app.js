var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();
require('./utils/connection');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Authentication 
var SignInRoute = require('./routes/Authentication/signin');
var addAdminRoute = require('./routes/SuperAdmin/addAdmin');
var getAdminsRoute = require('./routes/SuperAdmin/getAdmins');
var deleteAdminsRoute = require('./routes/SuperAdmin/deleteAdmin');
var updateAdminRoute = require('./routes/SuperAdmin/updateAdmin');
var addCompanyRoute = require('./routes/Admin/addCompany');
var getCompaniesRoute = require('./routes/Admin/getCompanies');
var deleteCompanyRoute = require('./routes/Admin/deleteCompany');
var updateCompanyRoute = require('./routes/Admin/updateCompany');
var openaiRoute = require('./routes/Admin/openai');
var getJobsRoute = require('./routes/Admin/getJobs');
var updateJobRoute = require('./routes/Admin/updateJob');
var addJobRoute = require('./routes/Admin/addJob');
var deleteJobRoute = require('./routes/Admin/deleteJob');

var app = express();
app.use(cors());

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const API_KEY = process.env.API_KEY; 

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (apiKey && apiKey === API_KEY) {
    next(); 
  } else {
    res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  }
};

const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = decoded; 
    next();
  });
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(apiKeyMiddleware);

app.use('/api/v1/authentication/signin', SignInRoute);
app.use('/api/v1/superadmin/addAdmin',jwtMiddleware, addAdminRoute);
app.use('/api/v1/superadmin/getAdmins',jwtMiddleware, getAdminsRoute);
app.use('/api/v1/superadmin/deleteAdmin',jwtMiddleware, deleteAdminsRoute);
app.use('/api/v1/superadmin/updateAdmin',jwtMiddleware, updateAdminRoute);
app.use('/api/v1/admin/addCompany',jwtMiddleware, addCompanyRoute);
app.use('/api/v1/admin/getCompanies',jwtMiddleware, getCompaniesRoute);
app.use('/api/v1/admin/deleteCompany',jwtMiddleware, deleteCompanyRoute);
app.use('/api/v1/admin/editCompany',jwtMiddleware, updateCompanyRoute);
app.use('/api/v1/admin/openai',jwtMiddleware, openaiRoute);
app.use('/api/v1/admin/addjob',jwtMiddleware, addJobRoute);
app.use('/api/v1/admin/deletejob',jwtMiddleware, deleteJobRoute);
app.use('/api/v1/admin/updatejob',jwtMiddleware, updateJobRoute);
app.use('/api/v1/admin/getjobs', getJobsRoute);

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
