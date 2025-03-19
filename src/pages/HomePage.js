import React, { useEffect, useState } from "react";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBannerBox from "./HomePageComponents/TopBannerBox";
import ActionBtnRow from "./HomePageComponents/ActionBtnRow";

// Importing local images
import image1 from "../assets/PlantImages/image_1.jpg";
import image2 from "../assets/PlantImages/image_2.jpg";
import image3 from "../assets/PlantImages/image_3.jpg";
import image4 from "../assets/PlantImages/image_4.jpg";

const images = [image1, image2, image3, image4];

function HomePage({ setPropData }) {
  const [prodList, setProdList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodsRes = await axios.get("http://localhost:8081/api/get_products");
        if (prodsRes.data.status === "success") setProdList(prodsRes.data.data);

        const agenciesRes = await axios.get("http://localhost:8081/api/getAgencies");
        if (agenciesRes.data.Status === "Success") setAgencyList(agenciesRes.data.data);

        const plantsRes = await axios.get("http://localhost:8081/api/getPlants");
        if (plantsRes.data.Status === "Success") setPlantList(plantsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      <section
        className="homePage-overview-details"
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1s ease-in-out",
        }}
      >
        <TopBannerBox
          plants={plantList}
          plantOperators={agencyList}
          products={prodList}
          setPropData={setPropData}
        />
      </section>
      <section className="homePage-overview-details">
        <ActionBtnRow />
      </section>
    </div>
  );
}

export default HomePage;
