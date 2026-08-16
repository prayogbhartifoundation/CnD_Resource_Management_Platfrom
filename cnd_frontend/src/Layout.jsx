import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useState } from "react";
import { getCookie } from "./data/cookieHelpers";
// import axios from "axios";
import UserPopupForm from "./components/UserPopupForm";
// import vnnImg from "./assets/vnnLogo.jpg";
import SwachhLogo from "./assets/Swachh-Bharat-Abhiyan.jpg";
import Development from "./components/Development";

const Layout = ({ usrType, setUsrType, usr, setUsr, visits }) => {

  const location = useLocation();

    const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    organisation: "",
  });
  // const [sideBarOpen, setSideBarOpen] = useState(false);
  // const [propData, setPropData] = useState(0);

  // const [userType, setUserType] = useState(localStorage.getItem("userType"));
  // const [user, setUser] = useState(localStorage.getItem("user"));

  // const navigate = useNavigate();

  // useEffect(() => {
  //   axios
  //     .get("https://cndofftakencr.in/api/agencyHome", { withCredentials: true })
  //     .then((res) => {
  //       console.log(res);

  //       if (res.data.Status === "Success") {
  //         localStorage.setItem("userType", "agency");
  //         setUserType("agency");
  //         setUser(res.data.name);
  //       } else {
  //         // navigate('/Login')
  //         localStorage.setItem("userType", "NA");
  //       }
  //     })
  //     .catch((err) => console.log(err));

  //   axios
  //     .get("https://cndofftakencr.in/api/plantHome", { withCredentials: true })
  //     .then((res) => {
  //       if (res.data.Status === "Success") {
  //         localStorage.setItem("userType", "plant");
  //         setUserType("plant");
  //         setUser(res.data.name);
  //       } else {
  //         localStorage.setItem("userType", "NA");
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  const vnn = location.pathname === "true";

  // const [visits, setVisits] = useState(0);
  // const hasHit = useRef(false);

  // useEffect(() => {
  //   if (hasHit.current) return; // prevent duplicate call in StrictMode
  //   hasHit.current = true;

  //   if (!sessionStorage.getItem("visitRecorded")) {
  //     axios
  //       .post("https://cndofftakencr.in/api/visitHit")
  //       .then((res) => {
  //         setVisits(res.data.count);
  //         sessionStorage.setItem("visitRecorded", "true"); // block further hits
  //       })
  //       .catch((err) => {
  //         console.error("Error updating visits", err);
  //       });
  //   } else {
  //     // Just get the count
  //     axios
  //       .get("https://cndofftakencr.in/api/visitHitCount")
  //       .then((res) => setVisits(res.data.count))
  //       .catch((err) => console.error("Error getting visit count", err));
  //   }
  // }, []);

  // console.log(JSON.parse(getCookie("userRegisteredData") || "{}"));

  const userData = JSON.parse(getCookie("userRegisteredData") || "{}");
  console.log(userData.name); // "Kaushal Chaudhary"
  console.log(userData.mobile); // "8059071176"


    return (
    <div className="flex flex-col min-h-screen">
        {/* <UserPopupForm
        showForm={showForm}
        setShowForm={setShowForm}
        formData={formData}
        setFormData={setFormData}
      /> */}
      <Header visits = {visits}/>
      <div className="">
      <Navbar userType={usrType} user={usr} />
      {/* <div className="flex items-center gap-2.5">
  {vnn && (
    <img
      src={vnnImg}
      alt="VNN Logo"
      className="h-10 w-auto rounded"
    />
  )}
  <img
    src={SwachhLogo}
    alt="Swachh Logo"
    className="h-10 w-auto rounded"
  />

  <div className="flex flex-col justify-center bg-white px-2.5 rounded-md leading-snug">
    <div className="font-bold text-lg">
      {getCookie("userRegistered") ? (
        <span>{userData.name || ""}</span>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="text-blue-600 font-semibold"
        >
          User Register
        </button>
      )}
    </div>

    <div>
      {userType === "agency" ? (
        <Link
          to="/agency-home"
          className="text-base font-bold text-blue-600 hover:underline"
        >
          Agency Admin
        </Link>
      ) : userType === "plant" ? (
        <Link
          to="/plant-home"
          className="text-base font-bold text-blue-600 hover:underline"
        >
          Plant Admin
        </Link>
      ) : userType === "superAdmin" ? (
        <Link
          to="/s_admin"
          className="text-base font-bold text-blue-600 hover:underline"
        >
          Super Admin
        </Link>
      ) : (
        <Link
          to="/Login"
          className="text-base font-bold text-blue-600 hover:underline"
        >
          Admin Login
        </Link>
      )}
    </div>
  </div>
</div> */}
</div>

      <main className="flex-grow">
        <Outlet context={{usrType,setUsrType,usr,setUsr, vnn}} />
      </main>
      <Development />

      <Footer />
    </div>
  );
};

export default Layout;