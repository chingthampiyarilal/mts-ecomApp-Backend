const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Joi = require('joi');

// Define the user schema
const userSchema = new mongoose.Schema({
    CustomerFirstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    CustomerLastName: {
        type: String,
        required: [true, "First Name is required"],
    },
    CustomerID: {
        type: String,
        unique: true,
    },
    Addressline1: {
        type: String,
    },
    Addressline2: {
        type: String,
    },
    State: {
        type: String,
    },
    City: {
        type: String,
    },
    Dstrict: {
        type: String,
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
        type: Number,
    }

});

// Password hashing before saving
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('Password')) {
//         return next();
//     }
//     try {
//         const hashedPassword = await bcrypt.hash(this.Password, 10);
//         this.Password = hashedPassword;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// Create the model
const userModel = mongoose.model("mts-ecom-customer", userSchema);

module.exports = userModel;
