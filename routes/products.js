const express = require('express');

const crearProducto = require('../controllers/Products/crear');
const {getProducts, getProduct} = require('../controllers/Products/consultar');
const updateProducts = require('../controllers/Products/actualizar');
const eliminarProducto = require('../controllers/Products/eliminar');

const router= express.Router();
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', crearProducto);
router.put('/id', updateProducts);
router.delete('/id',eliminarProducto)

module.exports=router;
