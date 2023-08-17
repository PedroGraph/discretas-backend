const dbProducts = require('../../models/products')

const getProducts = async (req, res, next) => {
    try {
        
        const products = await dbProducts.find({});
        console.log(products)
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const targetId = req.params.id;
        console.log(targetId)
        const product = await dbProducts.findOne({ _id: targetId});
        console.log(JSON.stringify(product));
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};



module.exports = { 
    getProducts,
    getProduct
};