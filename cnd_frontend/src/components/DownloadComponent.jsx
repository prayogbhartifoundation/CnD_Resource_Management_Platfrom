import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Regulatory from "./Regulatory";
import { getCookie } from "../data/cookieHelpers";
import axios from "axios";
import Guidelines from "./Guidelines";
import Publications from "./Publications";
import Circular from "./Circular";
import TestReports from "./TestReports";
import OtherReports from "./OtherReports";
import regulatory_icon from "../assets/regulatory.png";
import policy_icon from "../assets/policy.png";

import guideline_icon from "../assets/guideline.png";

import publication_icon from "../assets/publication.png";

import circular_icon from "../assets/circulars.png";

import test_icon from "../assets/test_reports.png";

import other_reports_icon from "../assets/others_report.png";
import Policy from "./Policy";


const DownloadComponent = ({

  setShowForm,
  //   isRegistered,
  formData,
  setFormData,

}) => {

  const location = useLocation();
  const { downloadIndex } = location.state || "";

  const [activeNav, setActiveNav] = useState(downloadIndex || 0);
  const [editable, setEditable] = useState(false);
  const [editOn, setEditOn] = useState(false);

  const [agency, setAgency] = useState({});

  // const user = JSON.parse(localStorage.getItem("user")); // Parse the stored string
  // const agencyId = user?.agencyId; // Use optional chaining to avoid errors

  useEffect(() => {
    if (downloadIndex !== undefined) {
      setActiveNav(downloadIndex);
    }
  }, [downloadIndex]);

  const agencyId = localStorage?.user;
  useEffect(() => {
    console.log(agencyId);

    const getAgencies = () => {
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

    axios
      .get("https://cndofftakencr.in/api/agencyHome", { withCredentials: true })
      .then((res) => {
        console.log(res);

        if (res.data.Status === "Success") {
          console.log(res.data.name);

          res.data.name === agencyId ? setEditable(true) : setEditable(false);
          getAgencies();

          // navigate("/agency-home");
        } else {
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const navItems = [
    {
      name: "Regulatory / Policy",
      icon: regulatory_icon,
      element: (
        <Regulatory
          user={editable ? agencyId : ""}
          agency={agency?.agency}
          setShowForm={setShowForm}
          // isRegistered={!getCookie("userRegistered")}
          isRegistered={!!getCookie("userRegistered")}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    // {
    //   name: "Policy",
    //   icon: policy_icon,
    //   element: (
    //     <Policy
    //       user={editable ? agencyId : ""}
    //       agency={agency?.agency}
    //       setShowForm={setShowForm}
    //       isRegistered={!!getCookie("userRegistered")}
    //       formData={formData}
    //       setFormData={setFormData}
    //     />
    //   ),
    // },
    {
      name: "Guidelines",
      icon: guideline_icon,
      element: (
        <Guidelines
          user={editable ? agencyId : ""}
          agency={agency?.agency}
          setShowForm={setShowForm}
          isRegistered={!!getCookie("userRegistered")}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      name: "Publications",
      icon: publication_icon,
      element: (
        <Publications
          user={editable ? agencyId : ""}
          agency={agency?.agency}
          setShowForm={setShowForm}
          isRegistered={!!getCookie("userRegistered")}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      name: "Circulars",
      icon: circular_icon,
      element: (
        <Circular
          user={editable ? agencyId : ""}
          agency={agency?.agency}
          setShowForm={setShowForm}
          isRegistered={!!getCookie("userRegistered")}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    // =================================================================================
    // {
    //   name: "Compliance Reports",
    //   icon: "🧱",
    //   element: (
    //     <ComplianceReports
    //       user={""}
    //       agency={agency}
    //       setShowForm={setShowForm}
    //       isRegistered={!getCookie("userRegistered")}
    //       formData={formData}
    //       setFormData={setFormData}
    //     />
    //   ),
    // },
    // ==============================================================================
    {
      name: "Test Reports",
      icon: test_icon,
      element: (
        <TestReports
          user={""}
          agency={agency}
          setShowForm={setShowForm}
          isRegistered={!!getCookie("userRegistered")}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    // =====================================================================================
    // {
    //   name: "MOM Reports",
    //   icon: "🧱",
    //   element: (
    //     <MomReports
    //       user={""}
    //       agency={agency}
    //       setShowForm={setShowForm}
    //       isRegistered={!getCookie("userRegistered")}
    //       formData={formData}
    //       setFormData={setFormData}
    //     />
    //   ),
    // },
    // ================================================================================
    {
      name: "Other Informations",
      icon: other_reports_icon,
      element: (
        <OtherReports
          user={""}
          agency={agency}
          setShowForm={setShowForm}
          isRegistered={!!getCookie("userRegistered")}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
  ];

  return (
    //        <div className="flex min-h-screen w-full border border-gray-300">
    //   {/* Sidebar */}
    //   <aside className="w-[250px] bg-green-700 text-white flex flex-col p-2.5">
    //     <button className="bg-white text-green-700 px-4 py-2 font-bold mb-2 rounded">
    //       Downloads
    //     </button>

    //     <nav>
    //       {navItems.map((item, index) => (
    //         <button
    //           key={index}
    //           className={`flex items-center gap-4 w-full text-left text-lg px-2.5 py-2 cursor-pointer hover:bg-white/20 rounded-md ${
    //             activeNav === index ? "bg-red-200/20" : ""
    //           }`}
    //           onClick={() => setActiveNav(index)}
    //         >
    //           <img
    //       src={item.icon}
    //       alt={item.name}
    //       className="w-8 h-8 object-contain"
    //     />
    //           <span>{item.name}</span>
    //         </button>
    //       ))}
    //     </nav>
    //   </aside>

    //   {/* Main Content */}
    //   <main className="flex-1 p-5 bg-gray-100 flex flex-col">
    //     {navItems[activeNav].element}
    //   </main>
    // </div>

    <div className="flex flex-col md:flex-row min-h-screen w-full border border-gray-300">
      {/* Sidebar */}
      <aside className="w-full md:w-[250px] bg-green-700 text-white flex flex-col p-3 md:p-2.5">
        <button className="bg-white text-green-700 px-4 py-2 font-bold mb-3 rounded w-full md:w-auto text-center">
          Downloads
        </button>

        <nav className="flex md:flex-col flex-wrap justify-center gap-2 md:gap-0">
          {navItems.map((item, index) => (
            <React.Fragment key={index}>
              <button
                className={`flex items-center justify-center md:justify-start gap-2 md:gap-4 w-full text-left text-base md:text-lg px-3 py-2 cursor-pointer hover:bg-white/20 rounded-md ${activeNav === index ? "bg-red-200/20" : ""
                  }`}
                onClick={() => setActiveNav(index)}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-6 h-6 md:w-8 md:h-8 object-contain"
                />
                <span className="truncate">{item.name}</span>
              </button>

              {item.name === "Publications" && <hr />}
            </React.Fragment>
          ))}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 md:p-5 bg-gray-100 flex flex-col overflow-auto">
        {navItems[activeNav].element}
      </main>
    </div>

  )
};

export default DownloadComponent;