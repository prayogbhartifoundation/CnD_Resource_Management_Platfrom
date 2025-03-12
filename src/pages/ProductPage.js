import React, { useEffect, useState } from "react";
import "../styles/ProductPage.css";
import axios from "axios";

function ProductPage() {
  const [prodList, setProdList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [agency, setAgency] = useState([]);
  const [selectedProd, setSelectedProd] = useState(-1);
  const [prodName, setProdName] = useState("");
  const [filteredProdList, setFilteredProdList] = useState([]);

  useEffect(() => {
    const getProds = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/get_products");
        console.log(res.data.status?.toLowerCase());
        if (res.data.status?.toLowerCase() === "success") {
          setProdList(res.data.data);
          setFilteredProdList(res.data.data);
        } else {
          alert("Something went wrong, check logs!");
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getAgencies = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/getAgencies");
        console.log(res);
        if (res.data.Status?.toLowerCase() === "success") {
          setAgencyList(res.data.data);
        } else {
          alert("Something went wrong, check logs!");
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getPlants = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/getPlants");
        console.log(res);
        if (res.data.Status?.toLowerCase() === "success") {
          setPlantList(res.data.data);
        } else {
          alert("Something went wrong, check logs!");
        }
      } catch (err) {
        console.log(err);
      }
    };

    getProds();
    getAgencies();
    getPlants();
  }, []);

  // Update agency list based on the selected product
  useEffect(() => {
    if (selectedProd !== -1) {
      const selectedProduct = filteredProdList[selectedProd];
      if (selectedProduct) {
        const agencies = Array.from(
          new Set(
            selectedProduct.plantWise
              .map((pw) =>
                agencyList.find((a) =>
                  a.plants.some((ap) => ap.plantId === pw.plantId)
                )
              )
              .filter(Boolean) // Removes undefined values
          )
        );
        setAgency(agencies);
      }
    }
  }, [selectedProd, filteredProdList, agencyList]);

  return (
    <div className="product-page">
      {/* Header Section */}
      <header>
        <h1>Product Name</h1>
        <div className="inp-box">
          <label htmlFor="">🔍</label>
          <input
            type="text"
            value={prodName}
            onChange={(e) => {
              setProdName(e.target.value);
              setFilteredProdList(
                prodList.filter((p) =>
                  p.prodName.toLowerCase().includes(e.target.value.toLowerCase())
                )
              );
            }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Product List Section */}
        <div className={selectedProd === -1 ? "ProdList" : "selectedProdList"}>
          {filteredProdList.map((p, index) => (
            <div
              key={index}
              className="prod"
              onClick={() =>
                setSelectedProd(selectedProd === index ? -1 : index)
              }

              title={
                (p.plantWise?.[0]?.details).toString()
              }

            >
              <h2>{p.prodName}</h2>
            </div>
          ))}
        </div>

        {/* Selected Product Details */}
        {selectedProd !== -1 && filteredProdList[selectedProd] && (
          <div className="selectedProd">

            <section className="product-details">
              <div className="product-images">
                <p>Product Images</p>
              </div>
              <div className="agency-info">
              <span className="cross"
              
              onClick={() => setSelectedProd(-1)}

              >❌</span>
                <h2>{filteredProdList[selectedProd].prodName}</h2>
                <h4>{filteredProdList[selectedProd].plantWise?.[0]?.details}</h4>
                <div className="product-card-agency-box">
                  <h3>Plant Operators</h3>
                  {agency.map((a, idx) => (
                    <p key={idx} className="row">
                      <span>{a.agency}</span>:
                      {a.plants
                        .filter((ap) =>
                          filteredProdList[selectedProd].plantWise.some(
                            (pl) => pl.plantId === ap.plantId
                          )
                        )
                        .map((pln, pIdx) => {
                          const plant = plantList.find(
                            (pl) => pl.plantId === pln.plantId
                          );
                          return (
                            <span key={pIdx}>
                              {" "}
                              {plant?.location}{" "}
                              <i>
                                [
                                {
                                  filteredProdList[selectedProd].plantWise.find(
                                    (plw) => plw.plantId === pln.plantId
                                  )?.qnt
                                }
                                ]
                              </i>
                            </span>
                          );
                        })}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductPage;
