const ecomCategory = require('../model/MTSEcomCategory')

exports.getMTSEcomCategory = async(req, res) => {
    try {
        const category = await ecomCategory.find();
        res.status(200).json({
            message:'Category fetched successfully',
            data:category
        })
    }catch (error){
        res.status(500).json({
            message:"Failed to fetch Category",
            error:error.message
        });
    }
};