import React, { useState } from "react";
import "./styles/TargetConsolidatedChartBox.css";
import ReactApexChart from "react-apexcharts";
import deptOfftake from "../../data/deptOfftake";

const TargetConsolidatedChartBox = ({ plantOperators }) => {
  const data = [
    { category: "MCD", value: 90, target: 70 },
    { category: "DDA", value: 90, target: 90 },
    { category: "DSIIDC", value: 85, target: 85 },
    { category: "I&FC", value: 95, target: 95 },
    { category: "NDMC", value: 75, target: 88 },
  ];

  const categories = deptOfftake.map((item) => item.department);
  const values = deptOfftake.map((item) => item.offtakeStatus.total_off);
  const targets = deptOfftake.map((item) => item.annualTarget);
  const barColors = deptOfftake.map((item) =>
    item.offtakeStatus.total_off >= item.annualTarget ? "#068df6" : "#ff0000"
  ); // Green if value >= target, else red

  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: "line",
    },
    plotOptions: {
      bar: {
        columnWidth: "30%", // Make bars thinner
        colors: {
          ranges: data.map((item, index) => ({
            from: values[index],
            to: values[index],
            color: barColors[index],
          })),
        },
      },
    },
    stroke: {
      width: [0, 2],
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    labels: categories,
    xaxis: {
      categories: categories,
    },
    yaxis: [
      {
        title: {
          text: "Annual Offtake Value (MT)",
        },
      },
    ],
  });

  const [series, setSeries] = useState([
    {
      name: "Actual Value",
      type: "column",
      data: values,
    },
    {
      name: "Target Value",
      type: "line",
      data: targets,
    },
  ]);

  return (
    <div className="TargetConsolidatedChartBox">
    
    {/* <div className="CharttitleBox">
      <span>City Wise Offtake Status (01.04.24 to 31.01.25)</span>
      <select name="" id="">
        <option value="NCR">Delhi NCR</option>
      </select>
    </div> */}

    <div className="main">
      {/* <div className="plantOperatorsList">
        <h4>Plant Operators</h4>
        <ul>
          {plantOperators.map((plantOperator, index) => (
            <li key={index}>{plantOperator.agency}</li>
          ))}
        </ul>
      </div> */}

      <div className="ConsolidatedChartBox">
        {/* <h4>Target vs. Actual Chart <i style={{fontSize:'13px'}}>(** Sample Data, Actual Data linking to chart is in progress)</i></h4> */}
        <div className="chartBox">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default TargetConsolidatedChartBox;
