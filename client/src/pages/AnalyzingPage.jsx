import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeQR } from "../services/apiService";

export default function AnalyzingPage(){

const navigate = useNavigate();

useEffect(()=>{

const qrData = localStorage.getItem("scannedQR");

if(!qrData){
navigate("/dashboard");
return;
}

async function analyze(){

try{

const mobile = localStorage.getItem("userMobile") || "";
if (!mobile) {
  alert("Please login first");
  navigate("/login");
  return;
}

const data = await analyzeQR(qrData, mobile);

// store fraud score
localStorage.setItem("fraudScore", data.fraudScore || 0);
localStorage.setItem("riskLevel", data.riskLevel || "SAFE");

// store parsed UPI data
localStorage.setItem(
"parsedUPI",
JSON.stringify({
merchant:data.merchant || "Unknown",
upiId:data.upiId || "",
amount:data.amount || "0"
})
);

// store community data
localStorage.setItem("communityReports", data.communityReports || 0);
localStorage.setItem("previouslyReported", data.previouslyReported ? "true" : "false");
localStorage.setItem("isBlacklisted", data.isBlacklisted ? "true" : "false");

// store warnings and behavior stats
localStorage.setItem("warnings", JSON.stringify(data.warnings || []));
localStorage.setItem("behaviorStats", JSON.stringify(data.behaviorStats || {}));

navigate("/result");

}catch(err){

console.error("Analyze error:", err);

// show real message
alert("Error analyzing QR. Check backend or console.");

navigate("/dashboard");

}

}

analyze();

},[]);

return(

<div className="flex items-center justify-center h-screen text-white">

<h2>Analyzing QR with AI...</h2>

</div>

);

}