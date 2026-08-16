import { Link } from "react-router-dom";
import cnd_logo from "../assets/cnd_logo.jpeg";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import admin_icon from "../assets/admin.png";
import { Menu, X } from "lucide-react";

function Navbar({ userType, user }) {
  const [expBoxOpen, setExpBoxOpen] = useState(null);
  const [agencyList, setAgencyList] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [agency, setAgency] = useState({});
  const navRef = useRef(null);

  const vnn = localStorage.getItem("vnn") === "true";
  console.log(userType, user);

  useEffect(() => {
    const getAgencies = async () => {
      try {
        const res = await axios.get("https://cndofftakencr.in/api/getAgencies");
        if (res.data.Status?.toLowerCase() === "success") {
          setAgencyList(res.data.data);
        } else {
          alert("Something went wrong, check logs!");
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getAgency = () => {
      axios
        .get("https://cndofftakencr.in/api/getAgency/" + user)
        .then((res) => {
          if (res.data.Status === "Success") {
            setAgency(res.data.data[0]);
          } else {
            alert("Something wrong, check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };

    getAgencies();
    getAgency();
  }, [userType, user]);

  // Close dropdown & mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setExpBoxOpen(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navData = [
    { name: "Home", to: "/", expandable: false },
    {
      name: "Products",
      to: "/product",
      expandable: true,
      expandedBox: (
        <ul className="py-2">
          <li className="px-4 py-2 hover:bg-gray-100 border border-[#EAEAEA]">
            <Link to="/products" onClick={() => setExpBoxOpen(null)}>
              Products List
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-100 border border-[#EAEAEA]">
            <Link to="/inventory" onClick={() => setExpBoxOpen(null)}>
              Inventory
            </Link>
          </li>
        </ul>
      ),
    },
    {
      name: "Agencies",
      to: "/agency",
      expandable: true,
      expandedBox: (
        <ul className="py-2">
          {agencyList.map((agencyItem, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 border border-[#EAEAEA]"
            >
              <Link
                to="/agency"
                state={{ agencyId: agencyItem.agencyId }}
                onClick={() => setExpBoxOpen(null)}
              >
                {agencyItem.agency}
              </Link>
            </li>
          ))}
        </ul>
      ),
    },
    {
      name: "Dashboard",
      to: "/dashboard",
      expandable: true,
      expandedBox: (
        <ul className="py-2">
          <li className="px-4 py-2 hover:bg-gray-100 border border-[#EAEAEA]">
            <Link
              to="/dashboard"
              state={{ dashIndex: 0 }}
              onClick={() => setExpBoxOpen(null)}
            >
              Overview
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-100 border border-[#EAEAEA]">
            <Link
              to="/dashboard"
              state={{ dashIndex: 1 }}
              onClick={() => setExpBoxOpen(null)}
            >
              Offtake MIS
            </Link>
          </li>
          {(agency?.agency?.includes("Indo Enviro") ||
            user === "A003_P011") && (
            <li className="px-4 py-2 hover:bg-gray-100 border border-[#EAEAEA]">
              <Link
                to="/dashboard"
                state={{ dashIndex: 2 }}
                onClick={() => setExpBoxOpen(null)}
              >
                VNN WeighBridge
              </Link>
            </li>
          )}
        </ul>
      ),
    },
    {
      name: "Downloads",
      to: "/download",
      expandable: true,
      expandedBox: (
        <ul className="py-2">
          {[
            "Regulatory / Policy",
            "Guidelines",
            "Publications",
            "Circulars",
            "Test Reports",
            "Other Informations",
          ].map((item, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-gray-100 border border-[#EAEAEA]"
            >
              <Link
                to="/download"
                state={{ downloadIndex: idx }}
                onClick={() => setExpBoxOpen(null)}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      ),
    },
    { name: "Contact Us", to: "/contact", expandable: false },
  ];

  const vnnNavData = [
    {
      name: "Home",
      to: "/vnn",
      expandable: false,
      onhover: () => {
        setExpBoxOpen(null);
      },
    },

    {
      name: "Agencies",
      to: "/agencies",
      expandable: true,
      onhover: () => {
        setExpBoxOpen(expBoxOpen === 1 ? null : 1);
      },
      expandedBox: (
        <>
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100 border border-[#EAEAEA]">
              <Link to="/agency" state={{ agencyId: "vnn" }}>
                {"Varanasi Nagar Nigam"}
              </Link>
            </li>
          </ul>
        </>
      ),
    },

    {
      name: "Processing",
      to: "/vnnProcessingForm",
      expandable: true,
      onhover: () => {
        setExpBoxOpen(expBoxOpen === 2 ? null : 2);
      },
      expandedBox: (
        <>
          <ul className="py-2">
            {(user === "A001_P007" || user === "A001") && (
              <li className="px-4 py-2 hover:bg-gray-100 border border-[#EAEAEA]">
                <Link to="/vnnProcessingForm" state={{ dashIndex: 2 }}>
                  VNN Processing Submission
                </Link>
              </li>
            )}
            <li className="px-4 py-2 hover:bg-gray-100 border border-[#EAEAEA]">
              <Link to="/vnnProcessingData" state={{ dashIndex: 2 }}>
                VNN Processing Report
              </Link>
            </li>
          </ul>
        </>
      ),
    },
    {
      name: "Dashboard",
      to: "/dashboard",
      expandable: true,
      onhover: () => {
        setExpBoxOpen(expBoxOpen === 3 ? null : 3);
      },
      expandedBox: (
        <>
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100 border border-[#EAEAEA]">
              <Link to="/dashboard" state={{ dashIndex: 2 }}>
                VNN WeighBridge
              </Link>
            </li>
          </ul>
        </>
      ),
    },

    // {
    //   name: "Contact Us",
    //   to: "/contact",
    //   expandable: false,
    //   onhover: () => {},
    // },
  ];

  return (
    <nav ref={navRef} className="bg-white shadow-md relative">
      <div className="w-full mx-auto px-2 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo - Left */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img src={cnd_logo} alt="Logo" className="h-14 object-contain" />
          </Link>
        </div>

        {/* Desktop Nav - Center */}
        <div className="flex-1 hidden md:flex justify-center">
          <ul className="flex space-x-8 font-medium text-green-800">
            {(vnn ? vnnNavData : navData).map((item, index) => (
              <li
                key={index}
                className="relative cursor-pointer"
                onClick={() =>
                  item.expandable &&
                  setExpBoxOpen(expBoxOpen === index ? null : index)
                }
              >
                {item.expandable ? (
                  <>
                    <span className="hover:text-green-600 flex items-center gap-1">
                      {item.name} <span>▼</span>
                    </span>

                    {expBoxOpen === index && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-full left-0 mt-2 w-52 bg-white shadow-lg rounded-md border z-50"
                      >
                        {item.expandedBox}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={item.to} className="hover:text-green-600">
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Admin - Right */}
        <div className="hidden md:flex flex-shrink-0">
          {userType === "agency" ? (
            <Link
              to="/agency-home"
              className="hover:text-green-600 font-medium text-green-800"
            >
              Agency Admin
            </Link>
          ) : userType === "plant" ? (
            <Link
              to="/plant-home"
              className="hover:text-green-600 font-medium text-green-800"
            >
              Plant Admin
            </Link>
          ) : userType === "master" ? (
            <Link
              to="/s_admin"
              className="hover:text-green-600 font-medium text-green-800"
            >
              Master Admin
            </Link>
          ) : (
            <Link
              to="/Login"
              className="flex items-center gap-2 text-green-800 font-medium hover:text-green-600"
            >
              <img src={admin_icon} className="w-5 h-5" />
              <span>login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-auto text-green-800"
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* ✅ Improved Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-4 py-4 space-y-3">
          {navData.map((item, index) => (
            <div key={index}>
              {item.expandable ? (
                <>
                  <button
                    className="w-full flex justify-between items-center text-green-800 font-medium"
                    onClick={() =>
                      setExpBoxOpen(expBoxOpen === index ? null : index)
                    }
                  >
                    {item.name}
                    <span>{expBoxOpen === index ? "▲" : "▼"}</span>
                  </button>

                  {expBoxOpen === index && (
                    <div className="pl-3 mt-2 space-y-2">
                      {item.expandedBox}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.to}
                  className="block text-green-800 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}

          {/* Mobile Admin */}
          <div className="pt-4 border-t">
        
            {userType ? (
              <Link
                to={
                  userType === "agency"
                    ? "/agency-home"
                    : userType === "plant"
                    ? "/plant-home"
                    : "/s_admin"
                }
                className="block text-green-800 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {userType === "master"
                  ? "Master Admin"
                  : userType === "plant"
                  ? "Plant Admin"
                  : "Agency Admin"}
              </Link>
            ) : (
              <Link
                to="/Login"
                className="flex items-center gap-2 text-green-800 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img src={admin_icon} className="w-5 h-5" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
