import { Product } from "./product.js";
import { Image } from "./image.js";
import { User } from "./user.js";
import { RevokedToken } from "./revokedToken.js";
import { ShoppingCart } from "./shoppingCart.js";
import { Order } from "./orders.js";

const models = { Product, Image, User, RevokedToken, ShoppingCart, Order}; 

async function syncDatabase() {
    try {
      await Promise.all(Object.values(models).map((model) => model.sync({ force: false })));
      console.log('Base de datos sincronizada correctamente.');
    } catch (error) {
      console.error('Error al sincronizar la base de datos:', error);
    }
}

export default syncDatabase;