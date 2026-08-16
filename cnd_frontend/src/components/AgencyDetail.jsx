import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/AgencyDetailPage.css";
import vnnImg from "../assets/vnnLogo.jpg";
import defaultImg from "../assets/default.png";
import FileUploadSection from "./FileUploadSection";

const agencyLoc = {
  A003: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4090.611943398094!2d77.08631601890886!3d28.49647768302295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d193854f80fc1%3A0x4279dbdec2f8e703!2sEverEnviro%20Resource%20Management%20Private%20Limited!5e1!3m2!1sen!2sin!4v1743137897464!5m2!1sen!2sin",
  A004: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2883.773633525533!2d77.17404137451386!3d28.725625579848867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d010024d90a23%3A0xc83e647c4dd50c63!2sUttar%20Dilli%20C%26D%20waste%20Recycling%20Pvt%20Ltd!5e1!3m2!1sen!2sin!4v1743138010643!5m2!1sen!2sin",
  A005: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2885.587916996969!2d77.01326527451116!3d28.659785582844368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d055a24ed4a29%3A0xbafce95f35ddeeb9!2sC%26D%20Waste%20Plant%20(Rise%20Eleven%20Delhi%20Waste%20Management%20Co.)!5e1!3m2!1sen!2sin!4v1743138080925!5m2!1sen!2sin",
  A006: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2881.7320332936033!2d77.06736777451692!3d28.79955017647838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390da9da38554047%3A0xce34be3dac787851!2sRamky%20Enviro%20Engineers%20Ltd%20(WtE)!5e1!3m2!1sen!2sin!4v1743138132573!5m2!1sen!2sin",
};

const AgencyDetail = () => {
  const location = useLocation();
  console.log("location: ", location);
  const { agencyId } = location.state || "--";

  const [uploadBoxOpen, setUploadBoxOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  // When files are selected
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const fileData = selectedFiles.map((file) => ({
      file,
      newName: file.name.split(".")[0], // Default name (without extension)
    }));
    setFiles(fileData);
  };

  // Update name before uploading
  const handleNameChange = (index, newName) => {
    const updatedFiles = [...files];
    updatedFiles[index].newName = newName;
    setFiles(updatedFiles);
  };

  const [prodList, setProdList] = useState([]);
  const [agency, setAgency] = useState({});
  const [plantList, setPlantList] = useState([]);

  const [editable, setEditable] = useState(false);
  const [editOn, setEditOn] = useState(false);

  const [formData, setFormData] = useState({});
  const [submitted, setsubmitted] = useState({});
  const [refresh, setRefresh] = useState(true);

  const [filteredProdQnt, setFilteredProdQnt] = [];
  const vnn = localStorage.getItem("vnn") === "true";

  const updateAgencyData = async (updatedData) => {
    try {
      const response = await axios.put(
        "https://cndofftakencr.in/api/update_plantOperator",
        updatedData,
        { withCredentials: true }
      );

      if (response.data.Status === "Success") {
        alert("Agency updated successfully!");
        console.log("Updated Data:", response.data.updatedEntry);
      } else {
        alert("Failed to update agency: " + response.data.message);
      }
    } catch (err) {
      console.error("Error updating agency:", err);
      alert("Error updating agency. Please try again.");
    }
  };

  const handleUpdateAgency = () => {
    const updatedAgencyData = {
      agencyId: agencyId, // Ensure agencyId is sent
      incharge: formData.incharge || "",
      contactEmail: formData.contactEmail || "",
      mapLoc: formData.mapLoc || "",
      wasteProcessingDetails: {
        installedWasteCap:
          formData?.wasteProcessingDetails?.installedWasteCap || "",
        mobile: formData?.wasteProcessingDetails?.mobile || "",
      },
    };

    updateAgencyData(updatedAgencyData);
  };

  useEffect(() => {
    // console.log("inside usshbhbhsb");
    axios
      .get("https://cndofftakencr.in/api/agencyHome", { withCredentials: true })
      .then((res) => {
        // console.log("inside uhuhu if", res.data.Status)
        if (res.data.Status === "Success") {
          // console.log("agencydataname: ", res.data.name)
          // console.log("agencydataname2: ", agencyId)

          res.data.name === agencyId ? setEditable(true) : setEditable(false);
        }
      })
      .catch((err) => console.log("abcd: ", err));
  }, []);

  useEffect(() => {
    const getAgencies = () => {
      axios
        .get("https://cndofftakencr.in/api/getAgency/" + agencyId)
        .then((res) => {
          // console.log(res);
          // console.log(res.data.data);

          if (res.data.Status === "Success") {
            setAgency(res.data.data[0]);

            setFormData(res.data.data[0]);
          } else {
            alert("something wrong, check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };
    const getPlants = () => {
      axios
        .get("https://cndofftakencr.in/api/getPlants")
        .then((res) => {
          // console.log(res);
          if (res.data.Status === "Success") {
            setPlantList(res.data.data);
          } else {
            alert("something wrong, check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };

    const getProds = () => {
      axios
        .get("https://cndofftakencr.in/api/get_products")
        .then((res) => {
          // console.log(res);
          if (res.data.status === "success") {
            setProdList(res.data.data);
            // setFilteredProdList(res.data.data);
          } else {
            alert("something wrong, check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };

    getProds();
    getAgencies();
    getPlants();
  }, [agencyId, refresh]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Define the new file path
    const newLogoPath = `../assets/plantOperator/logos/${agencyId}_logo.png`;

    // Update the form data
    setFormData({ ...formData, logo: newLogoPath });

    // Simulate saving the file (backend logic needed)
    saveLogoFile(file, newLogoPath);
  };

  const saveLogoFile = (file, filePath) => {
    // Backend API call to save the file (You need to implement this)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filePath", filePath);

    fetch("/api/upload-logo", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => console.log("File uploaded successfully:", data))
      .catch((err) => console.error("Error uploading file:", err));
  };

  const handleFileUpload = async (files, field) => {
    // const files = e.target.files;
    console.log("files: ", files);
    const formData = new FormData();

    if (field === "logo") {
      formData.append("logo", files[0]); // ✅ matches backend's .single("logo")
    } else if (field === "operation") {
      formData.append("operationImage", files[0]); // ✅ matches backend's .single("operationImage")
    } else if (field === "compliance") {
      for (let i = 0; i < files.length; i++) {
        formData.append("complianceFiles", files[i]); // ✅ matches backend's .array("complianceFiles", 5)
      }
    } else if (field === "testReports") {
      console.log("files.length: ", files);
      for (let i = 0; i < files.length; i++) {
        formData.append("testFiles", files[i]); // ✅ matches backend's .array("complianceFiles", 5)
      }
    } else if (field === "momReports") {
      for (let i = 0; i < files.length; i++) {
        formData.append("momFiles", files[i]); // ✅ matches backend's .array("complianceFiles", 5)
      }
    } else if (field === "otherReports") {
      for (let i = 0; i < files.length; i++) {
        formData.append("otherFiles", files[i]); // ✅ matches backend's .array("complianceFiles", 5)
      }
    }

    try {
      const response = await fetch(
        `https://cndofftakencr.in/api/upload/${field}/${agencyId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setRefresh(!refresh);

        // setFormData((prev) => ({
        //   ...prev,
        //   complianceTestReports: [
        //     ...(Array.isArray(prev?.complianceTestReports)
        //       ? prev.complianceTestReports
        //       : []),
        //     ...(Array.isArray(data?.uploadedFiles) ? data.uploadedFiles : []),
        //   ],
        // }));
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen min-w-[95%] mx-auto box-border">
      {/* Header Section */}
      <div className="bg-[#F8F9FA] pt-12">
        <div className="text-[#325A58] p-4 text-xl sm:text-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b">
          {/* LEFT : Logo + Title */}
          <div className="flex items-center gap-4">
            {!editOn && (
              <img
                src={
                  agencyId === "vnn"
                    ? vnnImg
                    : formData?.logo && formData?.logo !== "default.png"
                    ? `https://cndofftakencr.in/api${formData.logo}`
                    : agency?.logo && agency?.logo !== "default.png"
                    ? `https://cndofftakencr.in/api${agency.logo}`
                    : defaultImg
                }
                alt="logo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/default.png";
                }}
                className="w-[90px] sm:w-[120px] object-contain"
              />
            )}

            {editOn && (
              <div className=" border border-black flex items-center justify-center bg-[#a09f9f9b]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "logo")}
                />
              </div>
            )}

            <b className="text-left leading-tight">
              {agencyId === "vnn" ? "Varanasi Nagar Nigam" : agency?.agency}
            </b>
          </div>

          {/* RIGHT : Buttons */}
          <div className="flex gap-2 justify-start sm:justify-end">
            {editable && (
              <button
                className="bg-[#1AA5A7] hover:bg-[#148b8d] 
                 text-white text-sm font-medium 
                 py-1.5 px-3 
                 rounded-md shadow-sm transition-all"
                onClick={() => setEditOn(!editOn)}
              >
                {editOn ? "Discard" : "Edit"}
              </button>
            )}

            {editOn && (
              <button
                className="bg-[#325A58] hover:bg-[#24423f] 
                 text-white text-sm font-medium 
                 py-1.5 px-3 
                 rounded-md shadow-sm transition-all"
                onClick={() => {
                  setsubmitted(formData);
                  setEditOn(false);
                  handleUpdateAgency();
                }}
              >
                Save
              </button>
            )}
          </div>
        </div>

        {/* Top Section */}
        {agency?.plants?.length === 1 && (
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 px-4 sm:px-8 md:px-12 py-8 rounded-lg my-4">
            {/* LEFT : Plant Info */}
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center">
              {(() => {
                const plant = plantList.find(
                  (pl) => pl.plantId === agency?.plants[0]?.plantId
                );
                if (!plant) return null;

                return (
                  <>
                    {/* HEADER */}
                    <div className="text-center mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#325A58]">
                        {plant.location}
                      </h3>
                      <span className="text-xs text-gray-600">
                        Installed Capacity : {plant.installedWasteCap} MT
                      </span>
                    </div>

                    <hr className="mb-4" />

                    {/* DETAILS */}
                    {/* DETAILS */}
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex gap-2">
                        <span className="font-semibold whitespace-nowrap">
                          Plant Incharge:
                        </span>
                        <span className="capitalize">{plant.contact}</span>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold whitespace-nowrap">
                          Email:
                        </span>
                        <span className="break-all truncate">
                          {plant.contactEmail}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold whitespace-nowrap">
                          Mobile:
                        </span>
                        <span>{plant.phone}</span>
                      </div>

                      <div className="flex gap-2 items-start">
                        <span className="font-semibold whitespace-nowrap">
                          Address:
                        </span>
                        <span className="break-words leading-relaxed">
                          {plant.address || "N/A"}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* RIGHT : MAP */}
            <div className="relative bg-[#e7ebed] rounded-xl shadow-md overflow-hidden h-[300px] sm:h-[400px] lg:h-full">
              <iframe
                title={agencyId}
                src={
                  agencyId === "vnn"
                    ? "https://www.google.com/maps/embed?pb=!1m18..."
                    : agency?.mapLoc || agencyLoc[agencyId]
                }
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {editOn && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <input
                    type="text"
                    name="mapLoc"
                    value={formData.mapLoc || submitted.mapLoc}
                    className="p-2 w-[80%] rounded bg-white shadow"
                    onChange={(e) =>
                      setFormData({ ...formData, mapLoc: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            {/* Left Bottom - Incharge */}
            {/* <div className="bg-white p-6 sm:p-8 text-center rounded-lg font-bold text-[#353535] relative shadow-lg border border-[#ddd]">
            <p>
              <div>
                {agencyId === "vnn"
                  ? "निः शुल्क मलबा उठाने हेतु कृपया इस नम्बर पर संपर्क करे "
                  : "Plant Operator Head"}
              </div>
              <br />
              <span className="mt-2.5 block capitalize">
                {agencyId === "vnn"
                  ? "‪+91 7233000550‬"
                  : agency?.incharge?.toLowerCase()
                  ? agency?.incharge?.toLowerCase()
                  : agency?.contactEmail?.toLowerCase()}
              </span>
              {agencyId === "vnn"
                ? "-email-"
                : submitted.contactEmail?.toLowerCase()
                ? submitted.contactEmail?.toLowerCase()
                : agency?.contactEmail?.toLowerCase()}
            </p>

            {editOn && (
              <div className="absolute inset-0 border border-black flex items-center justify-center bg-[#a09f9f9b]"></div>
            )}
          </div> */}
          </section>
        )}
      </div>

      {/* Plants Section */}
      {agencyId !== "vnn" && agency?.plants?.length > 1 && (
        <div className="bg-[#F8F9FA]">
          <section className="px-4 sm:px-8 md:px-12 py-8 sm:py-10 rounded-lg my-4 bg-[#F8F9FA]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-20">
              {agency?.plants.map((p) => {
                const plant = plantList.find((pl) => pl.plantId === p.plantId);
                if (!plant) return null;

                if (!vnn && p.plantId === "A001_P007") return null;

                return (
                  <div
                    key={p.plantId}
                    className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col justify-between p-4 w-full"
                  >
                    {/* Header */}
                    <div className="text-center mb-3">
                      <h3 className="font-bold text-base text-gray-800">
                        {plant.location}{" "}
                        <span className="text-xs font-semibold text-gray-600">
                          [ {plant.installedWasteCap} MT ]
                        </span>
                      </h3>
                    </div>

                    <hr className="mb-3" />

                    {/* Details */}
                    <div className="space-y-3 text-sm text-gray-700">
                      <div>
                        <label className="block font-semibold text-gray-800">
                          Plant Incharge
                        </label>
                        <p className="ms-2 capitalize break-words text-xs">
                          {plant.contact || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-800">
                          Email
                        </label>
                        <p className="ms-2 break-all text-xs">{plant.contactEmail || "-"}</p>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-800">
                          Mobile
                        </label>
                        <p className="ms-2 text-xs">{plant.phone || "-"}</p>
                      </div>
                    </div>

                    {/* Map */}
                    <div className="mt-4">
                      <div className="text-sm font-semibold mb-1">
                        Location
                      </div>
                      <div className="w-full h-[180px] rounded-lg overflow-hidden border">
                        <iframe
                          title={plant.location}
                          src={plant.mapLoc}
                          className="w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Waste Processing Section */}
      {agencyId === "vnn" ? (
        <></>
      ) : (
        // <div className="bg-[#F8F9FA] pt-12">
        //   <h3 className="text-center text-xl sm:text-2xl text-[#325A58] font-semibold mb-6 p-4">
        //     Waste Processing Details
        //   </h3>
        //   <section className="px-4 sm:px-8 md:px-12 py-8 sm:py-10 rounded-lg my-4 bg-[#F8F9FA]">
        //     <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr] gap-6 lg:gap-8">
        //       {/* Capacity */}
        //       <div className="bg-white p-6 sm:p-12 text-center rounded-lg font-bold text-black relative shadow-lg border border-[#ddd]">
        //         <p>Installed Waste Capacity over all plants</p>
        //         <br />
        //         <hr />
        //         <br />
        //         <span>
        //           {plantList
        //             .filter((p) => p.agencyId === agency?.agencyId)
        //             ?.reduce((acc, plant) => acc + plant.installedWasteCap, 0)}
        //         </span>{" "}
        //         MT
        //       </div>

        //       {/* Processed Material */}
        //       {/* <div className="bg-white p-6 sm:p-12 text-center rounded-lg font-bold text-black relative shadow-lg border border-[#ddd] overflow-x-auto">
        //     <p className="text-center text-lg sm:text-xl mb-6 font-['Segoe_UI',sans-serif]">
        //       Processed Material Types and Quantities
        //     </p>
        //     <table className="min-w-full border-collapse font-normal bg-white rounded-lg overflow-hidden shadow font-['Segoe_UI',sans-serif]">
        //       <thead className="bg-green-600 text-white font-semibold">
        //         <tr>
        //           <th className="p-3 border border-[#ddd] text-center text-sm sm:text-base">
        //             Sno
        //           </th>
        //           <th className="p-3 border border-[#ddd] text-center text-sm sm:text-base">
        //             Product
        //           </th>
        //           <th className="p-3 border border-[#ddd] text-center text-sm sm:text-base">
        //             Quantity
        //           </th>
        //         </tr>
        //       </thead>
        //       <tbody className="max-h-[400px] overflow-auto block">
        //         {prodList.map((pr, index) => {
        //           const prod = pr.prodName;
        //           const agencyPlantIds =
        //             agency?.plants?.map((plant) => plant.plantId) || [];
        //           const totalQnt = pr.plantWise
        //             ?.filter((pw) => agencyPlantIds.includes(pw.plantId))
        //             ?.reduce((curr, item) => curr + +item.qnt, 0);

        //           return (
        //             <tr
        //               key={index}
        //               className="table table-fixed w-full even:bg-[#f8f9fa] hover:bg-[#e9ecef]"
        //             >
        //               <td className="p-3 border border-[#ddd] text-left text-sm sm:text-base">
        //                 {index + 1}
        //               </td>
        //               <td className="p-3 border border-[#ddd] text-left text-sm sm:text-base">
        //                 {prod}
        //               </td>
        //               <td className="p-3 border border-[#ddd] text-left text-sm sm:text-base">
        //                 {totalQnt || 0}
        //               </td>
        //             </tr>
        //           );
        //         })}
        //       </tbody>
        //     </table>
        //   </div> */}
        //       <div className="bg-white p-4 sm:p-6 md:p-12 text-center rounded-lg font-bold text-black relative shadow-lg border border-[#ddd] overflow-hidden">
        //         <p className="text-center text-base sm:text-lg md:text-xl mb-4 sm:mb-6 font-['Segoe_UI',sans-serif]">
        //           Processed Material Types and Quantities
        //         </p>

        //         {/* Responsive table wrapper */}
        //         <div className="overflow-x-auto">
        //           <table className="min-w-full border-collapse font-normal bg-white rounded-lg overflow-hidden shadow font-['Segoe_UI',sans-serif]">
        //             <thead className="bg-green-600 text-white font-semibold">
        //               <tr>
        //                 <th className="p-2 sm:p-3 border border-[#ddd] text-center text-xs sm:text-sm md:text-base">
        //                   Sno
        //                 </th>
        //                 <th className="p-2 sm:p-3 border border-[#ddd] text-center text-xs sm:text-sm md:text-base">
        //                   Product
        //                 </th>
        //                 <th className="p-2 sm:p-3 border border-[#ddd] text-center text-xs sm:text-sm md:text-base">
        //                   Quantity
        //                 </th>
        //               </tr>
        //             </thead>
        //             <tbody>
        //               {prodList.map((pr, index) => {
        //                 const prod = pr.prodName;
        //                 const agencyPlantIds =
        //                   agency?.plants?.map((plant) => plant.plantId) || [];
        //                 const totalQnt = pr.plantWise
        //                   ?.filter((pw) => agencyPlantIds.includes(pw.plantId))
        //                   ?.reduce((curr, item) => curr + +item.qnt, 0);

        //                 return (
        //                   <tr
        //                     key={index}
        //                     className="even:bg-[#f8f9fa] hover:bg-[#e9ecef] transition-colors duration-200"
        //                   >
        //                     <td className="p-2 sm:p-3 border border-[#ddd] text-left text-xs sm:text-sm md:text-base">
        //                       {index + 1}
        //                     </td>
        //                     <td className="p-2 sm:p-3 border border-[#ddd] text-left text-xs sm:text-sm md:text-base">
        //                       {prod}
        //                     </td>
        //                     <td className="p-2 sm:p-3 border border-[#ddd] text-left text-xs sm:text-sm md:text-base">
        //                       {totalQnt || 0}
        //                     </td>
        //                   </tr>
        //                 );
        //               })}
        //             </tbody>
        //           </table>
        //         </div>
        //       </div>

        //       {/* Agency Contact */}
        //       {/* <div className="bg-white shadow-lg p-4 sm:p-5 rounded-xl my-5 font-['Segoe_UI',sans-serif] border border-[#ddd] overflow-x-auto">
        //     <p className="text-lg sm:text-xl font-semibold mb-4 text-[#333]">
        //       Agency Contact Details
        //     </p>
        //     {agencyId === "vnn" ? (
        //       "--"
        //     ) : agency?.contactDetails && agency.contactDetails.length > 0 ? (
        //       <table className="min-w-full border-collapse text-sm sm:text-base">
        //         <thead>
        //           <tr>
        //             <th className="p-3 border-b bg-green-600 text-white text-center">
        //               Name
        //             </th>
        //             <th className="p-3 border-b bg-green-600 text-white text-center">
        //               Email
        //             </th>
        //             <th className="p-3 border-b bg-green-600 text-white text-center">
        //               Mobile
        //             </th>
        //             <th className="p-3 border-b bg-green-600 text-white text-center">
        //               Designation
        //             </th>
        //           </tr>
        //         </thead>
        //         <tbody>
        //           {agency.contactDetails.map((contact, index) => (
        //             <tr key={index} className="hover:bg-[#f1f1f1]">
        //               <td className="p-3 border-b text-[#484747]">
        //                 {contact.name?.toUpperCase()}
        //               </td>
        //               <td className="p-3 border-b text-[#484747]">
        //                 {contact.email}
        //               </td>
        //               <td className="p-3 border-b text-[#484747]">
        //                 {contact.phone}
        //               </td>
        //               <td className="p-3 border-b text-[#484747]">
        //                 {contact.designation?.toUpperCase()}
        //               </td>
        //             </tr>
        //           ))}
        //         </tbody>
        //       </table>
        //     ) : (
        //       <p className="text-[#888] italic mt-2.5">
        //         No contact details available
        //       </p>
        //     )}
        //   </div> */}
        //       <div className="bg-white shadow-lg p-3 sm:p-5 rounded-xl my-5 font-['Segoe_UI',sans-serif] border border-[#ddd] overflow-hidden">
        //         <p className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-[#333]">
        //           Agency Contact Details
        //         </p>

        //         {agencyId === "vnn" ? (
        //           "--"
        //         ) : agency?.contactDetails &&
        //           agency.contactDetails.length > 0 ? (
        //           <div className="overflow-x-auto">
        //             <table className="min-w-full border-collapse text-xs sm:text-sm md:text-base">
        //               <thead>
        //                 <tr>
        //                   <th className="p-2 sm:p-3 border-b bg-green-600 text-white text-center whitespace-nowrap">
        //                     Name
        //                   </th>
        //                   <th className="p-2 sm:p-3 border-b bg-green-600 text-white text-center whitespace-nowrap">
        //                     Email
        //                   </th>
        //                   <th className="p-2 sm:p-3 border-b bg-green-600 text-white text-center whitespace-nowrap">
        //                     Mobile
        //                   </th>
        //                   <th className="p-2 sm:p-3 border-b bg-green-600 text-white text-center whitespace-nowrap">
        //                     Designation
        //                   </th>
        //                 </tr>
        //               </thead>
        //               <tbody>
        //                 {agency.contactDetails.map((contact, index) => (
        //                   <tr
        //                     key={index}
        //                     className="hover:bg-[#f1f1f1] transition-colors duration-200"
        //                   >
        //                     <td className="p-2 sm:p-3 border-b text-[#484747] text-left">
        //                       {contact.name?.toUpperCase()}
        //                     </td>
        //                     <td className="p-2 sm:p-3 border-b text-[#484747] text-left break-all">
        //                       {contact.email}
        //                     </td>
        //                     <td className="p-2 sm:p-3 border-b text-[#484747] text-left whitespace-nowrap">
        //                       {contact.phone}
        //                     </td>
        //                     <td className="p-2 sm:p-3 border-b text-[#484747] text-left">
        //                       {contact.designation?.toUpperCase()}
        //                     </td>
        //                   </tr>
        //                 ))}
        //               </tbody>
        //             </table>
        //           </div>
        //         ) : (
        //           <p className="text-[#888] italic mt-2.5">
        //             No contact details available
        //           </p>
        //         )}
        //       </div>
        //     </div>
        //   </section>
        // </div>
        //         <div className="bg-[#F8F9FA] pt-12">
        //   <h3 className="text-center text-xl sm:text-2xl text-[#325A58] font-semibold mb-6 p-4">
        //     Waste Processing Details
        //   </h3>
        //   <section className="px-4 sm:px-8 md:px-12 py-8 sm:py-10 rounded-lg my-4 bg-[#F8F9FA]">
        //     <div className="flex flex-col lg:flex-row flex-wrap gap-6 lg:gap-8">
        //       {/* Capacity */}
        //       <div className="">
        //       <div className="bg-white p-6 sm:p-12 text-center rounded-lg font-bold text-black relative shadow-lg border border-[#ddd] flex-1 min-w-[300px]">
        //         <p>Installed Waste Capacity over all plants</p>
        //         <br />
        //         <hr />
        //         <br />
        //         <span>
        //           {plantList
        //             .filter((p) => p.agencyId === agency?.agencyId)
        //             ?.reduce((acc, plant) => acc + plant.installedWasteCap, 0)}
        //         </span>{" "}
        //         MT
        //       </div>

        //       {/* Processed Material */}
        //       <div className="bg-white p-4 sm:p-6 md:p-12 text-center rounded-lg font-bold text-black relative shadow-lg border border-[#ddd] overflow-hidden flex-1 min-w-[300px]">
        //         <p className="text-center text-base sm:text-lg md:text-xl mb-4 sm:mb-6 font-['Segoe_UI',sans-serif]">
        //           Processed Material Types and Quantities
        //         </p>

        //         {/* Responsive table wrapper */}
        //         <div className="overflow-x-auto">
        //           <table className="min-w-full border-collapse font-normal bg-white rounded-lg overflow-hidden shadow font-['Segoe_UI',sans-serif]">
        //             <thead className="bg-green-600 text-white font-semibold">
        //               <tr>
        //                 <th className="p-2 sm:p-3 border border-[#ddd] text-center text-xs sm:text-sm md:text-base">
        //                   Sno
        //                 </th>
        //                 <th className="p-2 sm:p-3 border border-[#ddd] text-center text-xs sm:text-sm md:text-base">
        //                   Product
        //                 </th>
        //                 <th className="p-2 sm:p-3 border border-[#ddd] text-center text-xs sm:text-sm md:text-base">
        //                   Quantity
        //                 </th>
        //               </tr>
        //             </thead>
        //             <tbody>
        //               {prodList.map((pr, index) => {
        //                 const prod = pr.prodName;
        //                 const agencyPlantIds =
        //                   agency?.plants?.map((plant) => plant.plantId) || [];
        //                 const totalQnt = pr.plantWise
        //                   ?.filter((pw) => agencyPlantIds.includes(pw.plantId))
        //                   ?.reduce((curr, item) => curr + +item.qnt, 0);

        //                 return (
        //                   <tr
        //                     key={index}
        //                     className="even:bg-[#f8f9fa] hover:bg-[#e9ecef] transition-colors duration-200"
        //                   >
        //                     <td className="p-2 sm:p-3 border border-[#ddd] text-left text-xs sm:text-sm md:text-base">
        //                       {index + 1}
        //                     </td>
        //                     <td className="p-2 sm:p-3 border border-[#ddd] text-left text-xs sm:text-sm md:text-base">
        //                       {prod}
        //                     </td>
        //                     <td className="p-2 sm:p-3 border border-[#ddd] text-left text-xs sm:text-sm md:text-base">
        //                       {totalQnt || 0}
        //                     </td>
        //                   </tr>
        //                 );
        //               })}
        //             </tbody>
        //           </table>
        //         </div>
        //       </div>
        //       </div>

        //       {/* Agency Contact */}
        //       <div className="bg-white shadow-lg p-3 sm:p-5 rounded-xl my-5 font-['Segoe_UI',sans-serif] border border-[#ddd] overflow-hidden flex-1 min-w-[300px]">
        //         <p className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-[#333]">
        //           Agency Contact Details
        //         </p>

        //         {agencyId === "vnn" ? (
        //           "--"
        //         ) : agency?.contactDetails && agency.contactDetails.length > 0 ? (
        //           <div className="overflow-x-auto">
        //             <table className="min-w-full border-collapse text-xs sm:text-sm md:text-base">
        //               <thead>
        //                 <tr>
        //                   <th className="p-2 sm:p-3 border-b bg-green-600 text-white text-center whitespace-nowrap">
        //                     Name
        //                   </th>
        //                   <th className="p-2 sm:p-3 border-b bg-green-600 text-white text-center whitespace-nowrap">
        //                     Email
        //                   </th>
        //                   <th className="p-2 sm:p-3 border-b bg-green-600 text-white text-center whitespace-nowrap">
        //                     Mobile
        //                   </th>
        //                   <th className="p-2 sm:p-3 border-b bg-green-600 text-white text-center whitespace-nowrap">
        //                     Designation
        //                   </th>
        //                 </tr>
        //               </thead>
        //               <tbody>
        //                 {agency.contactDetails.map((contact, index) => (
        //                   <tr
        //                     key={index}
        //                     className="hover:bg-[#f1f1f1] transition-colors duration-200"
        //                   >
        //                     <td className="p-2 sm:p-3 border-b text-[#484747] text-left">
        //                       {contact.name?.toUpperCase()}
        //                     </td>
        //                     <td className="p-2 sm:p-3 border-b text-[#484747] text-left break-all">
        //                       {contact.email}
        //                     </td>
        //                     <td className="p-2 sm:p-3 border-b text-[#484747] text-left whitespace-nowrap">
        //                       {contact.phone}
        //                     </td>
        //                     <td className="p-2 sm:p-3 border-b text-[#484747] text-left">
        //                       {contact.designation?.toUpperCase()}
        //                     </td>
        //                   </tr>
        //                 ))}
        //               </tbody>
        //             </table>
        //           </div>
        //         ) : (
        //           <p className="text-[#888] italic mt-2.5">
        //             No contact details available
        //           </p>
        //         )}
        //       </div>
        //     </div>
        //   </section>
        // </div>

        <div className="bg-[#F8F9FA]">
          {/* <h3 className="text-center text-xl sm:text-2xl text-[#325A58] font-semibold mb-6 p-4">
            Waste Processing Details
          </h3> */}

          <section className="px-4 sm:px-8 md:px-12 py-8 sm:py-10 rounded-lg my-4 bg-[#F8F9FA]">
            <div className="flex flex-col lg:flex-col gap-6 lg:gap-8">
              {/* LEFT COLUMN — Capacity + Processed Material */}
              <div className="flex flex-row gap-6 flex-1 min-w-[350px]">
                {/* Installed Capacity Card */}
                {/* <div className="bg-white p-6 sm:p-8 text-center rounded-xl font-semibold text-black shadow-md border border-[#ddd]">
          <p className="text-base sm:text-lg text-[#325A58] mb-2">
            Installed Waste Capacity over all plants
          </p>
          <hr className="my-4" />
          <span className="text-2xl sm:text-3xl font-bold text-[#1e4d4a]">
            {plantList
              .filter((p) => p.agencyId === agency?.agencyId)
              ?.reduce((acc, plant) => acc + plant.installedWasteCap, 0)}
          </span>
          <span className="text-[#666] font-medium ml-1">MT</span>
        </div> */}

                {/* Processed Material Table */}
                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl font-['Segoe_UI',sans-serif] shadow-md border border-[#ddd] flex-1">
                  <p className="text-center text-lg sm:text-xl font-semibold text-[#325A58] mb-6">
                    Product Inventory
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse font-normal bg-white rounded-lg overflow-hidden">
                      <thead className="bg-green-600 text-white font-semibold">
                        <tr>
                          <th className="p-3 border border-[#ddd] text-center text-sm md:text-base">
                            S/N
                          </th>
                          <th className="p-3 border border-[#ddd] text-center text-sm md:text-base">
                            Product
                          </th>
                          <th className="p-3 border border-[#ddd] text-center text-sm md:text-base">
                            Unit
                          </th>
                          <th className="p-3 border border-[#ddd] text-center text-sm md:text-base">
                            Quantity (MT)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {prodList.map((pr, index) => {
                          const prod = pr.prodName;
                          const unit = pr.unit;
                          const agencyPlantIds =
                            agency?.plants?.map((plant) => plant.plantId) || [];
                          const totalQnt = pr.plantWise
                            ?.filter((pw) =>
                              agencyPlantIds.includes(pw.plantId)
                            )
                            ?.reduce((curr, item) => curr + +item.qnt, 0);

                          return (
                            <tr
                              key={index}
                              className="even:bg-[#f8f9fa] hover:bg-[#e9ecef] transition-colors duration-200"
                            >
                              <td className="p-3 border border-[#ddd] text-center text-sm md:text-base">
                                {index + 1}
                              </td>
                              <td className="p-3 border border-[#ddd] text-left text-sm md:text-base">
                                {prod}
                              </td>
                              <td className="p-3 border border-[#ddd] text-left text-sm md:text-base">
                                {unit}
                              </td>
                              <td className="p-3 border border-[#ddd] text-center text-sm md:text-base">
                                {totalQnt || 0}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN — Agency Contact */}
              <div className="bg-white shadow-md p-5 sm:p-8 rounded-xl font-['Segoe_UI',sans-serif] border border-[#ddd] flex-1 min-w-[350px]">
                <p className="text-lg sm:text-xl font-semibold mb-4 text-[#325A58]">
                  Agency Contact Details for Offtake
                </p>

                {agencyId === "vnn" ? (
                  <p className="text-[#888] italic">--</p>
                ) : agency?.contactDetails &&
                  agency.contactDetails.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm md:text-base">
                      <thead>
                        <tr>
                          {["Name", "Email", "Mobile", "Designation"].map(
                            (header, i) => (
                              <th
                                key={i}
                                className="p-3 border-b bg-green-600 text-white text-center whitespace-nowrap"
                              >
                                {header}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {agency.contactDetails.map((contact, index) => (
                          <tr
                            key={index}
                            className="hover:bg-[#f1f1f1] transition-colors duration-200"
                          >
                            <td className="p-3 border-b text-[#484747] capitalize text-left">
                              {contact.name}
                            </td>
                            <td className="p-3 border-b text-[#484747] text-center break-all">
                              {contact.email}
                            </td>
                            <td className="p-3 border-b text-[#484747] text-center whitespace-nowrap">
                              {contact.phone}
                            </td>
                            <td className="p-3 border-b text-[#484747] capitalize text-center">
                              {contact.designation}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[#888] italic mt-2.5">
                    No contact details available
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Reports Section (Compliance, Test, MOMs, Other) */}
      {agencyId === "vnn" ? (
        <></>
      ) : (
        <div className="px-4 sm:px-8 md:px-12 py-8 sm:py-10 bg-[#F8F9FA]">
          {/* "complianceTestReports",
            "momReports", */}
          {["testReports", "otherReports"].map((reportType, idx) => (
            <div
              key={idx}
              className="border border-[#ddd] px-4 sm:px-6 py-8 sm:py-10 rounded-xl mt-5 shadow-lg text-center relative"
            >
              <h3 className="text-lg sm:text-[22px] font-semibold mb-4 text-[#325A58]">
                {reportType === "complianceTestReports"
                  ? "Compliance & Test Reports"
                  : reportType === "testReports"
                  ? "Test Reports"
                  : reportType === "momReports"
                  ? "MOMs"
                  : "Other Informations"}
              </h3>

              {formData?.[reportType] && formData?.[reportType]?.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-3 mb-4 overflow-auto">
                  {formData[reportType].map((report, index) => (
                    <a
                      key={index}
                      className="px-4 py-2.5 bg-green-800 m-3 sm:m-7 rounded-lg text-white text-xs sm:text-sm font-medium text-center min-w-fit shadow hover:bg-green-700"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://cndofftakencr.in/api${report.filePath}`}
                      // download
                    >
                      {report.name}
                    </a>
                  ))}

                  {/* <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  multiple
                  onChange={(e) => handleFileUpload(e, "otherReports")}
                  className="mt-2.5 py-1.5"
                /> */}
                </div>
              ) : (
                <p className="text-[#888] italic mt-2.5">
                  No reports available
                </p>
              )}

              {editOn && (
                <FileUploadSection
                  handleFileUploadToServer={handleFileUpload}
                  field={reportType}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgencyDetail;

//         <div className="flex flex-col min-h-screen min-w-[95%] mx-auto box-border">
//   {/* Header Section */}
//   <div className="bg-[#F8F9FA] pt-12">
//     <div className="text-[#325A58] p-4 text-2xl text-center">
//       <b>
//         {agencyId === "vnn" ? "Varanasi Nagar Nigam" : agency?.agency}
//       </b>
//       {editable && (
//         <button className="btn" onClick={() => setEditOn(!editOn)}>
//           {editOn ? "Discard Edit" : "Edit Details"}
//         </button>
//       )}
//       {editOn && (
//         <button
//           className="btn"
//           onClick={() => {
//             setsubmitted(formData);
//             setEditOn(!editOn);
//             handleUpdateAgency();
//           }}
//         >
//           {"Save Changes"}
//         </button>
//       )}
//     </div>

// <section className="grid grid-cols-[1fr_2fr] grid-rows-2 gap-8 px-12 py-10 rounded-lg my-4">
//   {/* Left Top - Logo */}
//   <div className="bg-white p-8 text-center rounded-lg font-bold text-[#353535] relative shadow-lg border border-[#ddd]">
//     <img
//       src={
//                 agencyId === "vnn"
//                   ? vnnImg
//                   : formData?.logo
//                   ? `https://cndofftakencr.in/api${formData.logo}`

//                   :formData?.logo !== "default.png"
//                   ? `https://cndofftakencr.in/api${formData?.logo}`
//                   : defaultImg
//                   ? agency?.logo
//                   ? `https://cndofftakencr.in/api${agency.logo}`

//                   : agency?.logo !== "default.png"
//                   ? `https://cndofftakencr.in/api${agency.logo}`
//                   : defaultImg : defaultImg
//               }
//       alt="logo"
//       className="w-[190px] mx-auto"
//     />
//     {editOn && (
//       <div className="absolute inset-0 border border-black flex items-center justify-center bg-[#a09f9f9b]">
//         <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "logo")} />
//       </div>
//     )}
//   </div>

//   {/* Right side - Map (spanning both rows) */}
//   <div className="relative bg-[#e7ebed] text-center rounded-lg text-black row-span-2">
//     <iframe
//       title={agencyId}
//       src={
//         agencyId === "vnn"
//           ? "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d717.383488982683!2d82.9925177265525!3d25.312109211203285!2m3!1f281.5783746618988!2f39.29047134450135!3f0!3m2!1i1024!2i768!4f35!3m2!1m1!2zMjXCsDE4JzQ3LjEiTiA4MsKwNTknMTEuOCJF!5e1!3m2!1sen!2sin!4v1753349049178!5m2!1sen!2sin"
//           : agency?.mapLoc
//           ? agency?.mapLoc
//           : agencyLoc[agencyId]
//       }
//       className="w-full h-full border-0"
//       allowFullScreen=""
//       loading="lazy"
//       referrerPolicy="no-referrer-when-downgrade"
//     ></iframe>

//     {editOn && (
//       <div className="absolute inset-0 border border-black flex items-center flex-col justify-center bg-[#a09f9f9b]">
//         <input
//           type="text"
//           name="mapLoc"
//           value={formData.mapLoc ? formData.mapLoc : submitted.mapLoc}
//           className="p-1.5 min-w-[70%] bg-white z-[199] shadow-[0_0_20px_2px_rgba(247,247,208,0.388)]"
//           onChange={(e) => setFormData({ ...formData, mapLoc: e.target.value })}
//         />
//       </div>
//     )}
//   </div>

//   {/* Left Bottom - Incharge */}
//   <div className="bg-white p-8 text-center rounded-lg font-bold text-[#353535] relative shadow-lg border border-[#ddd] ">
//     <p>
//       <div>
//         {agencyId === "vnn"
//           ? "निः शुल्क मलबा उठाने हेतु कृपया इस नम्बर पर संपर्क करे "
//           : "Agency Incharge"}
//       </div>
//       <br />
//       <span className="mt-2.5">
//         {agencyId === "vnn"
//           ? "‪+91 7233000550‬"
//           : agency?.incharge
//           ? agency?.incharge
//           : agency?.contactEmail}
//       </span>
//       <br />
//       {agencyId === "vnn"
//         ? "-email-"
//         : submitted.contactEmail
//         ? submitted.contactEmail
//         : agency?.contactEmail}
//     </p>

//     {editOn && (
//       <div className="absolute inset-0 border border-black flex items-center justify-center bg-[#a09f9f9b]"></div>
//     )}
//   </div>
// </section>

//   </div>

//   {/* Plants Section */}
//   {agencyId === "vnn" ? <></> : (
//     <div className="py-12 bg-[#F8F9FA]">
//       <h3 className="text-center text-2xl text-green-800 font-semibold mb-6 p-4">List of Plants</h3>
//       <section className="px-12 py-10 rounded-lg my-4 bg-[#F8F9FA]">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-20">
//           {agencyId === "vnn" ? "--"
//           : agency?.plants &&
//             agency?.plants.map((p) => {
//               const plant = plantList.find((pl) => pl.plantId === p.plantId);
//               if (!plant) return null;

//               {console.log("plants--> ", plant)}
//               return (
//                 <div className="bg-white p-6 text-center rounded-lg font-bold text-black relative shadow-lg border border-[#ddd]" key={p.plantId}>
//                   <p>
//                     {plant?.location}{" "}
//                     <span className="font-semibold text-xs">[ {plant?.installedWasteCap} MT ]</span>
//                   </p>
//                   <hr />
//                   <br />

//                   <>
//                     <div className="text-sm flex flex-wrap gap-2.5 items-start p-1.5">
//                       <span className="text-base font-bold">Incharge : </span> {plant?.contact}
//                     </div>
//                     <div className="text-sm flex flex-wrap gap-2.5 items-start p-1.5">
//                       <span className="text-base font-bold">Email : </span> {plant?.contactEmail}
//                     </div>
//                     <div className="text-sm flex flex-wrap gap-2.5 items-start p-1.5">
//                       <span className="text-base font-bold">Mobile : </span> {plant?.phone}
//                     </div>

//                     <div className="text-sm flex flex-wrap gap-2.5 items-start p-1.5">
//                       <span className="text-base font-bold">Map : </span>
//                       <iframe
//                         title={plant?.location}
//                         src={plant?.mapLoc}
//                         className="w-full h-full border-0"
//                         allowFullScreen=""
//                         loading="lazy"
//                         referrerPolicy="no-referrer-when-downgrade"
//                       ></iframe>
//                     </div>
//                   </>
//                 </div>
//               );
//             })}
//         </div>
//       </section>
//     </div>
//   )}

//   {/* Waste Processing Section */}
//   {agencyId === "vnn" ? <></> : (
//     <div className="bg-[#F8F9FA] pt-12">
//       <h3 className="text-center text-2xl text-green-800 font-semibold mb-6 p-4">Waste Processing Details</h3>
//       <section className="px-12 py-10 rounded-lg my-4 bg-[#F8F9FA]">
//         <div className="grid grid-areas-[capacity_material/contact_material/operation_operation] grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] gap-4 lg:gap-8">
//           <div className="bg-white p-12 text-center rounded-lg font-bold text-black relative shadow-lg border border-[#ddd]">
//             <p>Installed Waste Capacity over all plants</p>
//             <br />
//             <hr />
//             <br />
//             <span>
//               {plantList
//                 .filter((p) => p.agencyId === agency?.agencyId)
//                 ?.reduce((acc, plant) => acc + plant.installedWasteCap, 0)}
//             </span>{" "}
//             MT
//           </div>

//           <div className="bg-white p-12 text-center rounded-lg font-bold text-black relative shadow-lg border border-[#ddd]">
//             <p className="text-center text-xl mb-6 font-['Segoe_UI',sans-serif]">Processed Material Types and Quantities</p>
//             <table className="border-collapse font-normal bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-['Segoe_UI',sans-serif] table-fixed w-full">
//               <thead className="bg-green-600 text-white font-semibold table table-fixed w-full">
//                 <tr>
//                   <th className="p-3 border border-[#ddd] text-center text-base font-semibold w-[60px]">Sno</th>
//                   <th className="p-3 border border-[#ddd] text-center text-base font-semibold">Product</th>
//                   <th className="p-3 border border-[#ddd] text-center text-base font-semibold w-[100px]">Quantity</th>
//                 </tr>
//               </thead>

//               <tbody className="block max-h-[470px] overflow-auto">
//                 {prodList.map((pr, index) => {
//                   const prod = pr.prodName;
//                   const agencyPlantIds = agency?.plants?.map((plant) => plant.plantId) || [];
//                   const totalQnt = pr.plantWise
//                     ?.filter((pw) => agencyPlantIds.includes(pw.plantId))
//                     ?.reduce((curr, item) => curr + +item.qnt, 0);

//                   return (
//                     <tr key={index} className="table table-fixed w-full even:bg-[#f8f9fa] hover:bg-[#e9ecef]">
//                       <td className="p-3 border border-[#ddd] text-left text-base font-semibold text-[#484747] w-[60px]">{index + 1}</td>
//                       <td className="p-3 border border-[#ddd] text-left text-base font-semibold text-[#484747]">{prod}</td>
//                       <td className="p-3 border border-[#ddd] text-left text-base font-semibold text-[#484747] w-[100px]">{totalQnt || 0}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <div className="bg-white shadow-lg p-5 rounded-xl my-5 font-['Segoe_UI',sans-serif] border border-[#ddd]">
//             <p className="text-xl font-semibold mb-4 text-[#333]">Agency Contact Details</p>

//             {agencyId === "vnn" ? "--" : agency?.contactDetails && agency.contactDetails.length > 0 ? (
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr>
//                     <th className="p-3 text-left border-b border-[#eee] text-base bg-green-600 font-semibold text-white text-center">Name</th>
//                     <th className="p-3 text-left border-b border-[#eee] text-base bg-green-600 font-semibold text-white text-center">Email</th>
//                     <th className="p-3 text-left border-b border-[#eee] text-base bg-green-600 font-semibold text-white text-center">Mobile</th>
//                     <th className="p-3 text-left border-b border-[#eee] text-base bg-green-600 font-semibold text-white text-center">Designation</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {agency.contactDetails.map((contact, index) => (
//                     <tr key={index} className="hover:bg-[#f1f1f1]">
//                       <td className="p-3 text-left border-b border-[#eee] text-base font-semibold text-[#484747]">{contact.name?.toUpperCase()}</td>
//                       <td className="p-3 text-left border-b border-[#eee] text-base font-semibold text-[#484747]">{contact.email}</td>
//                       <td className="p-3 text-left border-b border-[#eee] text-base font-semibold text-[#484747]">{contact.phone}</td>
//                       <td className="p-3 text-left border-b border-[#eee] text-base font-semibold text-[#484747]">{contact.designation?.toUpperCase()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-[#888] italic mt-2.5">No contact details available</p>
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   )}

//   {agencyId === "vnn" ? <></> : (
//     <div className="px-12 py-10 bg-[#F8F9FA]">
//       {/* Compliance Section */}
//       <div className="border border-[#ddd] px-6 py-10 rounded-xl mt-5 shadow-lg text-center relative">
//         <h3 className="text-[22px] font-semibold mb-4 text-green-800 ">Compliance & Test Reports</h3>

//         {formData?.complianceTestReports && formData?.complianceTestReports?.length > 0 ? (
//           <div className="flex flex-wrap gap-3 mb-4 max-h-fit overflow-auto">
//             {formData.complianceTestReports.map((report, index) => (
//               <a
//                 key={index}
//                 className="px-4 py-2.5 bg-[#07426a] m-7 border-none rounded-lg text-white text-sm font-medium text-center min-w-fit cursor-pointer no-underline shadow-[2px_2px_4px_2px_rgb(222,210,255)] hover:bg-[#063A5D]"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 href={`https://cndofftakencr.in/api${report.filePath}`}
//                 download
//               >
//                 {report.name}
//               </a>
//             ))}
//           </div>
//         ) : (
//           <p className="text-[#888] italic mt-2.5">No reports available</p>
//         )}

//         {editOn && (
//           <div className="mt-2.5">
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx,.xls,.xlsx"
//               multiple
//               onChange={(e) => handleFileUpload(e, "compliance")}
//               className="mt-2.5 py-1.5"
//             />
//           </div>
//         )}
//       </div>

//       {/* Test Reports Section */}
//       <div className="border border-[#ddd] px-6 py-10 rounded-xl mt-5 shadow-lg text-center relative">
//         <h3 className="text-[22px] font-semibold mb-4 text-green-800">Test Reports</h3>

//         {formData?.testReports && formData?.testReports?.length > 0 ? (
//           <div className="flex flex-wrap gap-3 mb-4 max-h-fit overflow-auto">
//             {formData.testReports.map((report, index) => (
//               <a
//                 key={index}
//                 className="px-4 py-2.5 bg-[#07426a] m-7 border-none rounded-lg text-white text-sm font-medium text-center min-w-fit cursor-pointer no-underline shadow-[2px_2px_4px_2px_rgb(222,210,255)] hover:bg-[#063A5D]"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 href={`https://cndofftakencr.in/api${report.filePath}`}
//                 download
//               >
//                 {report.name}
//               </a>
//             ))}
//           </div>
//         ) : (
//           <p className="text-[#888] italic mt-2.5">No reports available</p>
//         )}

//         {editOn && (
//           <div className="mt-2.5">
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx,.xls,.xlsx"
//               multiple
//               onChange={(e) => handleFileUpload(e, "testReports")}
//               className="mt-2.5 py-1.5"
//             />
//           </div>
//         )}
//       </div>

//       {/* MOMs Section */}
//       <div className="border border-[#ddd] px-6 py-10 rounded-xl mt-5 shadow-lg text-center relative">
//         <h3 className="text-[22px] font-semibold mb-4 text-green-800">MOMs</h3>

//         {formData?.momReports && formData?.momReports?.length > 0 ? (
//           <div className="flex flex-wrap gap-3 mb-4 max-h-fit overflow-auto">
//             {formData.momReports.map((report, index) => (
//               <a
//                 key={index}
//                 className="px-4 py-2.5 bg-[#07426a] m-7 border-none rounded-lg text-white text-sm font-medium text-center min-w-fit cursor-pointer no-underline shadow-[2px_2px_4px_2px_rgb(222,210,255)] hover:bg-[#063A5D]"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 href={`https://cndofftakencr.in/api${report.filePath}`}
//                 download
//               >
//                 {report.name}
//               </a>
//             ))}
//           </div>
//         ) : (
//           <p className="text-[#888] italic mt-2.5">No reports available</p>
//         )}

//         {editOn && (
//           <div className="mt-2.5">
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx,.xls,.xlsx"
//               multiple
//               onChange={(e) => handleFileUpload(e, "momReports")}
//               className="mt-2.5 py-1.5"
//             />
//           </div>
//         )}
//       </div>

//       {/* Other Docs Section */}
//       <div className="border border-[#ddd] px-6 py-10 rounded-xl mt-5 shadow-lg text-center relative">
//         <h3 className="text-[22px] font-semibold mb-4 text-green-800">Other Reports</h3>

//         {formData?.otherReports && formData?.otherReports?.length > 0 ? (
//           <div className="flex flex-wrap gap-3 mb-4 max-h-fit overflow-auto">
//             {formData.otherReports.map((report, index) => (
//               <a
//                 key={index}
//                 className="px-4 py-2.5 bg-[#07426a] m-7 border-none rounded-lg text-white text-sm font-medium text-center min-w-fit cursor-pointer no-underline shadow-[2px_2px_4px_2px_rgb(222,210,255)] hover:bg-[#063A5D]"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 href={`https://cndofftakencr.in/api${report.filePath}`}
//                 download
//               >
//                 {report.name}
//               </a>
//             ))}
//           </div>
//         ) : (
//           <p className="text-[#888] italic mt-2.5">No reports available</p>
//         )}

//         {editOn && (
//           <div className="mt-2.5">
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx,.xls,.xlsx"
//               multiple
//               onChange={(e) => handleFileUpload(e, "otherReports")}
//               className="mt-2.5 py-1.5"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   )}
// </div>
