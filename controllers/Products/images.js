import logger from '../../logs/log.js';
import { Image } from '../../models/database/product.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { verifyImage, saveImage, generateFileName } from '../../utils/images.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// CREATE
export async function createImage(req, res) {
  try {
    const { body, file } = req;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    if (!file) {
      logger.warn('File not found');
      throw new Error('File not found');
    }

    const isAImage = await verifyImage(file.buffer);
    if (!isAImage) {
      logger.warn('File is not an image');
      return res.status(400).send('El archivo no es una imagen o tiene una extensión no válida.');
    }

    const productName = body.productName.replaceAll(" ", "_");
    const fileName = generateFileName(productName, file.originalname);
    const filepath = path.resolve(__dirname, '..', '..', 'public', 'uploads', productName);
    await saveImage(file.buffer, filepath, fileName);

    const newImage = await Image.create({
      imageName: fileName,
      imagePath: filepath,
      productID: body.productId
    });

    logger.info('Image created successfully');

    if(process.env.NODE_ENV === 'TEST') {
      return res.status(201).json({ newImage });
    }

    return res.status(201).json(newImage);

  } catch (error) {
    logger.error(`Error creating image: ${error.message}`);
    return res.status(500).json({ error: `Error creating image: ${error.message}` });
  }
}

// READ
export async function getImagesByProductId(req, res) {
  try {
    const { params } = req;
    const images = await Image.findAll({ where: { id: params.id } });
    let { imagePath, imageName } = images[0];
    imagePath = imagePath.split('/');
    const productFile = path.resolve(__dirname, '..', '..', 'public', 'uploads', imagePath.pop());
    if(!productFile) {
      logger.warn(`Product with ID ${params.id} not found`);
      throw new Error(`Product with ID ${params.id} not found`);
    }else{
      logger.info(`Product with ID ${params.id} found`);
      res.sendFile(`${productFile}/${imageName}`);
    }
  } catch (error) {
    logger.error(`Error getting images by product ID: ${error.message}`);
    return res.status(500).json({ error: `Error getting images by product ID: ${error.message}` });
  }
}

// UPDATE
export async function updateImage(req, res) {
  try {
    const { body } = req;
    const { imageId, updatedData } = body;
    await Image.update(updatedData, { where: { id: imageId } });
    const updatedImage = await Image.findByPk(imageId);
    if(process.env.NODE_ENV === 'TEST') {
      return res.status(200).json({ updatedImage });
    }
    logger.info('Image updated successfully');
    return res.status(200).json({info: 'Image updated successfully'});
  } catch (error) {
    logger.error(`Error updating image: ${error.message}`);
    return res.status(500).json({ error: `Error updating image: ${error.message}` });
  }
}

// DELETE
export async function deleteImage(req, res) {
  try {
    const { params } = req;
    const imageId = params.id;
    const imageToDelete = await Image.findByPk(imageId);
    if (!imageToDelete) {
      logger.warn(`Image with ID ${imageId} not found`);
      throw new Error(`Image with ID ${imageId} not found`);
    }
    await imageToDelete.destroy();
    logger.info(`Image with ID ${imageId} deleted successfully`);
    return res.status(200).json(imageToDelete);
  } catch (error) {
    logger.error(`Error deleting image: ${error.message}`);
    return res.status(500).json({ error: `Error deleting image: ${error.message}` });
  }
}
