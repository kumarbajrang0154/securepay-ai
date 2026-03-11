/**
 * Utility Functions
 */

import crypto from "crypto"
import * as Jimp from "jimp"
import QrCode from "qrcode-reader"

/**
 * Generate SHA256 hash
 */
export const generateHash = (data) => {
  return crypto.createHash("sha256").update(data).digest("hex")
}

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate UPI format
 */
export const isValidUPI = (upi) => {
  const upiRegex = /^[a-zA-Z0-9.\-_]+@[a-zA-Z]{3,}$/
  return upiRegex.test(upi)
}

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

/**
 * Get IP address from request
 */
export const getIPAddress = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "Unknown"
  )
}

/**
 * Sanitize input string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input
  return input.trim().replace(/[<>]/g, "")
}

/**
 * Decode QR Image
 */
export const decodeQR = async (imagePath) => {

  try {

    const image = await Jimp.read(imagePath)

    return new Promise((resolve) => {

      const qr = new QrCode()

      qr.callback = function (err, value) {

        if (err || !value) {
          console.error("QR decode error:", err)
          return resolve(null)
        }

        resolve(value.result)

      }

      qr.decode(image.bitmap)

    })

  } catch (error) {

    console.error("Image read error:", error)
    return null

  }

}

/**
 * Extract UPI Payment Data
 */
export const parseUPI = (qrData) => {

  try {

    const url = new URL(qrData)

    return {
      upiId: url.searchParams.get("pa"),
      merchantName: url.searchParams.get("pn"),
      amount: parseFloat(url.searchParams.get("am")) || 0,
      currency: url.searchParams.get("cu"),
    }

  } catch (error) {

    return null

  }

}

export default {
  generateHash,
  isValidEmail,
  isValidUPI,
  formatCurrency,
  getIPAddress,
  sanitizeInput,
  decodeQR,
  parseUPI,
}