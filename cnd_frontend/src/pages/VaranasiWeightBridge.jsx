import axios from "axios";
import React, { useEffect, useState } from "react";
// import VNNWeighbridge from "../data/VNNWeighbridge";
import * as XLSX from "xlsx";


const VaranasiWeightBridge = () => {

     const [data, setData] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState({ date: "", vehicle: "", source: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reqPar, setReqPar] = useState("cur");

  const [filters, setFilters] = useState({
    date: "",
    vehicle: "",
    source: "",
  });

  const [stats, setStats] = useState({
    totalEntries: 0,
    totalNetWeight: 0,
    avgNetWeight: 0,
  });

  // --------------------------------------------------SAP API--------------------------------------------------

  // const fetchWeightData = async () => {
  //   try {
  //     setLoading(true);
  //     // Step 1: Get Access Token
  //     const tokenResponse = await axios.post('https://everenviro-prd-z1veh80q.authentication.in30.hana.ondemand.com/oauth/token',
  //       new URLSearchParams({
  //         grant_type: 'client_credentials',
  //         client_id: 'sb-b5407119-6de1-476b-b3b3-8eddeec34fbb!b2263|it-rt-everenviro-prd-z1veh80q!b148',
  //         client_secret: 'd0973dc0-445a-4dd3-be21-ebbce7cd0e2c$_y-Ta7bnPt0fsAd23_loJ8W82LKMdZTcetYxLbFpwx0='
  //       }),
  //       {
  //         headers: {
  //           'Content-Type': 'application/x-www-form-urlencoded'
  //         }
  //       }
  //     );

  //     const accessToken = tokenResponse.data.access_token;

  //     console.log("accessToken:", accessToken); // Log the access token for debugging

  //     // 2. Use access token to call prdAPI
  //     const prdResponse = await axios.post('https://everenviro-prd-z1veh80q.it-cpi021-rt.cfapps.in30.hana.ondemand.com/http/HistoricalWeight_Data',
  //       {
  //         WeightBridgeID: '2003',
  //         WeightBridgeNo: '001',
  //         StartDate: '29-04-2025',
  //         EndDate: '29-04-2025'
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );

  //     const weightData = prdResponse.data?.HistoricalWeight_Data_Res?.HistoricalWeight_Data || [];
  //     setData(weightData);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to fetch data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   // Initial fetch
  //   fetchWeightData();

  //   // Set interval for 15 mins
  //   const intervalId = setInterval(() => {
  //     fetchWeightData();
  //   }, 15 * 60 * 1000); // 15 minutes

  //   // Cleanup
  //   return () => clearInterval(intervalId);
  // }, []);

  
  const fetchWeightData = async (par) => {
  try {
    setLoading(true);
    const response = await axios.get(`/api/vnn-weight-data/${par}`);

    // console.log("response:", response.data); // Log the full response for debugging
    
    setData(
      response.data || {}
    );
  } catch (err) {
    console.error(err);
    setError("Failed to fetch data");
  } finally {
    setLoading(false);
  }
};
  
  // useEffect(() => {
  //   if (data) {
  //     setFilteredData(data);
  //   }
  // }, [data]);

  useEffect(() => {
  if (data && data.HistoricalWeight_Data) {
    setFilteredData(data.HistoricalWeight_Data);
  } else {
    setFilteredData([]); // fallback to empty array
  }
}, [data]);

  // --------------------------------------------------SAP API--------------------------------------------------

  useEffect(() => {
    fetchWeightData("cur");
    // console.log(VNNWeighbridge);
  }, []);

  // useEffect(() => {
  //   if (data && data.HistoricalWeight_Data) {
  //     setFilteredData(data.HistoricalWeight_Data);
  //   }
  // }, [data]);


  useEffect(() => {
    if (data && data.HistoricalWeight_Data) {
      const sortedData = [...data.HistoricalWeight_Data].sort((a, b) => {
        // Sort by Creation_Date
        if (a.Creation_Date !== b.Creation_Date) {
          return b.Creation_Date.localeCompare(a.Creation_Date); // descending
        }
        // Sort by Vehicle_Gate_In_Time
        if (a.Vehicle_Gate_In_Time !== b.Vehicle_Gate_In_Time) {
          return a.Vehicle_Gate_In_Time.localeCompare(b.Vehicle_Gate_In_Time);
        }
        // Sort by Vehicle_Gate_Out_Time
        return a.Vehicle_Gate_Out_Time.localeCompare(b.Vehicle_Gate_Out_Time);
      });
  
      setFilteredData(sortedData);
    }
  }, [data]);
  
  console.log("fileteredVnn: ", filteredData);
   const totalWeight = Array.isArray(filteredData)
    ? filteredData.reduce((acc, curr) => acc + parseFloat(curr.Net_Weight || 0), 0)
    : 0;

  const handleSearch = () => {
    const { ticket, vehicle, source, Material_Description } = search;

    console.log(ticket, startDate, endDate, vehicle, source, Material_Description); // Log the search parameters for debugging

    const filtered = data.HistoricalWeight_Data.filter((item) => {
      const entryDateStr = item.Creation_Date;
      let entryDate;

      if (entryDateStr && entryDateStr.length === 8) {
        entryDate = new Date(
          `${entryDateStr.substring(0, 4)}-${entryDateStr.substring(
            4,
            6
          )}-${entryDateStr.substring(6, 8)}`
        );
      }

      const matchesTicket = ticket
        ? item.Ticket_No.toLowerCase().includes(ticket.toLowerCase())
        : true;

      const matchesStart = startDate ? entryDate >= new Date(startDate) : true;
      const matchesEnd = endDate ? entryDate <= new Date(endDate) : true;

      const matchesVehicle = vehicle
        ? item.Vehicle_No.toLowerCase().includes(vehicle.toLowerCase())
        : true;
      
        const matchesMaterialDescription = Material_Description
        ? item.Material_Description.toLowerCase().includes(Material_Description.toLowerCase())
        : true;

      const matchesSource = source
        ? item.Source_or_Destination?.toLowerCase().includes(
            source.toLowerCase()
          )
        : true;

      return (
        matchesTicket &&
        matchesStart &&
        matchesEnd &&
        matchesVehicle &&
        matchesSource &&
        matchesMaterialDescription
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };



  const formatTime = (raw) => {
    if (!raw || raw.length !== 6) return raw;

    const hr = raw.substring(0, 2);
    const min = raw.substring(2, 4);
    const sec = raw.substring(4, 6);

    return `${hr}:${min}:${sec}`;
  };

  const formatDate = (raw) => {
    if (!raw || raw.length !== 8) return raw;
    const year = raw.substring(0, 4);
    const month = raw.substring(4, 6);
    const day = raw.substring(6, 8);

    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

    const handleExport = () => {
    const dataForExport = filteredData.map((entry) => {
    const prev = { ...entry };
    return {
      ...prev,
      Creation_Date: formatDate(entry.Creation_Date),
      Vehicle_Gate_In_Time: formatTime(entry.Vehicle_Gate_In_Time),
      Vehicle_Gate_Out_Time: formatTime(entry.Vehicle_Gate_Out_Time),
    };
  });
      
    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "DashboardData.xlsx");
  };

  const handleVehicleExport = () => {
    const summaryMap = {};

    filteredData.forEach((entry) => {
      const vehicle = entry.Vehicle_No;
      const netWeight = (+entry.Gross_Weight - +entry.Tare_Weight) / 1000; // MT

      if (summaryMap[vehicle]) {
        summaryMap[vehicle] += netWeight;
      } else {
        summaryMap[vehicle] = netWeight;
      }
    });

    const summaryArray = Object.entries(summaryMap).map(
      ([vehicle, totalWeight]) => ({
        "Vehicle No": vehicle,
        "Total Net Weight (MT)": totalWeight.toFixed(2),
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(summaryArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicle Summary");
    XLSX.writeFile(workbook, "VehicleWeightSummary.xlsx");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredData)
  ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
  : [];
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //   if (loading) return <div>Loading...</div>;
  //   if (error) return <div>Error: {error}</div>;

  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // "YYYYMMDD"

  const todayWeight = Array.isArray(filteredData)
    ? filteredData.reduce((acc, curr) => {
        if (curr.Creation_Date === todayStr) {
          const net = (+curr.Gross_Weight - +curr.Tare_Weight) / 1000; // MT
          return acc + net;
        }
        return acc;
      }, 0)
    : 0;


    return (
       <div className="flex flex-col w-full p-6 font-sans bg-white">
      {/* Top Section */}
      <div className="flex flex-col gap-4">
        <h2 className="flex justify-between text-2xl font-semibold text-gray-800">
          Dashboard{" "}
          <span className="text-blue-600 font-medium">
            Today's Net Weight: {todayWeight.toFixed(2)} MT
          </span>
        </h2>

        <h5 className="text-sm text-gray-500">
          [Last Update on:{" "}
          {new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata" })}]
        </h5>

        <hr className="border-gray-300" />

        {/* Analytics */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-medium text-gray-700">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleVehicleExport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow"
            >
              Download Vehicle Summary
            </button>

            <button
              onClick={() => fetchWeightData("allData")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow"
            >
              {loading ? "Loading Data ..." : "Fetch All Data"}
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <span>Total Records: {filteredData.length}</span>
            <span>Total Net Weight: {totalWeight.toFixed(2)} MT</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-4 border-t border-gray-300 pt-4">
          {/* Ticket */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Ticket No.</label>
            <input
              type="text"
              placeholder="Ticket No"
              value={search.ticket}
              onChange={(e) => setSearch({ ...search, ticket: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {/* Material Description */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Material Description</label>
            <input
              type="text"
              placeholder="Material Description"
              value={search.Material_Description}
              onChange={(e) =>
                setSearch({
                  ...search,
                  Material_Description: e.target.value,
                })
              }
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {/* Vehicle No */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Vehicle No.</label>
            <input
              type="text"
              placeholder="Vehicle No"
              value={search.vehicle}
              onChange={(e) =>
                setSearch({ ...search, vehicle: e.target.value })
              }
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {/* Source/Destination */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Source/Destination</label>
            <input
              type="text"
              placeholder="Source"
              value={search.source}
              onChange={(e) => setSearch({ ...search, source: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm shadow"
            >
              Filter
            </button>
            <button
              onClick={handleExport}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm shadow"
            >
              Export to Excel
            </button>
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      {/* Stats Table */}
      <div className="border border-gray-300 rounded-lg overflow-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Ticket No</th>
              <th className="border px-4 py-2 text-left">Material Description</th>
              <th className="border px-4 py-2 text-left">Vehicle No</th>
              <th className="border px-4 py-2 text-left">Vehicle Type</th>
              <th className="border px-4 py-2 text-left">Driver</th>
              <th className="border px-4 py-2 text-left">Source/Destination</th>
              <th className="border px-4 py-2 text-left">Zone</th>
              <th className="border px-4 py-2 text-left">Gross [KG]</th>
              <th className="border px-4 py-2 text-left">Gate In Time</th>
              <th className="border px-4 py-2 text-left">Tare [KG]</th>
              <th className="border px-4 py-2 text-left">Gate Out Time</th>
              <th className="border px-4 py-2 text-left">Net [MT]</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((entry, index) => (
              <tr
                key={index}
                className={`${
                  parseFloat(entry.Net_Weight) > 0
                    ? "bg-green-50"
                    : "bg-yellow-50"
                } border-b`}
              >
                <td className="px-4 py-2">{formatDate(entry.Creation_Date)}</td>
                <td className="px-4 py-2">{entry.Ticket_No}</td>
                <td className="px-4 py-2">{entry.Material_Description}</td>
                <td className="px-4 py-2">{entry.Vehicle_No}</td>
                <td className="px-4 py-2">{entry.Vehicle_type}</td>
                <td className="px-4 py-2">{entry.Drive_Name}</td>
                <td className="px-4 py-2">{entry.Source_or_Destination}</td>
                <td className="px-4 py-2">{entry.Zone}</td>
                <td className="px-4 py-2">{entry.Gross_Weight}</td>
                <td className="px-4 py-2">
                  {formatTime(entry.Vehicle_Gate_In_Time)}
                </td>
                <td className="px-4 py-2">{entry.Tare_Weight}</td>
                <td className="px-4 py-2">
                  {formatTime(entry.Vehicle_Gate_Out_Time)}
                </td>
                <td className="px-4 py-2">
                  {(+entry.Gross_Weight - +entry.Tare_Weight) / 1000}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (pageNum) =>
              pageNum === 1 ||
              pageNum === totalPages ||
              Math.abs(currentPage - pageNum) <= 1
          )
          .map((pageNum, index, arr) => (
            <React.Fragment key={pageNum}>
              {index > 0 && pageNum !== arr[index - 1] + 1 && (
                <span className="px-1">...</span>
              )}
              <button
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 border rounded-md ${
                  pageNum === currentPage
                    ? "bg-blue-500 text-white border-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            </React.Fragment>
          ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>

        <input
          type="number"
          min={1}
          max={totalPages}
          placeholder="Go to"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
                e.target.value = "";
              }
            }
          }}
          className="w-16 px-2 py-1 border rounded-md ml-2 text-sm focus:ring-1 focus:ring-blue-400"
        />
      </div>
    </div>
    )
};

export default VaranasiWeightBridge;