const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User authentication
router.post('/login', userController.login);

// User management
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/employees', userController.getAllEmployees);
router.get('/admins', userController.getAllAdmins);

module.exports = router;
