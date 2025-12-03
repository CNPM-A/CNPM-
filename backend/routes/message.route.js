const express = require('express');
const { authenticateToken } = require('../controllers/auth.controller');
const { getMyMessage } = require('../controllers/message.controller');
const route = express.Router();

route.use(authenticateToken);

route.get('/me', getMyMessage);

module.exports = route;