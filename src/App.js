import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // Для предварительного просмотра изображения
  const [colorType, setColorType] = useState("");
  const [recommendedColors, setRecommendedColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setImagePreviewUrl(URL.createObjectURL(selectedFile)); // Устанавливаем URL для предварительного просмотра
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://color-type-recogmition-flask.onrender.com/detect_color_type",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setColorType(response.data.color_type);
      setRecommendedColors(response.data.recommended_colors);
    } catch (error) {
      alert("Ошибка при обработке изображения.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Определение цветотипа</h1>

      <form onSubmit={handleSubmit}>
        <div className="upload-section">
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button type="submit" disabled={!file || loading}>
            {loading ? "Отправка..." : "Отправить"}
          </button>
        </div>
      </form>

      {colorType && (
        <div id="resultSection" className="result-section">
          <div className="image-preview">
            {imagePreviewUrl && <img src={imagePreviewUrl} alt="Предварительный просмотр" />}
          </div>
          <div className="result-info">
            <h2>
              Ваш цветотип: <span id="colorType">{colorType}</span>
            </h2>
            <h3>Рекомендованные цвета:</h3>
            <div id="colorPalette" className="color-palette">
              {recommendedColors.map((color, index) => (
                <div key={index} className="color-box">
                  <div className="color-swatch" style={{ backgroundColor: color.hex }}></div>
                  <p className="color-name">{color.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
