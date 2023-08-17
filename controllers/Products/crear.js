const Products = require('../../models/products')

const crearProducts = async (req, res, next) => {
    try {
        const { name, productType, image,  price, description, stars } = req.body;

        const newProduct = new Products({
            name,
            productType,
            price,
            image,
            description,
            stars
        });

        const saveProduct = await newProduct.save();
        res.status(201).json(saveProduct);
        console.log("saved")
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
module.exports = crearProducts;
