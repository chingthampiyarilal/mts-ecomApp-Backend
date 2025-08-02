const mongoose = require('mongoose');

const mtsEcomProductSchema = new mongoose.Schema({
    parentId:String,
    assetName: String,
    assetValue: String,
});


module.exports = mongoose.model('Product', mtsEcomProductSchema, 'mts-ecom-products');

