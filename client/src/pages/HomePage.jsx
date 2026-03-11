import { useNavigate } from "react-router-dom"

export default function HomePage() {

  const navigate = useNavigate()

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>

      <h1>SecurePay AI</h1>
      <h2>Choose QR Method</h2>

      <div style={{ marginTop: "40px" }}>

        <button
          onClick={() => navigate("/scan")}
          style={{
            padding: "15px 40px",
            margin: "10px",
            fontSize: "18px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Scan QR
        </button>

        <button
          onClick={() => navigate("/upload")}
          style={{
            padding: "15px 40px",
            margin: "10px",
            fontSize: "18px",
            backgroundColor: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Upload QR
        </button>

      </div>

    </div>
  )
}