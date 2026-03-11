import { decodeQR, parseUPI } from "../utils/helpers.js"

export const analyzeQR = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        error: "No QR image uploaded"
      })
    }

    const imagePath = req.file.path

    // Decode QR
    const qrData = await decodeQR(imagePath)

    if (!qrData) {
      return res.json({
        upiId: null,
        merchantName: null,
        amount: 0,
        riskLevel: "Unknown",
        transactionApproved: false
      })
    }

    // Extract UPI data
    const paymentData = parseUPI(qrData)

    if (!paymentData) {
      return res.json({
        upiId: null,
        merchantName: null,
        amount: 0,
        riskLevel: "Unknown",
        transactionApproved: false
      })
    }

    const { upiId, merchantName, amount } = paymentData

    // Fraud risk logic
    let riskScore = 0

    if (!upiId) riskScore += 50
    if (!merchantName) riskScore += 20
    if (amount > 5000) riskScore += 30

    let riskLevel = "Green"
    let transactionApproved = true

    if (riskScore >= 60) {
      riskLevel = "Red"
      transactionApproved = false
    } else if (riskScore >= 30) {
      riskLevel = "Yellow"
    }

    return res.json({
      upiId,
      merchantName,
      amount,
      riskLevel,
      transactionApproved
    })

  } catch (error) {

    console.error("Analysis error:", error)

    res.status(500).json({
      error: "Error analyzing QR"
    })

  }

}