const express = require('express');
const ticketControllers = require('../controllers/ticketControllers');

const router = express.Router();

router.get('/viewTickets', ticketControllers.view)
router.post('/products/search', ticketControllers.searchProduct);

module.exports = router