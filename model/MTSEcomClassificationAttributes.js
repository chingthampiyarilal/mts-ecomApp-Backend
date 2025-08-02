const mongoose = require('mongoose');

const mtsEcomClassificationAttributesSchema = new mongoose.Schema({
    classificationID:String,
    classificationName:String,
    classAttributeID:String,
    classAttributeName:String,
    classAttributeValue:String,
    relatedImages:String,
});


module.exports = mongoose.models.ClassificationAttribute || mongoose.model('ClassificationAttribute', mtsEcomClassificationAttributesSchema, 'mts-ecom-classification-attributes');

