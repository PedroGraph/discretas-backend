const Products = require('../../models/products')

const updateProducts = async (req, res, next) => {
    try {
        const tareaActualizada = await
        Products.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tareaActualizada) {
            res.status(404).json({ message: "There's no products" });
        } else {
            res.status(200).json(tareaActualizada);
        }
    } catch (err) {
        next(err);
    }
};

module.exports = updateProducts;