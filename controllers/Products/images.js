import logger from '../../logCreator/log.js';
import { Image } from '../../models/postgres/product.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { verifyImage, saveImage, generateFileName } from '../../utils/images.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// CREATE

export class ImageController {
  constructor( imageModel ) {
    this.imageModel = imageModel;
  }

  create = async (req, res) => {
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
  
      const newImage = await this.imageModel.save({
        imageName: fileName,
        imagePath: filepath,
        productID: body.productId
      });
      logger.info('A new image has been created');
      res.status(201).json({ info: newImage });
    } catch (error) {
      logger.error('Has ocurred an error creating a new image');
      res.status(500).json({ error: `Error server: the image could not be created. Error message: ${error}` });
    }
  }

  getAll = async (req, res) => {
    try {
      const images = await this.imageModel.getAll();
      logger.info('Items obtained successfully');
      res.status(200).json(images);
    } catch (error) {
      logger.error('Error obtaining items - Server error');
      res.status(500).json({ error: `Error server: the items could not be obtained. Error message: ${error}` });
    }
  }

  getById = async (req, res) => {
    const imageId = req.params.id;
    try {
      const image = await this.imageModel.getById(imageId);
      console.log(image)
      let { imagePath, imageName } = image.dataValues;
      imagePath = imagePath.split('/');
      const productFile = path.resolve(__dirname, '..', '..', 'public', 'uploads', imagePath.pop());
      if(!productFile) {
        logger.warn(`Product with ID ${imageId} not found`);
        throw new Error(`Product with ID ${imageId} not found`);
      }else{
        logger.info(`Product with ID ${imageId} found`);
        res.sendFile(`${productFile}/${imageName}`);
      }
    } catch (error) {
      logger.error('Error obtaining item - Server error');
      res.status(500).json({ error: `Error server: the item could not be obtained. Error message: ${error}` });
    }
  }

  update = async (req, res) => {
    const updatedData = req.body;
    const imageId = req.params.id;
    try {
      const updatedImage = await this.imageModel.update({ updatedData, imageId });
      logger.info('Item updated successfully');
      res.status(200).json(updatedImage);
    } catch (error) {
      logger.error('Error updating item - Server error');
      res.status(500).json({ error: `Error server: the item could not be updated. Error message: ${error}` });
    }
  }

  deleteImage = async (req, res) => {
    const imageId = req.params.id;
    try {
      const deletedImage = await this.imageModel.delete({ imageId });
      logger.info('Item deleted successfully');
      res.status(200).json(deletedImage);
    } catch (error) {
      logger.error('Error deleting item - Server error');
      res.status(500).json({ error: `Error server: the item could not be deleted. Error message: ${error}` });
    }
  }

}
