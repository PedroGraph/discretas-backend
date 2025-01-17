import { Product } from "./product.js";
import { Image } from "./image.js";
import { User } from "./user.js";
import { RevokedToken } from "./revokedToken.js";
import { ShoppingCart } from "./shoppingCart.js";
import { Order } from "./orders.js";
import { UsedDiscountCode } from "./usedDiscountCodes.js";
import { DiscountCode } from "./discountCodes.js";
import { Payment } from "./payment.js";

async function syncDatabase() {
    try {
        // Sync models in the correct order
        await Product.sync({ force: false });
        await Image.sync({ force: false });
        await User.sync({ force: false });
        await RevokedToken.sync({ force: false });
        await ShoppingCart.sync({ force: false });
        await Order.sync({ force: false });
        await DiscountCode.sync({ force: false });
        await UsedDiscountCode.sync({ force: false });
        await Payment.sync({ force: false });
        console.log('Base de datos sincronizada correctamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
}

export default syncDatabase;