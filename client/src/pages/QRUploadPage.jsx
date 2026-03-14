import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Navbar from "../components/Navbar"
import NeuralNetworkBackground from "../components/NeuralNetworkBackground"

import { analyzeQR } from "../utils/fraudDetection"
import { parseUPI } from "../utils/upiParser"

import jsQR from "jsqr"

export default function QRUploadPage() {

  const navigate = useNavigate()

  const [preview,setPreview] = useState(null)
  const [qrData,setQrData] = useState("")

  const handleImage = (e)=>{

    const file = e.target.files[0]
    if(!file) return

    const reader = new FileReader()

    reader.onload = ()=>{

      const imgData = reader.result
      setPreview(imgData)

      const img = new Image()

      img.onload = ()=>{

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img,0,0)

        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        )

        const code = jsQR(
          imageData.data,
          canvas.width,
          canvas.height
        )

        if(code){

          // ONLY SAVE DATA
          setQrData(code.data)

        }else{

          alert("QR not detected")

        }

      }

      img.src = imgData

    }

    reader.readAsDataURL(file)

  }

  const handleAnalyze = ()=>{

    if(!qrData){
      alert("Upload QR or paste data")
      return
    }

    const parsed = parseUPI(qrData)

    const fraudScore = analyzeQR(qrData)

    localStorage.setItem("scannedQR",qrData)
    localStorage.setItem("fraudScore",fraudScore)
    localStorage.setItem("parsedUPI",JSON.stringify(parsed))

    navigate("/analyzing")

  }

  return (

    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground/>
      <Navbar/>

      <div className="relative z-10 max-w-3xl mx-auto mt-12 px-6">

        <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3 text-sm mb-6 text-blue-400 text-center">
          🤖 AI Image Scanner Ready
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg text-center">

          <h1 className="text-2xl font-bold mb-6">
            Upload QR Code Image
          </h1>

          <label className="block border-2 border-dashed border-cyan-400 rounded-xl p-12 cursor-pointer hover:bg-white/5 transition">

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />

            <p className="text-gray-400 text-sm">
              Drag & drop QR image or click to upload
            </p>

          </label>

          {preview && (

            <div className="mt-6">

              <img
                src={preview}
                alt="preview"
                className="mx-auto rounded-lg max-h-64 border border-white/10"
              />

            </div>

          )}

          <div className="mt-6">

            <p className="text-sm text-gray-400 mb-2">
              Paste QR data (optional)
            </p>

            <input
              value={qrData}
              onChange={(e)=>setQrData(e.target.value)}
              placeholder="upi://pay?... "
              className="w-full p-2 rounded bg-black/40 border border-white/10"
            />

          </div>

          <button
            onClick={handleAnalyze}
            className="mt-6 w-full py-3 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition"
          >
            Analyze QR with AI
          </button>

        </div>

      </div>

    </div>

  )

}