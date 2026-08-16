import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import axios from "axios";

import "../components/styles/offtakeMIS.css";

const getCurrentFinYear = () => {
  const now = new Date();
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${year}-${year + 1}`;
};

const OfftakeMISPastYears = ({ fyData, detailView }) => {
  const [selectedDept, setSelectedDept] = useState(-1);
  const [selectedAgency, setSelectedAgency] = useState(-1);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [offtake, setOfftake] = useState([]);
  const [submitted, setSubmitted] = useState(false);

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

  const preparedOfftake = offtake
    .sort((a, b) => +a.seq - +b.seq)
    .map((dept) => {
      // Deep copy of fyData so we don’t mutate shared array
      const fys = [...fyData].map((f) => ({ ...f }));

      fys.forEach((f) => {
        const target =
          dept.annualTarget.find((t) => t.finYear === f.fyStr)?.offtakeTarget ||
          0;

        const [fyStartYear, fyEndYear] = f.fyStr.split("-").map(Number);
        const fyStartDate = new Date(fyStartYear, 3, 1);
        const fyEndDate = new Date(fyEndYear, 2, 31, 23, 59, 59);

        const vnn = localStorage.getItem("vnn") === "true";
        const validPlantIds = plantList
          .filter((p) =>
            vnn
              ? p.location?.toLowerCase() === "varanasi"
              : p.location?.toLowerCase() !== "varanasi"
          )
          .map((p) => p.plantId);

        const totalOfftake = dept.offtakeData
          .filter((o) => {
            if (!o.offtakeDate) return false;
            // Ensure we strictly aggregate for the active region (NCR vs Varanasi)
            if (plantList.length > 0 && o.plantId && !validPlantIds.includes(o.plantId)) return false;
            
            const entryDate = new Date(o.offtakeDate);
            return entryDate >= fyStartDate && entryDate <= fyEndDate;
          })
          .reduce((sum, d) => sum + Number(d.offtakeValue || 0), 0);

        const percent = target
          ? ((totalOfftake / target) * 100).toFixed(2)
          : "0";

        f.target = target;
        f.totalOfftake = totalOfftake;
        f.percent = percent;
      });

      return { ...dept, fys }; // attach to dept
    });

  //   console.log(preparedOfftake);

  const handleDownloadCSV = () => {
    if (!preparedOfftake.length) return;

    // --- Escape helper ---
    const escapeCSVValue = (value) => {
      if (value === null || value === undefined) return "";
      const stringValue = String(value);
      if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Build header row dynamically
    let headers = ["S.No.", "Department"];
    fyData.forEach((f) => {
      headers.push(`${f.fyStr} Target (MT)`);
      headers.push(`${f.fyStr} Offtake (MT)`);
      headers.push(`${f.fyStr} %`);
    });

    // Build data rows
    const rows = preparedOfftake.map((dept) => {
      const row = [dept.seq, escapeCSVValue(dept.department)];
      fyData.forEach((f) => {
        const fyEntry = dept.fys.find((fy) => fy.fyStr === f.fyStr);
        row.push(fyEntry?.target || 0);
        row.push(fyEntry?.totalOfftake?.toFixed(2) || 0);
        row.push(fyEntry?.percent || "0");
      });
      return row;
    });

    // Add total row
    const totalRow = ["", "Total"];
    fyData.forEach((f) => {
      const totalTarget = preparedOfftake.reduce((sum, dept) => {
        const fyEntry = dept.fys.find((fy) => fy.fyStr === f.fyStr);
        return sum + Number(fyEntry?.target || 0);
      }, 0);

      const totalOfftake = preparedOfftake.reduce((sum, dept) => {
        const fyEntry = dept.fys.find((fy) => fy.fyStr === f.fyStr);
        return sum + Number(fyEntry?.totalOfftake || 0);
      }, 0);

      const percent = totalTarget
        ? ((totalOfftake / totalTarget) * 100).toFixed(2)
        : "0";

      totalRow.push(totalTarget);
      totalRow.push(totalOfftake.toFixed(2));
      totalRow.push(percent);
    });

    rows.push(totalRow);

    // Convert to CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Offtake_MIS_${getCurrentFinYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col items-center  relative min-h-[80vh] bg-white min-w-0">
      {/* Top Bar */}
      <div className="w-full px-2 sm:px-3 md:w-[98%] flex flex-col sm:flex-row justify-between items-center bg-white p-2 sm:p-3 font-bold gap-2 sm:gap-3 border-b border-black mb-2 sm:mb-3">
        <div className="flex-1 text-base sm:text-lg text-gray-800 text-center sm:text-left w-full sm:w-auto">
          Offtake Status{" "}
          <span className="text-gray-600">
            [{fyData[0].fyStr} to {fyData[fyData.length - 1].fyStr}]
          </span>
        </div>
        <button
          onClick={handleDownloadCSV}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold py-1.5 px-3 rounded text-sm sm:text-base"
        >
          ⬇️ Download CSV
        </button>
      </div>

      {/* MIS Table */}
      <div className="w-full px-1 sm:px-2 md:w-[98%] flex-1 p-2 sm:p-3 pt-0 overflow-x-auto min-w-0">
        <table className="w-full  border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-2 sm:p-3 text-center border border-gray-300 sticky top-0 bg-green-700 whitespace-nowrap">
                <span className="fy-head">
                  <span>S.No.</span>
                </span>
              </th>
              <th className="p-2 sm:p-3 text-center border border-gray-300 sticky top-0 bg-green-700 whitespace-nowrap">
                <span className="fy-head">
                  <span>Department</span>
                </span>
              </th>

              {fyData.map((f, i) => (
                <React.Fragment key={i}>
                  <th
                    className={`p-2 sm:p-3 border border-gray-300 sticky top-0 ${
                      i % 2 === 0 ? "bg-green-700" : "bg-green-600"
                    }`}
                  >
                    <span className="fy-head">
                      <span>{f.fyStr}</span>
                      <span className="fy-sub">Target (MT)</span>
                    </span>
                  </th>

                  <th
                    className={`p-2 sm:p-3 border border-gray-300 sticky top-0 ${
                      i % 2 === 0 ? "bg-green-700" : "bg-green-600"
                    }`}
                  >
                    <span className="fy-head">
                      <span>{f.fyStr}</span>
                      <span className="fy-sub">Offtake (MT)</span>
                    </span>
                  </th>

                  <th
                    className={`p-2 sm:p-3 border border-gray-300 sticky top-0 ${
                      i % 2 === 0 ? "bg-green-700" : "bg-green-600"
                    }`}
                  >
                    <span className="fy-head">
                      <span>{f.fyStr}</span>
                      <span className="fy-sub">%</span>
                    </span>
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {preparedOfftake.map((dept, index) => {
              if (dept.department === "Private") return null;
              return(
              <tr
                key={index}
                className="hover:bg-gray-100 border border-gray-300 cursor-pointer"
                onClick={() =>
                  setSelectedDept(selectedDept === index ? -1 : index)
                }
              >
                <td className="p-2 font-semibold sm:p-3 text-center text-[#393735] text-xs sm:text-sm md:text-base">
                  {dept.seq}
                </td>
                <td className="p-2 sm:p-3 text-left font-semibold text-[#393735] text-xs sm:text-sm md:text-base">
                  {dept.department}
                </td>

                {dept.fys.map((f, fyIndex) => (
                  <React.Fragment key={fyIndex}>
                    <td
                      className={`px-2 py-2 sm:px-4 sm:py-3 text-right font-semibold text-[#393735] text-[11px] sm:text-xs md:text-sm lg:text-base whitespace-nowrap
 ${fyIndex % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
                    >
                      {f.target
                        ? Number(f.target).toLocaleString("en-IN")
                        : "-"}
                    </td>
                    <td
                      className={`px-2 py-2 sm:px-4 sm:py-3 text-right font-semibold text-[#393735] text-[11px] sm:text-xs md:text-sm lg:text-base whitespace-nowrap
 ${fyIndex % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
                    >
                      {f.totalOfftake
                        ? Number(f.totalOfftake).toLocaleString("en-IN")
                        : "-"}
                    </td>
                    <td
                      className={`px-2 py-2 sm:px-4 sm:py-3 text-right font-semibold text-[#393735] text-[11px] sm:text-xs md:text-sm lg:text-base whitespace-nowrap
 ${fyIndex % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
                    >
                      {f.percent} %
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            )})}
          </tbody>

          <tfoot>
            <tr className="bg-green-700 text-white font-bold sticky bottom-0">
              <td
                colSpan="2"
                className="p-2 sm:p-3 text-left border-t border-gray-300 text-xs sm:text-sm md:text-base"
              >
                Total
              </td>

              {fyData.map((f, fyIndex) => {
                // Calculate totals for each FY
                const totalTarget = preparedOfftake.reduce((sum, dept) => {
                  const fyEntry = dept.fys.find((fy) => fy.fyStr === f.fyStr);
                  return sum + Number(fyEntry?.target || 0);
                }, 0);

                const totalOfftake = preparedOfftake.reduce((sum, dept) => {
                  const fyEntry = dept.fys.find((fy) => fy.fyStr === f.fyStr);
                  return sum + Number(fyEntry?.totalOfftake || 0);
                }, 0);

                const percent = totalTarget
                  ? ((totalOfftake / totalTarget) * 100).toFixed(2)
                  : "0";

                return (
                  <React.Fragment key={fyIndex}>
                    <td
                      className={`p-2 sm:p-3 text-right border-t border-gray-300 text-xs sm:text-sm md:text-base ${
                        fyIndex % 2 === 0 ? "bg-green-800" : "bg-green-700"
                      }`}
                    >
                      {totalTarget.toLocaleString("en-IN")}
                      {" MT"}
                    </td>
                    <td
                      className={`p-2 sm:p-3 text-right border-t border-gray-300 text-xs sm:text-sm md:text-base ${
                        fyIndex % 2 === 0 ? "bg-green-800" : "bg-green-700"
                      }`}
                    >
                      {Number(totalOfftake).toLocaleString("en-IN")}
                      {" MT"}
                    </td>
                    <td
                      className={`p-2 sm:p-3 text-right border-t border-gray-300 text-xs sm:text-sm md:text-base ${
                        fyIndex % 2 === 0 ? "bg-green-800" : "bg-green-700"
                      }`}
                    >
                      {percent} %
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OfftakeMISPastYears;

//   const downloadCSV = () => {
//     const currentTime = new Date().toLocaleString("en-IN", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     });

//     const numColumns = 4; // S.No., Department, Target, % Achieved
//     const emptyCols = Array(numColumns - 1)
//       .fill("")
//       .join(","); // for merging illusion

//     let csvContent = "data:text/csv;charset=utf-8,";

//     // --- Fake merged headers ---
//     csvContent += `Offtake Status [${selectedFinYear}],${emptyCols}\n`;
//     csvContent += `Downloaded on: ${currentTime},${emptyCols}\n\n`;

//     // --- Column headers ---
//     const headers = [
//       "S.No.",
//       "Department",
//       "Annual Offtake Target (MT)",
//       "% Achieved by Dept.",
//     ];
//     csvContent += headers.join(",") + "\n";

//     // --- Escape helper ---
//     const escapeCSVValue = (value) => {
//       if (value === null || value === undefined) return "";
//       const stringValue = String(value);
//       if (/[",\n]/.test(stringValue)) {
//         return `"${stringValue.replace(/"/g, '""')}"`;
//       }
//       return stringValue;
//     };

//     // --- Table data ---
//     offtake.forEach((dept, index) => {
//       const targetObj = dept.annualTarget.find(
//         (t) => t.finYear === selectedFinYear
//       );
//       const totalOfftake = dept.offtakeData
//         .filter((o) => o.offtakeDate?.startsWith(selectedFinYear.split("-")[0]))
//         .reduce((sum, d) => sum + Number(d.offtakeValue || 0), 0);
//       const target = Number(targetObj?.offtakeTarget || 0);
//       const percent = target ? ((totalOfftake / target) * 100).toFixed(2) : "0";

//       const row = [
//         index + 1,
//         escapeCSVValue(dept.department),
//         escapeCSVValue(target),
//         `${escapeCSVValue(percent)} %`,
//       ];
//       csvContent += row.join(",") + "\n";
//     });

//     // --- Trigger download ---
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `offtake_report_${selectedFinYear}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
