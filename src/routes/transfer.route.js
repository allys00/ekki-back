const express = require('express');
const router = express.Router();
const transfer_controller = require('../controllers/transfer.controller')

router.post('/', transfer_controller.create);
router.get('/:id', transfer_controller.list);
router.put('/:id', transfer_controller.update);
router.delete('/:id', transfer_controller.delete);



module.exports = router;