const express = require('express');
const route = express.Router();
const { signUp, signIn, logOut, refreshToken } = require('../controllers/auth.controller');
// Import lại AppError để dùng ở dưới
const AppError = require('../utils/appError');

route.post('/signup', signUp);

route.post('/signin', signIn);

route.delete('/logout', logOut);

route.post('/token', refreshToken);

route.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = route;

