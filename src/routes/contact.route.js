const express = require('express');
const router = express.Router();
const contact_controller = require('../controllers/contact.controller');

router.post('', contact_controller.contact_create);
router.get('/:id', contact_controller.contact_details);
router.put('/:id', contact_controller.contact_update);
router.delete('/:id', contact_controller.contact_delete);



module.exports = router;