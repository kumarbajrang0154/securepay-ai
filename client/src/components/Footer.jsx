function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-10">
      <div className="container mx-auto px-4 py-4 text-center">
        <p>© {new Date().getFullYear()} SecurePay AI</p>
        <p className="text-sm text-gray-400">
          AI Powered UPI Fraud Detection
        </p>
      </div>
    </footer>
  );
}

export default Footer;