import React from "react";

const FileUpload = ({
  onFileUpload,
  headerRow,
  onHeaderRowChange,
  onProcessCSV,
}) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = ({ target }) => {
      onFileUpload(target.result);
    };

    reader.readAsText(file);
  };

  return (
    <div className="upload-section">
      <div className="header-row-input">
        <label>Selecione o arquivo CSV:</label>
        <input
          className="file-input"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />

        <label>Linha do cabeçalho:</label>
        <input
          type="number"
          value={headerRow}
          onChange={(e) => onHeaderRowChange(Number(e.target.value))}
          min="1"
        />

        <button className="process-btn" onClick={onProcessCSV}>
          Processar CSV
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
