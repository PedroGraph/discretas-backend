import { mainApp } from "./app.js";
import { ProductModel } from "./models/postgres/product.js";
import { UserModel } from "./models/postgres/user.js";
import { ShoppingCartModel } from "./models/postgres/shoppingCart.js";
import { OrderModel } from "./models/postgres/orders.js";
import { DiscountCodeModel } from "./models/postgres/discountCodes.js";
import { UsedDiscountCodeModel } from "./models/postgres/usedDiscountCodes.js";
// import 

const app = mainApp({ 
    productModel: new ProductModel(), 
    userModel: new UserModel(),
    shoppingCartModel: new ShoppingCartModel(),
    orderModel: new OrderModel(),
    discountCodeModel: new DiscountCodeModel(),
    usedDiscountCodeModel: new UsedDiscountCodeModel(),
});

export default app