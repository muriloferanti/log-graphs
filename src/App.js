import React, { useState } from "react";
import Papa from "papaparse";
import FileUpload from "./FileUpload";
import ColumnMenu from "./ColumnMenu";
import XAxisSelection from "./XAxisSelection";
import Chart from "./Chart";
import CsvAnalyzer from "./CsvAnalyzer";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [headerRow, setHeaderRow] = useState(1);
  const [fileContent, setFileContent] = useState(null);
  const [xAxisColumn, setXAxisColumn] = useState("");
  const [csvProcessed, setCsvProcessed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFileUpload = (content) => {
    setFileContent(content);
  };

  const handleHeaderRowChange = (value) => {
    setHeaderRow(value);
  };

  const handleXAxisColumnChange = (value) => {
    setXAxisColumn(value);
  };

  const processCSV = () => {
    if (fileContent) {
      Papa.parse(fileContent, {
        header: false, 
        skipEmptyLines: true,
        complete: (results) => {
          const allRows = results.data;

          if (headerRow < 1 || headerRow > allRows.length) {
            console.error("Linha do cabeçalho inválida");
            return;
          }

          const header = allRows[headerRow - 1];
          const dataRows = allRows.slice(headerRow);

          const stampIndex = header.indexOf("STAMP");
          const validColumns = header.filter(
            (col) =>
              col === "STAMP" ||
              dataRows.some(
                (row) =>
                  row[header.indexOf(col)] !== "" &&
                  row[header.indexOf(col)] !== null
              )
          );

          const hasStamp = stampIndex !== -1;
          const uniqueColumns = Array.from(new Set(validColumns));
          let groupedData = dataRows.map((row) => {
            const dataRow = {};
            header.forEach((col, index) => {
              dataRow[col] = row[index];
            });
            return dataRow;
          });

          if (hasStamp) {
            groupedData = {};
            dataRows.forEach((row) => {
              const stampValue = row[stampIndex];
              if (!groupedData[stampValue]) {
                groupedData[stampValue] = [];
              }
              groupedData[stampValue].push(row);
            });

            groupedData = Object.entries(groupedData).map(
              ([stampValue, rows]) => {
                const averagedRow = { STAMP: stampValue };

                uniqueColumns.forEach((col) => {
                  if (col !== "STAMP") {
                    const colIndex = header.indexOf(col);
                    const sum = rows.reduce(
                      (acc, row) => acc + (parseFloat(row[colIndex]) || 0),
                      0
                    );
                    averagedRow[col] = sum / rows.length;
                  }
                });

                return averagedRow;
              }
            );
          }

          const newColumns = uniqueColumns.filter((col) => col !== "STAMP");

          setColumns(hasStamp ? ["STAMP", ...newColumns] : newColumns);
          setData(groupedData);

          if (hasStamp) {
            setXAxisColumn("STAMP");
          } else {
            setXAxisColumn(newColumns[0] || "");
          }

          setIsMenuOpen(true);
          setSelectedColumns([]);
          setCsvProcessed(true);
        },
      });
    }
  };

  const getYAxisDomain = () => {
    if (selectedColumns.length === 0) return [0, 1];

    const values = selectedColumns.flatMap((col) =>
      data.map((row) => parseFloat(row[col])).filter((val) => !isNaN(val))
    );

    if (values.length === 0) return [0, 1];

    const min = Math.min(...values);
    const max = Math.max(...values);

    return [min - (max - min) * 0.1, max + (max - min) * 0.1];
  };

  return (
    <div className="App">
      <h1 className="title">Logger Graph</h1>

      <FileUpload
        onFileUpload={handleFileUpload}
        headerRow={headerRow}
        onHeaderRowChange={handleHeaderRowChange}
        onProcessCSV={processCSV}
      />

      <ColumnMenu
        columns={columns}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        isOpen={isMenuOpen}
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      <XAxisSelection
        columns={columns}
        xAxisColumn={xAxisColumn}
        onXAxisColumnChange={handleXAxisColumnChange}
        isVisible={csvProcessed}
      />

      <Chart
        data={data}
        xAxisColumn={xAxisColumn}
        yAxisDomain={getYAxisDomain()}
        selectedColumns={selectedColumns}
      />

      {/* Botão para Analisar CSV com ChatGPT */}
      <CsvAnalyzer data={data} />
    </div>
  );
}

export default App;
