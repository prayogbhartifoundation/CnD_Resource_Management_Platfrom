import product from "../assets/product.png";
import inventory from "../assets/inventory.png";
import department from "../assets/department.png";
import offtake_status from "../assets/offtake_status.png";
import dept_wise from "../assets/dept_wise.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";

const features = [
  { title: "Product List", icon: product },
  { title: "Total Inventory", icon: inventory },
  { title: "Department List", icon: department },
  { title: "Offtake Status", icon: offtake_status },
  { title: "Dept. Wise Offtake Analytics", icon: dept_wise },
];

const btnGroup = [
  {
    // logo: "📦",
    logo: product,
    title: "Products List",
    navigate: "/products",
  },
  {
    // logo: "🏛️",
    logo: department,
    title: "Department List",
    navigate: "/department",
  },
  {
    // logo: "🚛",
    logo: offtake_status,
    title: "Offtake Status",
    navigate: "/dashboard",
  },
  {
    // logo: "🏢",
    logo: inventory,
    title: "Total Inventory",
    navigate: "/inventory",
  },
  {
    logo: dept_wise,
    title: "Dept. Wise Offtake Analytics",
    navigate: "/deptWiseOfftake",
  },
];

const vnnbtnGroup = [
  {
    logo: inventory,
    title: "Varanasi Nagar Nigam",
    navigate: "/agency",
  },

  {
    logo: dept_wise,
    title: "Weghtbridge",
    navigate: "/dashboard",
  },
  //  {
  //   logo: "📃",
  //   title: "VNN Processing Form",
  //   navigate: "/vnnProcessingForm",
  // },
  {
    logo: offtake_status,
    title: "VNN Processing Data",
    navigate: "/vnnProcessingData",
  },

];



const Features = () => {



  const scrollContainerRef = useRef(null);

  const vnn = localStorage.getItem("vnn") === "true";

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 200;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const navigate = useNavigate();


  return (
    <>


      {/* <div className="flex items-center gap-4 w-full overflow-hidden bg-[#F8F9FA] px-2.5 py-1 mt-12">
  <button
    className="text-white rounded-md h-full flex items-center justify-center mx-1 transition-colors"
    onClick={() => scroll("left")}
  >
    <FontAwesomeIcon
      icon={faCircleChevronLeft}
      size="lg"
      style={{ color: "#07426a" }}
    />
  </button>

  <div
    className="flex overflow-x-auto scroll-smooth no-scrollbar w-[calc(100%-80px)] py-2"
    ref={scrollContainerRef}
  >
    {(vnn ? vnnbtnGroup : btnGroup).map((item, index) => (
      <div
        key={index}
        className="bg-[#f7f7f7] min-w-[100px] mx-2 px-5 py-2.5 rounded-lg font-semibold text-[#4a47a3] 
                   text-center flex items-center justify-center flex-shrink-0 shadow-[1px_1px_2px_2px_#80D3D4] 
                   cursor-pointer transition-all duration-300"
        onClick={() => {
          if (vnn) {
            if (item.title === "Varanasi Nagar Nigam") {
              navigate(item.navigate, { state: { agencyId: "vnn" } });
            } else if (item.title === "Weghtbridge") {
              navigate(item.navigate, { state: { dashIndex: 2 } });
            } else {
              navigate(item.navigate);
            }
          } else {
            navigate(item.navigate);
          }
        }}
      >
        <div className="text-2xl relative -top-[2px] text-center">
          <span>{item.logo}</span>
        </div>
        <span>{item.title}</span>
      </div>
    ))}
  </div>

  <button
    className="text-white rounded-md h-full flex items-center justify-center mx-1 transition-colors"
    onClick={() => scroll("right")}
  >
    <FontAwesomeIcon
      icon={faCircleChevronRight}
      size="lg"
      style={{ color: "#07426a" }}
    />
  </button>
</div> */}

      <div id="features" className="flex items-center gap-4 w-full overflow-hidden bg-blue-50 px-6 py-6">
        {/* Left Scroll Button */}
        <button
          className="text-white rounded-md h-full flex items-center justify-center mx-1 transition-colors"
          onClick={() => scroll("left")}
        >
          <FontAwesomeIcon
            icon={faCircleChevronLeft}
            size="lg"
            style={{ color: "#07426a" }}
          />
        </button>

        {/* Scrollable Container */}
        <div
          className="flex overflow-x-auto scroll-smooth justify-between no-scrollbar w-[calc(100%-80px)] py-2"
          ref={scrollContainerRef}
        >
          {(vnn ? vnnbtnGroup : btnGroup).map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center flex-shrink-0 mx-3"
              onClick={() => {
                if (vnn) {
                  if (item.title === "Varanasi Nagar Nigam") {
                    navigate(item.navigate, { state: { agencyId: "vnn" } });
                  } else if (item.title === "Weghtbridge") {
                    navigate(item.navigate, { state: { dashIndex: 2 } });
                  } else {
                    navigate(item.navigate);
                  }
                } else {
                  navigate(item.navigate);
                }
              }}
            >
              {/* Card with icon */}
              <div className="w-[10rem] h-[10rem] shadow-lg rounded-xl flex items-center justify-center">
               { item.logo && <img src={item.logo} alt={item.title} width={80} className="h-[9rem] object-contain hover:cursor-pointer" />}

              </div>

              {/* Title */}
              <p className="mt-3 text-md font-semibold text-gray-800 text-center hover:cursor-pointer">
                {item.title}
              </p>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          className="text-white rounded-md h-full flex items-center justify-center mx-1 transition-colors"
          onClick={() => scroll("right")}
        >
          <FontAwesomeIcon
            icon={faCircleChevronRight}
            size="lg"
            style={{ color: "#07426a" }}
          />
        </button>
      </div>
    </>

  );
}

export default Features;
