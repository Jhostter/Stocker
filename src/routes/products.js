const express = require('express');
const productController = require('../controllers/productControllers');

const router = express.Router();

router.get('/viewProducts', productController.view)
router.get('/addProducts', productController.add);
router.post('/addProducts', productController.store);
router.post('/deleteProduct', productController.destroy)
router.get('/editProduct:id', productController.edit);
router.post('/editProduct:id', productController.update);

module.exports = router;