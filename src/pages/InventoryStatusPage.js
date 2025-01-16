import React, { useState } from "react";
import "../styles/InventoryStatusPage.css";

function InventoryStatusPage() {

  const [selectedItems, setSelectedItems] = useState(new Set());

  const toggleSelection = (rowIndex, colIndex, unitIndex) => {
    const key = `${rowIndex}-${colIndex}-${unitIndex}`;
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(key)) {
        newSelected.delete(key);
      } else {
        newSelected.add(key);
      }
      return newSelected;
    });
  };

  const handleButtonClick = () => {
    console.log("Selected Items:", Array.from(selectedItems));

    alert( Array.from(selectedItems).toString())
  };

  const handleClearSelection = () => {
    setSelectedItems(new Set());
  };

  return (
    <div className="inventory-status-page">
      {/* Header */}
      <header className="inventory-header">
        <h1>Inventory Status</h1>
      </header>
      {/* Main Content */}
      <main className="inventory-content">
        <div className="inventory-layout">

          {/* Table Section */}
          <section className="table-section">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Products</th>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <th>Agency Name</th>
                  ))}
                </tr>
                <tr>
                  <th></th>

                  {Array.from({ length: 4 }).map((_, index) => (
                    <th>
                      <div className="plants">
                        <span>P1</span>
                        <span>P2</span>
                        <span>P3</span>
                        <span>P4</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            <td>Product Name</td>
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <td key={colIndex}>
                <div className="plants">
                  {Array.from({ length: 4 }).map((_, unitIndex) => {
                    const key = `${rowIndex}-${colIndex}-${unitIndex}`;
                    const isSelected = selectedItems.has(key);
                    return Math.floor(Math.random() * 9) !== 0 ? (
                      <div
                        key={unitIndex}
                        className={`units ${isSelected ? "selected" : ""}`}
                        onClick={() =>
                          toggleSelection(rowIndex, colIndex, unitIndex)
                        }
                      >
                        {Math.floor(Math.random() * 999) + 1}
                        <br />
                        <small>as of 4-1-25</small>
                      </div>
                    ) : (
                      <div key={unitIndex} className="units">--</div>
                    );
                  })}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
            </table>
          </section>
        </div>

        {/* Action Button */}
        <div className="button-container">
          <button onClick={handleButtonClick} className="query-button">
            Raise requirement query for Selected items
          </button>
          <button onClick={handleClearSelection} className="query-button">
            Clear Selection
          </button>
        </div>

        {/* Document Section */}
        <section className="document-section">
          <h2>Material Test Reports</h2>
          <div className="document-cards">
            <div className="doc-card">
              <b>Doc Button Card</b>
            </div>
            
          </div>
        </section>
      </main>
    </div>
  );
}

export default InventoryStatusPage;
