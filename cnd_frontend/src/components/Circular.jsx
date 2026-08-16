import axios from "axios";
import { useEffect, useRef, useState } from "react";
import arrow_icon from "../assets/arrow.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Circular = ({
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
  const [uploaded, setUploaded] = useState(false);

    const [uploadBoxOpen, setUploadBoxOpen] = useState(false);

  const [files, setFiles] = useState([]);
    
      const fileInputRef = useRef(null);
    
      const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files).map((file) => ({
          file,
          newName: file.name, // default name
        }));
        setFiles(selectedFiles);
      };
    
      const handleNameChange = (index, newName) => {
        const updatedFiles = [...files];
        updatedFiles[index].newName = newName;
        setFiles(updatedFiles);
      };
    
      const handleFileUpload = async () => {
        if (files.length === 0) return alert("No files selected!");
    
        const formData = new FormData();
        files.forEach(({ file, newName }) => {
          const renamedFile = new File([file], newName, { type: file.type });
          formData.append("files", renamedFile);
        });
    
        formData.append("category", "circular");
        formData.append("agency", agency);
    
        try {
          const response = await fetch("https://cndofftakencr.in/api/upload", {
            method: "POST",
            body: formData,
          });
    
          const data = await response.json();
          if (response.ok) {
            alert("Files uploaded successfully!");
            console.log("Uploaded files:", data);
            setUploaded(!uploaded);
    
            setFiles([]);
    
            if(fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          } else {
            alert(`Upload failed: ${data.message}`);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          alert("Error uploading file. Please try again.");
        }
      };
    
  

  const categories = [
    {
      name: "Detailed Assessment of Tecchnical Properties of Recycled Aggregate",
    },
    { name: "MOM" },
  ];

  useEffect(() => {
    fetchFiles();
  }, [uploaded]);

  const fetchFiles = async () => {
    try {
      const response = await fetch("https://cndofftakencr.in/api/files");
      const data = await response.json();
      setDocuments(data.filter((d) => d.category === 'circular'));
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // console.log("fil: ", filteredCategories)
  // const handleFileUpload = async (e) => {
  //   const files = e.target.files;
  //   if (!files.length) return;

  //   const formData = new FormData();
  //   for (let file of files) {
  //     formData.append("files", file);
  //   }
  //   formData.append("category", 'circular'); // Attach category info
  //   formData.append("agency", agency);

  //   try {
  //     const response = await fetch("https://cndofftakencr.in/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       setUploaded(!uploaded);
  //       alert("Files uploaded successfully!");
  //       console.log("Uploaded files:", data);
  //     } else {
  //       alert(`Upload failed: ${data.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     alert("Error uploading file. Please try again.");
  //   }
  // };

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

      window.open(`https://cndofftakencr.in/api/${doc.path}`, "_blank");
    } catch (err) {
      alert("Error logging download");
      console.error(err);
    }
  };

    return (
//         <div className="w-[95%] mx-auto my-1 rounded-lg bg-white p-5 shadow-md border border-gray-300">
//   <div className="flex justify-between items-center bg-[#02AB6A] text-gray-800 px-5 py-2 rounded-t-lg">
//     <h2 className="font-semibold text-lg">Circulars</h2>
//     <div className="flex items-center bg-white px-2 py-1 rounded">
      
//       <input
//         type="text"
//         placeholder="Search documents..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="border-none outline-none px-2 text-sm py-1 bg-white"
//       />
//       <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#07426a] mr-2" />

//     </div>
//   </div>

//   <div className="p-5 bg-white rounded-b-lg">
//     {!selectedCategory ? (
//       <ul className="list-none p-0">
//         {filteredCategories.map((category, index) => (
//           <li
//             key={index}
//             onClick={() => handleCategoryClick(category)}
//             className="flex items-center justify-between p-2 bg-[#02AB6A] text-gray-800 my-1 rounded cursor-pointer text-left border border-black font-semibold hover:bg-[#03CF85] transition-colors"
//           >

//                              <span>{category.name}</span>
// <img
//                     src={arrow_icon} // ← your arrow image path here
//                     alt="arrow"
//                     className="w-4 h-4 object-contain"
//                   />
//           </li>
//         ))}
//       </ul>
//     ) : (
//       <div className="text-center">
//         <h3 className="flex items-center justify-between px-4">
//           <span className="text-[#393735] font-semibold">{selectedCategory.name}</span>
//           <span className="inline-block cursor-pointer text-[#07426a] font-bold">
//             {user && (
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx,.xls,.xlsx"
//                 placeholder="Upload Files"
//                 multiple
//                 onChange={handleFileUpload}
//                 className="mr-2"
//               />
//             )}
//             <span onClick={handleBack} className="cursor-pointer">
//               ⬅️ Back
//             </span>
//           </span>
//         </h3>

//         <ul className="list-none p-0">
//           {documents
//             .filter((doc) => doc.category === selectedCategory.name)
//             .map((doc, index) => (
//               <li
//                 key={index}
//                 className="p-2 my-1 bg-orange-300 rounded cursor-pointer text-left flex justify-between text-[#393735] border border-black "
//               >
//                 <div
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleDownload(doc);
//                   }}
//                   className="cursor-pointer hover:underline text-[#393735] "
//                 >
//                   {doc.path.split("/").pop()}
//                 </div>
//                 <i>~ {doc?.agency}</i>
//               </li>
//             ))}
//         </ul>
//       </div>
//     )}
//   </div>
// </div>

<div className="w-[95%] mx-auto my-1 rounded-lg bg-white p-5 shadow-md border border-gray-300">
  
  {/* Topbar */}
  <div className="flex flex-wrap justify-between items-center bg-[#02AB6A] text-gray-800 px-5 py-2.5 rounded-t-lg gap-2">
    <h2 className="font-semibold text-lg sm:text-xl w-full sm:w-auto text-center sm:text-left">
      Circulars
    </h2>

    <div className="flex items-center bg-white px-2 py-1 rounded w-full sm:w-auto">
      <input
        type="text"
        placeholder="Search documents..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border-none outline-none p-1 text-sm bg-white w-full sm:w-auto"
      />
      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#07426a] mr-2" />
    </div>
  </div>

 {user && <button
        onClick={() => {setUploadBoxOpen(!uploadBoxOpen)}}
        className={`${uploadBoxOpen ? "bg-[#f65d37]" : "bg-[#02AB6A]"} text-white px-6 py-2 mt-4 rounded-lg font-medium hover:bg-[#027348] ${uploadBoxOpen ? "hover:bg-[#943821]" : "hover:bg-[#027348]"} transition w-1/4`}
      >
        {uploadBoxOpen ? "Cancel Upload" : "Upload Files"}
      </button>}

  {user && uploadBoxOpen && (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Upload Policy
          </h2>

          {/* Upload section in a row */}
          <div className="flex items-center gap-3">
            <label className="flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition w-1/2">
              <span className="text-gray-700 font-medium">Choose Files</span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            <button
              onClick={handleFileUpload}
              className="bg-[#02AB6A] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition w-1/2"
            >
              Upload Files
            </button>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Files to Upload
              </h3>

              <div className="space-y-3">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <input
                      type="text"
                      value={f.newName}
                      onChange={(e) => handleNameChange(i, e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-sm text-gray-500 ml-3">
                      {(f.file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

  {/* Content Only */}
  <div className="p-5 bg-white rounded-lg overflow-x-auto">
    <div className="text-center">
    
      <ul className="list-none p-0 mt-3 space-y-2">
        {documents
        .filter((doc) =>
            doc.path.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((doc, index) => (
          <li
            key={index}
            className="p-2 my-1 bg-orange-300 rounded cursor-pointer text-left flex flex-col sm:flex-row justify-between items-start sm:items-center text-[#393735] border border-black text-xs sm:text-sm"
          >
            <div
              onClick={(e) => {
                e.preventDefault();
                handleDownload(doc);
              }}
              className="cursor-pointer hover:underline break-all text-[#393735]"
            >
              {doc.path.split("/").pop()}
            </div>
            <i className="mt-1 sm:mt-0 text-gray-700">~ {doc?.agency}</i>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>




    )
};

export default Circular;