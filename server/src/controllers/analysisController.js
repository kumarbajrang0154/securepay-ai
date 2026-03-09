import { decodeQR, parseUPI } from "../utils/helpers.js"

export const analyzeQR = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "QR image not uploaded"
      })
    }

    const imagePath = req.file.path

    const qrData = await decodeQR(imagePath)

    const paymentData = parseUPI(qrData)

    if (!paymentData) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR code"
      })
    }

    const { upiId, merchantName, amount } = paymentData

    let riskScore = 0

    if (amount > 5000) riskScore += 30
    if (!merchantName) riskScore += 20

    let riskLevel = "Green"
    let transactionApproved = true

    if (riskScore > 60) {
      riskLevel = "Red"
      transactionApproved = false
    } else if (riskScore > 30) {
      riskLevel = "Yellow"
    }

    res.json({
      success: true,
      upiId,
      merchantName,
      amount,
      riskScore,
      riskLevel,
      transactionApproved
    })

  } catch (error) {

    console.error("Analysis Error:", error)

    res.status(500).json({
      success: false,
      message: "Error analyzing transaction"
    })

  }
}