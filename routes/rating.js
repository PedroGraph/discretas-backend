const express = require('express');

const {getProducts, getProduct} = require('../controllers/Products/consultar');
const actualizarProducto = require('../controllers/Rating/update');    

const router= express.Router();
// router.get('/', getProducts);
// router.get('/:id', getProduct);
router.put('/:id', actualizarProducto);

module.exports=router;
