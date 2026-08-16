import { useNavigate } from "react-router-dom";
import ncr from "../assets/ncr_map.png";
import { useEffect, useState } from "react";
import axios from "axios";
import MapWithPins from "./MapWithPins";
const Overview = ({fyStr}) => {
  const vnn = localStorage.getItem("vnn") === "true";
  const navigate = useNavigate();
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [offtake, setOfftake] = useState([]);
  const [plantData, setPlantData] = useState([]);
   const getCurrentFinYear = () => {
    const now = new Date();
    const year =
      now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    return `${year}-${year + 1}`;
  };
   const [selectedFinYear, setSelectedFinYear] = useState(
      fyStr ? fyStr : getCurrentFinYear()
    );
  

  useEffect(() => {
    axios.get("https://cndofftakencr.in/api/getPlantsLocation").then((res) => {
      setPlantData(res.data.data?.filter(p=>p.location?.toLowerCase() !== "varanasi"));

    });
  }, []);
  console.log("plantsdata000:", plantData);

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
  }, []);

 

  const totalTarget = offtake
  .filter((dept) => dept.department !== "Private")
  .reduce((sum, dept) => {
    const t = dept.annualTarget.find((t) => t.finYear === getCurrentFinYear());
    return sum + Number(t?.offtakeTarget || 0);
  }, 0);
  // const totalAchieved = offtake
  // .filter((dept) => dept.department !== "Private")
  // .reduce((sum, dept) => {
  //   return (
  //     sum +
  //     dept.offtakeData
  //       .filter((o) =>
  //         o.offtakeDate?.startsWith(getCurrentFinYear().split("-")[0])
  //       )
  //       .reduce((s, d) => s + Number(d.offtakeValue || 0), 0)
  //   );
  // }, 0);

      const [fyStartYear, fyEndYear] = selectedFinYear
  .split("-")
  .map(Number);

const fyStartDate = new Date(`${fyStartYear}-04-01T00:00:00.000Z`);
const fyEndDate = new Date(`${fyEndYear}-03-31T23:59:59.999Z`);

  const totalAchieved = offtake
  .filter((dept) => dept.department !== "Private")
  .reduce((sum, dept) => {
    const deptTotal = dept.offtakeData
      ?.filter((o) => {
        if (!o.offtakeDate) return false;
        const d = new Date(o.offtakeDate);
        return d >= fyStartDate && d <= fyEndDate;
      })
      .reduce((s, d) => s + Number(d.offtakeValue || 0), 0);

    return sum + deptTotal;
  }, 0);

  return (
    <div>
      <div className="mb-4">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-4 py-2 rounded-md font-bold shadow-sm">
          <h2 className="text-orange-700">
            Construction & Demolition Overview {vnn ? "Varanasi" : "Delhi NCR"}
          </h2>
          {/* <span className="bg-[#07426a] text-white px-3 py-1 rounded-md text-sm">
        <FontAwesomeIcon icon={faCircle} /> As on 31-Mar-2025
      </span> */}
        </header>

        {/* Filters */}
        {vnn && (
          <div className="mt-3">
            <button className="mr-2 px-4 py-2 rounded-md font-medium cursor-pointer bg-green-700 text-white">
              {vnn ? "Varanasi" : ""}
            </button>
          </div>
        )}
      </div>

      {/* Main Dashboard Grid */}
      <div className="flex mt-5 border border-gray-400 p-3">
        {/* Left: Map */}
        <div className="flex-1 h-[450px] rounded-md overflow-hidden">
          {console.log("i am here ...123", plantData.length)}
          {plantData.length > 0 && <MapWithPins plants={plantData} />}
        </div>

        {/* Right: Statistics */}
        <div className="flex-1 ml-5 flex gap-4 flex-wrap h-fit">
          {/* <div className="max-w-[250px] bg-white p-4 mb-3 rounded-md text-center text-base shadow-md">
        <h3 className="font-semibold">Total Regions</h3>
        <p className="text-green-700 text-xl font-bold" onClick={() => navigate("/department")}>{vnn ? 1 : 17}</p>
      </div> */}

          {/* {!vnn && (
        <div className="max-w-[250px] bg-white p-4 mb-3 rounded-md text-center text-base shadow-md">
          <h3 className="font-semibold">Total Departments</h3>
          <button onClick={() => navigate("/department")}><p className="text-green-700 text-xl font-bold" >{vnn ? 1 : 17}</p></button>
        </div>
      )} */}

          <div className="max-w-[250px] bg-white p-4 mb-3 rounded-md text-center text-base shadow-md">
            <h3 className="font-semibold">Total Plants</h3>
            <p className="text-green-700 text-xl font-bold">
              {vnn ? 1 : plantList.length - 1}
            </p>
          </div>

          {!vnn && (
            <div
              className="max-w-[250px] bg-white p-4 mb-3 rounded-md text-center text-base shadow-md cursor-pointer"
              onClick={() =>
                navigate("/dashboard", { state: { dashIndex: 1 } })
              }
            >
              <h3 className="font-semibold">Offtake Target</h3>
              <p className="text-green-700 text-xl font-bold">
                {vnn ? 0 : totalTarget.toLocaleString() + " MT"}
              </p>
            </div>
          )}

          {!vnn && (
            <div
              className="max-w-[250px] bg-white p-4 mb-3 rounded-md text-center text-base shadow-md cursor-pointer"
              onClick={() =>
                navigate("/dashboard", { state: { dashIndex: 1 } })
              }
            >
              <h3 className="font-semibold">Offtake Achieved Against Target</h3>
              <p className="text-red-700 text-xl font-bold">
                {vnn ? 0 : Number(totalAchieved).toLocaleString() + " MT"}
              </p>
            </div>
          )}

          {/* {!vnn && (
        <div className="max-w-[250px] bg-white p-4 mb-3 rounded-md text-center text-base shadow-md">
          <h3 className="font-semibold">Total Offtake Capacity</h3>
          <p className="text-green-700 text-xl font-bold">-- TPD</p>
        </div>
      )} */}

          {!vnn && (
            <div
              className="max-w-[250px] bg-white p-4 mb-3 rounded-md text-center text-base shadow-md cursor-pointer"
              onClick={() => navigate("/products")}
            >
              <h3 className="font-semibold">No. of Products</h3>
              <button>
                <p className="text-green-700 text-xl font-bold">18</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
