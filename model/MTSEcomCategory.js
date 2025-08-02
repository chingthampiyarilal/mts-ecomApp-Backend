const mongoose = require('mongoose');

const mtsEcomCategorySchema = new mongoose.Schema({
    catID: String,
    catName: String,
    desc: String,
    image: String
});


module.exports = mongoose.model('Category', mtsEcomCategorySchema);

