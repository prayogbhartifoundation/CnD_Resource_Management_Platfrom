import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import OfftakeMISPastYears from "../pages/OfftakeMISPastYears";

import "./styles/offtakeMIS.css";

const getCurrentFinYear = () => {
  const now = new Date();
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${year}-${year + 1}`;
};

const getFYData = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Financial year starts in April
  const fyStart = currentMonth >= 4 ? currentYear : currentYear - 1;

  const fyData = [];
  for (let year = fyStart; year >= 2022; year--) {
    fyData.push({
      fyStr: `${year}-${year + 1}`,
      fyStart: `${year}`,
    });
  }

  return fyData;
};

const fyData = getFYData();

const OfftakeMIS = ({ fyStr, detailView }) => {
  const [selectedDept, setSelectedDept] = useState(-1);
  const [selectedAgency, setSelectedAgency] = useState(-1);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [isPastYearsOn, setIsPastYearsOn] = useState(false);

  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [offtake, setOfftake] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const [selectedFinYear, setSelectedFinYear] = useState(
    fyStr ? fyStr : getCurrentFinYear()
  );

   const [fyStartYear, fyEndYear] = selectedFinYear
  .split("-")
  .map(Number);

  const fyStartDate = new Date(fyStartYear, 3, 1);
const fyEndDate = new Date(fyEndYear, 2, 31, 23, 59, 59);

const validPlantIds = plantList
  .filter((p) =>
    (localStorage.getItem("vnn") === "true")
      ? p.location?.toLowerCase() === "varanasi"
      : p.location?.toLowerCase() !== "varanasi"
  )
  .map((p) => p.plantId);


  //   const [selectedDept, setSelectedDept] = useState(null);
  // const [selectedAgency, setSelectedAgency] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  // const [privateOfftake, setPrivateOfftake] = useState(null);

  


  

  const vnn = localStorage.getItem("vnn") === "true";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offtakeRes, agencyRes, plantRes] = await Promise.all([
          axios.get("https://cndofftakencr.in/api/getDeptOfftake"),
          axios.get("https://cndofftakencr.in/api/getAgencies"),
          axios.get("https://cndofftakencr.in/api/getPlants"),
        ]);

        if (offtakeRes.data.Status?.toLowerCase() === "success") {
          setOfftake(offtakeRes.data.data);
        }
        if (agencyRes.data.Status?.toLowerCase() === "success") {
          setAgencyList(agencyRes.data.data);
        }
        if (plantRes.data.Status?.toLowerCase() === "success") {
          setPlantList(plantRes.data.data);
        }
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchData();
  }, [submitted]);

  

  const downloadCSV = () => {
    const currentTime = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const numColumns = 4; // S.No., Department, Target, % Achieved
    const emptyCols = Array(numColumns - 1)
      .fill("")
      .join(","); // for merging illusion

    let csvContent = "data:text/csv;charset=utf-8,";

    // --- Fake merged headers ---
    csvContent += `Offtake Status [${selectedFinYear}],${emptyCols}\n`;
    csvContent += `Downloaded on: ${currentTime},${emptyCols}\n\n`;

    // --- Column headers ---
    const headers = [
      "S.No.",
      "Department",
      "Annual Offtake Target (MT)",
      "% Achieved by Dept.",
    ];
    csvContent += headers.join(",") + "\n";

    // --- Escape helper ---
    const escapeCSVValue = (value) => {
      if (value === null || value === undefined) return "";
      const stringValue = String(value);
      if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // --- Table data ---
    offtake.forEach((dept, index) => {
      const targetObj = dept.annualTarget.find(
        (t) => t.finYear === selectedFinYear
      );
      const [fyStartYear, fyEndYear] = selectedFinYear.split("-").map(Number);
      const fyStartDateLoc = new Date(fyStartYear, 3, 1);
      const fyEndDateLoc = new Date(fyEndYear, 2, 31, 23, 59, 59);

      const totalOfftake = dept.offtakeData
        .filter((o) => {
          if (!o.offtakeDate) return false;
          // Filter correctly against the NCR vs Varanasi flag
          if (plantList.length > 0 && o.plantId && !validPlantIds.includes(o.plantId)) return false;

          const entryDate = new Date(o.offtakeDate);
          return entryDate >= fyStartDateLoc && entryDate <= fyEndDateLoc;
        })
        .reduce((sum, d) => sum + Number(d.offtakeValue || 0), 0);
      const target = Number(targetObj?.offtakeTarget || 0);
      const percent = target ? ((totalOfftake / target) * 100).toFixed(2) : "0";

      const row = [
        index + 1,
        escapeCSVValue(
          `${dept.fullName} ${
            dept?.abbreviation ? `(${dept?.abbreviation})` : ""
          }`
        ),
        escapeCSVValue(target),
        `${escapeCSVValue(percent)} %`,
      ];
      csvContent += row.join(",") + "\n";
    });

    // --- Trigger download ---
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `offtake_report_${selectedFinYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
// const dateList = offtake
//   .map((item) => item.offtakeData)
//   .flat()
//   .map((d) => {
//     if (!isValidDate(d.offtakeDate)) return null;
//     return new Date(d.offtakeDate);
//   })
//   .filter(Boolean); // removes nulls

const isValidOfftakeDate = (value) => {
  if (!value) return false;

  const d = new Date(value);

  return (
    d instanceof Date &&
    !isNaN(d.getTime()) &&
    d <= new Date() &&          // 🚫 exclude future uploads
    d >= fyStartDate &&
    d <= fyEndDate              // 🚫 outside FY
  );
};

  // const dateList = offtake
  //   .map((item) => item.offtakeData)
  //   .flat()
  //   .map((d) => {
  //     if (!isValidDate(d.offtakeDate)) return null;
  //   return new Date(d.offtakeDate);
  //     // const date = new Date(d.offtakeDate);
  //     // return date instanceof Date && !isNaN(date) ? date : null; // Check if the date is valid
  //   })
  //   // .filter((date) => date !== null); // Remove any invalid dates
  //   .filter(Boolean);
  console.log("offtake before dateList: ", offtake[0]?.offtakeData);
  const dateList = offtake
  .map((item) => item.offtakeData)
  .flat()
  .filter((d) => isValidOfftakeDate(d.offtakeDate))
  .map((d) => new Date(d.offtakeDate));
  // console.log("dateList after dateList: ", dateList)
  console.log("dateList after after dateList: ", dateList[13])

  console.log("dateList :: ", new Date(Math.max(...dateList.map((d) => d.getTime()))));



  // const mostRecentDate =
  // dateList.length > 0
  //   ? new Date(Math.max(...dateList.map((d) => d.getTime())))
  //   : null;

  const mostRecentDate =
    dateList.length > 0
      ? new Date(Math.max(...dateList.map((d) => d.getTime())))
      : null;

console.log("most recent date:", mostRecentDate);

    console.log("mosst recent date : ", mostRecentDate)

  // const mostRecentDate =
  //   dateList.length > 0 ? new Date(Math.max(...dateList)) : null;

  const privateOfftake = offtake.find((d) => d.department === "Private");

  const publicOfftake = offtake
    .filter((d) => d.department !== "Private")
    .sort((a, b) => +a.seq - +b.seq);

   



  return (
    <div className="w-full flex flex-col items-stretch border border-black relative min-h-[80vh] bg-white min-w-0 overflow-hidden">
      {/* Top Bar */}
      <div className="w-full px-2 sm:px-3 md:w-[98%] flex flex-col sm:flex-row justify-between items-center bg-white p-2 sm:p-3 font-bold gap-2 sm:gap-3 border-b border-black mb-2 sm:mb-3">
        <div className="flex-1 text-base sm:text-lg text-gray-800 text-center sm:text-left w-full sm:w-auto">
          {!isPastYearsOn && (
            <>
              Offtake Status{" "}
              <span className="text-gray-600">
                [
                {!isPastYearsOn
                  ? selectedFinYear || ""
                  : "Past 3 years offtake"}
                ]
              </span>
              {mostRecentDate && (
                <div className="text-gray-600">
                  Last Updated: {mostRecentDate.toLocaleDateString("en-GB")}
                </div>
              )}
            </>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <span className="hidden sm:inline text-gray-400">|</span>

          <div
            className="px-2 py-1.5 sm:px-3 sm:py-2 bg-orange-600 text-white rounded-md font-semibold cursor-pointer transition text-xs sm:text-sm md:text-base whitespace-nowrap"
            onClick={() => setIsPastYearsOn(!isPastYearsOn)}
          >
            {isPastYearsOn ? "Current Year Offtake" : "Past 3 Years Offtake"}
          </div>

          {detailView && (
            <div
              className="px-2 py-1.5 sm:px-3 sm:py-2 bg-orange-600 text-white rounded-md font-semibold cursor-pointer transition text-xs sm:text-sm md:text-base whitespace-nowrap"
              onClick={() => setIsFilterPopupOpen(!isFilterPopupOpen)}
            >
              Filters
            </div>
          )}

          <div
            className="px-2 py-1.5 sm:px-3 sm:py-2 bg-orange-600 text-white rounded-md font-semibold cursor-pointer transition text-xs sm:text-sm md:text-base whitespace-nowrap"
            onClick={downloadCSV}
          >
            <span className="hidden xs:inline">Download </span>
            <FontAwesomeIcon icon={faDownload} />
          </div>
        </div>
      </div>

      {/* Filter Popup */}
      {isFilterPopupOpen && (
        <div className="absolute top-[15%] sm:top-[20%] left-1/2 -translate-x-1/2 w-[95%] xs:w-[90%] sm:w-2/3 md:w-1/2 lg:w-2/5 bg-white rounded-xl shadow-2xl z-50 p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center bg-[#2e7d32] text-white rounded-t-xl px-3 sm:px-4 py-2">
            <h3 className="font-semibold text-sm sm:text-base">
              Filter Options
            </h3>
            <button
              onClick={() => setIsFilterPopupOpen(false)}
              className="text-lg sm:text-xl hover:text-gray-200 transition"
            >
              ✖
            </button>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 border border-gray-300 rounded-b-xl">
            <label className="font-semibold text-sm sm:text-base">
              Financial Year:
            </label>
            <select
              value={selectedFinYear}
              onChange={(e) => setSelectedFinYear(e.target.value)}
              className="border border-black rounded-md p-2 w-full text-sm sm:text-base"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                const finYear = `${y}-${y + 1}`;
                return (
                  <option key={i} value={finYear}>
                    {finYear}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex justify-end bg-[#2e7d32] rounded-b-xl p-2 sm:p-3">
            <button
              className="bg-[#46a0c7] hover:bg-[#9d0303] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-bold transition text-xs sm:text-sm md:text-base"
              onClick={() => setIsFilterPopupOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* MIS Table */}
      {isPastYearsOn ? (
        <div className="w-full px-1 sm:px-2 md:w-[98%] flex-1 p-2 sm:p-3 pt-0 overflow-hidden min-w-0">
          <div className="max-w-[80vw] overflow-x-auto min-w-0">
            <OfftakeMISPastYears fyData={fyData.slice(1)} detailView={false} />
          </div>
        </div>
      ) : (
        <div className="w-full px-1 sm:px-2 md:w-[98%] flex-1 p-2 sm:p-3 pt-0 overflow-x-auto min-w-0">
          <table className="w-full border border-gray-300 border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="p-2 sm:p-3 w-[8%] sm:w-[5%] text-center font-semibold border border-gray-300 sticky top-0 bg-green-700 text-xs sm:text-sm md:text-base">
                  S.No.
                </th>
                <th className="p-2 sm:p-3 w-[30%] text-left font-semibold border border-gray-300 sticky top-0 bg-green-700 text-xs sm:text-sm md:text-base">
                  Department
                </th>
                <th className="p-2 sm:p-3 w-[20%] text-right font-semibold border border-gray-300 sticky top-0 bg-green-700 text-xs sm:text-sm md:text-base">
                  <span className="hidden sm:inline">Annual </span>Offtake
                  Target (MT)
                </th>
                <th className="p-2 sm:p-3 w-[20%] text-right font-semibold border border-gray-300 sticky top-0 bg-green-700 text-xs sm:text-sm md:text-base">
                  <span className="hidden sm:inline">Annual </span>Offtake
                  Status (MT)
                </th>
                <th className="p-2 sm:p-3 w-[12%] sm:w-[10%] text-right font-semibold border border-gray-300 sticky top-0 bg-green-700 text-xs sm:text-sm md:text-base">
                  Achieved %
                </th>
              </tr>
            </thead>

            <tbody>
              {publicOfftake.map((dept, index) => {
                const targetObj = dept.annualTarget.find(
                  (t) => t.finYear === selectedFinYear
                );

                const [fyStartYearLoc, fyEndYearLoc] = selectedFinYear
                  .split("-")
                  .map(Number);

                const fyStartDateLoc = new Date(fyStartYearLoc, 3, 1);
                const fyEndDateLoc = new Date(fyEndYearLoc, 2, 31, 23, 59, 59);

                const totalOfftake = dept.offtakeData
                  .filter((o) => {
                    if (!o.offtakeDate) return false;
                    if (plantList.length > 0 && o.plantId && !validPlantIds.includes(o.plantId)) return false;
                    const d = new Date(o.offtakeDate);
                    return d >= fyStartDateLoc && d <= fyEndDateLoc;
                  })
                  .reduce((sum, d) => sum + Number(d.offtakeValue || 0), 0);

                const target = Number(targetObj?.offtakeTarget || 0);
                const percent = target
                  ? ((totalOfftake / target) * 100).toFixed(2)
                  : "0";

                {
                  /* console.log(dept); */
                }

                return (
                  <React.Fragment key={index}>
                    <tr
                      className="hover:bg-gray-100 border border-gray-300 cursor-pointer"
                      onClick={() =>
                        setSelectedDept(selectedDept === index ? -1 : index)
                      }
                    >
                      <td className="p-2 font-semibold sm:p-3 text-center text-[#393735] text-xs sm:text-sm md:text-base">
                        {dept.seq}
                      </td>
                      <td className="p-2 sm:p-3 text-left font-semibold text-[#393735] text-xs sm:text-sm md:text-base">
                        {dept.fullName}{" "}
                        {dept?.abbreviation ? `(${dept?.abbreviation})` : ""}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-right font-semibold text-[#393735] text-xs sm:text-sm md:text-base">
                        {target ? `${target.toLocaleString("en-IN")}` : "-"}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-right font-semibold text-[#393735] text-xs sm:text-sm md:text-base">
                        {totalOfftake
                          ? `${Number(totalOfftake).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : "-"}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-right font-semibold text-gray-700 text-xs sm:text-sm md:text-base">
                        {percent} %
                      </td>
                    </tr>

                    {/* Agencies */}
                    {selectedDept === index &&
                      agencyList.map((agency, i) => {
                        const [startYearStr, endYearStr] = selectedFinYear
                          .split("-")
                          .map(Number);
                        const fyStart = new Date(startYearStr, 3, 1);
                        const fyEnd = new Date(endYearStr, 2, 31, 23, 59, 59);

                        const agencyTotal = agency?.plants?.reduce(
                          (acc, plant) => {
                            const plantDetails = plantList.find(
                              (p) => p.plantId === plant.plantId
                            );
                            const plantOfftakeData =
                              dept?.offtakeData?.filter(
                                (entry) =>
                                  entry.plantId === plantDetails?.plantId
                              ) || [];
                            const fyData = plantOfftakeData.filter(
                              (entry) =>
                                new Date(entry.offtakeDate) >= fyStart &&
                                new Date(entry.offtakeDate) <= fyEnd
                            );
                            return (
                              acc +
                              fyData.reduce(
                                (sum, entry) =>
                                  sum + Number(entry.offtakeValue || 0),
                                0
                              )
                            );
                          },
                          0
                        );

                        return (
                          <React.Fragment key={i}>
                            <tr className="bg-gray-100 hover:bg-gray-200">
                              <td></td>
                              <td
                                className="text-right font-semibold p-2 cursor-pointer text-[#393735] text-xs sm:text-sm md:text-base"
                                onClick={() =>
                                  setSelectedAgency(
                                    selectedAgency === i ? -1 : i
                                  )
                                }
                              >
                                {agency.agency?.toUpperCase()}
                              </td>
                              <td></td>
                              <td className="text-right font-bold text-[#393735] text-xs sm:text-sm md:text-base">
                                {agencyTotal
                                  ? `${Number(agencyTotal).toLocaleString(
                                      "en-IN",
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )}`
                                  : "-"}
                              </td>
                              <td></td>
                            </tr>

                            {/* Plants */}
                            {selectedAgency === i &&
                              agency?.plants?.map((plant, j) => {
                                const plantDetails = plantList.find(
                                  (p) => p.plantId === plant.plantId
                                );
                                const plantOfftakeData =
                                  dept?.offtakeData?.filter(
                                    (entry) =>
                                      entry.plantId === plantDetails?.plantId
                                  ) || [];
                                const fyData = plantOfftakeData.filter(
                                  (entry) =>
                                    new Date(entry.offtakeDate) >= fyStart &&
                                    new Date(entry.offtakeDate) <= fyEnd
                                );
                                const totalFYOfftake = fyData.reduce(
                                  (sum, entry) =>
                                    sum + Number(entry.offtakeValue || 0),
                                  0
                                );

                                return plantDetails?.location?.toLowerCase() ===
                                  "varanasi" ? null : (
                                  <tr
                                    key={j}
                                    className="bg-gray-50 hover:bg-gray-100"
                                  >
                                    <td></td>
                                    <td className="text-right text-[#393735] text-xs sm:text-sm md:text-base">
                                      {plantDetails?.location?.toUpperCase()}
                                    </td>
                                    <td></td>
                                    <td className="text-right text-[#393735] text-xs sm:text-sm md:text-base">
                                      {totalFYOfftake
                                        ? `${Number(
                                            totalFYOfftake
                                          ).toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}`
                                        : "-"}
                                    </td>
                                    <td></td>
                                  </tr>
                                );
                              })}
                          </React.Fragment>
                        );
                      })}
                  </React.Fragment>
                );
              })}

              {/* Totals Row */}
              <tr className="bg-[#16803C] text-white font-bold sticky bottom-0">
                <td
                  colSpan="2"
                  className="p-2 sm:p-3 text-left border-t border-gray-300 text-xs sm:text-sm md:text-base"
                >
                  Total
                </td>
                <td className="p-2 sm:p-3 text-right border-t border-gray-300 text-xs sm:text-sm md:text-base">
                  {offtake
                    .filter((dept) => dept.department !== "Private")
                    .reduce((sum, dept) => {
                      const target = dept.annualTarget.find(
                        (t) => t.finYear === selectedFinYear
                      );
                      return sum + Number(target?.offtakeTarget || 0);
                    }, 0)
                    .toLocaleString("en-IN")}{" "}
                  MT
                </td>
                <td className="p-2 sm:p-3 text-right border-t border-gray-300 text-xs sm:text-sm md:text-base">
                  {Number(
                    offtake
                      .filter((dept) => dept.department !== "Private")
                      .reduce((sum, dept) => {
                        const deptTotal = dept.offtakeData
                          ?.filter((o) => {
                            if (!o.offtakeDate) return false;
                            if (plantList.length > 0 && o.plantId && !validPlantIds.includes(o.plantId)) return false;
                            const d = new Date(o.offtakeDate);
                            return d >= fyStartDate && d <= fyEndDate;
                          })
                          .reduce((s, d) => s + Number(d.offtakeValue || 0), 0);

                        return sum + deptTotal;
                      }, 0)
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  MT
                </td>

                <td className="p-2 sm:p-3 text-right border-t border-gray-300 text-xs sm:text-sm md:text-base">
                  {(() => {
                    const totalTarget = offtake
                      .filter((dept) => dept.department !== "Private")
                      .reduce((sum, dept) => {
                        const t = dept.annualTarget.find(
                          (t) => t.finYear === selectedFinYear
                        );
                        return sum + Number(t?.offtakeTarget || 0);
                      }, 0);
                    const totalAchieved = offtake
  .filter((dept) => dept.department !== "Private")
  .reduce((sum, dept) => {
    const deptAchieved = dept.offtakeData
      ?.filter((o) => {
        if (!o.offtakeDate) return false;
        if (plantList.length > 0 && o.plantId && !validPlantIds.includes(o.plantId)) return false;
        const d = new Date(o.offtakeDate);
        return d >= fyStartDate && d <= fyEndDate;
      })
      .reduce((s, d) => s + Number(d.offtakeValue || 0), 0);

    return sum + deptAchieved;
  }, 0);

                    return totalTarget
                      ? ((totalAchieved / totalTarget) * 100).toFixed(2)
                      : "0";
                  })()}{" "}
                  %
                </td>
              </tr>

              {privateOfftake &&
                (() => {
                  const targetObj = privateOfftake.annualTarget.find(
                    (t) => t.finYear === selectedFinYear
                  );

                  const [startYearStr, endYearStr] = selectedFinYear
                    .split("-")
                    .map(Number);

                  const fyStart = new Date(startYearStr, 3, 1);
                  const fyEnd = new Date(endYearStr, 2, 31, 23, 59, 59);

                  // FY-filtered private data
                  const fyPrivateData = privateOfftake.offtakeData.filter(
                    (o) =>
                      new Date(o.offtakeDate) >= fyStart &&
                      new Date(o.offtakeDate) <= fyEnd
                  );

                  const totalOfftake = fyPrivateData.reduce(
                    (sum, d) => sum + Number(d.offtakeValue || 0),
                    0
                  );

                  const target = Number(targetObj?.offtakeTarget || 0);
                  const percent = target
                    ? ((totalOfftake / target) * 100).toFixed(2)
                    : "0";

                  return (
                    <React.Fragment key="private">
                      {/* ================= PRIVATE MAIN ROW ================= */}
                      <br />
                      <tr className="bg-[#16803C] text-white">
                        <td colSpan={5} className="px-4 py-2 font-bold">
                          Private Offtake Details
                        </td>
                      </tr>
                      <tr
                        className="hover:bg-gray-100 border border-gray-300 cursor-pointer"
                        onClick={() =>
                          setSelectedDept(
                            selectedDept === "private" ? null : "private"
                          )
                        }
                      >
                        <td className="p-2 text-center font-semibold">
                          {privateOfftake.seq || ""}
                        </td>
                        <td className="p-2 font-semibold">
                          {privateOfftake.fullName}
                        </td>
                        <td className="p-2 text-right">
                          {/* {target ? target.toLocaleString("en-IN") : "-"} */}
                        </td>
                        <td className="p-2 text-right">
                          {totalOfftake
                            ? Number(totalOfftake).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "-"}
                        </td>
                        <td className="p-2 text-right"></td>
                      </tr>

                      {/* ================= AGENCY LEVEL ================= */}
                      {selectedDept === "private" &&
                        agencyList.map((agency, i) => {
                          const agencyTotal = agency?.plants?.reduce(
                            (acc, plant) => {
                              const plantTotal = fyPrivateData
                                .filter((e) => e.plantId === plant.plantId)
                                .reduce(
                                  (s, e) => s + Number(e.offtakeValue || 0),
                                  0
                                );
                              return acc + plantTotal;
                            },
                            0
                          );

                          if (!agencyTotal) return null;

                          return (
                            <React.Fragment key={i}>
                              <tr
                                className="bg-gray-100 hover:bg-gray-200 cursor-pointer"
                                onClick={() =>
                                  setSelectedAgency(
                                    selectedAgency === `p-${i}`
                                      ? null
                                      : `p-${i}`
                                  )
                                }
                              >
                                <td></td>
                                <td className="text-right font-semibold p-2">
                                  {agency.agency.toUpperCase()}
                                </td>
                                <td></td>
                                <td className="text-right font-bold">
                                  {Number(agencyTotal).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </td>
                                <td></td>
                              </tr>

                              {/* ================= PLANT LEVEL ================= */}
                              {selectedAgency === `p-${i}` &&
                                agency?.plants?.map((plant, j) => {
                                  const plantDetails = plantList.find(
                                    (p) => p.plantId === plant.plantId
                                  );

                                  const plantData = fyPrivateData.filter(
                                    (e) => e.plantId === plant.plantId
                                  );

                                  if (!plantData.length) return null;

                                  const plantTotal = plantData.reduce(
                                    (s, e) => s + Number(e.offtakeValue || 0),
                                    0
                                  );

                                  return (
                                    <React.Fragment key={j}>
                                      <tr
                                        className="bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                          setSelectedPlant(
                                            selectedPlant === `p-${i}-${j}`
                                              ? null
                                              : `p-${i}-${j}`
                                          )
                                        }
                                      >
                                        <td></td>
                                        <td className="text-right">
                                          {plantDetails?.location?.toUpperCase()}
                                        </td>
                                        <td></td>
                                        <td className="text-right">
                                          {Number(plantTotal).toLocaleString(
                                            "en-IN",
                                            {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            }
                                          )}
                                        </td>
                                        <td></td>
                                      </tr>

                                      {/* ================= PRIVATE ENTITY LEVEL ================= */}
                                      {selectedPlant === `p-${i}-${j}` &&
                                        Object.entries(
                                          plantData.reduce((acc, e) => {
                                            const key =
                                              e.offtakeEntity || "UNKNOWN";
                                            acc[key] =
                                              (acc[key] || 0) +
                                              Number(e.offtakeValue || 0);
                                            return acc;
                                          }, {})
                                        ).map(([entity, value], k) => (
                                          <tr key={k} className="bg-white">
                                            <td></td>
                                            <td className="text-right text-sm italic">
                                              {entity}
                                            </td>
                                            <td></td>
                                            <td className="text-right text-sm">
                                              {Number(value).toLocaleString(
                                                "en-IN",
                                                {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                }
                                              )}
                                            </td>
                                            <td></td>
                                          </tr>
                                        ))}
                                    </React.Fragment>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}
                    </React.Fragment>
                  );
                })()}

              {/* Totals Row */}
              <tr className="bg-[#16803C] text-white font-bold sticky bottom-0">
                <td
                  colSpan="2"
                  className="p-2 sm:p-3 text-left border-t border-gray-300 text-xs sm:text-sm md:text-base"
                >
                  Grand Total
                </td>
                <td className="p-2 sm:p-3 text-right border-t border-gray-300 text-xs sm:text-sm md:text-base">
                  {offtake
                    .reduce((sum, dept) => {
                      const target = dept.annualTarget.find(
                        (t) => t.finYear === selectedFinYear
                      );
                      return sum + Number(target?.offtakeTarget || 0);
                    }, 0)
                    .toLocaleString("en-IN")}{" "}
                  MT
                </td>
                <td className="p-2 sm:p-3 text-right border-t border-gray-300 text-xs sm:text-sm md:text-base">
                  {offtake
                    .reduce((sum, dept) => {
                      const [fyStartYear, fyEndYear] =
                        selectedFinYear.split("-");

                      const fyStartDate = new Date(`${fyStartYear}-04-01`);
                      const fyEndDate = new Date(
                        `${fyEndYear}-03-31T23:59:59.999`
                      );

                      return (
                        sum +
                        dept.offtakeData
                          .filter((o) => {
                            if (!o.offtakeDate) return false;
                            const date = new Date(o.offtakeDate);
                            return date >= fyStartDate && date <= fyEndDate;
                          })
                          .reduce((s, d) => s + Number(d.offtakeValue || 0), 0)
                      );
                    }, 0)
                    .toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  MT
                </td>

                <td className="p-2 sm:p-3 text-right border-t border-gray-300 text-xs sm:text-sm md:text-base">
                  {(() => {
                    const totalTarget = offtake.reduce((sum, dept) => {
                      const t = dept.annualTarget.find(
                        (t) => t.finYear === selectedFinYear
                      );
                      return sum + Number(t?.offtakeTarget || 0);
                    }, 0);
                    const totalAchieved = offtake.reduce((sum, dept) => {
                      const [fyStartYear, fyEndYear] =
                        selectedFinYear.split("-");

                      const fyStartDate = new Date(`${fyStartYear}-04-01`);
                      const fyEndDate = new Date(
                        `${fyEndYear}-03-31T23:59:59.999`
                      );
                      return (
                        sum +
                        dept.offtakeData
                          .filter((o) => {
                            if (!o.offtakeDate) return false;
                            const date = new Date(o.offtakeDate);
                            return date >= fyStartDate && date <= fyEndDate;
                          })
                          .reduce((s, d) => s + Number(d.offtakeValue || 0), 0)
                      );
                    }, 0);
                    return totalTarget
                      ? ((totalAchieved / totalTarget) * 100).toFixed(2)
                      : "0";
                  })()}{" "}
                  %
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OfftakeMIS;

{
  /* <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            <button className="px-2 py-1.5 sm:px-3 sm:py-2 bg-orange-600 text-white rounded-md font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
              Department-wise
            </button>
          </div>

          <span className="hidden sm:inline text-gray-400">|</span>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            <button className="px-2 py-1.5 sm:px-3 sm:py-2 bg-orange-600 text-white rounded-md font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
              Delhi NCR
            </button>
          </div> */
}
