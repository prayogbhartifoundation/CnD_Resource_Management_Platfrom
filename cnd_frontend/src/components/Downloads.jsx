import { useState } from "react";
import map_img from "../assets/map.png";
import { Link } from "react-router-dom";
import "./styles/homeOverview.css";

function Downloads({overView}) {
  const [activeSection, setActiveSection] = useState("Overview");
  

  const menuItems = [
    "Overview",
    "Regulatory",
    "Guidelines",
    "Circulars",
    // 'Compliance Reports',
    "Test Reports",
    // 'MOM Reports',
    "Other Informations",
  ];

  const downloadIndexMap = {
    Regulatory: 0,
    Guidelines: 1,
    Publications: 2,
    Circulars: 3,
    "Test Reports": 4,
    "Other Informations": 5,
  };

  const content = {
    Overview: {
      title: "Overview",
      text: "This section of the C&D Offtake NCR website is organized into key categories such as Regulatory, Guidelines, Publications, Circulars, Compliance Reports, Test Reports, MOM Reports, and Other Reports. This section serves as a centralized repository for important documents related to construction and demolition waste management, offering users access to official notices, operational guidelines, regulatory updates, and reporting data. Designed for transparency and ease of navigation, this section caters to stakeholders like government officials, contractors, environmental consultants, and the general public. Some files may require login access, ensuring secure and authorized use of sensitive information.",
    },
    Regulatory: {
      title: "Regulatory Documents",
      text: "Access comprehensive regulatory documents related to construction and demolition waste management. These include official notifications, policy documents, and regulatory frameworks governing C&D waste handling and disposal practices.",
    },
    Guidelines: {
      title: "Guidelines",
      text: "Find detailed guidelines for proper construction and demolition waste management practices. These documents provide step-by-step instructions for compliance with environmental regulations and best practices.",
    },
    Circulars: {
      title: "Circulars",
      text: "Official circulars and notifications issued by regulatory authorities regarding C&D waste management policies, updates, and procedural changes.",
    },
    "Compliance Reports": {
      title: "Compliance Reports",
      text: "Regular compliance reports showing adherence to environmental regulations and waste management standards across various projects and facilities.",
    },
    "Test Reports": {
      title: "Test Reports",
      text: "Laboratory test reports and analysis documents related to waste characterization, environmental impact assessments, and quality control measures.",
    },
    "MOM Reports": {
      title: "MOM Reports",
      text: "Minutes of Meeting reports from various stakeholder meetings, committee discussions, and regulatory review sessions.",
    },
    "Other Reports": {
      title: "Other Reports",
      text: "Additional reports and documents that support C&D waste management operations, including research studies, case studies, and supplementary documentation.",
    },
  };

  return (
    <div className=" bg-gray-50 overview-wrapper">
      {/* Main Content Container */}
      <div className="bg-white rounded-lg shadow-lg downloads-wrapper overflow-hidden ">
        <div className="overview-title">
          <h1>Overview: Utilization of Recycled C&D Materials / Products in Delhi NCR</h1>
        </div>

        <div className="flex flex-col lg:flex-row ">
          <div className="downloads-content">
            <h2 className="downloads-title">
              {/* {content[activeSection].title} */}
            </h2>

            <div className="downloads-text  commonText" dangerouslySetInnerHTML={{ __html: overView ? overView : content[activeSection].text }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Downloads;


// {overView ? overView : content[activeSection].text}