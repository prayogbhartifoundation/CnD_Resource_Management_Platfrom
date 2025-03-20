import React, { useState } from "react";
import "./styles/TopBannerBox.css";
import { useNavigate } from "react-router-dom";
import InfoBox from "./InfoBox";
import TargetConsolidatedChartBox from "./TargetConsolidatedChartBox";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";

import cr_img1 from "../../assets/PlantImages/image_1.jpg";
import cr_img2 from "../../assets/PlantImages/image_2.jpg";
import cr_img3 from "../../assets/PlantImages/image_3.jpg";
import cr_img4 from "../../assets/PlantImages/image_4.jpg";

const TopBannerBox = ({ plants, plantOperators, products, setPropData }) => {
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
        <Swiper
          effect={"fade"}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          modules={[EffectFade, Autoplay]}
          loop
        >
          {/* Slide 1: News List */}
          <SwiperSlide>
            <div className="slide-content">
              <img src={cr_img1} alt="Image 1" className="carousel-img" />

              {/* <div className="imgDetails">Bricks</div> */}
            </div>
          </SwiperSlide>

          {/* Slide 2: Image 1 */}
          <SwiperSlide>
            <div className="slide-content">
              <img src={cr_img1} alt="Image 1" className="carousel-img" />

              {/* <div className="imgDetails">Bricks</div> */}
            </div>
          </SwiperSlide>

          {/* Slide 3: Image 2 */}
          <SwiperSlide>
            <div className="slide-content">
              <img src={cr_img2} alt="Image 2" className="carousel-img" />
              {/* <div className="imgDetails">Solid Waste Separation</div> */}
            </div>
          </SwiperSlide>

          {/* Slide 4: Image 3 */}
          <SwiperSlide>
            <div className="slide-content">
              <img src={cr_img3} alt="Image 3" className="carousel-img" />
              {/* <div className="imgDetails">Ever Enviro Plant</div> */}
            </div>
          </SwiperSlide>
          {/* Slide 4: Image 3 */}
          <SwiperSlide>
            <div className="slide-content">
              <img src={cr_img4} alt="Image 3" className="carousel-img" />
              {/* <div className="imgDetails">Processing Steps</div> */}
            </div>
          </SwiperSlide>
        </Swiper>
        {/* <TargetConsolidatedChartBox plantOperators={agencyList}/> */}
      </div>

      <div className="div3">
        <InfoBox />
      </div>
    </div>
  );
};

export default TopBannerBox;
