import { useLocation } from "react-router-dom"

export default function RiskResultPage() {

  const { state } = useLocation()

  if (!state) {
    return <h2 style={{textAlign:"center"}}>No analysis data</h2>
  }

  const riskColor =
    state.riskLevel === "Green"
      ? "#22c55e"
      : state.riskLevel === "Yellow"
      ? "#facc15"
      : "#ef4444"

  return (

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f3f4f6"
      }}
    >

      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          width: "400px",
          textAlign: "center",
          boxShadow: "0px 5px 20px rgba(0,0,0,0.15)"
        }}
      >

        <h2>Transaction Analysis Result</h2>

        <p><b>UPI ID:</b> {state.upiId || "Not detected"}</p>

        <p><b>Merchant:</b> {state.merchantName || "Unknown"}</p>

        <p><b>Amount:</b> ₹{state.amount || "0"}</p>

        <p>
          <b>Risk Level:</b>
          <span
            style={{
              color: riskColor,
              fontWeight: "bold",
              marginLeft: "5px"
            }}
          >
            {state.riskLevel || "Unknown"}
          </span>
        </p>

        <h3
          style={{
            marginTop: "20px",
            color: state.transactionApproved ? "green" : "red"
          }}
        >
          Transaction Approved:
          {state.transactionApproved ? " YES" : " NO"}
        </h3>

      </div>

    </div>

  )

}