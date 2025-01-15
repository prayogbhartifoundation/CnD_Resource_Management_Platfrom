import React from "react";
import "../styles/InventoryStatusPage.css";

function InventoryStatusPage() {
  return (
    <div className="inventory-status-page">
      <header className="inventory-header">
        <h1>Inventory Status</h1>
      </header>

      <main className="inventory-content">
        {/* Table Section */}
        <section className="table-section">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Agency Name</th>
                <th>Agency Name</th>
                <th>Agency Name</th>
                <th>Agency Name</th>
              </tr>
            </thead>
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
                <td>--<br /><small>-</small></td>
                <td>
                  650
                  <br />
                  <small>as of 4-1-25</small>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Product List */}
        <aside className="product-list">
          {Array.from({ length: 8 }).map((_, index) => (
            <button key={index} className="product-button">Product Name</button>
          ))}
        </aside>

        {/* Action Button */}
        <button className="query-button">
          Raise requirement query for Selected items
        </button>

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
