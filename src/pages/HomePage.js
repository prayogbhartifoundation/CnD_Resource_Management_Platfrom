import React, { useEffect, useState } from "react";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBannerBox from "./HomePageComponents/TopBannerBox";
import ActionBtnRow from "./HomePageComponents/ActionBtnRow";
import InfoBox from "./HomePageComponents/InfoBox";
import TargetConsolidatedChartBox from "./HomePageComponents/TargetConsolidatedChartBox";
import HomeDataBox from "./HomePageComponents/HomeDataBox";

function HomePage({setPropData}) {
  const [prodList, setProdList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(-1);
  

  useEffect(() => {
    const getProds = () => {
      axios
        .get("https://cndofftakencr.in/api/get_products")
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
        .get("https://cndofftakencr.in/api/getAgencies")
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
        .get("https://cndofftakencr.in/api/getPlants")
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
        <TopBannerBox plants={plantList} plantOperators={agencyList} products={prodList} setPropData={setPropData}/>
        {/* <InfoBox/> */}
      </section>
      
      <section className="homePage-overview-details">
        <ActionBtnRow/>
      </section>
      
      <section className="homePage-overview-details">
        <HomeDataBox plants={plantList} plantOperators={agencyList} products={prodList} setPropData={setPropData}/>
        {/* <InfoBox/> */}
      </section>
      
      {/* <section className="homePage-overview-details">
        <TargetConsolidatedChartBox plantOperators={agencyList}/>
      </section> */}
      

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
