const express = require('express');
const router = express.Router();
const credit_card_controller = require('../controllers/credit-card.controller');

router.post('/create', credit_card_controller.credit_card_create);
router.get('/:id', credit_card_controller.credit_card_details);
router.put('/:id', credit_card_controller.credit_card_update);
router.delete('/:id', credit_card_controller.credit_card_delete);



module.exports = router;