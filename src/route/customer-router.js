// 'use strict'
// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/customer-controller');
// const authService = require('../services/auth-service');

// router.post('/', controller.post);
// router.get('/', controller.get);
// router.post('/authenticate', controller.authenticate);
// router.post('/refresh-token', authService.authorize, controller.refreshToken);
// module.exports = router;
const express = require('express')
var router = express.Router(); //interceptação das rotas
const userController = require("../controllers/customer-controller");

router.post('/create', userController.post);
router.post('/authenticate', userController.Authenticate)

router.get('/login', userController.login)
router.get('/', userController.get);
router.get('/:id', userController.getById);

router.put('/:id', userController.update);

router.delete('/:id', userController.del);

module.exports = router;