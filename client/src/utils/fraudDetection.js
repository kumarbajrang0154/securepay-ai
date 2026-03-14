export function analyzeQR(qrData){

let score = 0

const text = qrData.toLowerCase()

// suspicious words
const suspicious = [
"test",
"fraud",
"scam",
"reward",
"gift",
"free",
"offer"
]

suspicious.forEach(word=>{

if(text.includes(word)){

score += 30

}

})

// non UPI format
if(!text.includes("upi://pay")){

score += 50

}

// suspicious amount
if(text.includes("am=0")){

score += 20

}

if(score > 100){

score = 100

}

return score

}