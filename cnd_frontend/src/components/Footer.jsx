import cnd_logo from "../assets/cnd_logo.jpeg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import emailIcon from "../assets/email.png"; // your email icon
import phoneIcon from "../assets/phone.png"; // your phone icon
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Footer() {

   const [utilData, setUtilData] = useState([]);


  useEffect(() => {
  
    
    const getUtils = () => {
      axios
        .get("https://cndofftakencr.in/api/util_get")
        .then((res) => {
          console.log(res);
          if (res.data.Status === "Success") {
            setUtilData(res.data.data);
          } else {
            alert("something wrong,3 check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };

    getUtils();
  }, []);


  return (
 <footer className="bg-green-800 text-white px-6 sm:px-10 py-12 font-['Segoe_UI',sans-serif]">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
    
    {/* Logo & Description */}
    <div>
      <img src={cnd_logo} alt="C&D Logo" className="h-16 mb-4" />
      <p className="text-sm leading-relaxed text-gray-200">
        <span className="font-semibold text-white">C&D Offtake NCR</span> is a
        monitoring and management portal dedicated to tracking the offtake and
        utilization of construction and demolition (C&D) waste across the
        National Capital Region.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
      <ul className="space-y-2 text-sm">
        <li>
          <a href="#" className="hover:text-gray-300 transition-colors duration-200">
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300 transition-colors duration-200">
            Disclaimer
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300 transition-colors duration-200">
            Help
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300 transition-colors duration-200">
            Terms & Conditions
          </a>
        </li>
      </ul>
    </div>

    {/* Resources */}
    <div>
      <h4 className="text-lg font-semibold mb-4">Site Map</h4>
      <ul className="space-y-2 text-sm">
  <li>
    <Link
      to="/dashboard"
      className="hover:text-gray-300 transition-colors duration-200"
    >
      Dashboard
    </Link>
  </li>
  <li>
    <Link
      to="/deptWiseOfftake"
      className="hover:text-gray-300 transition-colors duration-200"
    >
      Dept Wise Offtake
    </Link>
  </li>
  <li>
    <Link
      to="/inventory"
      className="hover:text-gray-300 transition-colors duration-200"
    >
      Inventory
    </Link>
  </li>
  <li>
    <Link
      to="/products"
      className="hover:text-gray-300 transition-colors duration-200"
    >
      Products
    </Link>
  </li>
</ul>
    </div>

    {/* Contact & Social */}
    <div className="flex flex-col items-start space-y-4">
      <h4 className="text-lg font-semibold mb-2">Contact Us</h4>

      <a
        href="tel:+918059071176"
        className="flex items-center gap-3 text-sm hover:text-gray-300 transition-colors duration-200"
      >
        <img src={phoneIcon} alt="Phone Icon" className="w-5 h-5" />
        <span>{utilData?.mobile ? utilData?.mobile : "+91 8059071176"}</span>
      </a>

      <a
        href="mailto:info.cnd@everenviro.com"
        className="flex items-center gap-3 text-sm hover:text-gray-300 transition-colors duration-200 break-all"
      >
        <img src={emailIcon} alt="Email Icon" className="w-5 h-5" />
        <span>{utilData?.email ? utilData?.email : "info.cnd@everenviro.com"}</span>
        {/* <span>info.cnd@everenviro.com</span> */}
      </a>

      {/* <div className="flex space-x-5 text-xl mt-3">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 transition-transform duration-200 hover:scale-110"
        >
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 transition-transform duration-200 hover:scale-110"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          href="https://x.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 transition-transform duration-200 hover:scale-110"
        >
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
      </div> */}
    </div>
  </div>

  {/* Bottom Line */}
  <div className="border-t border-green-700 mt-10 pt-6">
    <p className="text-center text-xs sm:text-sm text-gray-300 leading-relaxed">
      © {new Date().getFullYear()} C&D Offtake. Content owned, maintained, and
      updated by C&D Offtake. For any queries, please contact the concerned
      departments.
    </p>
  </div>
</footer>


  );
}

export default Footer;
