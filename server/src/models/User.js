import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Mobile login (main auth for your app)
    mobile: {
      type: String,
      unique: true,
      sparse: true
    },

    // Optional email login
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true
    },

    password: {
      type: String
    },

    name: {
      type: String,
      default: "SecurePay User"
    },

    avatar: {
      type: String,
      default: "https://i.pravatar.cc/150"
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    isActive: {
      type: Boolean,
      default: true
    }

  },
  {
    timestamps: true
  }
);

// Hash password if password exists
userSchema.pre("save", async function (next) {

  if (!this.password || !this.isModified("password"))
    return next();

  try {

    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);

    next();

  } catch (error) {

    next(error);

  }

});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {

  if (!this.password) return false;

  return await bcryptjs.compare(enteredPassword, this.password);

};

export const User = mongoose.model("User", userSchema);