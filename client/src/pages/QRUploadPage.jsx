import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";

import { AnalysisContext } from "../context/AnalysisContext";

function QRUploadPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const { setQrData } = useContext(AnalysisContext);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
      const img = new Image();
      img.src = reader.result;

      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setQrData(code.data);
          navigate("/analysis");
        } else {
          alert("No QR code detected in the image.");
        }
      };
    };

    reader.readAsDataURL(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center py-10">

      <h2 className="text-2xl font-bold mb-6">Upload QR Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="mb-6"
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="QR Preview"
          className="w-64 border rounded-lg shadow"
        />
      )}

    </div>
  );
}

export default QRUploadPage;