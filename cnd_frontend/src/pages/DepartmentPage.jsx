import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";

const DepartmentPage = () => {
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [deptOfftakeList, setDeptOfftakeList] = useState([]);
  const [filteredDepList, setFilteredDepList] = useState([]);
  const [prodName, setProdName] = useState("");
  const [selectedDep, setSelectedDep] = useState(-1);
  const [expandedAgencyIndex, setExpandedAgencyIndex] = useState(null);

  const [viewMode, setViewMode] = useState("summary"); // "summary" or "detailed"
  const [selectedFY, setSelectedFY] = useState(""); // e.g. "2024-2025"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agenciesRes, plantsRes, deptsRes] = await Promise.all([
          axios.get("https://cndofftakencr.in/api/getAgencies"),
          axios.get("https://cndofftakencr.in/api/getPlants"),
          axios.get("https://cndofftakencr.in/api/getDeptOfftake"),
        ]);

        if (agenciesRes.data.Status === "Success") {
          setAgencyList(agenciesRes.data.data);
        }
        if (plantsRes.data.Status === "Success") {
          setPlantList(plantsRes.data.data);
        }
        if (deptsRes.data.Status === "Success") {
          setDeptOfftakeList(deptsRes.data.data);
          setFilteredDepList(deptsRes.data.data);
          const currentFY = getFinancialYearsList()[0];
          setSelectedFY(currentFY);
        }
      } catch (err) {
        console.error("Data fetch error:", err);
        alert("Something went wrong while fetching data!");
      }
    };

    fetchData();
  }, []);

  const handleDeptClick = (index) => {
    setSelectedDep(selectedDep === index ? -1 : index);
  };

  const getFinancialYear = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return month < 4 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
  };

  const getAgencyOfftake = (agency, deptOfftake, selectedFY) => {
    const { fyStart, fyEnd } = getFYRange(selectedFY);
    const agencyPlants = agency.plants || [];
    let total = 0;

    agencyPlants.forEach((plant) => {
      const entries = deptOfftake.offtakeData?.filter(
        (entry) =>
          entry.plantId === plant.plantId &&
          entry.offtakeDate &&
          new Date(entry.offtakeDate) >= fyStart &&
          new Date(entry.offtakeDate) <= fyEnd &&
          Number(entry.offtakeValue) > 0
      );
      const sum = entries?.reduce(
        (acc, cur) => acc + Number(cur.offtakeValue || 0),
        0
      );
      total += sum;
    });

    return total;
  };

  const getPlantOfftake = (plantId, deptOfftake, selectedFY) => {
    const { fyStart, fyEnd } = getFYRange(selectedFY);
    const entries = deptOfftake.offtakeData?.filter(
      (entry) =>
        entry.plantId === plantId &&
        entry.offtakeDate &&
        new Date(entry.offtakeDate) >= fyStart &&
        new Date(entry.offtakeDate) <= fyEnd &&
        Number(entry.offtakeValue) > 0
    );

    return (
      entries?.reduce(
        (sum, entry) => sum + Number(entry.offtakeValue || 0),
        0
      ) || 0
    );
  };

  const getAgencyTarget = (dept, agency, selectedFY) => {
    const targetObj = dept.annualTarget?.find((t) => t.finYear === selectedFY);
    return Number(targetObj?.offtakeTarget || 0);
  };

  const getFinancialYearsList = () => {
    const currentYear = new Date().getFullYear() - 1;
    const startYear = currentYear - 5;
    const years = [];

    for (let i = startYear; i <= currentYear + 1; i++) {
      years.push(`${i}-${i + 1}`);
    }
    return years.reverse(); // recent years first
  };

  const getFYRange = (fyStr) => {
    const [start, end] = fyStr.split("-").map(Number);
    const fyStart = new Date(start, 3, 1); // April 1
    const fyEnd = new Date(end, 2, 31, 23, 59, 59); // March 31
    return { fyStart, fyEnd };
  };

  return (
    <>
      <div className="flex flex-col min-h-screen w-full font-sans bg-[#F8FAFB]">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-300 bg-white shadow-sm sticky top-0 z-10">
          <h2 className="text-center font-semibold text-xl text-[#325A58]">
            Departments
          </h2>
          <div className="flex items-center border border-gray-400 rounded-lg px-3 py-1 w-[320px] bg-white shadow-sm">
            <input
              type="text"
              placeholder="Search department..."
              value={prodName}
              onChange={(e) => {
                const val = e.target.value.toLowerCase();
                setProdName(val);
                setFilteredDepList(
                  deptOfftakeList.filter((d) =>
                    d.department.toLowerCase().includes(val)
                  )
                );
              }}
              className="flex-1 outline-none p-1 text-sm bg-white"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-[#07426a]"
            />
          </div>
        </header>

        {/* Main */}
        <main className="flex gap-6 p-4">
          {/* Department List */}
          <div
            className={
              selectedDep === -1
                ? "flex flex-wrap gap-4 min-h-[60vh] max-h-[280vh] justify-center overflow-y-auto pr-2 border-r border-gray-300"
                : "flex flex-col h-full overflow-y-auto pr-2 border-r border-gray-300"
            }
          >
            {filteredDepList
              .sort((a, b) => +a.seq - +b.seq)
              .map((d, index) => {
                console.log(d.logo);
                return (
                  <div
                    key={index}
                    className="relative flex flex-col items-center justify-between w-[240px] min-h-[140px] bg-gradient-to-br from-white to-[#f1f5f4] rounded-xl border border-gray-300 shadow-sm hover:shadow-lg hover:shadow-green-100 transition-all cursor-pointer p-3 text-center"
                    onClick={() => handleDeptClick(index)}
                    title={d.department}
                  >
                    <span className="absolute top-2 left-2 text-gray-500 text-xs font-semibold">
                      #{index + 1}
                    </span>

                    {/* LOGO */}
                    {d.logo ? (
                      <div className="w-full flex justify-center mb-2">
                        <img
                          src={`https://cndofftakencr.in/api/${d.logo}`}
                          alt={d.fullName || d.department}
                          className="h-16 w-16 object-contain rounded-md border border-gray-200 bg-white p-1"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 flex items-center justify-center text-gray-400 text-xs border border-dashed rounded-md">
                        No Logo
                      </div>
                    )}

                    {/* DEPARTMENT NAME */}
                    <h2 className="text-sm font-bold text-[#2F4F4F] leading-tight px-2 mt-1">
                      {d?.fullName || d?.department}
                    </h2>
                  </div>
                );
              })}
          </div>

          {/* Selected Department Details */}
          {selectedDep !== -1 &&
            (() => {
              const dept = filteredDepList[selectedDep];
              const [startYearStr, endYearStr] = selectedFY
                .split("-")
                .map(Number);
              const fyStart = new Date(startYearStr, 3, 1);
              const fyEnd = new Date(endYearStr, 2, 31, 23, 59, 59);

              const totalOfftakeSum =
                dept?.offtakeData
                  ?.filter((entry) => {
                    const date = new Date(entry.offtakeDate);
                    return date >= fyStart && date <= fyEnd;
                  })
                  .reduce(
                    (sum, entry) => sum + Number(entry.offtakeValue || 0),
                    0
                  ) || 0;

              const targetObj = dept.annualTarget?.find(
                (t) => t.finYear === selectedFY
              );
              const deptTarget = Number(targetObj?.offtakeTarget || 0);
              const deptAchievedPercent =
                deptTarget > 0
                  ? ((totalOfftakeSum / deptTarget) * 100).toFixed(2)
                  : "-";

              return (
                <div className="flex-1 flex flex-col h-[70vh] overflow-y-auto border-l border-gray-300 pl-6 bg-white rounded-lg shadow-sm p-4">
                  <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between bg-[#02AB6A] text-white p-3 rounded-lg shadow-md">
                      <h3 className="font-semibold text-base">
                        <div className="w-full flex justify-start mb-2">
                          <img
                            src={`https://cndofftakencr.in/api/${dept.logo}`}
                            alt={dept.department}
                            className="h-16 w-16 object-contain rounded-md border border-gray-200 bg-white p-1"
                          />
                        </div>
                        {dept.fullName} {dept?.abbreviation ? `(${dept?.abbreviation})` : ""} — FY {selectedFY}
                      </h3>
                      <div className="flex gap-3 items-center">
                        <select
                          value={selectedFY}
                          onChange={(e) => setSelectedFY(e.target.value)}
                          className="p-1 rounded text-black text-sm"
                        >
                          {getFinancialYearsList().map((fy) => (
                            <option key={fy} value={fy}>
                              {fy}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            setViewMode((prev) =>
                              prev === "summary" ? "detailed" : "summary"
                            )
                          }
                          className="px-3 py-1 rounded bg-white text-[#02AB6A] text-sm font-semibold "
                        >
                          {viewMode === "summary"
                            ? "All Entries"
                            : "Summary View"}
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto mt-2">
                      {viewMode === "detailed" ? (
                        <table className="w-full text-sm border border-gray-300 border-collapse shadow-sm rounded-md">
                          <thead className="bg-gray-100 font-semibold">
                            <tr>
                              <th className="border px-2 py-1 text-[#393735]">
                                S.No
                              </th>
                              <th className="border px-2 py-1 text-[#393735]">
                                Agency
                              </th>
                              <th className="border px-2 py-1 text-[#393735]">
                                Plant Name
                              </th>
                              <th className="border px-2 py-1 text-[#393735]">
                                Offtake Status
                              </th>
                              <th className="border px-2 py-1 text-[#393735]">
                                Offtake Date
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dept?.offtakeData
                              ?.filter((entry) => {
                                const date = new Date(entry.offtakeDate);
                                return date >= fyStart && date <= fyEnd && Number(entry.offtakeValue) > 0;
                              })
                              ?.map((entry, idx) => {
                                const plant = plantList.find(
                                  (p) => p.plantId === entry.plantId
                                );
                                const agency = agencyList.find((a) =>
                                  a.plants?.some(
                                    (p) => p.plantId === entry.plantId
                                  )
                                );
                                return (
                                  <tr key={idx} className="hover:bg-gray-100">
                                    <td className="border px-2 py-1 text-[#393735]">
                                      {idx + 1}
                                    </td>
                                    <td className="border px-2 py-1 text-[#393735]">
                                      {agency?.agency || "-"}
                                    </td>
                                    <td className="border px-2 py-1 text-[#393735]">
                                      {plant?.location || entry.plantId}
                                    </td>
                                    <td className="border px-2 py-1 text-[#393735]">
                                      {Number(entry.offtakeValue || 0).toFixed(
                                        2
                                      )}
                                    </td>
                                    <td className="border px-2 py-1 text-[#393735]">
                                      {new Date(
                                        entry.offtakeDate
                                      ).toLocaleDateString()}
                                    </td>
                                  </tr>
                                );
                              })}
                            <tr className="font-semibold bg-gray-200">
                              <td
                                colSpan={3}
                                className="text-right px-2 py-1 text-[#393735]"
                              >
                                Total
                              </td>
                              <td className="px-2 py-1 text-[#393735]">
                                {totalOfftakeSum.toFixed(2)}
                              </td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      ) : (
                        <table className="w-full text-sm border border-gray-300 border-collapse shadow-sm rounded-md">
                          <thead className="bg-gray-100 font-semibold">
                            <tr>
                              <th className="border px-2 py-1 text-[#393735]">
                                Agency
                              </th>
                              {/* <th className="border px-2 py-1 text-[#393735]">Target</th> */}
                              <th className="border px-2 py-1 text-[#393735]">
                                Offtake (MT)
                              </th>
                              <th className="border px-2 py-1 text-[#393735]">
                                % Achieved
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {agencyList.map((agency, i) => {
                              const target = getAgencyTarget(
                                dept,
                                agency,
                                selectedFY
                              );
                              const actual = getAgencyOfftake(
                                agency,
                                dept,
                                selectedFY
                              );
                              const percentage =
                                target > 0
                                  ? ((actual / target) * 100).toFixed(2)
                                  : "-";
                              return (
                                <tr
                                  key={i}
                                  className="hover:bg-gray-100 transition-colors"
                                >
                                  <td className="border px-2 py-1 text-[#393735]">
                                    {agency.agency}
                                  </td>
                                  {/* <td className="border px-2 py-1 text-[#393735]">
                                  {target > 0 ? target.toFixed(2) : "-"}
                                </td> */}
                                  <td className="border px-2 py-1 text-[#393735] text-center">
                                    {actual > 0 ? actual.toFixed(2) : "-"}
                                  </td>
                                  <td className="border px-2 py-1 text-[#393735] text-center">
                                    {percentage !== "-"
                                      ? `${percentage}%`
                                      : "-"}
                                  </td>
                                </tr>
                              );
                            })}
                            <tr className="font-semibold bg-gray-200">
                              <td className="text-left px-2 py-1 text-[#393735]">
                                Total Target {deptTarget || "-"} (MT)
                              </td>
                              {/* <td className="px-2 py-1 text-[#393735]">
                              {deptTarget || "-"}
                            </td> */}
                              <td className="px-2 py-1 text-[#393735] text-center" >
                                {totalOfftakeSum > 0
                                  ? `${totalOfftakeSum.toFixed(2)} MT`
                                  : "-"}
                              </td>
                              <td className="px-2 py-1 text-[#393735] text-xs text-center">
                                {deptAchievedPercent !== "-"
                                  ? `${deptAchievedPercent}%`
                                  : "-"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                  </section>
                </div>
              );
            })()}
        </main>
      </div>
    </>
  );
};

export default DepartmentPage;
