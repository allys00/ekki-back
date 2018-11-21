const express = require('express');
const router = express.Router();
const credit_card_controller = require('../controllers/credit-card.controller');

router.post('/', credit_card_controller.create);
router.get('/:id', credit_card_controller.details);
router.put('/:id', credit_card_controller.update);
router.delete('/:id', credit_card_controller.delete);



module.exports = router;