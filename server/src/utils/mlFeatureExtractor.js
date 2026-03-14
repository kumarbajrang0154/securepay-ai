export default function extractFeatures(parsed){

const suspiciousWords = [
"free",
"gift",
"offer",
"reward",
"test"
]

const merchant = parsed.merchant?.toLowerCase() || ""

let suspicious = 0

suspiciousWords.forEach(word=>{
if(merchant.includes(word)){
suspicious = 1
}
})

return {

amount: Number(parsed.amount) || 0,
suspicious_word: suspicious,
valid_upi: parsed.upiId ? 1 : 0

}

}