const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Joi = require('joi');

// Define the user schema
const userSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: [true, "Your username is required"],
    },
    UserID: {
        type: String,
        unique: true,
    },
    Password: {
        type: String,
        required: [true, "Your password is required"],
    },
    EmailID: {
        type: String,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    Phone: {
        type: String,
    },
    IsAdmin: {
        type: Boolean,
        default: false,
    },
    IsManager: {
        type: Boolean,
        default: false,
    },
    IsStockist: {
        type: Boolean,
        default: false, // Corrected to a boolean value
    },
    IsStoreUser: {
        type: Boolean,
        default: false, // Corrected to a boolean value
    },
});

// Password hashing before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.Password, 10);
        this.Password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Create the model
const userModel = mongoose.model("mts-sagol-users", userSchema);

module.exports = userModel;
