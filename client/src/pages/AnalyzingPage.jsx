import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

const res = await fetch(
"http://localhost:5000/api/analyze",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({qrData})
}
);

if(!res.ok){
throw new Error("API request failed");
}

const data = await res.json();

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