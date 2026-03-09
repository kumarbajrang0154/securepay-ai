import express from "express"
import multer from "multer"
import { analyzeQR } from "../controllers/analysisController.js"

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })

router.post("/analysis", upload.single("qrImage"), analyzeQR)

export default router