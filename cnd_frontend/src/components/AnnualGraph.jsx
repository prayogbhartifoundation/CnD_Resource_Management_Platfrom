import axios from "axios";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import "./styles/chartAnalytics.css";

const AnnualGraph = ({ fyStart, fyStr }) => {
  const [deptOfftake, setOfftake] = useState([]);
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  const [chartMinWidth, setChartMinWidth] = useState(800);

  useEffect(() => {
    const getOfftake = async () => {
      try {
        const res = await axios.get(
          "https://cndofftakencr.in/api/getDeptOfftake"
        );

        if (res.data.Status?.toLowerCase() === "success") {
          console.log(res.data.data);
          setOfftake(res.data.data?.filter((item) => item.department !== "Private"));
        } else {
          alert("Something went wrong, check logs!");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getOfftake();
  }, []);

  useEffect(() => {
    if (!deptOfftake || deptOfftake.length === 0) return;

    const now = new Date();
    const defaultFYStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    const fyStartYear = fyStart ? parseInt(fyStart) : defaultFYStart;
    const fyString = fyStr || `${fyStartYear}-${fyStartYear + 1}`;

    const categories = deptOfftake
      .sort((a, b) => +a.seq - +b.seq)
      .map((item) => item.abbreviation || item.department);
    const categoriesHover = deptOfftake
      .sort((a, b) => +a.seq - +b.seq)
      .map((item) =>
        item?.fullName
          ? `${item?.fullName} ${
              item?.abbreviation ? `(${item?.abbreviation})` : ""
            }`
          : item?.department
      );

    // Compute actual and target values
    const actualValues = deptOfftake
      .sort((a, b) => +a.seq - +b.seq)
      .map((dep) => {
        const actual = dep?.offtakeData
          ?.filter((item) => {
            const date = new Date(item.offtakeDate);
            const fyStartDate = new Date(fyStartYear, 3, 1);
            const fyEndDate = new Date(fyStartYear + 1, 2, 31, 23, 59, 59);
            return date >= fyStartDate && date <= fyEndDate;
          })
          .reduce((sum, item) => sum + Number(item.offtakeValue || 0), 0);
        return actual || 0;
      });

    const targetValues = deptOfftake
      .sort((a, b) => +a.seq - +b.seq)
      .map((dep) => {
        const targetObj = dep?.annualTarget?.find(
          (t) => t.finYear === fyString
        );
        return targetObj ? Number(targetObj.offtakeTarget) : 0;
      });

    // Compute percentage (actual / target * 100)
    const percentValues = actualValues.map((act, i) =>
      targetValues[i] > 0 ? ((act / targetValues[i]) * 100).toFixed(2) : 0
    );

    const barColors = percentValues.map(
      (p) => (Number(p) >= 100 ? "#007bff" : "#ff0000") // ✅ Blue if 100%+, Red otherwise
    );

    if (!categories.length || percentValues.some(isNaN)) return;

    const calculatedWidth = Math.max(categories.length * 60, 900);
    setChartMinWidth(calculatedWidth);

    setOptions({
      chart: {
        height: 380,
        type: "bar",
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: "25%",
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -18,
        style: {
          fontSize: "11px",
          colors: ["#3b82f6"],
          fontWeight: 600,
        },
        formatter: (val) => `${Number(val).toFixed(2)}%`, // ✅ Show only %
      },
      tooltip: {
        shared: true,
        intersect: false,

        x: {
          formatter: (val, { dataPointIndex }) => {
            return categoriesHover[dataPointIndex];
          },
        },

        y: {
          title: {
            formatter: () => "", // ✅ removes the blank "Achievement (%)"
          },
          formatter: (val, { dataPointIndex }) => {
            const actual = actualValues[dataPointIndex];
            const target = targetValues[dataPointIndex];
            const percent = percentValues[dataPointIndex];

            return `
            Achievement: (${percent})% |
        Actual: ${actual.toFixed(2)} MT |
        Target: ${target.toFixed(2)} MT |
      `;
          },
        },
      },

      xaxis: {
        categories,
      },
      yaxis: {
        title: {
          text: `Achievement (%) FY ${fyString}`,
        },
        labels: {
          formatter: (val) => `${Number(val).toFixed(2)}%`,
        },
      },
      legend: { show: false },
      //   fill: {
      //     colors: barColors,
      //   },
      annotations: {
        yaxis: [
          {
            y: 100,
            borderColor: "#00E396",
            label: {
              borderColor: "#00E396",
              style: {
                color: "#fff",
                background: "#00E396",
              },
              text: "Target (100%)",
            },
          },
        ],
        points: categories.map((dept, i) => ({
          x: dept,
          y: Number(percentValues[i]),
          marker: { size: 0 },
          label: {
            text: `${(targetValues[i] / 1000).toFixed(1)}K`,
            style: {
              background: "#00b050",
              color: "#fff",
              fontSize: "11px",
              borderRadius: 4,
              padding: { left: 3, right: 3, top: 2, bottom: 2 },
            },
            offsetY: -15, // adjust to appear just above % label
          },
        })),
      },
    });

    setSeries([
      {
        name: "Achievement (%)",
        type: "bar",
        data: percentValues.map((val, i) => ({
          x: categories[i],
          y: Number(val),
          fillColor: Number(val) >= 100 ? "#007bff" : "#ff0000", // ✅ per-bar color
        })),
      },
    ]);
  }, [deptOfftake]);

  return (
    <>
      <div className="chart-container">
        <div className="chart-inner">
          <div className="chart-scroll-wrapper">
            <div
              className="chart-scroll-inner"
              style={{ minWidth: `${chartMinWidth}px` }}
            >
              <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={300}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot blue"></span> Actual Value
            </div>
            <div className="legend-item">
              <span className="legend-dot green"></span> Target Value
            </div>
            <div className="legend-item">
              <span className="legend-bar red"></span> Under Target
            </div>
            <div className="legend-item">
              <span className="legend-bar over"></span> Over Target
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnualGraph;

// <div className="border border-black h-full w-full flex flex-col items-center justify-center rounded-md">
//   <div className="flex flex-1 w-full h-full border border-black">
//     <div className="flex-1 flex flex-col items-center justify-center gap-4 rounded-lg">
//       <div className="w-full h-full min-h-[320px] p-2.5 ">
//         <ReactApexChart
//           options={options}
//           series={series}
//           type="bar"
//           height={400}
//           width={"100%"}
//         />
//       </div>
//       {/* Legend */}
//       <div className="flex flex-col sm:flex-row justify-center sm:space-x-6 mt-4 space-y-2 sm:space-y-0">
//         <div className="flex items-center">
//           <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
//           <span className="text-sm text-gray-600">Actual Value</span>
//         </div>
//         <div className="flex items-center">
//           <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
//           <span className="text-sm text-gray-600">Target Value</span>
//         </div>
//         <div className="flex items-center">
//           <div className="w-10 h-3 bg-[#ff0000] rounded-2 mr-2"></div>
//           <span className="text-sm text-gray-600">Under Target</span>
//         </div>
//         <div className="flex items-center">
//           <div className="w-10 h-3 bg-[#007bff] rounded-2 mr-2"></div>
//           <span className="text-sm text-gray-600">Over Target</span>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
