const express = require('express');
const router = express.Router();
const account = require('../controllers/account.controller');

router.post('/register', account.register);
router.get('/:id', account.getUser);
router.post('/login', account.login);
router.get('/logout', account.logout);
router.get('/login', account.hasAuthenticated);


module.exports = router;