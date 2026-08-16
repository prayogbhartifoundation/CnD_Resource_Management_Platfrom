
import Banner from "../components/Banner";
import Notification from "../components/Notification";
import Features from "../components/Features";
import InfoCards from "../components/InfoCards";
import Downloads from "../components/Downloads";
import Development from "../components/Development";
import Dashboard from "../components/Dashboard";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Description from "../components/Description";

import "../components/styles/homePage.css";

function Home({ setPropData, vnn }) {

  // const { vnn } = useOutletContext();

const [prodList, setProdList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [utilData, setUtilData] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(-1);

  localStorage.setItem("vnn", vnn);

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
    
    const getUtils = () => {
      axios
        .get("https://cndofftakencr.in/api/util_get")
        .then((res) => {
          console.log(res);
          if (res.data.Status === "Success") {
            setUtilData(res.data.data);
          } else {
            alert("something wrong,3 check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };

    getProds();
    getAgencies();
    getPlants();
    getUtils();
  }, []);


  const navigate = useNavigate();
  return (
    <>
      
      <div className="flex flex-col lg:flex-row px-2 w-full bg-gray-50 " >
        {/* Banner Section */}
        <div className="lg:w-2/3 w-full">
          <Banner
            plants={plantList}
            plantOperators={agencyList}
            products={prodList}
            setPropData={setPropData}
            vnn={vnn}
          />
        </div>

        {/* Downloads Section */}
        {!vnn && (
              <Downloads overView ={utilData?.overview}/>

         
        )}
      </div>
      <Notification notification ={utilData?.notification}/>
      <Description vnn={vnn} />
      <Features  />
      <InfoCards />
      <Dashboard plants={plantList}
          plantOperators={agencyList}
          products={prodList}
          setPropData={setPropData}
          vnn={vnn} />
      {/* {!vnn && <Downloads />} */}
      {/* <Development /> */}
    </>
  );
}

export default Home;
