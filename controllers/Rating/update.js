const Rating = require('../../models/rating')

const updateProducts = async (req, res, next) => {
    try {
        // const tareaActualizada = await
        // Rating.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // if (!tareaActualizada) {
        //     res.status(404).json();
        // } else {
            res.status(200).json({ message: req.ip });
        // }
    } catch (err) {
        next(err);
    }
};

module.exports = updateProducts;