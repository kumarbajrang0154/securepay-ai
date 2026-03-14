const API = "http://localhost:5000/api";

export const analyzeQR = async (qrData)=>{

const mobile = localStorage.getItem("userMobile") || "";

const res = await fetch(`${API}/analyze`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
qrData,
mobile
})

});

if(!res.ok){
const errorData = await res.json().catch(() => ({}));
throw new Error(errorData.message || "Analyze failed");
}

return await res.json();

};

export const reportFraud = async (data) => {
  const res = await fetch(`${API}/report-fraud`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Report failed");
  }

  return await res.json();
};

export const getMyReports = async (mobile) => {
  const encodedMobile = encodeURIComponent(mobile || "");
  const res = await fetch(`${API}/my-reports?mobile=${encodedMobile}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch reports");
  }

  return await res.json();
};