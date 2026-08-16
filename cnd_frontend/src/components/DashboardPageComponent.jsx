import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import Overview from "./Overview";
import OfftakeMIS from "./OfftakeMIS";
import axios from "axios";
import VaranasiWeightBridge from "../pages/VaranasiWeightBridge";
import overview_icon from "../assets/Overview.png";
import offtake_icon from "../assets/Offtake.png";

const navItems = [
  { name: "Overview", icon: overview_icon, element: <Overview /> },
  { name: "Offtake MIS", icon: offtake_icon, element: <OfftakeMIS detailView={true}/> },
  { name: "VNN WeightBridge", element: <VaranasiWeightBridge /> },
];

const DashboardPageComponent = () => {
  const vnn = localStorage.getItem("vnn") === "true";
  const location = useLocation();
  // const { dashIndex } = location.state || "";

  const dashIndex = location.state?.dashIndex ?? 0;



  const [activeNav, setActiveNav] = useState(dashIndex || 0);
  const [agency, setAgency] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const userType = localStorage.getItem("userType");
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (dashIndex !== undefined) {
      // alert(dashIndex)
      setActiveNav(dashIndex);
    }
  }, [dashIndex]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const getAgencies = () => {
      axios
        .get("https://cndofftakencr.in/api/getAgency/" + user)
        .then((res) => {
          if (res.data.Status === "Success") {
            setAgency(res.data.data[0]);
          } else {
            alert("something wrong, check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };

    getAgencies();
  }, [userType, user, dashIndex]);

const navigate = useNavigate();

const handleNavClick = (index) => {
  setActiveNav(index);

  // reset router state when using sidebar
  navigate("/dashboard", { replace: true, state: { dashIndex: index } });

  if (isMobile) setIsSidebarOpen(false);
};


  return (
    <div className="flex w-full min-h-screen relative overflow-hidden">
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[35]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile ? 'fixed top-[18rem] h-full z-[36]' : 'relative'}
          w-[220px] bg-green-700 text-white flex flex-col p-2.5
          transition-transform duration-300 ease-in-out
          border-r border-[#c9c7c7]
        `}
      >
        {/* Mobile Toggle button inside sidebar (right edge) */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-2 right-[-2.5rem] bg-green-700 p-2.5 rounded-md text-white shadow-lg hover:bg-green-800 transition-all"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        )}

        <button className="bg-white text-orange-700 p-2.5 font-bold mb-2.5 rounded-md text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          Dashboard 
          {/* {userType}{user} */}
        </button>
        
        <nav className="flex flex-col gap-1">
          {navItems.map((item, index) => {
            if(!agency?.agency?.includes("Indo Enviro") && user !== 'A003_P011'){
              if(item.name === "VNN WeightBridge") return null;
            }
            if(vnn && item.name === "Offtake MIS") return null;
            if(vnn && item.name === "Overview") return null;
            
            return(
              <button 
                key={index} 
                className={`
                  flex items-center gap-3 bg-transparent text-white border-none 
                  p-2.5 text-left text-base w-full cursor-pointer 
                  hover:bg-white/20 rounded transition-colors
                  ${activeNav === index ? "bg-[rgba(252,150,150,0.2)]" : ""}
                `}
                onClick={() => handleNavClick(index)}
              >
                {item.icon && (
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-7 h-7 object-contain flex-shrink-0"
                  />
                )}
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Toggle Button (Mobile Only, outside sidebar) */}
      {isMobile && !isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`
            fixed z-[37] bg-green-700 text-white p-2.5 
            shadow-lg hover:bg-green-800 transition-all duration-300 ease-in-out
            right-4 top-[4.5rem] rounded-md
          `}
          aria-label="Open Sidebar"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Main Content */}
      <main 
        className={`
          flex-1 min-h-screen bg-[#f5f5f5] 
          transition-all duration-300 ease-in-out
          ${isMobile ? 'w-full ' : ''}
        `}
      >
        <div className="w-full h-full">
          {(agency?.agency?.includes("Indo Enviro") || user === 'A003_P011') && activeNav === navItems.length
            ? <VaranasiWeightBridge />
            : navItems[activeNav]?.element}
        </div>
      </main>
    </div>
  );
};

export default DashboardPageComponent;
