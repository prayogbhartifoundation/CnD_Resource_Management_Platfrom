import React, { useRef } from "react";
import "./styles/ActionBtnRow.css";
import { useNavigate } from "react-router-dom";

const btnGroup = [
  {
    logo: "📦",
    title: "Products List",
    navigate: "/product",
  },
  {
    logo: "🏛️",
    title: "Department List",
    navigate: "/department",
  },
  {
    logo: "🚛",
    title: "Offtake Status",
    navigate: "/offtake",
  },
  {
    logo: "🏢",
    title: "Total Inventory",
    navigate: "/inventoryBeta",
  },
  {
    logo: "📊",
    title: "City Wise Offtake Analytics",
    navigate: "/cityWiseOfftake",
  },
];

const ActionBtnRow = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 200;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const navigate = useNavigate();

  return (
    <div className="ActionBtnRowWrapper">
    
      <button
        className="ActionBtnRow__arrow left"
        onClick={() => scroll("left")}
      >
        ⬅️
      </button>
      <div className="ActionBtnRow" ref={scrollContainerRef}>
        {[...Array(17).keys()].map((num) =>
          num < btnGroup.length ? (
            <div
              className="ActionBtnRow__btn"
              key={num}
              onClick={() => navigate(btnGroup[num]?.navigate)}
            >
              <div className="logo">
                <span>{btnGroup[num]?.logo}</span>
              </div>
              <span>{btnGroup[num]?.title} </span>
            </div>
          ) : (
            <div key={num} className="ActionBtnRow__btn">
              Button {num + 1}
            </div>
          )
        )}
      </div>
      <button
        className="ActionBtnRow__arrow right"
        onClick={() => scroll("right")}
      >
        ➡️
      </button>

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
    </div>
  );
};

export default ActionBtnRow;
