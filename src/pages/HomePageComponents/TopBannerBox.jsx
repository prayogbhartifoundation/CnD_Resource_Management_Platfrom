import React, { useState } from "react";
import "./styles/TopBannerBox.css";
import { useNavigate } from "react-router-dom";
import InfoBox from "./InfoBox";
import TargetConsolidatedChartBox from "./TargetConsolidatedChartBox";

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
        <div className="homePage-listBox">
          <div className="leftPanel">
            {/* <div>
              <h2>Plant Operators</h2>
            </div> */}

            {agencyList.map((agency, index) => {
              return (
                <>
                  <div key={agency.agency_id}>
                    <h2>{agency.agency}</h2>
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
        <div className="objectives">
          {/* <h2>Objectives</h2> */}
          {/* <TargetConsolidatedChartBox plantOperators={agencyList}/> */}
        </div>
      </div>
      
      <div className="div3">
        <InfoBox/>
      </div>
     
    </div>
  );
};

export default TopBannerBox;
