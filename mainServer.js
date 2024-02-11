import { mainApp } from "./app.js";
import { ProductModel } from "./models/postgres/product.js";
import { UserModel } from "./models/postgres/user.js";

const app = mainApp({ 
    productModel: new ProductModel(), 
    userModel: new UserModel(),
});

export default app