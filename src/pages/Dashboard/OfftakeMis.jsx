import React, { useState } from "react";
import "./styles/mis.css";
import deptOfftake from "../../data/deptOfftake";

const OfftakeMis = () => {
  const [selectedDept, setSelectedDept] = useState(-1);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  return (
    <div className="offtakeMis">
    {
      isFilterPopupOpen && (
        <div className="filterPopup">
          <div className="filterPopupContent">
            <div className="filterPopupHeader">
              Filters
              <button onClick={() => setIsFilterPopupOpen(false)}>Close</button>
            </div>
            <div className="filterPopupBody">
              <div className="filterPopupRow">
                <label>Department</label>
                <select>
                  <option>All</option>

                  {deptOfftake.map((dept, index) => (
                    <option key={index}>{dept.department}</option>
                  ))}

                </select>
              </div>
              <div className="filterPopupRow">
                <label>Location</label>
                <select>
                  <option>All</option>
                  <option>Delhi NCR</option>
                  <option>Varanasi</option>
                </select>
              </div>
              <div className="filterPopupRow">
                <label>Time Period</label>
                <select>
                  <option>All</option>
                  <option>01.04.24 to 15.12.24</option>
                  <option>16.12.24 to 31.12.24</option>
                  <option>01.04.24 to 31.12.24</option>
                </select>
              </div>
              
              <div className="filterPopupRow">
                <label>Custom Time Period</label>
                <div className="dateRange">
                  <input type="date" />
                  <input type="date" /> 
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
      <div className="topBar">
        <div className="title">Offtake Status</div>
        <div className="filters">
          <button className="active">Department-wise</button>
          <button>Plant Operator - wise</button>
        </div>
        |
        <div className="filters">
          <button className="active">Delhi NCR</button>
          <button className="disabled">Varanasi</button>
        </div>
        |<div className="filter-btn"
        onClick={() => setIsFilterPopupOpen(!isFilterPopupOpen)}
        >Filters</div>
      </div>

      <div className="misTable">
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Department</th>
              <th>Annual Offtake Target</th>
              <th>
                Offtake Status <span>01.04.24 to 15.12.24 </span>
              </th>
              <th>
                Offtake Status <span>16.12.24 to 31.12.24 </span>
              </th>
              <th>
                Offtake Status <span>01.04.24 to 31.12.24 </span>
              </th>
              <th>% Achieved by Dept.</th>
            </tr>
          </thead>

          <tbody>
            {deptOfftake.map((dept, index) => (
              <>
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td onClick={() => setSelectedDept(selectedDept === -1 ? index : -1)}>
                    {dept.department}
                  </td>
                  <td>{dept.annualTarget}</td>
                  <td>{dept.offtakeStatus.off_1}</td>
                  <td>{dept.offtakeStatus.off_2}</td>
                  <td>{dept.offtakeStatus.total_off}</td>
                  <td>{dept.achievedPercentage} %</td>
                </tr>

                {selectedDept === index && (
                    <>
                        <tr>
                        <td colSpan="7" style={{ textAlign: "center" }}>
                            <strong>Location-wise Offtake Status for {dept.department}</strong>
                        </td>
                        </tr>
                        {Object.entries(dept.locations).map(([location, offtake]) => (
                        <tr className="selectedRow" key={location} style={{ backgroundColor: "#f9f9f9" }}>
                            <td></td>
                            <td style={{textAlign:"right"}}>{location}</td>
                            <td></td>
                            <td>{offtake.off_1}</td>
                            <td>{offtake.off_2}</td>
                            <td>{(offtake.off_1 + offtake.off_2).toFixed(2)}</td>
                            <td></td>
                        </tr>
                        ))}
                    </>
                )}
              </>
            ))}

            <tr>
              <td colSpan="2">
                <strong>Total</strong>
              </td>
              <td style={{ textAlign: "right" }}>
                {deptOfftake.reduce((acc, dept) => acc + dept.annualTarget, 0)}
              </td>
              <td>
              {deptOfftake.reduce((acc, dept) => acc + dept.offtakeStatus.off_1, 0)}
              </td>
              <td>
              {deptOfftake.reduce((acc, dept) => acc + dept.offtakeStatus.off_2, 0)}
              </td>
              <td>
              {deptOfftake.reduce((acc, dept) => acc + dept.offtakeStatus.total_off, 0)}
              </td>
              <td>5.86 %</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfftakeMis;
