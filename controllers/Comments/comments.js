const Comments = require('../../models/comments');


const getComments = async (req, res, next) => {

    try {   
       const comments = await Comments.find({productID: req.params.id});
        if (!comments) {
            res.status(201).json({ error: "There's not comments" });
        } else {
            res.status(200).json(comments);
        }
    } catch (err) {
        next(err);
    }
};


const setComment = async (req, res, next) => {

    try {   
        const comment = new Comments(req.body);
        await comment.save();
        await res.status(200).json('Added comment');
    } catch (err) {
        next(err);
    }
};
  
module.exports = {
    getComments,
    setComment
}