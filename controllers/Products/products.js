import { Product, Image } from '../../models/database/product.js'; 
export async function createProduct(req, res) {
  try {
    let { body } = req;
    const newProduct = await Product.create(body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
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
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function getProductById(req, res) {
  const productId = req.params.id;
  try {
    const product = await Product.findByPk(productId, { include: Image });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
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
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
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
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
