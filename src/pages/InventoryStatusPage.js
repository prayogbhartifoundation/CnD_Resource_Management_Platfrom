import React from "react";
import "../styles/InventoryStatusPage.css";

function InventoryStatusPage() {
  return (
    <div className="inventory-status-page">
      {/* Header */}
      <header className="inventory-header">
        <h1>Inventory Status</h1>
      </header>

      {/* Main Content */}
      <main className="inventory-content">
        <div className="inventory-layout">
          {/* Product List Section */}
          <section className="product-list-container">
            <h3 className="product-header">Products</h3>
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="product-item">
                <b>Product Name </b>
               
              </div>
            ))}
          </section>

          {/* Table Section */}
          <section className="table-section">
            <table className="inventory-table">
              {/* Table Header */}
              <thead>
                <tr>
                  <th>Agency Name</th>
                  <th>Agency Name</th>
                  <th>Agency Name</th>
                  <th>Agency Name</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                <tr>
                  <td>
                    650
                    <br />
                    <small>as of 4-1-25</small>
                  </td>
                  <td>
                    650
                    <br />
                    <small>as of 4-1-25</small>
                  </td>
                  <td>
                    --
                    <br />
                    <small>-</small>
                  </td>
                  <td>
                    650
                    <br />
                    <small>as of 4-1-25</small>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

<container className="container-button">
        {/* Action Button */}
        <button className="query-button">
          Raise requirement query for Selected items
        </button>
    </container>

        {/* Document Section */}
        <section className="document-section">
          <h2>Material Test Reports</h2>
          <div className="document-cards">
            <div className="doc-card">Doc Button card</div>
            <div className="doc-card">Doc Button card</div>
            <div className="doc-card">Doc Button card</div>
          </div>
        </section>
      </main>
      </div>
  );
}

export default InventoryStatusPage;
