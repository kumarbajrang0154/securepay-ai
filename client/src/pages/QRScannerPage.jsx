import React, { useEffect, useRef } from "react"

export default function QRScannerPage() {

  const videoRef = useRef(null)

  useEffect(() => {

    const startCamera = async () => {

      try {

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

      } catch (err) {
        console.error("Camera error:", err)
        alert("Camera access denied")
      }

    }

    startCamera()

  }, [])

  return (

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >

      <h2>Scan QR Code</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "400px",
          borderRadius: "12px",
          border: "3px solid #333"
        }}
      />

    </div>

  )

}