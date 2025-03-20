import React, { useEffect, useState } from "react";
import "./styles/mis.css";
import deptOfftake from "../../data/deptOfftake";

const off_colMap = {
  "01.04.24 to 15.12.24": "off_1",
  "16.12.24 to 31.12.24 (last 15 days)": "off_2",
  "01.04.24 to 31.12.24 (Annual)": "total_off",
};

const OfftakeMis = () => {
  const [selectedDept, setSelectedDept] = useState(-1);
  const [filteredDept, setFilteredDept] = useState(deptOfftake);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  const defaultFilters = {
    department: [],
    location: "All",
    timePeriod: [
      "01.04.24 to 15.12.24",
      "16.12.24 to 31.12.24 (last 15 days)",
      "01.04.24 to 31.12.24 (Annual)",
    ],
    customTimePeriod: {
      from: "",
      to: "",
    },
  };

  const [filters, setFilters] = useState({ ...defaultFilters });

  useEffect(() => {
    console.log(filters.department);

    setFilteredDept(
      deptOfftake.filter((dept) =>
        filters.department.length === 0 || filters.department.includes("All")
          ? true // Show all if "All" is selected or no department is selected
          : filters.department.includes(dept.department)
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Table Headers
    let headers = ["S.No.", "Department", "Annual Offtake Target"];
    headers.push(...filters.timePeriod.map((tp) => `Offtake Status ${tp}`));
    headers.push("% Achieved by Dept.");
    csvContent += headers.join(",") + "\n";

    // Table Data
    filteredDept.forEach((dept, index) => {
      let row = [
        index + 1,
        dept.department,
        dept.annualTarget,
        ...filters.timePeriod.map(
          (tp) => dept.offtakeStatus[off_colMap[tp]] || 0
        ),
        `${dept.achievedPercentage} %`,
      ];
      csvContent += row.join(",") + "\n";

      // Location-wise data
      Object.entries(dept.locations).forEach(([location, offtake]) => {
        let locationRow = [
          "",
          location[0].toUpperCase() + location.slice(1),
          "",
          offtake.off_1,
          offtake.off_2,
          (offtake.off_1 + offtake.off_2).toFixed(2),
          "",
        ];
        csvContent += locationRow.join(",") + "\n";
      });
    });

    // Total Row
    let totalRow = [
      "Total",
      "",
      filteredDept.reduce((acc, dept) => acc + dept.annualTarget, 0),
      ...filters.timePeriod.map((tp) =>
        filteredDept.reduce(
          (acc, dept) => acc + dept.offtakeStatus[off_colMap[tp]],
          0
        )
      ),
      `${(
        (filteredDept.reduce(
          (acc, dept) =>
            acc + dept.offtakeStatus.off_1 + dept.offtakeStatus.off_2,
          0
        ) /
          filteredDept.reduce((acc, dept) => acc + dept.annualTarget, 0)) *
        100
      ).toFixed(2)} %`,
    ];
    csvContent += totalRow.join(",") + "\n";

    // Download CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "offtake_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="offtakeMis">
      {isFilterPopupOpen && (
        <div className="filterPopup">
          <div className="filterPopupContent">
            <div className="filterPopupHeader">
              Filters
              <button onClick={() => setIsFilterPopupOpen(false)}>Close</button>
            </div>

            <div className="filterPopupBody">
              <div className="filterPopupRow">
                <label>Department</label>

                <div className="multiSelect">
                  <label
                    className="btn"
                    htmlFor=""
                    onClick={() =>
                      setFilters({
                        ...filters,
                        department:
                          filters.department.length === deptOfftake.length
                            ? []
                            : deptOfftake.map((d) => d.department),
                      })
                    }
                  >
                    --{" "}
                    {filters.department.length === deptOfftake.length
                      ? "Deselect All"
                      : "Select All"}{" "}
                    --
                  </label>
                  {deptOfftake.map((dept, index) => (
                    <label key={index} className="multiSelectOption">
                      <input
                        type="checkbox"
                        value={dept.department}
                        checked={filters?.department?.includes(dept.department)}
                        onChange={(e) => {
                          const selectedDepartments =
                            filters?.department?.includes(e.target.value)
                              ? filters?.department?.filter(
                                  (d) => d !== e.target.value
                                )
                              : [...filters?.department, e.target.value];
                          setFilters({
                            ...filters,
                            department: selectedDepartments,
                          });
                        }}
                      />
                      {dept.department}
                    </label>
                  ))}
                </div>
              </div>
              <div className="filterPopupRow">
                <label>Location</label>
                <select>
                  <option>All</option>
                  <option>Delhi NCR</option>
                  {/* <option>Varanasi</option> */}
                </select>
              </div>
              {/* <div className="filterPopupRow">
                <label>Time Period</label>
                <select>
                  <option>All</option>
                  <option>01.04.24 to 15.12.24</option>
                  <option>16.12.24 to 31.12.24 (last 15 days)</option>
                  <option>01.04.24 to 31.12.24 (Annual)</option>
                </select>
              </div> */}

              <div className="filterPopupRow">
                <label>Time Period</label>

                <div className="multiSelect">
                  <label
                    className="btn"
                    htmlFor=""
                    onClick={() =>
                      setFilters({
                        ...filters,
                        timePeriod:
                          filters.timePeriod.length === 3
                            ? []
                            : [
                                "01.04.24 to 15.12.24",
                                "16.12.24 to 31.12.24 (last 15 days)",
                                "01.04.24 to 31.12.24 (Annual)",
                              ],
                      })
                    }
                  >
                    --{" "}
                    {filters.timePeriod.length === 3
                      ? "Deselect All"
                      : "Select All"}{" "}
                    --
                  </label>

                  {[
                    "01.04.24 to 15.12.24",
                    "16.12.24 to 31.12.24 (last 15 days)",
                    "01.04.24 to 31.12.24 (Annual)",
                  ].map((tp, index) => (
                    <label key={index} className="multiSelectOption">
                      <input
                        type="checkbox"
                        value={tp}
                        checked={filters?.timePeriod?.includes(tp)}
                        onChange={(e) => {
                          const selectedTP = filters?.timePeriod?.includes(
                            e.target.value
                          )
                            ? filters?.timePeriod?.filter(
                                (d) => d !== e.target.value
                              )
                            : [...filters?.timePeriod, e.target.value];
                          setFilters({
                            ...filters,
                            timePeriod: selectedTP,
                          });
                        }}
                      />
                      {tp}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filterPopupRow">
                <label>Custom Time Period</label>
                <div className="dateRange">
                  <input type="date" />
                  <input type="date" />
                </div>
              </div>
            </div>

            <div className="filterPopupFooter">
              {/* <button onClick={() => setIsFilterPopupOpen(false)}>Apply</button> */}
              <button onClick={() => setFilters(defaultFilters)}>Reset</button>
            </div>
          </div>
        </div>
      )}
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
        |
        <div
          className="filter-btn"
          onClick={() => setIsFilterPopupOpen(!isFilterPopupOpen)}
        >
          Filters
        </div>
        <div className="filter-btn" onClick={downloadCSV}>Download ⬇️</div>
      </div>

      <div className="misTable">
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Department</th>
              <th>Annual Offtake Target</th>

              {filters.timePeriod.map((tp, index) => (
                <th key={index}>
                  Offtake Status <span>{tp}</span>
                </th>
              ))}

              <th>% Achieved by Dept.</th>
            </tr>
          </thead>

          <tbody>
            {filteredDept.map((dept, index) => (
              <>
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td
                    onClick={() =>
                      setSelectedDept(selectedDept === -1 ? index : -1)
                    }
                  >
                    {dept.department}
                  </td>
                  <td>{dept.annualTarget}</td>

                  {filters.timePeriod.map((tp, index) => (
                    <td key={index}>
                      {dept.offtakeStatus[off_colMap[tp]] || 0}
                    </td>
                  ))}
                  <td>{dept.achievedPercentage} %</td>
                </tr>

                {selectedDept === index && (
                  <>
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        <strong>
                          Location-wise Offtake Status for {dept.department}
                        </strong>
                      </td>
                    </tr>
                    {Object.entries(dept.locations).map(
                      ([location, offtake]) => (
                        <tr
                          className="selectedRow"
                          key={location}
                          style={{ backgroundColor: "#f9f9f9" }}
                        >
                          <td></td>
                          <td style={{ textAlign: "right" }}>
                            {location[0].toUpperCase() + location.slice(1)}
                          </td>
                          <td></td>
                          <td>{offtake.off_1}</td>
                          <td>{offtake.off_2}</td>
                          <td>{(offtake.off_1 + offtake.off_2).toFixed(2)}</td>
                          <td></td>
                        </tr>
                      )
                    )}
                  </>
                )}
              </>
            ))}

            <tr>
              <td colSpan="2">
                <strong>Total</strong>
              </td>
              <td style={{ textAlign: "right" }}>
                {filteredDept.reduce((acc, dept) => acc + dept.annualTarget, 0)}
              </td>

              {filters.timePeriod.map((tp, index) => (
                <td key={index}>
                  {filteredDept.reduce(
                    (acc, dept) => acc + dept.offtakeStatus[off_colMap[tp]],
                    0
                  )}
                </td>
              ))}
              <td>
                {(
                  (filteredDept.reduce(
                    (acc, dept) =>
                      acc + dept.offtakeStatus.off_1 + dept.offtakeStatus.off_2,
                    0
                  ) /
                    filteredDept.reduce(
                      (acc, dept) => acc + dept.annualTarget,
                      0
                    )) *
                  100
                ).toFixed(2)}{" "}
                %
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfftakeMis;
