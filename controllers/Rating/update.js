const Rating = require('../../models/rating')
const Products = require('../../models/products')

const updateStars = async (req, res, next) => {
    try {
        const filter = {
            uid: req.body.uid,
            productID: req.body.productID,
        }
        const updateRating = await
        Rating.findOneAndUpdate(filter, req.body, { new: true, upsert: true});
        if (!updateRating) {
            res.status(404).json({ error: "Product not found or this product has been removed" });
        } else {
            res.status(200).json({ message: `You has rating this product with ${req.body.rating} stars`});
        }
    } catch (err) {
        next(err);
    }
};



const ratingInfo = async (req, res, next) => {
    try {
        
        let ratingInfo = {};

        console.log(req.body)

        const ratingProduct = await Rating.aggregate([
            {
              $match: { productID: req.body?.productID }
            },
            {
              $group: {
                _id: "$productID",
                totalRating: { $sum: 1 },
                totalStars: { $sum: { $toInt: "$stars" } }
              }
            },
            {
              $project: {
                _id: 0,
                totalRating: 1,
                totalStars: 1
              }
            }
          ]);

          if(!req.body.uid){

            ratingInfo = {
                productTotalRating: ratingProduct[0].totalRating,
                averageRating: ratingProduct[0].totalStars / ratingProduct[0].totalRating,
            }

          }else{

            const ratingUser = await Rating.find({
            productID: req.body.productID,
            uid: req.body.uid
            },{
                stars: 1,
                _id: 0
            });
        
            ratingInfo = {
                productTotalRating: ratingProduct[0].totalRating,
                averageRating: ratingProduct[0].totalStars / ratingProduct[0].totalRating,
                productUserRating: ratingUser[0]?.stars || 0
            }
          }

          console.log(ratingInfo)

          
          if(!ratingProduct) res.status(404).json({error: "The product that you look for not found"}) 

          res.status(200).json(ratingInfo);

    } catch (err) {
        next(err);
    }
};




module.exports = {
    updateStars,
    ratingInfo
}