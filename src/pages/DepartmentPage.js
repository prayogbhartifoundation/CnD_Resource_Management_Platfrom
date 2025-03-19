import React, { useEffect, useState } from "react";
import "../styles/ProductPage.css";
import axios from "axios";

const departmentList = [
  "MCD",
  "DDA",
  "DSIIDC",
  "Irrigation & Flood Control (I&FC)",
  "New Delhi Municipal Council (NDMC)",
  "PWD",
  "CPWD",
  "NBCC",
  "DMRC",
  "Railway Board",
  "NCRTC",
  "DJB",
  "Delhi Tourism & Transport Development Corporation (DTTDC)",
  "Delhi Urban Shelter Improvement Board (DUSIB)",
  "Delhi Cantonment Board",
  "Delhi Transco Ltd, BYPL, BRPL, Tata Power Delhi Distribution Ltd & Other Government Dept of NCT of Delhi",
  "National Highway Authority of India (NHAI)",

  "Postal Services",
  "APMC (Agricultural Produce Market Committee)",
  "Forest & Wildlife",
  "Private",
];

function DepartmentPage() {
  const [prodList, setProdList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);

  const [prodName, setProdName] = useState("");
  const [filteredProdList, setFilteredProdList] = useState([]);
  const [filteredDepList, setFilteredDepList] = useState(departmentList);

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
        <h2>Departments</h2>

        <div className="inp-box">
          <label htmlFor="">🔍</label>
          <input
            type="text"
            value={prodName}
            onChange={(e) => {
              setProdName(e.target.value);
              // setFilteredProdList(
              //   prodList.filter((p) =>
              //     p.prodName
              //       .toLowerCase()
              //       .includes(e.target.value.toLowerCase())
              //   )
              // );

              setFilteredDepList(
                departmentList.filter((d) =>
                  d.toLowerCase().includes(e.target.value.toLowerCase())
                )
              );
            }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Top Section: Product Images and Agency Info */}
        {filteredDepList.map((d) => {
          return (
            <section className="product-details">
              <div className="product-images">
                <h2>{d}</h2>
              </div>
              <div className="agency-info">
                <div className="product-card-agency-box">
                  <h3>Plant Operators Table with their Offtake for {d}</h3>
                  <table className="offtake-table">
                    <thead>
                    <tr>
                      <th>Plant Operator</th>
                      <th>Annual Offtake Taget (MT)</th>
                      <th>Offtake Status <span style={{color: 'red'}}>(01.04.24 to 31.01.25)</span>(MT)</th>
                      <th>Offtake Status <span style={{color: 'red'}}>(01.02.25 to 15.02.25)</span>(15 Days)(MT)</th>
                      <th>Offtake Status <span style={{color: 'red'}}>(01.04.24 to 15.02.25)</span>(MT)</th>
                      <th>% achieved</th>
                    </tr>
                    </thead>

                    <tbody>
                      {agencyList.map((a)=>{
                        return(
                          <tr>
                            <td>{a.agency}</td>
                            <td>--</td>
                            <td>--</td>
                            <td>--</td>
                            <td>--</td>
                            <td>--</td>
                          </tr>
                        )
                      })}
                    </tbody>

                  </table>
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

export default DepartmentPage;
