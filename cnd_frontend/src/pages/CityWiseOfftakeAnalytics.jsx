import { useEffect, useState } from "react";
import AnnualGraph from "../components/AnnualGraph";
import OfftakeMIS from "../components/OfftakeMIS";
import axios from "axios";
import OfftakeMISPastYears from "./OfftakeMISPastYears";

const CityWiseOfftakeAnalytics = () => {
  const [prodList, setProdList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [selectedFY, setSelectedFY] = useState(""); // store selected financial year

  // const fyData = [
  //   { fyStr: "2025-2026", fyStart: "2025" },
  //   { fyStr: "2024-2025", fyStart: "2024" },
  //   { fyStr: "2023-2024", fyStart: "2023" },
  //   { fyStr: "2022-2023", fyStart: "2022" }
  // ];

  [
    { fyStr: "2025-26", fyStart: "2025" },
    { fyStr: "2024-25", fyStart: "2024" },
    { fyStr: "2023-24", fyStart: "2023" },
    { fyStr: "2022-23", fyStart: "2022" },
  ];

  const getFYData = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Financial year starts in April
    const fyStart = currentMonth >= 4 ? currentYear : currentYear - 1;

    const fyData = [];
    for (let year = fyStart; year >= 2022; year--) {
      fyData.push({
        fyStr: `${year}-${(year + 1)}`,
        fyStart: `${year}`,
      });
    }

    return fyData;
  };

  const fyData = getFYData();


  useEffect(() => {
    const getProds = () => {
      axios
        .get("https://cndofftakencr.in/api/get_products")
        .then((res) => {
          if (res.data.status === "success") {
            setProdList(res.data.data);
          } else {
            alert("Something went wrong while fetching products!");
          }
        })
        .catch((err) => console.log(err));
    };

    const getAgencies = () => {
      axios
        .get("https://cndofftakencr.in/api/getAgencies")
        .then((res) => {
          if (res.data.Status === "Success") {
            setAgencyList(res.data.data);
          } else {
            alert("Something went wrong while fetching agencies!");
          }
        })
        .catch((err) => console.log(err));
    };

    const getPlants = () => {
      axios
        .get("https://cndofftakencr.in/api/getPlants")
        .then((res) => {
          if (res.data.Status === "Success") {
            setPlantList(res.data.data);
          } else {
            alert("Something went wrong while fetching plants!");
          }
        })
        .catch((err) => console.log(err));
    };

    getProds();
    getAgencies();
    getPlants();
  }, []);

  return (
    <div className="w-full p-5 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-2xl font-semibold text-gray-800">
          Department Wise Offtake Analytics
        </h3>

        {/* Financial Year Dropdown */}
        <select
          value={selectedFY}
          onChange={(e) => setSelectedFY(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-300 cursor-pointer"
        >
          <option value="">All Years</option>
          {fyData.map((fy) => (
            <option key={fy.fyStr} value={fy.fyStr}>
              {fy.fyStr}
            </option>
          ))}
        </select>
      </div>

          <div
           
            className="bg-teal-100/40 p-5 mb-7 rounded-lg shadow-sm"
          >
            <h4 className="text-lg font-medium text-gray-700 mb-4">
              FY {fyData[0].fyStr}
            </h4>

            <OfftakeMIS fyStr={fyData[0].fyStr} detailView={false} />

            <div className="mt-5">
              <AnnualGraph
                plantOperators={agencyList}
                fyStart={fyData[0].fyStart}
                fyStr={fyData[0].fyStr}
              />
            </div>
          </div>
          
          
          <div
           
            className="bg-teal-100/40 p-5 mb-7 rounded-lg shadow-sm"
          >

            <OfftakeMISPastYears fyData={fyData.slice(1)}  detailView={false} />

            <div className="mt-5">
              {/* <AnnualGraph
                plantOperators={agencyList}
                fyStart={fyData[0].fyStart}
                fyStr={fyData[0].fyStr}
              /> */}
            </div>
          </div>
      
    </div>
  );
};

export default CityWiseOfftakeAnalytics;
