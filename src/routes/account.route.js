const express = require('express');
const router = express.Router();
const account = require('../controllers/account.controller');

router.post('/register', account.register);
router.get('/:id', account.getUser);
router.get('/email/:email', account.getUserByEmail);
router.post('/login', account.login);
router.get('/logout', account.logout);
router.get('/login', account.hasAuthenticated);


module.exports = router;