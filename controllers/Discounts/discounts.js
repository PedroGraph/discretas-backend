import logger from "../../logCreator/log.js";

export class DiscountsController {

    constructor(discountModels) {
        if (!discountModels) throw new Error("Missing model dependencies");
        const { discountCodeModel, usedDiscountCodeModel } = discountModels
        this.discountsCodesModel = discountCodeModel;
        this.usedDiscountsCodesModels = usedDiscountCodeModel;
    }

    getUsedDiscountCode = async (req, res) => {
        const { code } = req.params;
        const { userId } = req.query;
        const usedAt = new Date();
        try{
            if(!code || !userId) return res.status(401).json({ error: 'Missing parameters' });
            const discount = await this.discountsCodesModel.getDiscountCode(code);
            if(!discount) return res.status(201).json({ error: 'Discount code not found' });
            const usedDiscount = await this.usedDiscountsCodesModels.getUsedDiscountCodeByCodeAndUser(code, userId);   
            if(usedDiscount) return res.status(201).json({ error: 'Discount code already used by this user' });
            return res.status(200).json({ discount: discount.discountPercentage, code: code });
        }catch(error){
            console.log(error)
            logger.error('Error obtaining discount code - Server error');
            res.status(500).json({ error: `Error server: the discount code could not be obtained. Error message: ${error}` });
        }   
    }

    setNewUsedDiscountCode = async (req, res) => {
        const { code, userId } = req.body;
        try{
            console.log(req.body)
            if(!code || !userId) return res.status(401).json({ error: 'Missing parameters' });
            const discount = await this.discountsCodesModel.getDiscountCode(code);
            if(!discount) return res.status(201).json({ error: 'Discount code not found' });
            const usedDiscount = await this.usedDiscountsCodesModels.getUsedDiscountCodeByCodeAndUser(code, userId);
            if(usedDiscount) return res.status(201).json({ error: 'Discount code already used by this user' });
            await this.usedDiscountsCodesModels.createUsedDiscountCode({ 
                couponCode: code, 
                userId: userId, 
                usedAt: new Date(), 
                discountCodeId: discount.id 
            });
            logger.info(`Discount code ${code} obtained successfully. This user ${userId} has not used it yet`);
            return res.status(200).json({ message: 'Discount code has been used and added' });
        }catch(error){
            console.log(error)
            logger.error('Error obtaining discount code - Server error');
            res.status(500).json({ error: `Error server: the discount code could not be obtained. Error message: ${error}` });
        }   
    }
}