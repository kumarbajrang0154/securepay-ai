import express from "express";

const router = express.Router();

let otpStore = {};

// SEND OTP
router.post("/send-otp", (req, res) => {
  const { mobile } = req.body;

  if (!mobile || mobile.length !== 10) {
    return res.status(400).json({
      success: false,
      message: "Invalid mobile number",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[mobile] = otp;

  console.log("Generated OTP:", otp);

  res.json({
    success: true,
    message: "OTP sent successfully",
  });
});

// VERIFY OTP
router.post("/verify-otp", (req, res) => {
  const { mobile, otp } = req.body;

  if (otpStore[mobile] == otp) {
    delete otpStore[mobile];

    return res.json({
      success: true,
      token: "securepay-demo-token",
      user: { mobile },
    });
  }

  res.status(400).json({
    success: false,
    message: "Invalid OTP",
  });
});

export default router;