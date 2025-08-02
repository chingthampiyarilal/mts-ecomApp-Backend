// controllers/authController.js

const User = require('../model/MTSEcomCustomer');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken')


const registerSchema = Joi.object({
  CustomerFirstName: Joi.string().min(1).required(),
  CustomerLastName: Joi.string().min(1).required(),
  CustomerID: Joi.string().optional(),
  Addressline1: Joi.string().optional(),
  Addressline2: Joi.string().optional(),
  State: Joi.string().optional(),
  City: Joi.string().optional(),
  Dstrict: Joi.string().optional(),
  Password: Joi.string().min(1).required(),
  EmailID: Joi.string().email().optional(),
  Phone: Joi.number().optional()
});

const loginSchema = Joi.object({
  CustomerID: Joi.string().min(1).required(),
  Password: Joi.string().min(1).required()
});

const modifyUserSchema = Joi.object({
  CustomerID: Joi.string().optional(),
  Password: Joi.string().optional(),
  CustomerFirstName: Joi.string().min(1).optional(),
  CustomerLastName: Joi.string().min(1).optional(),
  EmailID: Joi.string().email().optional(),
  Phone: Joi.string().optional()
});

const registerController = async (req, res) => {
  try {
    // Validate request using Joi or your custom schema
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ success: false, message: error.details[0].message });
    }

    // Destructure all fields from the request body
    const {
      CustomerFirstName,
      CustomerLastName,
      CustomerID,
      Password,
      EmailID,
      Phone,
      Addressline1,
      Addressline2,
      City,
      State,
      Dstrict
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ EmailID });
    if (existingUser) {
      return res.status(400).send({ success: false, message: 'Email already exists' });
    }

    console.log("req.body", req.body)
    // Hash password
    // const hashedPassword = await bcrypt.hash(Password, 10);
    // const hashedPassword = await bcrypt.hash(Password.trim(), 10);

//     console.log("Original password:", `"${Password}"`);
// console.log("Trimmed password:", `"${Password.trim()}"`);
// console.log("Hashed password:", hashedPassword);


    // Create and save new user
    const newUser = new User({
      CustomerFirstName,
      CustomerLastName,
      CustomerID,
      // Password: hashedPassword,
      Password,
      EmailID,
      Phone,
      Addressline1,
      Addressline2,
      City,
      State,
      Dstrict
    });

    await newUser.save();

    res.status(201).send({
      message: "Registration successful",
      success: true,
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({
      success: false,
      message: `Registration failed: ${error.message}`,
    });
  }
};

// getUserController

const getUserController = async (req, res) => {
  const { EmailID } = req.params;
  try {
    const user = await User.findOne({ EmailID });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// getUserListController
const getUserListController = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// modifyUserController
const modifyUserController = async (req, res) => {
  const { EmailID } = req.params;
  const updateData = req.body;

  try {
    console.log("Request to update user:", { EmailID, updateData });
    // Validate the update data using Joi schema
    const { error } = modifyUserSchema.validate(updateData);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    if (updateData.Password) {
      const hashedPassword = await bcrypt.hash(updateData.Password, 10);
      updateData.Password = hashedPassword;
    }

    // Find user and update
    const user = await User.findOneAndUpdate({ EmailID }, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error modifying user:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//deleteUserController
const deleteUserController = async (req, res) => {
  const { EmailID } = req.params;

  try {
    const user = await User.findOneAndDelete({ EmailID });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const loginController = async (req, res) => {
  console.log('req.body', req.body)
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ success: false, message: error.details[0].message });
    }
    const { CustomerID, Password } = req.body;
    if (!CustomerID || !Password) {
      return res.status(400).send({ success: false, message: 'User and Password are required' });
    }

    const user = await User.findOne({ CustomerID });
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    console.log("Login attempt for:", CustomerID);
    console.log("User found:", user);

    console.log("Entered Password:", Password);
    console.log("Hashed Password in DB:", user.Password);

    // const isMatch = await bcrypt.compare(Password, user.Password);
    // const isMatch = await bcrypt.compare(Password.trim(), user.Password);
    // console.log("Password Match Result:", isMatch);
    // if (!isMatch) {
    //   return res.status(400).send({ message: "Invalid credentials", success: false });
    // }
    if (user.Password !== Password) {
      return res.status(401).json({ message: "Invalid password", success: false });
    }
   
    const token = jwt.sign(
      { id: user._id, },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).send({
      message: "Login successful",
      success: true,
      token,
      userInfo: {
        CustomerFirstName: user.CustomerFirstName,
        CustomerLastName: user.CustomerLastName,
        Addressline1: user.Addressline1,
        Addressline2: user.Addressline2,
        State: user.State,
        City: user.City,
        District: user.Dstrict,
        CustomerID: user._id,
        isActive: user.isActive,
        EmailID: user.EmailID,
        Phone: user.Phone,
      },
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: `Login failed: ${error.message}`, success: false });
  }
};


const logoutController = (req, res) => {
  try {
    console.log(`User logged out. UserID: ${req.userId}`);

    res.status(200).send({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send({
      success: false,
      message: `Logout failed: ${error.message}`,
    });
  }
};


const authController = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log('Error in authController:', error);
    res.status(500).send({
      message: "Authentication error.",
      success: false,
      error: error.message,
    });
  }
};
// const updateProfileController = async (req, res) => {
//   try {
//     const { CustomerID, currentPassword, updatedData } = req.body;
//     console.log('req.body', req.body);


//     const user = await User.findOne({ CustomerID });
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // 🔐 Verify current password
//     const isMatch = await bcrypt.compare(currentPassword, user.Password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: 'Invalid current password' });
//     }

//     // 🔐 If new password is provided, hash it
//     if (updatedData.Password && updatedData.Password.trim() !== '') {
//       const hashedPassword = await bcrypt.hash(updatedData.Password, 10);
//       updatedData.Password = hashedPassword;
//     } else {
//       delete updatedData.Password; // Don't update password if field is blank
//     }

//     // ✅ Update all other fields
//     const updatedUser = await User.findByIdAndUpdate(
//       user._id,
//       { $set: updatedData },
//       { new: true }
//     );

//     const { Password, __v, ...userInfo } = updatedUser.toObject();

//     res.status(200).json({
//       success: true,
//       message: 'Profile updated successfully',
//       userInfo
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };


const updateProfileController = async (req, res) => {
  try {
    const { CustomerID, currentPassword, updatedData } = req.body;

    if (!CustomerID || !currentPassword) {
      return res.status(400).json({ success: false, message: 'CustomerID and current password are required' });
    }

    const user = await User.findOne({ CustomerID });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate current password
    // const isMatch = await bcrypt.compare(currentPassword, user.Password);
    // if (!isMatch) {
    //   return res.status(401).json({ success: false, message: 'Incorrect current password' });
    // }

    if (user.Password.trim() !== currentPassword.trim()) {
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }

    // Prepare updated fields
    const {
      CustomerFirstName,
      CustomerLastName,
      Addressline1,
      Addressline2,
      City,
      State,
      District,
      Phone,
      Password, // New password (optional)
    } = updatedData;

    // Update fields
    if (CustomerFirstName) user.CustomerFirstName = CustomerFirstName;
    if (CustomerLastName) user.CustomerLastName = CustomerLastName;
    if (Addressline1) user.Addressline1 = Addressline1;
    if (Addressline2) user.Addressline2 = Addressline2;
    if (City) user.City = City;
    if (State) user.State = State;
    if (District) user.Dstrict = District;
    if (Phone) user.Phone = Phone;

    // Update password if provided
    if (Password && Password.trim().length > 0) {
      const hashedNewPassword = await bcrypt.hash(Password.trim(), 10);
      user.Password = hashedNewPassword;
    }

    await user.save();

    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: `Update failed: ${error.message}` });
  }
};


module.exports = {
  registerController,
  loginController,
  authController,
  logoutController,
  getUserController,
  getUserListController,
  modifyUserController,
  deleteUserController,
  updateProfileController
}
