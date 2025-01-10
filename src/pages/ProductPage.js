import React from "react"; 
import "../styles/ProductPage.css";

function ProductPage() {
  return (
    <div className="product-page">
      <main>
        <h2>Product Name</h2>

        <section className="product-details">
          <div className="product-images">
            {/* Placeholder for images */}
            <p>Product Images</p>
          </div>

          <div className="agency-info">
            <h3>Agency Name & Location</h3>
            <p>List of agencies with their locations providing this product</p>
            <button className="action-button">Raise Product Requirement Ticket</button>
            <button className="action-button">Product DSR</button>
          </div>
        </section>

        <section className="material-reports">
          <h3>Material Test Reports for this Product</h3>
          <div className="doc-cards">
            <div className="card">
              <h4>Document 1</h4>
              <p>Details for Document 1</p>
            </div>
            <div className="card">
              <h4>Document 2</h4>
              <p>Details for Document 2</p>
            </div>
            <div className="card">
              <h4>Document 3</h4>
              <p>Details for Document 3</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProductPage;
