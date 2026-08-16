import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Settings, Download, Share2, MoreHorizontal } from "lucide-react";
import axios from "axios";
import AnnualGraph from "./AnnualGraph";
import { useNavigate } from "react-router-dom";
import InfoBox from "./InfoBox";

import "./styles/homeDashboard.css";

const Dashboard = ({ plants, plantOperators, products, setPropData, vnn }) => {
  const chartData = [
    { name: "DSIIDC", actualValue: 0, targetValue: 180000 },
    { name: "MCD", actualValue: 180000, targetValue: 180000 },
    { name: "DDA", actualValue: 50000, targetValue: 100000 },
    { name: "Railway Board", actualValue: 10000, targetValue: 100000 },
    { name: "PWD", actualValue: 100000, targetValue: 100000 },
    { name: "CPWD", actualValue: 100000, targetValue: 100000 },
  ];

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
    <div className="dashboard">
  <div className="dashboard-wrapper">

    {/* Agencies */}
    <div className="panel agencies-panel">
      <div className="agencies-box">
        <h2 className="panel-title">Agencies</h2>

        <div className="agencies-list">
          {!vnn ? (
            agencyList.map((agency, index) => (
              <div key={agency.agencyId} className="agency-card">
                <h3
                  onClick={() => {
                    if (agency?.agencyId) {
                      navigate("/agency", {
                        state: { agencyId: agency.agencyId },
                      });
                    }
                  }}
                >
                  {agency.agency}
                </h3>

                {selectedAgency === index && (
                  <div className="plant-list">
                    {agencyList[index].plants.map((ap, i) => {
                      const plant = plantList.find(
                        (p) => p.plantId === ap.plantId
                      );
                      return <div key={i}>{plant?.location}</div>;
                    })}
                  </div>
                )}
              </div>
            ))
          ) : (
            <h3
              className="agency-single"
              onClick={() =>
                navigate("/agency", { state: { agencyId: "vnn" } })
              }
            >
              Varanasi Nagar Nigam
            </h3>
          )}
        </div>
      </div>
    </div>

    {/* Chart */}
    {!vnn && (() => {
      const now = new Date();
      const currentYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
      const fyStr = `${currentYear}-${currentYear + 1}`;
      return (
        <div className="panel chart-panel">
          <h3 className="panel-title">Annual Offtake {fyStr}</h3>
          <AnnualGraph plantOperators={agencyList} fyStart={String(currentYear)} fyStr={fyStr} />
        </div>
      );
    })()}

  </div>
</div>

  );
};

export default Dashboard;

// const [prodList, setProdList] = useState([]);
// const [agencyList, setAgencyList] = useState([]);
// const [plantList, setPlantList] = useState([]);
// const [selectedAgency, setSelectedAgency] = useState(-1);

// const vnn = false;

// useEffect(() => {
//   const getProds = () => {
//     axios
//       .get("https://cndofftakencr.in/api/get_products")
//       .then((res) => {
//         console.log(res);
//         if (res.data.status === "success") {
//           setProdList(res.data.data);
//           // setFilteredProdList(res.data.data);
//         } else {
//           alert("something wrong,1 check logs !!");
//         }
//       })
//       .catch((err) => console.log(err));
//   };
//   const getAgencies = () => {
//     axios
//       .get("https://cndofftakencr.in/api/getAgencies")
//       .then((res) => {
//         console.log(res);
//         if (res.data.Status === "Success") {
//           setAgencyList(res.data.data);
//         } else {
//           alert("something wrong,2 check logs !!");
//         }
//       })
//       .catch((err) => console.log(err));
//   };
//   const getPlants = () => {
//     axios
//       .get("https://cndofftakencr.in/api/getPlants")
//       .then((res) => {
//         console.log(res);
//         if (res.data.Status === "Success") {
//           setPlantList(res.data.data);
//         } else {
//           alert("something wrong,3 check logs !!");
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   getProds();
//   getAgencies();
//   getPlants();
// }, []);

// const navigate = useNavigate();

// <div className="min-h-screen bg-gray-100 p-6">
//   <div className="max-w-7xl mx-auto">
//     {/* Main Dashboard Grid */}
//     <div className="grid grid-cols-12 gap-6">

//       {/* Plant Operators Section */}
//       <div className="col-span-2">
//         <div className="bg-teal-500 rounded-lg p-6 h-full">
//           <h2 className="text-white text-xl font-semibold mb-6">Plant Operators</h2>
//           <div className="space-y-3">
//             {/* {plantOperators.map((operator, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-lg p-4 text-sm font-medium text-gray-800 hover:shadow-md transition-shadow duration-200 cursor-pointer"
//               >
//                 {operator}
//               </div>
//             ))} */}
//             {!vnn ? agencyList.map((agency, index) => {
//           return (
//             <>
//               <div key={agency.agencyId} className='bg-white rounded-lg p-4 text-sm font-medium text-gray-800 hover:shadow-md transition-shadow duration-200 cursor-pointer'>
//                 <h2
//                   onClick={() => {
//                     if (agency?.agencyId) {
//                       navigate("/agency", {
//                         state: { agencyId: agency.agencyId },
//                       });
//                     } else {
//                       console.error("Agency ID is undefined");
//                     }
//                   }}
//                 >
//                   {agency.agency}
//                 </h2>

//                 {/* <button
//                   onClick={() => {
//                     setSelectedAgency(
//                       selectedAgency === index ? -1 : index
//                     );
//                   }}
//                 >
//                   ⬇️
//                 </button> */}
//               </div>
//               {selectedAgency === index && (
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "flex-start",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {agencyList[index].plants.map((ap, i) => {
//                     const plant = plantList.find(
//                       (p) => p.plantId === ap.plantId
//                     );
//                     return (
//                       <div
//                         key={i}
//                         style={{ display: "inline-block" }}
//                         // onClick={() => navigate('/agency', { state: { plantId: ap.plantId } })}
//                       >
//                         {plant?.location}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </>
//           );
//         }) : <>
//           <div >
//                 <h2
//                 className='text-gray-800'
//                   onClick={() => {

//                       navigate("/agency", {
//                         state: { agencyId: 'vnn' },
//                       });

//                   }}
//                 >
//                   Varanasi Nagar Nigam
//                 </h2>
//                 </div>
//         </>}
//           </div>
//         </div>
//       </div>

//       {/* Chart Section */}
//       <div className="col-span-8">
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           {/* Chart Header */}
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Annual Offtake Value (MT) 2025-2026
//             </h3>
//             <div className="flex items-center space-x-2">
//               <button className="p-2 hover:bg-gray-100 rounded">
//                 <Settings className="w-4 h-4 text-gray-500" />
//               </button>
//               <button className="p-2 hover:bg-gray-100 rounded">
//                 <Download className="w-4 h-4 text-gray-500" />
//               </button>
//               <button className="p-2 hover:bg-gray-100 rounded">
//                 <Share2 className="w-4 h-4 text-gray-500" />
//               </button>
//               <button className="p-2 hover:bg-gray-100 rounded">
//                 <MoreHorizontal className="w-4 h-4 text-gray-500" />
//               </button>
//             </div>
//           </div>

//           {/* Chart */}
//           <div className="h-64">
//             {!vnn && <AnnualGraph plantOperators={agencyList} />}
//             {/* <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis
//                   dataKey="name"
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 12, fill: '#666' }}
//                 />
//                 <YAxis
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 12, fill: '#666' }}
//                   domain={[0, 200000]}
//                   tickFormatter={(value) => `${value / 1000}k`}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="actualValue"
//                   stroke="#3b82f6"
//                   strokeWidth={3}
//                   dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
//                   activeDot={{ r: 8, fill: '#3b82f6' }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="targetValue"
//                   stroke="#10b981"
//                   strokeWidth={2}
//                   strokeDasharray="5 5"
//                   dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer> */}
//           </div>

//           {/* Legend */}
//           <div className="flex justify-center mt-4 space-x-6">
//             <div className="flex items-center">
//               <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
//               <span className="text-sm text-gray-600">Actual Value</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
//               <span className="text-sm text-gray-600">Target Value</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Notifications Section */}
//       <div className="col-span-2">
//         {/* <div className="bg-teal-500 rounded-lg p-6 h-full">
//           <h2 className="text-white text-xl font-semibold mb-6">Notifications</h2>
//           <div className="bg-white rounded-lg p-4">
//             <p className="text-gray-600 text-center text-sm">
//               No new messages yet.
//             </p>
//           </div>
//         </div> */}
//         <InfoBox plantOperators={agencyList} />
//       </div>
//     </div>

//     {/* Footer */}
//     {/* <div className="mt-8 text-center">
//       <p className="text-gray-600 text-sm">
//         <span className="font-medium">Site Under Development:</span> For any technical Portal related query please contact{' '}
//         <a href="mailto:info@cyberguardiantechnologies.com" className="text-blue-600 hover:underline">
//           info@cyberguardiantechnologies.com
//         </a>
//         {' '}|| +91 8059071176
//       </p>
//     </div> */}
//   </div>
// </div>
