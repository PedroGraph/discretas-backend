import express from 'express';
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

    if (!file) throw new Error('File not found');
    const isAImage = await verifyImage(file.buffer);
    if (!isAImage) return res.status(400).send('El archivo no es una imagen o tiene una extensión no válida.');

    const productName = body.productName.replaceAll(" ", "_");
    const fileName = generateFileName(productName, file.originalname);
    const filepath = path.resolve(__dirname, '..', '..', 'public', 'uploads', productName);
    await saveImage(file.buffer, filepath, fileName);

    const newImage = await Image.create({
      imageName: fileName,
      imagePath: filepath,
      productID: body.productId
    })
    return res.status(201).json(newImage);

  } catch (error) {
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
    res.sendFile(`${productFile}/${imageName}`);
  } catch (error) {
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
    return res.status(200).json(updatedImage);
  } catch (error) {
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
      throw new Error(`Image with ID ${imageId} not found`);
    }
    await imageToDelete.destroy();
    return res.status(200).json(imageToDelete);
  } catch (error) {
    return res.status(500).json({ error: `Error deleting image: ${error.message}` });
  }
}
