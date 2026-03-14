const API = "http://localhost:3000/api";

export const analyzeQR = async (qrData)=>{

const res = await fetch(`${API}/analyze`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
qrData
})

});

if(!res.ok){

throw new Error("Analyze failed");

}

return await res.json();

};