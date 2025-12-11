const express = require('express');
const { getMe, updateMe, getDriverContacts } = require('../controllers/user.controller');
const { authenticateToken } = require('../controllers/auth.controller');
const route = express.Router();

route.use(authenticateToken);

route.get('/me', getMe);

route.patch('/me', updateMe);

// Driver lấy danh bạ phụ huynh từ các chuyến đi hôm nay
route.get('/driver/contacts', getDriverContacts);

module.exports = route;