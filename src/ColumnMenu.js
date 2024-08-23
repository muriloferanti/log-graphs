import React, { useEffect, useRef } from "react";

const ColumnMenu = ({
  columns,
  selectedColumns,
  setSelectedColumns,
  isOpen,
  toggleMenu,
}) => {
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      toggleMenu();
    }
  };

  const handleEscKey = (event) => {
    if (event.key === "Escape") {
      toggleMenu();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscKey);
      };
    }
  }, [isOpen]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedColumns((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((col) => col !== value)
    );
  };

  return (
    <div className="menu-container" ref={menuRef}>
      <button
        className={`menu-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <div className="icon-bar"></div>
        <div className="icon-bar"></div>
        <div className="icon-bar"></div>
      </button>
      <div className={`columns-menu ${isOpen ? "open" : ""}`}>
        <h2>Selecione as colunas para o gráfico</h2>
        <div className="checkbox-group">
          {columns.map((column) => (
            <label key={column} className="checkbox-label">
              <input
                type="checkbox"
                value={column}
                checked={selectedColumns.includes(column)}
                onChange={handleCheckboxChange}
              />
              {column}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColumnMenu;
