const dbProducts = require('../../models/products');
const Rating = require('../../models/rating');

const getProducts = async (req, res) => {
    try {
        const limit = req.body?.limit ? parseInt(req.body?.limit) : null;
        const skipCount = req.body?.skip ? parseInt(req.body?.skip) : null;
 
        const products = await dbProducts.find({}).skip(skipCount).limit(limit);
        const ratingPromises = products.map(async (product) => {
            const productid = product._id.toString();
            const ratingCount = await Rating.aggregate([
                {
                    $match: {
                        productID: productid
                    }
                },
                {
                    $project: {
                        _id: 0,
                        stars: { $toInt: "$stars" }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$stars" },
                        count: { $sum: 1 }
                    }
                },
            ]);
            product.stars = ratingCount[0]?.total / ratingCount[0]?.count
            return product;
        });
        const finalProducts = await Promise.all(ratingPromises);
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
    }
};

const getProduct = async (req, res) => {
    try {
        const targetId = req.params.id;
        const product = await dbProducts.findOne({ _id: targetId});
        res.status(200).json(product);
    } catch (err) {
        console.log(err);
    }
};

const getRelatedProduct = async(req, res, next) => {

    const randomQuantity = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
    try{
        dbProducts.aggregate([
            {$sample: 
                { size: randomQuantity}
            }
        ]).then((document) =>{
           res.status(200).json(document)
        });
    }catch(e){
        console.log(e)
    }

}

const searchProducts = async (req, res) => {

    try{
      const products = await dbProducts.find({
        name: { 
            $regex: new RegExp(req.params.name, 'i') 
        } 
      })
      .limit(5);
      res.status(200).json(products)
    }catch(err){
      console.error(err)
    }
  
}



module.exports = { 
    getProducts,
    getProduct,
    getRelatedProduct,
    searchProducts
};