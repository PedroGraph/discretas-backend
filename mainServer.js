import { mainApp } from "./app.js";
import { ProductModel } from "./models/postgres/product.js";
import { UserModel } from "./models/postgres/user.js";
import { ShoppingCartModel } from "./models/postgres/shoppingCart.js";
import { OrderModel } from "./models/postgres/orders.js";

const app = mainApp({ 
    productModel: new ProductModel(), 
    userModel: new UserModel(),
    shoppingCartModel: new ShoppingCartModel(),
    orderModel: new OrderModel()
});

export default app