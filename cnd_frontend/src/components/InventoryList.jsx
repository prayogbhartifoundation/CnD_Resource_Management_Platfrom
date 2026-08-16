import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";

import axios from "axios";
const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample inventory data

  const location = useLocation();
  const { filterProd } = location.state || "";
  const [prodName, setProdName] = useState(filterProd || "");
  const [filteredProdList, setFilteredProdList] = useState([]);

  const [selectedItems, setSelectedItems] = useState(new Set());

  const [prodList, setProdList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [quantities, setQuantities] = useState([]);

  const [selectionPopUp, setSelectionPopUp] = useState(false);

  const [plantOperatorExtend, setPlantOperatorExtend] = useState(true);
  const [plantExtend, setPlantExtend] = useState(true);

  useEffect(() => {
    const getProds = () => {
      axios
        .get("https://cndofftakencr.in/api/get_products")
        .then((res) => {
          console.log(res);
          if (res.data.status === "success") {
            setProdList(res.data.data);

            if (filterProd) {
              console.log(filterProd);
              setFilteredProdList(
                res.data.data.filter((p) =>
                  p.prodName.toLowerCase().includes(filterProd.toLowerCase())
                )
              );
            } else {
              console.log("filterProd");
              setFilteredProdList(res.data.data);
            }
          } else {
            alert("something wrong,1 check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };
    const getAgencies = () => {
      axios
        .get("https://cndofftakencr.in/api/getAgencies")
        .then((res) => {
          console.log(res);
          if (res.data.Status === "Success") {
            setAgencyList(res.data.data);
          } else {
            alert("something wrong,2 check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };

    const getPlants = () => {
      axios
        .get("https://cndofftakencr.in/api/getPlants")
        .then((res) => {
          console.log(res);
          if (res.data.Status === "Success") {
            setPlantList(res.data.data);
          } else {
            alert("something wrong,3 check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };

    getProds();
    getAgencies();
    getPlants();
  }, [filterProd]);

  const [queryData, setQueryData] = useState([]);

  const toggleSelection = (prodName, colIndex, plant) => {
    const key = `${prodName}%${agencyList[colIndex]?.agencyId}%${agencyList[colIndex]?.agency}%${plant.plantId}%${plant.location}`;

    // alert(key);
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);

      if (newSelected.has(key)) {
        // 🔹 If already selected, remove it
        newSelected.delete(key);

        // Also remove from queryData
        setQueryData((prevData) =>
          prevData.filter((item) => item.value !== key)
        );
      } else {
        // 🔹 If not selected, add it
        newSelected.add(key);

        // Add to queryData with quantity = 0
        setQueryData((prevData) => [...prevData, { value: key, quantity: 0 }]);
      }

      return newSelected;
    });
  };

  // ✅ Update quantity for a selected item
  const handleQuantityChange = (key, newQuantity) => {
    setQueryData((prevData) =>
      prevData.map((item) =>
        item.value === key ? { ...item, quantity: Number(newQuantity) } : item
      )
    );
  };

  const handleButtonClick = () => {
    console.log("Selected Items:", Array.from(selectedItems));

    // alert(Array.from(selectedItems).toString());
    setSelectionPopUp(!selectionPopUp);
  };

  const handleClearSelection = () => {
    setSelectedItems(new Set());
  };

  const companies = [
    {
      key: "indoEnviro",
      name: "Indo Enviro Integrated Solutions (P) Ltd.",
      locations: ["Shastri Park", "Ranikhera", "Gurugram"],
    },
    {
      key: "uttarDilli",
      name: "Uttar Dilli C&D Waste Recycling (P) Ltd.",
      locations: ["Burari"],
    },
    {
      key: "riseEleven",
      name: "Rise Eleven Delhi Waste Management Co.",
      locations: ["Ranikhera"],
    },
    {
      key: "ramky",
      name: "Ramky Reclamation and Recycling Ltd.",
      locations: ["Bakkarwala", "Noida"],
    },
  ];

  // const handleSelectItem = (itemId) => {
  //   console.log(itemId);

  //   setSelectedItems((prev) =>
  //     prev.includes(itemId)
  //       ? prev.filter((id) => id !== itemId)
  //       : [...prev, itemId]
  //   );
  // };

  const handleSendQuery = async () => {
    for (const item of selectedItems) {
      const [prodName, agencyId, agencyName, plantId, plantName] =
        item.split("%");

      const queryAmount =
        queryData.find((q) => q.value === item)?.quantity || 0;

      const plantEmail =
        plantList.find((p) => p.plantId === plantId)?.contactEmail || "";

      const cc = [
        "rahul.yadav@everenviro.com",
        "info.cnd@everenviro.com",
        "hashmat.raza@everenviro.com",
      ];

      if (!plantEmail) {
        alert(`No contact email found for plant ${plantName}`);
        continue;
      }

      const subject = encodeURIComponent(
        `Product Query - ${prodName} (${plantName})`
      );

      const body = encodeURIComponent(`
Dear ${plantName} Team,

Please find below the query details:

Product: ${prodName}
Agency: ${agencyName}
Plant: ${plantName}
${queryAmount ? "Quantity Required: " + queryAmount : ""}

Regards,
(Generated via System)
    `);

      const mailtoLink = `mailto:${plantEmail}?cc=${cc.join(
        ","
      )}&subject=${subject}&body=${body}`;

      // open in new tab/window
      window.open(mailtoLink, "_blank");

      // ⏱️ wait briefly before next to prevent popup blocking
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  };

  useEffect(() => {
    console.log(selectedItems);
    console.log(queryData);
  }, [selectedItems, queryData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-6">
            Inventory Status
          </h1>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={handleButtonClick}
              className="bg-[#029054] hover:bg-[#02AB6A] text-white font-medium py-2 px-6 rounded transition-colors duration-200"
            >
              Raise Requirement Query For Selected Items
            </button>
            <button
              onClick={handleClearSelection}
              className="bg-[#029054] hover:bg-[#02AB6A] text-white font-medium py-2 px-6 rounded transition-colors duration-200"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Inventory Table */}

        <section className="table-section">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="inventory-table w-full min-w-[900px]">
                <thead>
                  <tr>
                    <th className="bg-[#029054] text-white border-r border-green-500 text-xs sm:text-sm md:text-base font-semibold">
                      <div className="p-3 text-center font-semibold text-sm sm:text-base md:text-lg">
                        Products
                      </div>
                      {/* <div className="flex bg-[#02AB6A]">
                      <div className="flex-1 p-2 text-center text-sm border-r border-green-500">
                        <button
                          className="text-white hover:text-green-200"
                          onClick={() => {
                            if (plantExtend) {
                              setPlantOperatorExtend(false);
                              setPlantExtend(false);
                            } else {
                              setPlantOperatorExtend(!plantOperatorExtend);
                            }
                          }}
                        >
                          {plantOperatorExtend ? "Collapse" : "Expand"} <br />
                          Plant Op.
                        </button>
                      </div>
                      <div className="flex-1 p-2 text-center text-sm">
                        <button
                          className="text-white hover:text-green-200"
                          onClick={() => {
                            if (!plantExtend) {
                              setPlantOperatorExtend(true);
                              setPlantExtend(true);
                            } else {
                              setPlantOperatorExtend(false);
                              setPlantExtend(false);
                            }
                          }}
                        >
                          {plantExtend ? "Collapse" : "Extend"} <br />
                          Plant
                        </button>
                      </div>
                    </div> */}
                    </th>
                    {/* {!plantOperatorExtend && (
                    <th className="bg-[#029054] text-white">
                      {"Total Stock Count"}
                    </th>
                  )} */}
                    {plantOperatorExtend &&
                      agencyList.map((a, index) => (
                        <th
                          key={index}
                          className="bg-[#029054] text-white border-r border-green-500 agency-head"
                        >
                          {a.agency}
                        </th>
                      ))}
                  </tr>
                  <tr>
                    <th className="bg-[#029054] text-white border-r border-green-500 text-xs sm:text-sm md:text-base font-semibold">
                      <div className="p-2 flex items-center justify-center">
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={prodName}
                          onChange={(e) => {
                            setProdName(e.target.value);
                            setFilteredProdList(
                              prodList.filter((p) =>
                                p.prodName
                                  .toLowerCase()
                                  .includes(e.target.value.toLowerCase())
                              )
                            );
                          }}
                          className="w-full text-black px-2 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <label
                          onClick={() => {
                            setProdName("");
                            setFilteredProdList(prodList);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <FontAwesomeIcon
                            icon={faCircleXmark}
                            size="lg"
                            style={{ color: "white" }}
                          />
                        </label>
                      </div>
                    </th>
                    {plantExtend &&
                      agencyList.map((a, index) => (
                        <th
                          key={index}
                          className="bg-[#029054] border border-[#30BD52] text-white p-2 align-middle"
                        >
                          <div className="plants flex flex-row justify-center items-center gap-2 h-full">
                            {a.plants.map(
                              (ap, plantIndex) =>
                                ap.plantId !== "A001_P007" && (
                                  <span
                                    key={plantIndex}
                                    className="inline-block bg-[#02AB6A] w-[100px] text-white px-3 py-1 rounded text-xs font-medium text-center"
                                  >
                                    {
                                      plantList.find(
                                        (pl) => pl.plantId === ap.plantId
                                      )?.location
                                    }{" "}
                                  </span>
                                )
                            )}
                          </div>
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredProdList
                    // Filter: only include products with at least one plant having qnt > 0
                    .filter((item) =>
                      item.plantWise?.some((plant) => Number(plant?.qnt) > 0)
                    )
                    .map((item, rowIndex) => (
                      <tr
                        key={item.id || rowIndex}
                        className={`border-b border-gray-200 ${
                          rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="border-r border-gray-200 p-3 sm:p-4">
                          <div className="flex items-center gap-3 min-w-[220px]">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={`https://cndofftakencr.in/api${item?.prodImg}`}
                                alt="Product"
                                className="w-[50px] h-[40px] sm:w-[60px] sm:h-[45px] md:w-[70px] md:h-[50px] object-contain rounded"
                              />
                            </div>

                            {/* Product Name & Unit */}
                            <div className="flex flex-col text-left">
                              <span className="text-[11px] sm:text-sm md:text-base font-semibold text-gray-900 leading-snug">
                                {item.prodName}
                              </span>
                              <span className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                                {item.unit}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* When not in plantOperatorExtend mode */}
                        {/* {!plantOperatorExtend && (
                        <td className="text-gray-900">
                          {item.plantWise.reduce(
                            (sum, plantItem) => sum + (+plantItem?.qnt || 0),
                            0
                          )}
                        </td>
                      )} */}

                        {/* Agency-wise total quantities */}
                        {/* {plantOperatorExtend &&
                        !plantExtend &&
                        agencyList.map((ag, colIndex) => (
                          <td key={colIndex} className="text-gray-900">
                            {item.plantWise
                              .filter((plant) =>
                                ag.plants.some(
                                  (a) => a.plantId === plant.plantId
                                )
                              )
                              .reduce(
                                (sum, plantItem) =>
                                  sum + (Number(plantItem?.qnt) || 0),
                                0
                              )}
                          </td>
                        ))} */}

                        {/* Detailed plant-wise units */}
                        {plantExtend &&
                          agencyList.map((ag, colIndex) => (
                            <td key={colIndex}>
                              <div
                                className="plants text-gray-900"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  alignContent: "center",
                                }}
                              >
                                {ag.plants.map((agp, unitIndex) => {
                                  {
                                    /* const key = `${item?.prodName}-${ag?.agencyId}-${agp?.plantId}`; */
                                  }

                                  const plantLoc = plantList.find(
                                    (pl) => pl.plantId === agp.plantId
                                  )?.location;

                                  agp.location = plantLoc || agp.location;

                                  const key = `${item?.prodName}%${ag?.agencyId}%${ag?.agency}%${agp?.plantId}%${agp?.location}`;
                                  const isSelected = selectedItems.has(key);
                                  const isAvailable = item.plantWise?.find(
                                    (plw) => plw.plantId === agp.plantId
                                  );

                                  if (agp.plantId === "A001_P007") return null;

                                  console.log("generating : ", key);
                                  return (
                                    <div
                                      key={unitIndex}
                                      className={`units ${
                                        isSelected ? "selected" : ""
                                      } 
  text-xs sm:text-sm md:text-base font-semibold`}
                                      onClick={() => {
                                        if (isAvailable) {
                                          toggleSelection(
                                            item?.prodName,
                                            colIndex,
                                            agp
                                          );
                                        }
                                      }}
                                    >
                                      {isAvailable
                                        ? isAvailable.qnt > 0
                                          ? isAvailable.qnt
                                          : "--"
                                        : "--"}
                                      <br />
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            onClick={handleButtonClick}
            className="bg-[#029054] hover:bg-[#02AB6A] text-white font-medium py-2 px-6 rounded transition-colors duration-200"
          >
            Requirement Query For Selected Items
          </button>
          <button
            onClick={handleClearSelection}
            className="bg-[#029054] hover:bg-[#02AB6A] text-white font-medium py-2 px-6 rounded transition-colors duration-200"
          >
            Clear Selection
          </button>
        </div>
      </div>
      {selectionPopUp && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Popup */}
          <div className="relative flex flex-col bg-white border border-green-200 rounded-lg w-11/12 md:w-1/2 max-h-[80vh] min-h-[60vh] p-4 shadow-[0_0_80px_20px_rgba(0,128,0,0.25)]">
            {/* Header */}
            <h2 className="m-0 p-2 bg-gradient-to-r from-green-700 via-green-500 to-green-400 text-white rounded-t-lg flex justify-between items-center shadow-md">
              Selected Items{" "}
              <span
                className="bg-white text-green-700 rounded-md px-2 py-1 cursor-pointer text-lg hover:bg-green-700 hover:text-white transition"
                onClick={() => setSelectionPopUp(!selectionPopUp)}
              >
                ❌
              </span>
            </h2>

            {/* Column Headers */}
            <div className="grid grid-cols-[2fr_auto_2fr_auto_2fr_2fr] gap-3 px-3 py-2 bg-green-100 border border-green-200 rounded-md text-sm font-semibold text-green-900">
              <span className="text-center">Product</span>
              <span className="text-center">→</span>
              <span className="text-center">Agency</span>
              <span className="text-center">→</span>
              <span className="text-center">Plant</span>
              <span className="text-center">Required Quantity</span>
            </div>

            {/* Selected items list */}
            <ul className="flex-1 overflow-y-auto p-2 list-none m-0 space-y-3">
              {Array.from(selectedItems).map((item, index) => {
                const [prodName, agencyId, agency, plantId, plant] =
                  item.split("%");
                return (
                  <li
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-xl p-3 shadow-sm hover:translate-y-[-3px] hover:shadow-lg hover:bg-green-100 transition"
                  >
                    <div className="grid grid-cols-[2fr_auto_2fr_auto_2fr_1fr] items-start gap-3 font-sans leading-snug">
                      <span className="font-bold text-green-900 break-words text-center self-center">
                        {prodName}
                      </span>
                      <span className="text-gray-500 text-sm text-center self-center">
                        ⇒
                      </span>
                      <span className="font-medium text-green-700 break-words">
                        {agency}
                      </span>
                      <span className="text-gray-500 text-sm text-center self-center">
                        ⇒
                      </span>
                      <span className="font-medium text-green-600 break-words text-center self-center">
                        {plant}
                      </span>

                      {/* Quantity Input */}
                      <input
                        type="number"
                        min="0"
                        placeholder="Quantity"
                        className="w-full border border-green-300 rounded-md px-2 py-1 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
                        onChange={(e) =>
                          handleQuantityChange(item, e.target.value)
                        }
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Button */}
            <button
              className="self-center mt-3 px-6 py-3 bg-green-700 text-white rounded-md font-bold text-lg tracking-wide shadow-md hover:bg-green-800 hover:scale-[1.02] transition"
              onClick={() => setSelectionPopUp(!selectionPopUp)}
            >
              Send Requirement Query
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
