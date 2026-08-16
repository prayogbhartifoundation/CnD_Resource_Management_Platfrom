import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Agency from "./pages/Agency";
import DashboardPage from "./pages/DashboardPage";
import Download from "./pages/Download";
import ContactPage from "./pages/ContactPage";
import { useEffect, useRef, useState } from "react";
import Layout from "./Layout";
import AgencyHome from "./pages/AgencyHome";
import LoginNewPage from "./pages/LoginNewPage";
import VNNProcessForm from "./pages/vnnProcessForm/VNNProcessForm";
import VNNProcessData from "./pages/vnnProcessForm/VNNProcessData";
import { getCookie } from "./data/cookieHelpers";
import axios from "axios";
import CleanDeptOfftake from "./pages/CleanDeptOfftake";
import OfftakeStatusPage from "./pages/OfftakeStatusPage";
import PlantPage from "./pages/PlantPage";
import DepartmentPage from "./pages/DepartmentPage";
import CityWiseOfftakeAnalytics from "./pages/CityWiseOfftakeAnalytics";
import ProdImageUpload from "./pages/ProdImageUpload";
import OfftakeTargetUpload from "./pages/OfftakeTargetUpload";
import AgencyResetPassword from "./pages/AgencyResetPassword";
import PlantResetPassword from "./pages/PlantResetPassword";

import PlantHome from "./pages/plantPages/PlantHome";
import AdminPage from "./pages/AdminPage";
import UserPopupForm from "./components/UserPopupForm";
import ScrollToTop from "./data/scrollToTop";
import SuperAdminLogin from "./components/superAdminPages/SuperAdminLogin";
import SuperAdminHome from "./components/superAdminPages/SuperAdminHome";
import EditProductProperties from "./components/EditProductProperties";
import EditDeptProperties from "./components/EditDeptProperties";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    organisation: "",
  });
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [propData, setPropData] = useState(0);

  const [userType, setUserType] = useState(localStorage.getItem("userType"));
  const [user, setUser] = useState(localStorage.getItem("user"));

  // const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://cndofftakencr.in/api/agencyHome", { withCredentials: true })
      .then((res) => {
        console.log(res);

        if (res.data.Status === "Success") {
          localStorage.setItem("userType", "agency");
          setUserType("agency");
          setUser(res.data.name);
        } else {
          // navigate('/Login')
          localStorage.setItem("userType", "NA");
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("https://cndofftakencr.in/api/plantHome", { withCredentials: true })
      .then((res) => {
        if (res.data.Status === "Success") {
          localStorage.setItem("userType", "plant");
          setUserType("plant");
          setUser(res.data.name);
        } else {
          localStorage.setItem("userType", "NA");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const vnn = localStorage.getItem("vnn") === "true";

  const [visits, setVisits] = useState(0);
  const hasHit = useRef(false);

  useEffect(() => {
    if (hasHit.current) return; // prevent duplicate call in StrictMode
    hasHit.current = true;

    if (!sessionStorage.getItem("visitRecorded")) {
      axios
        .post("https://cndofftakencr.in/api/visitHit")
        .then((res) => {
          setVisits(res.data.count);
          sessionStorage.setItem("visitRecorded", "true"); // block further hits
        })
        .catch((err) => {
          console.error("Error updating visits", err);
        });
    } else {
      // Just get the count
      axios
        .get("https://cndofftakencr.in/api/visitHitCount")
        .then((res) => setVisits(res.data.count))
        .catch((err) => console.error("Error getting visit count", err));
    }
  }, []);

  // console.log(JSON.parse(getCookie("userRegisteredData") || "{}"));

  const userData = JSON.parse(getCookie("userRegisteredData") || "{}");
  console.log(userData.name); // "Kaushal Chaudhary"
  console.log(userData.mobile); // "8059071176"

  return (
    <>
      <BrowserRouter>
      <ScrollToTop/>
        <Routes>
          <Route
            element={
              <Layout
                usrType={userType}
                setUsrType={setUserType}
                usr={user}
                setUsr={setUser}
                visits={visits}
              />
            }
          >
            <Route
              path="/"
              element={<Home setPropData={setPropData} vnn={false} />}
            />
            <Route
              path="/vnn"
              element={<Home setPropData={setPropData} vnn={true} />}
            />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route
              path="/download"
              element={
                <Download
                  setShowForm={setShowForm}
                  isRegistered={!!getCookie("userRegistered")}
                  formData={formData}
                  setFormData={setFormData}
                />
              }
            />
            <Route
            path="/reset-password-plant"
            element={<PlantResetPassword />}
          />
            <Route path="/agency" element={<Agency />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/OfftakeMis" element={<DashboardPage dashIndex={1} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/agency-home"
              element={
                <AgencyHome
                  usrType={userType}
                  setUsrType={setUserType}
                  usr={user}
                  setUsr={setUser}
                />
              }
            />
            <Route
              path="/login"
              element={
                <LoginNewPage
                  usrType={userType}
                  setUsrType={setUserType}
                  usr={user}
                  setUsr={setUser}
                />
              }
            />
            <Route path="/vnnProcessingForm" element={<VNNProcessForm />} />
            <Route path="/vnnProcessingData" element={<VNNProcessData />} />
            <Route path="/cleanDeptOfftake" element={<CleanDeptOfftake />} />
            {/* <Route path="/offtake" element={<OfftakeStatusPage />} /> */}
            <Route path="/plant" element={<PlantPage plantInfo={propData} />} />
            <Route path="/department" element={<DepartmentPage />} />
            <Route
              path="/deptWiseOfftake"
              element={<CityWiseOfftakeAnalytics />}
            />
            <Route path="/productImgUpload" element={<ProdImageUpload />} />
            <Route path="/editProducts" element={<EditProductProperties />} />
            <Route path="/editDepts" element={<EditDeptProperties />} />
            <Route
              path="/offtakeTargetUpload"
              element={<OfftakeTargetUpload />}
            />

            <Route path="/reset-password" element={<AgencyResetPassword />} />
            <Route
              path="/plant-home"
              element={
                <PlantHome
                  usrType={userType}
                  setUsrType={setUserType}
                  usr={user}
                  setUsr={setUser}
                />
              }
            />

            <Route path="/admin" element={<AdminPage />} />
          <Route path="/s_admin-login" element={<SuperAdminLogin />} />
          <Route path="/s_admin" element={<SuperAdminHome />} />

          </Route>
        </Routes>
        <UserPopupForm
          showForm={showForm}
          setShowForm={setShowForm}
          formData={formData}
          setFormData={setFormData}
        />
      </BrowserRouter>
    </>
  );
}

export default App;
