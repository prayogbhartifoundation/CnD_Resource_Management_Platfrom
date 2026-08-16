import axios from "axios";
import { useEffect, useState } from "react";
import AddNewProduct from "./components/AddNewProduct";
import UpdateInvetory from "./components/UpdateInvetory";
import UpdateOfftake from "./components/UpdateOfftake";
import { useNavigate } from "react-router-dom";

const AuthorisedPlantHome = ({ name, usrType, setUsrType, usr, setUsr }) => {
    
    const [btnClick, setBtnClick] = useState("");
  const userType = localStorage.getItem("userType");
  const user = localStorage.getItem("user");
  const [plant, setPlant] = useState({});
  const [agency, setAgency] = useState({});


  useEffect(() => {
    const getPlants = () => {
      axios
        .get("https://cndofftakencr.in/api/getPlants")
        .then((res) => {
          console.log(res);
          if (res.data.Status === "Success") {
            const plant = res.data.data?.find(
              (plant) => plant.plantId === name
            );
            const agencyId = plant?.agencyId;
            // alert(agencyId);

            getAgencies(agencyId);
            setPlant(plant);
          } else {
            alert("something wrong, check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };

    const getAgencies = (agencyId) => {
      axios
        .get("https://cndofftakencr.in/api/getAgency/" + agencyId)
        .then((res) => {
          console.log(res);
          console.log(res.data.data);

          if (res.data.Status === "Success") {
            setAgency(res.data.data[0]);
          } else {
            alert("something wrong, check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };

    getPlants();
  }, [name]);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("userType");

    // Remove cookies (basic way — only works for JS-accessible cookies)
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    // setUsrType(null);
    // setUsr(null);

    // Redirect to login or homepage
    navigate("/Login");
  };


    return (
        <div className="p-5 font-sans bg-gray-100 min-h-screen">
  {/* Logout Button */}
  <button
    onClick={handleLogout}
    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition duration-200"
  >
    Logout
  </button>

  <hr className="my-4 border-gray-300" />

  {/* Plant Details Box */}
  <div className="flex flex-col md:flex-row items-start gap-4 mb-5 p-5 border border-gray-300 rounded-lg bg-white shadow-sm text-base">
    <div className="flex flex-col min-w-fit">
      <span className="text-gray-700 font-medium">Plant Id : {user}</span>
      <span className="text-gray-700 font-medium">
        Plant Location : {plant?.location}
      </span>
    </div>

    <div className="flex flex-col min-w-fit">
      <span className="text-gray-700 font-medium">
        Agency Id : {plant?.agencyId}
      </span>
      <span className="text-gray-700 font-medium">Agency : {agency?.agency}</span>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex flex-wrap justify-center gap-6 mb-8">
    <div
      className={`px-6 py-3 font-semibold text-white text-[15px] tracking-wide rounded-lg cursor-pointer shadow-md transition-all duration-300 ${
        btnClick === 'npr'
          ? 'bg-green-600 shadow-[0_0_4px_1px_rgba(195,254,175,0.6)]'
          : 'bg-[#621de1] shadow-[2px_2px_6px_2px_rgba(208,192,251,0.6)] hover:bg-green-600 hover:shadow-[0_0_10px_2px_rgba(195,254,175,0.8)]'
      }`}
      onClick={() => setBtnClick('npr')}
    >
      Create Product
    </div>
   
    <div
      className={`px-6 py-3 font-semibold text-white text-[15px] tracking-wide rounded-lg cursor-pointer shadow-md transition-all duration-300 ${
        btnClick === 'inv'
          ? 'bg-green-600 shadow-[0_0_4px_1px_rgba(195,254,175,0.6)]'
          : 'bg-[#621de1] shadow-[2px_2px_6px_2px_rgba(208,192,251,0.6)] hover:bg-green-600 hover:shadow-[0_0_10px_2px_rgba(195,254,175,0.8)]'
      }`}
      onClick={() => setBtnClick('inv')}
    >
      Update Inventory
    </div>

    <div
      className={`px-6 py-3 font-semibold text-white text-[15px] tracking-wide rounded-lg cursor-pointer shadow-md transition-all duration-300 ${
        btnClick === 'oft'
          ? 'bg-green-600 shadow-[0_0_4px_1px_rgba(195,254,175,0.6)]'
          : 'bg-[#621de1] shadow-[2px_2px_6px_2px_rgba(208,192,251,0.6)] hover:bg-green-600 hover:shadow-[0_0_10px_2px_rgba(195,254,175,0.8)]'
      }`}
      onClick={() => setBtnClick('oft')}
    >
      Update Offtake
    </div>
  </div>

  <hr className="my-4 border-gray-300" />

  {/* Conditional Components */}
  {btnClick === "npr" && <AddNewProduct plantId={name} />}
  {btnClick === "inv" && <UpdateInvetory plantId={name} />}
  {btnClick === "oft" && <UpdateOfftake plantId={name} />}
</div>

    )
};

export default AuthorisedPlantHome;