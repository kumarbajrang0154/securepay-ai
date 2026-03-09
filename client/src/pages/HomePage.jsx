import Navbar from "../components/Navbar";
import { QrReader } from "react-qr-reader";

function HomePage() {

  return (

    <div>

      <Navbar />

      <div className="flex flex-col items-center mt-10">

        <div className="w-80">

          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={(result) => {

              if (result) {

                console.log(result?.text);

              }

            }}
            style={{ width: "100%" }}
          />

        </div>

        <button
          onClick={() => window.location.href="/upload"}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
        >
          Upload QR Image
        </button>

      </div>

    </div>

  );
}

export default HomePage;