const express = require('express');

const crearProducto = require('../controllers/Products/crear');
const {getProducts, getProduct, getRelatedProduct} = require('../controllers/Products/consultar');
const updateProducts = require('../controllers/Products/actualizar');
const eliminarProducto = require('../controllers/Products/eliminar');

const router= express.Router();
router.post('/allProducts', getProducts);
router.get('/relatedProducts', getRelatedProduct);
router.get('/:id', getProduct);
router.post('/', crearProducto);
router.put('/:id', updateProducts);
router.delete('/:id',eliminarProducto)

module.exports=router;
