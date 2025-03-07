import React, { useEffect, useState } from "react";
import "../styles/InventoryStatusPage.css";
import axios from "axios";



function InventoryStatusPageBeta() {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const [prodList, setProdList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);

  const [prodName, setProdName] = useState("");
  const [filteredProdList, setFilteredProdList] = useState([]);

  const [selectionPopUp, setSelectionPopUp] = useState(false);

  useEffect(() => {
    const getProds = () => {
      axios
        .get("http://localhost:8081/api/get_products")
        .then((res) => {
          console.log(res);
          if (res.data.status === "success") {
            setProdList(res.data.data);
            setFilteredProdList(res.data.data);
          } else {
            alert("something wrong,1 check logs !!");
          }
        })
        .catch((err) => console.log(err));
    };
    const getAgencies = () => {
      axios
        .get("http://localhost:8081/api/getAgencies")
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
        .get("http://localhost:8081/api/getPlants")
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
  }, []);

  const toggleSelection = (rowIndex, colIndex, unitIndex) => {
    const key = `${filteredProdList[rowIndex].prodName}-${agencyList[colIndex].agencyId}-${plantList[unitIndex].plantId}`;
    console.log(key);

    // const key = `${rowIndex}-${colIndex}-${unitIndex}`;
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(key)) {
        newSelected.delete(key);
      } else {
        newSelected.add(key);
      }
      return newSelected;
    });
  };

  const handleButtonClick = () => {
    console.log("Selected Items:", Array.from(selectedItems));

    // alert(Array.from(selectedItems).toString());
    setSelectionPopUp(!selectionPopUp);
  };

  const handleClearSelection = () => {
    setSelectedItems(new Set());
  };

  return (
    <div className="inventory-status-page">
      {/* Header */}
      <header className="inventory-header">
        <h1>Inventory Status</h1>
      </header>
      {/* Main Content */}
      <main className="inventory-content">
        <div className="inventory-layout">
          {/* Table Section */}
          <section className="table-section">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Products</th>
                  {agencyList.map((a, index) => (
                    <th>{a.agency}</th>
                  ))}
                </tr>
                <tr>
                  <th>
                    <div className="inp-box">
                      <label htmlFor="">🔍</label>
                      <input
                        type="text"
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
                      />
                    </div>
                  </th>

                  {agencyList.map((a, index) => (
                    <th>
                      <div className="plants">
                        {a.plants.map((ap, index) => (
                          <span>{plantList.find((pl) => pl.plantId === ap.plantId)?.location}</span>
                        ))}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredProdList.map((pr, rowIndex) => (
                  <tr key={rowIndex}>
                    <td style={{ fontWeight: "bold" }}>{pr.prodName}</td>

                    {agencyList.map((ag, colIndex) => (
                      <td key={colIndex}>
                        <div className="plants">
                          {ag.plants.map((agp, unitIndex) => {
                            const key = `${filteredProdList[rowIndex]?.prodName}-${agencyList[colIndex]?.agencyId}-${plantList[unitIndex]?.plantId}`;
                            const isSelected = selectedItems.has(key);
                            const isAvailable = pr.plantWise?.find(
                              (plw) => plw.plantId === agp.plantId
                            );
                            return (
                              <div
                                key={unitIndex}
                                className={`units ${
                                  isSelected ? "selected" : ""
                                }`}
                                onClick={() => {
                                  if (isAvailable) {
                                    toggleSelection(
                                      rowIndex,
                                      colIndex,
                                      unitIndex
                                    );
                                  }
                                }}
                              >
                                {isAvailable ? isAvailable.qnt : "--"}
                                {/* {Math.floor(Math.random() * 999) + 1} */}
                                <br />
                                <small>as of 4-1-25</small>
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
          </section>
        </div>

        {/* Action Button */}
        <div className="button-container">
          <button onClick={handleButtonClick} className="query-button">
            Raise requirement query for Selected items
          </button>
          <button onClick={handleClearSelection} className="query-button">
            Clear Selection
          </button>
        </div>

        {/* Document Section */}
        <section className="document-section">
          <h2>Material Test Reports</h2>
          <div className="document-cards">
            <div className="doc-card">
              <b>Doc Button Card</b>
            </div>
          </div>
        </section>
      </main>

      {selectionPopUp && (
        <div className="selection-popup-box">
          <div class="selection-overlay"></div>
          <div className="selection-popup">
            <h2>Selected Items <span className="close-button" onClick={() => setSelectionPopUp(!selectionPopUp)}>❌</span></h2>
            <ul>
              {Array.from(selectedItems).map((item) => {
                const [prodName, agencyId, plantId] = item.split("-");
                return (
                  <li>
                    <b>{prodName}</b> ==&gt; <b>{agencyId}</b> ==&gt; <b>{plantId}</b> 
                  </li>
                );
              })}
            </ul>

            <button className="query-button" onClick={() => setSelectionPopUp(!selectionPopUp)}>Send Requirement Query</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default InventoryStatusPageBeta;
