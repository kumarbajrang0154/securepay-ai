import User from "../models/User.js";
import { sanitizeInput } from "../utils/helpers.js";

export const loginUser = async (req, res) => {

  try {

    const rawMobile = req.body?.mobile || "";
    const mobile = sanitizeInput(rawMobile);

    if (!mobile || !/^\+?\d{10,15}$/.test(mobile.replace(/\s+/g, ""))) {
      return res.status(400).json({
        success: false,
        message: "Valid mobile number is required",
      });
    }

    // check if user exists
    let user = await User.findOne({ mobile });

    // create new user if not exists
    if (!user) {

      user = new User({
        mobile
      });

      await user.save();

    }

    res.json({
      success: true,
      message: "Login successful",
      user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};