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

const data = await analyzeQR(qrData);

// store fraud score
localStorage.setItem("fraudScore", data.fraudScore || 0);

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
localStorage.setItem("sameUserWarning", data.sameUserWarning ? "true" : "false");

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