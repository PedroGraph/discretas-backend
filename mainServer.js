import { mainApp } from "./app.js";
import { ProductModel } from "./models/postgres/product.js";
import { UserModel } from "./models/postgres/user.js";
import { ImageModel } from "./models/postgres/product.js";

const app = mainApp({ 
    productModel: new ProductModel(), 
    userModel: new UserModel(),
    imageModel: new ImageModel()
});

export default app