const mongoose = require('mongoose');

const ClassificationSchema  = new mongoose.Schema({
    classificationID:String,
    classificationName: String,
    classificationAttributes:[String],
});


module.exports = mongoose.models.Classification || mongoose.model('Classification', ClassificationSchema , 'mts-ecom-classifications');

