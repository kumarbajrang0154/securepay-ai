SecurePay AI – Real-Time UPI QR Fraud Detection System
Overview
SecurePay AI is a prototype web application designed to prevent UPI QR code fraud before a payment is completed. The system analyzes QR code payment details and evaluates the probability of fraud using behavioral signals and a risk-scoring engine.

Unlike traditional systems that detect fraud after the transaction, SecurePay AI aims to detect and warn users before they make the payment, helping reduce financial losses caused by fraudulent QR codes.

Problem Statement
UPI payments are widely used due to their speed and convenience. However, QR code scams and fraudulent payment requests are increasing rapidly. Many users, especially senior citizens and new digital payment users, become victims of scams because there is no real-time verification layer before payment.

SecurePay AI solves this problem by providing a real-time fraud detection layer that evaluates the safety of a transaction before redirecting users to their payment apps.

Key Features
Mobile number login with OTP verification (simulated)

QR Code scanning using device camera

Upload QR image for analysis

Extraction of UPI payment details

User verification step before fraud analysis

Risk scoring engine to estimate fraud probability

Color-coded risk indicators:

Green – Safe transaction
Yellow – Suspicious transaction (extra verification)
Red – High fraud probability
Option to report suspicious QR codes

Payment redirection simulation (Google Pay, PhonePe, Paytm)

System Workflow
User logs into the application using a mobile number and OTP verification.

The dashboard provides two options:

Scan QR code
Upload QR image
The system extracts payment details from the QR code.

The user confirms the merchant and payment details.

The fraud detection engine evaluates the transaction risk.

Based on the risk score, the system provides one of three outcomes:

Allow payment
Request additional verification
Block and report the QR code
Risk Detection Logic (Prototype)
The fraud detection engine calculates a risk score based on multiple signals such as:

Payment amount
Unknown merchant
Time of transaction
Reported merchant history
User verification
Example scoring logic:

risk = 0

if amount > 5000 → risk += 30
if merchant is unknown → risk += 30
if late night transaction → risk += 20
if merchant previously reported → risk += 40
Risk classification:

0 – 30 → Low Risk (Green)
30 – 70 → Medium Risk (Yellow)
70+ → High Risk (Red)
Technology Stack
Frontend
React.js
Tailwind CSS
Axios
QR Scanner library
Backend
Node.js
Express.js
MongoDB (optional for prototype)
Project Structure
securepay-ai
│
├── client          # React frontend
│
└── server          # Node.js backend
Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/securepay-ai.git
cd securepay-ai
2. Install frontend dependencies
cd client
npm install
npm run dev
3. Install backend dependencies
cd server
npm install
node server.js
Future Enhancements
Machine learning based fraud prediction model
Real-time merchant verification
Behavioral anomaly detection
QR reputation database
Bank API integration for fraud alerts
Mobile application version
Project Vision
SecurePay AI aims to introduce a preventive security layer for digital payments, helping users verify the authenticity of QR code transactions before completing the payment.

By combining QR validation, behavioral analysis, and risk scoring, this system can significantly reduce the chances of QR-based UPI fraud.

License
This project is developed as a prototype for educational and research purposes.