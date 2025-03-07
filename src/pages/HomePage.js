import React, { useEffect, useState } from "react";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBannerBox from "./HomePageComponents/TopBannerBox";
import ActionBtnRow from "./HomePageComponents/ActionBtnRow";
import InfoBox from "./HomePageComponents/InfoBox";
import TargetConsolidatedChartBox from "./HomePageComponents/TargetConsolidatedChartBox";

function HomePage({setPropData}) {
  const [prodList, setProdList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(-1);
  

  useEffect(() => {
    const getProds = () => {
      axios
        .get("http://localhost:8081/api/get_products")
        .then((res) => {
          console.log(res);
          if (res.data.status === "success") {
            setProdList(res.data.data);
            // setFilteredProdList(res.data.data);
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

  const navigate = useNavigate();
  return (
    <div className="home-page">
      {/* <section>Dashboard</section> */}
      <section className="homePage-overview-details">
        <TopBannerBox plants={plantList} plantOperators={agencyList} setPropData={setPropData}/>
        <InfoBox/>
      </section>
      <section className="homePage-overview-details">
        <ActionBtnRow/>
      </section>
      <section className="homePage-overview-details">
        <TargetConsolidatedChartBox plantOperators={agencyList}/>
      </section>
      <section className="homePage-overview-details">
      <h3>Plant Operators Overview</h3>
        <div className="homePage-listBox">
          <div className="leftPanel">
            <div>
              <h2>Plant Operator</h2>
              <h2>Total Plants</h2>
              <h2>Total Products</h2>
              <h2>Total Offtake (MT)</h2>
              <button style={{ opacity: 0 }}>⬇️</button>
            </div>

            {agencyList.map((agency, index) => {
              return (
                <>
                  <div key={agency.agency_id}>
                    <h2>{agency.agency}</h2>
                    <h2>{agency?.plants?.length}</h2>
                    <h2>
                      {agency.plants.reduce((total, ap) => {
                        const prodCount = prodList.filter((prod) =>
                          prod.plantWise.some((pw) => pw.plantId === ap.plantId)
                        ).length;
                        return total + prodCount;
                      }, 0)}
                    </h2>
                    <h2>--</h2>
                    <button
                      onClick={() => {
                        setSelectedAgency(
                          selectedAgency === index ? -1 : index
                        );
                      }}
                    >
                      ⬇️
                    </button>
                  </div>
                  {selectedAgency === index && (
                    <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', fontWeight:'bold'}}>
                      {agencyList[index].plants.map((ap) => {
                        const plant = plantList.find((p) => p.plantId === ap.plantId);
                        return(
                          <div style={{display:'inline-block'}}>{plant?.location}</div>
                        )
                      })}
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>

        {/* <div className="extended-details">
          <div className="agency-branding" onClick={() => navigate("/product")}>
            <div className="logo">
              <span>📦</span>
            </div>
            <h2>Products List </h2>
          </div>

          <div className="agency-branding" onClick={() => navigate("/department")}>
            <div className="logo">
              <span>🏛️</span>
            </div>
            <h2>Department List</h2>
          </div>

          <div className="agency-branding" onClick={() => navigate('/offtake')}>
            <div className="logo">
              <span>🚛</span>
            </div>
            <h2>Offtake Status</h2>
          </div>
          <div
            className="agency-branding"
            onClick={() => navigate("/inventoryBeta")}
          >
            <div className="logo">
              <span>🏢</span>
            </div>
            <h2>Total Inventory</h2>
          </div>
        </div> */}

        {/* <div className="plant-agency">
          <h2>Plant Overview</h2>
          <ul>
            <li>Waste Received</li>
            <li>Type of Processed Material</li>
            <li>Plant Capacity</li>
          </ul>
        </div> */}
      </section>

      {/* <section className="action-btns">
        <button type="button" onClick={() => navigate('/offtake')} className="status-button">Offtake Status</button>
        <button type="button" onClick={() => navigate('/inventoryBeta')} className="status-button">Inventory Status</button>
      </section>

      <section className="agency-cards">
        <div className="card">
          <h3>Agency Page 1</h3>
          <p>Details of Agency 1</p>
        </div>
        <div className="card">
          <h3>Agency Page 2</h3>
          <p>Details of Agency 2</p>
        </div>
        <div className="card">
          <h3>Agency Page 3</h3>
          <p>Details of Agency 3</p>
        </div>
      </section> */}
    </div>
  );
}

export default HomePage;
