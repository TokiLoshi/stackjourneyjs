const express = require('express');
const userRouter = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const localStrategy = require('passport-local');


module.exports = userRouter;