import { Product, Image } from '../../models/database/product.js';
import logger from '../../logCreator/log.js';
export async function createProduct(req, res) {
  try {
    let { body } = req;
    const newProduct = await Product.create(body);
    logger.info('Se ha creado un nuevo producto');

    if (process.env_NODE_ENV === 'TEST') {
      res.status(201).json(newProduct);
    }

    res.status(201).json({ info: "Producto creado" });
  } catch (error) {
    logger.error('Error al crear el nuevo producto');
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function getAllProducts(req, res) {
  try {
    const products = await Product.findAll({
      include: [{
        model: Image,
        attributes: ['id'],
      }],
    });
    logger.info('Se han obtenido todos los Productos');
    res.status(200).json(products);
  } catch (error) {
    logger.error('Error al obtener todos los Productos');
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function getProductById(req, res) {
  const productId = req.params.id;
  try {
    const product = await Product.findByPk(productId, { include: Image });
    if (product) {
      logger.info(`Se ha obtenido el Producto con el id ${productId}`);
      res.status(200).json(product);
    } else {
      logger.warn(`Error al obtener el Producto con el id ${productId}`);
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    logger.error(`Error al obtener el Producto con el id ${productId} - Server error`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function updateProduct(req, res) {
  const productId = req.params.productId;
  const updatedData = req.body;

  try {
    const [rowsUpdated, [updatedProduct]] = await Product.update(updatedData, {
      where: { id: productId },
      returning: true,
    });

    if (rowsUpdated > 0) {
      logger.info(`Se ha actualizado el Producto con el id ${productId}`);
      if (process.env.NODE_ENV === 'TEST') {
        res.status(200).json(updatedProduct);
      }
      res.status(200).json({ info: 'Producto actualizado' });
    } else {
      logger.warn(`Error al actualizar el Producto con el id ${productId}`);
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    logger.error(`Error al actualizar el Producto con el id ${productId} - Server error`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function deleteProduct(req, res) {
  const productId = req.params.productId;

  try {
    const deletedProduct = await Product.destroy({
      where: { id: productId },
    });

    if (deletedProduct) {
      logger.info(`Se ha eliminado el Producto con el id ${productId}`);
      res.status(204).json({ info: 'Producto eliminado' });
    } else {
      logger.warn(`Error al eliminar el Producto con el id ${productId}`);
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    logger.error(`Error al eliminar el Producto con el id ${productId} - Server error`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
