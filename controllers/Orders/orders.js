const Orders = require('../../models/orders');


const getOrders = async (req, res, next) => {

    try {   
       const orders = await Orders.find({userID: req.params.userId});
        if (!orders) {
            res.status(201).json({ error: "There's not orders" });
        } else {
            res.status(200).json(orders);
        }
    } catch (err) {
        next(err);
    }
};


const setOrder = async (req, res, next) => {

    try {   
        const orders = new Orders(req.body);
        await orders.save();
        await res.status(200).json('Added orders');
    } catch (err) {
        next(err);
    }
};
  
module.exports = {
    getOrders,
    setOrder
}