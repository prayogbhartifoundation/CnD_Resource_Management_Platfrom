import React from "react";
import "./styles/TopBannerBox.css";
import { useNavigate } from "react-router-dom";

const TopBannerBox = ({ plants, plantOperators, setPropData }) => {
  const visiblePlants = plants.slice(0, 15); // Only take the first 15 items
  const navigate = useNavigate()

  const handleChange = () => {
    setPropData("test")
  }

  return (
    <div class="parent">
      <div className="div1">Objectives</div>

      {visiblePlants.map((plant, index) => {
        const po = plantOperators.find((p) =>
          p.plants?.some((pl) => pl.plantId === plant?.plantId)
        );
        return (
          <div key={index} className={`div${index + 2}`}
          onClick={() => {
            handleChange();
            navigate('/plant')
          }}
          >
            <div className="titleBox">
              <span>{plant?.location}</span>
              <i scrollamount="3">{po?.agency}</i>
              <hr style={{ width: "100%" }} />
            </div>
            {plant ? (
              <>
                <span>Offtake (MT)</span>
                <span>01.04.24-15.02.25 : 7851.24</span>
              </>
            ) : (
              "--"
            )}
          </div>
        );
      })}

      {visiblePlants.length > 9 && (
        <div className="divMore">
          <a href="/more-plants">More &gt;&gt;</a>
        </div>
      )}
    </div>
  );
};

export default TopBannerBox;
