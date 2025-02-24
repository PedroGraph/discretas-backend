import { mainApp } from "./app.js";
import { ProductModel } from "./models/postgres/product.js";
import { UserModel } from "./models/postgres/user.js";
import { ShoppingCartModel } from "./models/postgres/shoppingCart.js";
import { OrderModel } from "./models/postgres/orders.js";
import { DiscountCodeModel } from "./models/postgres/discountCodes.js";
import { UsedDiscountCodeModel } from "./models/postgres/usedDiscountCodes.js";
import { MercadoPagoModel } from "./models/mercadoPago/payment.js";
import { PaymentModel } from "./models/postgres/payment.js";
import { AddressModel } from "./models/postgres/address.js";
import { WishlistModel } from "./models/postgres/wishlist.js";
import { NotificationsModel } from "./models/postgres/notifications.js";

const startServer = async () => {
  try {
    const app = await mainApp({ 
      productModel: new ProductModel(), 
      userModel: new UserModel(),
      shoppingCartModel: new ShoppingCartModel(),
      orderModel: new OrderModel(),
      discountCodeModel: new DiscountCodeModel(),
      usedDiscountCodeModel: new UsedDiscountCodeModel(),
      mercadoPagoModel: new MercadoPagoModel(),
      paymentModel: new PaymentModel(),
      addressModel: new AddressModel(),
      wishlistModel: new WishlistModel(),
      notificationModel: new NotificationsModel()
    });

    console.log("🚀 Servidor iniciado correctamente");

    return app;
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

const app = await startServer(); 
export default app;
