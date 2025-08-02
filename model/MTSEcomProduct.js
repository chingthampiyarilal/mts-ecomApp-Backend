const mongoose = require('mongoose');

const mtsEcomProductSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    productName: String,
    price: String,
    image: String,
    description: String,
    longDescription: String,
    catID: String,
    isModel: Boolean,
    isVariation: Boolean,
    modelProductId: String,
    classificationID: String,
    relatedImages: [String],
});


module.exports = mongoose.models.Product || mongoose.model('Product', mtsEcomProductSchema, 'mts-ecom-products');

