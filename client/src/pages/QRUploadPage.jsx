import { useState } from "react";
import { useNavigate } from "react-router-dom";

function QRUploadPage() {

  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleUpload = (e) => {

    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }

  };

  return (

    <div className="flex flex-col items-center p-8">

      <h1 className="text-2xl font-bold mb-6">
        Upload QR Image
      </h1>

      <input type="file" onChange={handleUpload} />

      {image && (

        <>
          <img
            src={image}
            alt="preview"
            className="mt-6 w-64 rounded"
          />

          <button
            onClick={() => navigate("/analysis")}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
          >
            Continue
          </button>

        </>
      )}

    </div>

  );
}

export default QRUploadPage;