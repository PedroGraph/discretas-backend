import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

export const Image = sequelize.define('image', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imageName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export class ImageModel {
  save = async (image) => {
    try {
      const newImage = await Image.create(image);
      if (newImage) return newImage;
      else return [];
    } catch (error) {
      console.log(error);
    }
  }

  getAll = async () => {
    try {
      const allImages = await Image.findAll();
      if (allImages) return allImages;
      return [];
    } catch (error) {
      console.log(error);
    }
  }

  getById = async (imageId) => {
    try {
      const image = await Image.findByPk(imageId);
      if (image) return image;
      return [];
    } catch (error) {
      console.log(error);
    }
  }

  update = async ({ updatedData, imageId }) => {
    try {
      const [rowsUpdated, [updatedImage]] = await Image.update(updatedData, {
        where: { id: imageId },
        returning: true,
      });
      if (rowsUpdated > 0) return updatedImage;
      else return [];
    } catch (error) {
      console.log(error);
    }
  }

  delete = async ({ imageId }) => {
    try {
      const rowsDeleted = await Image.destroy({
        where: { id: imageId },
      });
      if (rowsDeleted > 0) return { message: "Image deleted successfully" };
      else return [];
    } catch (error) {
      console.log(error);
    }
  }
}
