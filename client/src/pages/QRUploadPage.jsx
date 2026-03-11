import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function QRUploadPage() {

  const [file, setFile] = useState(null)
  const navigate = useNavigate()

  const handleUpload = async () => {

    if (!file) {
      alert("Please upload a QR image")
      return
    }

    const formData = new FormData()
    formData.append("qrImage", file)

    try {

      const response = await fetch("http://localhost:5000/api/analysis", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      navigate("/result", { state: data })

    } catch (err) {

      console.error(err)
      alert("Error analyzing QR")

    }

  }

  return (

    <div style={{ textAlign: "center", marginTop: "100px" }}>

      <h2>Upload QR Code</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Analyze QR
      </button>

    </div>

  )

}