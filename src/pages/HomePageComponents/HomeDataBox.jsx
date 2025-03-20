import React, { useState } from "react";
import "./styles/HomeDataBox.css";
import { useNavigate } from "react-router-dom";
import InfoBox from "./InfoBox";
import TargetConsolidatedChartBox from "./TargetConsolidatedChartBox";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";

import cr_img1 from "../../assets/PlantImages/image_1.jpg";
import cr_img2 from "../../assets/PlantImages/image_2.jpg";
import cr_img3 from "../../assets/PlantImages/image_3.jpg";
import cr_img4 from "../../assets/PlantImages/image_4.jpg";

const HomeDataBox = ({ plants, plantOperators, products, setPropData }) => {
  const [selectedAgency, setSelectedAgency] = useState(-1);
  const visiblePlants = plants.slice(0, 15); // Only take the first 15 items
  const navigate = useNavigate();
  const agencyList = plantOperators;
  const prodList = products;
  const plantList = plants;

  const handleChange = () => {
    setPropData("test");
  };

  return (
    <div class="parent">
      <div className="div1">
        {/* <h3>Plant Operators</h3> */}
        <div className="homePage-listBox">
          <div className="leftPanel">
            <div>
              <h2>Plant Operators</h2>
              {/* <h2>Total Plants</h2>
              <h2>Total Products</h2>
              <h2>Total Offtake (MT)</h2> */}
              {/* <button style={{ opacity: 0 }}>⬇️</button> */}
            </div>

            {agencyList.map((agency, index) => {
              return (
                <>
                  <div key={agency.agency_id}>
                    <h2>{agency.agency}</h2>
                    {/* <h2>{agency?.plants?.length}</h2>
                    <h2>
                      {agency.plants.reduce((total, ap) => {
                        const prodCount = prodList.filter((prod) =>
                          prod.plantWise.some((pw) => pw.plantId === ap.plantId)
                        ).length;
                        return total + prodCount;
                      }, 0)}
                    </h2>
                    <h2>--</h2> */}
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        fontWeight: "bold",
                      }}
                    >
                      {agencyList[index].plants.map((ap) => {
                        const plant = plantList.find(
                          (p) => p.plantId === ap.plantId
                        );
                        return (
                          <div style={{ display: "inline-block" }}>
                            {plant?.location}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </div>
      <div className="div2">
       
        <TargetConsolidatedChartBox plantOperators={agencyList}/>
      </div>

      <div className="div3">
        <InfoBox />
      </div>
    </div>
  );
};

export default HomeDataBox;
