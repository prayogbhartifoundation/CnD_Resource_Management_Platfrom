import axios from "axios";
import { useEffect, useState } from "react";
import arrow_icon from "../assets/arrow.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const OtherReports = ({
  user,
  agency,
  setShowForm,
  isRegistered,
  formData,
  setFormData,
}) => {

    const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);

  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    fetchFiles();
    fetchAgencies();
  }, [uploaded]);

  const fetchFiles = async () => {
    try {
      const response = await fetch("https://cndofftakencr.in/api/files");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const fetchAgencies = async () => {
    try {
      const response = await fetch("https://cndofftakencr.in/api/getAgencies");
      const data = await response.json();
      if (data.Status?.toLowerCase() === "success") {
        setCategories(data.data);
      } else {
        alert("Something went wrong, check logs!");
      }
    } catch (error) {
      console.error("Error fetching agencies:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter((category) =>
    category?.agency?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }
    formData.append("category", selectedCategory.name);
    formData.append("agency", agency?.agency);

    try {
      const response = await fetch("https://cndofftakencr.in/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploaded(!uploaded);
        alert("Files uploaded successfully!");
        console.log("Uploaded files:", data);
      } else {
        alert(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const handleDownload = async (doc) => {
    if (!isRegistered) {
      setShowForm(true);
      return;
    }

    try {
      // await axios.post("https://cndofftakencr.in/api/logDownload", {
      //   filePath: doc.path,
      //   name: formData?.name,
      //   email: formData?.email,
      // });

      window.open(`https://cndofftakencr.in/api/${doc.filePath}`, "_blank");
    } catch (err) {
      alert("Error logging download");
      console.error(err);
    }
  };

    return (
//     <div className="w-[95%] mx-auto my-1 rounded-lg bg-white p-5 shadow-md">
//   {/* Topbar */}
//   <div className="flex justify-between items-center bg-[#02AB6A] text-gray-800 px-5 py-2.5 rounded-t-lg">
//     <h2 className="text-lg font-semibold">Other Reports</h2>

//     <div className="flex items-center bg-white px-2 py-1 rounded-md">
//       {/* <span className="mr-1">🔍</span> */}
//       <input
//         type="text"
//         placeholder="Search documents..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="border-none outline-none px-1 py-0.5 text-sm bg-white"
//       />
//       <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#07426a] mr-2" />

//     </div>
//   </div>

//   {/* Content */}
//   <div className="p-5 bg-white rounded-b-lg">
//     {!selectedCategory ? (
//       <ul className="list-none p-0">
//         {filteredCategories.map((category, index) => (
//           <li
//             key={index}
//             onClick={() => handleCategoryClick(category)}
//             className="flex items-center justify-between px-3 py-2 bg-[#02AB6A] text-gray-800 font-semibold 
//                        my-1 rounded-md cursor-pointer text-left 
//                        border border-black transition-colors duration-300 
//                        hover:bg-[#03CF85]"
//           >
//             <span>{category.agency}</span>
//              <img
//                                 src={arrow_icon} // ← your arrow image path here
//                                 alt="arrow"
//                                 className="w-4 h-4 object-contain"
//                               />
//           </li>
//         ))}
//       </ul>
//     ) : (
//       <div className="text-center">
//         <h3 className="flex items-center justify-between px-4">
//           <span className="font-bold text-[#393735]">{selectedCategory.agency}</span>
//           <span className="flex items-center gap-3 font-semibold text-[#07426a]">
//             {user && (
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx,.xls,.xlsx"
//                 multiple
//                 onChange={handleFileUpload}
//                 className="cursor-pointer"
//               />
//             )}
//             <span className="cursor-pointer font-bold" onClick={handleBack}>
//               ⬅️ Back
//             </span>
//           </span>
//         </h3>

//         <ul className="list-none p-0 mt-3">
//           {selectedCategory.otherReports &&
//             selectedCategory.otherReports.map((doc, index) => (
//               <li
//                 key={index}
//                 className="px-3 py-2 my-1 bg-orange-300 border border-black 
//                            rounded-md cursor-pointer text-left 
//                            flex justify-between items-center"
//               >
//                 <div
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleDownload(doc);
//                   }}
//                   className="cursor-pointer"
//                 >
//                   {doc?.filePath?.split("/").pop()}
//                 </div>
//                 <i className="text-gray-700">~ {doc?.agency}</i>
//               </li>
//             ))}
//         </ul>
//       </div>
//     )}
//   </div>
// </div>

<div className="w-[95%] mx-auto my-1 rounded-lg bg-white p-5 shadow-md">
  {/* Topbar */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#02AB6A] text-gray-800 px-5 py-2.5 rounded-t-lg gap-2 sm:gap-0">
    <h2 className="text-base sm:text-lg font-semibold text-center sm:text-left w-full sm:w-auto">
      Other Informations
    </h2>

    <div className="flex items-center bg-white px-2 py-1 rounded-md w-full sm:w-auto">
      <input
        type="text"
        placeholder="Search documents..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border-none outline-none px-1 py-0.5 text-sm bg-white flex-1 min-w-0"
      />
      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#07426a] mr-2" />
    </div>
  </div>

  {/* Content */}
  <div className="p-5 bg-white rounded-b-lg overflow-x-auto">
    {!selectedCategory ? (
      <ul className="list-none p-0 space-y-2">
        {filteredCategories.map((category, index) => (
          <li
            key={index}
            onClick={() => handleCategoryClick(category)}
            className="flex items-center justify-between px-3 py-2 bg-[#02AB6A] text-gray-800 font-semibold 
                       my-1 rounded-md cursor-pointer text-left 
                       border border-black transition-colors duration-300 
                       hover:bg-[#03CF85] text-sm sm:text-base"
          >
            <span className="truncate">{category.agency}</span>
            <img
              src={arrow_icon}
              alt="arrow"
              className="w-4 h-4 object-contain flex-shrink-0"
            />
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-center">
        <h3 className="flex flex-col sm:flex-row items-center justify-between px-4 gap-3 text-sm sm:text-base">
          <span className="font-bold text-[#393735]">{selectedCategory.agency}</span>
          <span className="flex items-center flex-wrap justify-center gap-3 font-semibold text-[#07426a]">
            {user && (
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple
                onChange={handleFileUpload}
                className="cursor-pointer text-xs sm:text-sm"
              />
            )}
            <span
              className="cursor-pointer font-bold text-sm sm:text-base"
              onClick={handleBack}
            >
              ⬅️ Back
            </span>
          </span>
        </h3>

        <ul className="list-none p-0 mt-3 space-y-2">
          {selectedCategory.otherReports &&
            selectedCategory.otherReports.map((doc, index) => (
              <li
                key={index}
                className="px-3 py-2 my-1 bg-orange-300 border border-black 
                           rounded-md cursor-pointer text-left 
                           flex flex-col sm:flex-row justify-between items-start sm:items-center 
                           text-xs sm:text-sm"
              >
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(doc);
                  }}
                  className="cursor-pointer break-all"
                >
                  {doc?.filePath?.split("/").pop().slice(14)}
                </div>
                <i className="text-gray-700 mt-1 sm:mt-0">~ {doc?.agency}</i>
              </li>
            ))}
        </ul>
      </div>
    )}
  </div>
</div>


    )
};

export default OtherReports;