import React from "react";
import "../styles/ProductPage.css";

function ProductPage() {
  return (
    <div className="product-page">
      {/* Header Section */}
      <header>
        <h2>Product Name</h2>
      </header>

      {/* Main Content */}
      <main>
        {/* Top Section: Product Images and Agency Info */}
        <section className="product-details">
          <div className="product-images">
            <p>Product Images</p>
          </div>
          <div className="agency-info">
            <h3>Agency Name & Location</h3>
            <p>
              List of Agencies with their Locations which provides this Product
            </p>
          </div>
        </section>

        {/* Middle Buttons Section */}
        <section className="middle-buttons">
          <button>Raise Product Requirement Ticket</button>
          <button>Product DSR</button>
          <button>Product Details</button>
          <button>Product Processing Steps</button>
          <button>Department-Wise Requirements</button>
        </section>

        {/* Bottom Section: Material Test Reports */}
        <section className="material-reports">
          <h3>Material Test Reports for this Product Plant-wise</h3>
          <div className="doc-cards">
            <div className="card">Doc Button card</div>
            <div className="card">Doc Button card</div>
            <div className="card">Doc Button card</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProductPage;
