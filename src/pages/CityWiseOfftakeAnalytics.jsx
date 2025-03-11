import React, { useEffect, useState } from "react";
import TargetConsolidatedChartBox from "./HomePageComponents/TargetConsolidatedChartBox";
import axios from "axios";

const CityWiseOfftakeAnalytics = () => {
    const [prodList, setProdList] = useState([]);
    const [agencyList, setAgencyList] = useState([]);
    const [plantList, setPlantList] = useState([]);

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

  return (
    <div>
      <TargetConsolidatedChartBox plantOperators={agencyList} />
    </div>
  );
};

export default CityWiseOfftakeAnalytics;
