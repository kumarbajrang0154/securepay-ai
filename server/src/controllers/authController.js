import { User } from "../models/User.js";

export const loginUser = async (req, res) => {

  try {

    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required"
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