import React, { useEffect, useState } from "react";
import "../styles/ProductPage.css";
import axios from "axios";

function ProductPage() {
  const [prodList, setProdList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);

  const [prodName, setProdName] = useState("");
  const [filteredProdList, setFilteredProdList] = useState([]);

  useEffect(() => {
    const getProds = () => {
      axios
        .get("http://localhost:8081/api/get_products")
        .then((res) => {
          console.log(res);
          if (res.data.status === "success") {
            setProdList(res.data.data);
            setFilteredProdList(res.data.data);
          } else {
            alert("something wrong,1 check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };
    const getAgencies = () => {
      axios
        .get("http://localhost:8081/api/getAgencies")
        .then((res) => {
          console.log(res);
          if (res.data.Status === "Success") {
            setAgencyList(res.data.data);
          } else {
            alert("something wrong,2 check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };
    const getPlants = () => {
      axios
        .get("http://localhost:8081/api/getPlants")
        .then((res) => {
          console.log(res);
          if (res.data.Status === "Success") {
            setPlantList(res.data.data);
          } else {
            alert("something wrong,3 check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };

    getProds();
    getAgencies();
    getPlants();
  }, []);

  return (
    <div className="product-page">
      {/* Header Section */}
      <header>
        <h2>Product Name</h2>

        <div className="inp-box">
          <label htmlFor="">🔍</label>
          <input type="text" 
          value={prodName}
          onChange={(e) => {
            setProdName(e.target.value)
            setFilteredProdList(prodList.filter(p => p.prodName.toLowerCase().includes(e.target.value.toLowerCase())))
          }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Top Section: Product Images and Agency Info */}
        {filteredProdList &&
          filteredProdList.map((p) => {
            const agency = Array.from(
              new Set(
                p.plantWise
                  .map((pw) =>
                    agencyList.find((a) =>
                      a.plants.some((ap) => ap.plantId === pw.plantId)
                    )
                  )
                  .filter(Boolean) // Removes undefined values
              )
            );

            console.log(agency);

            return (
              <section className="product-details">
                <div className="product-images">
                  <p>Product Images</p>
                </div>
                <div className="agency-info">
                  <h2>{p.prodName}</h2>
                    <h4>{p.plantWise[0].details}</h4>
                  <div className="product-card-agency-box">
                  <h3>Plant Operators</h3>
                    {agency.map((a) => {
                      return (
                        <p className="row">
                          <span>{a.agency}</span>:
                          {a.plants
                            .filter((ap) =>
                              p.plantWise.some(
                                (pl) => pl.plantId === ap.plantId
                              )
                            )
                            .map((pln) => {
                              const plant = plantList.find((pl) => pl.plantId === pln.plantId)
                              return(
                              <span> {plant?.location} 
                                <i>[
                                {p.plantWise.find(
                                  (plw) => plw.plantId === pln.plantId).qnt
                                }]
                                </i>
                              </span>
                            )})}
                        </p>
                      );
                    })}
                  </div>

                 
                </div>
              </section>
            );
          })}
      </main>
    </div>
  );
}

export default ProductPage;
