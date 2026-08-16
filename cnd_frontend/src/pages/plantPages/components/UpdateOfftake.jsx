import { useEffect, useState } from "react";
import departments from "../../../data/departments";
import axios from "axios";

const UpdateOfftake = ({ plantId }) => {
  const defaultForm = departments.map((d) => ({
    department: d,
    offtakeData: [
      {
        agencyId: "", // Needs user input
        plantId,
        offtakeValue: "",
        offtakeDate: new Date().toISOString(),
      },
    ],
  }));

  const defaultPreForm = departments.map((d) => ({
    department: d,
    annualTarget: [
      {
        finYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        offtakeTarget: "",
      },
    ],
    offtakeData: [
      {
        agencyId: "", // Needs user input
        plantId,
        offtakeValue: "",
        offtakeDate: "",
      },
    ],
  }));

  const [formData, setFormData] = useState(defaultForm);
  const [preFormData, setPreFormData] = useState(defaultPreForm);
  const [plant, setPlant] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [offtake, setOfftake] = useState([]);

  const [previousYearEditOn, setPreviousYearEditOn] = useState(false);
  const [previousYear, setPreviousYear] = useState(new Date().getFullYear());
  const [previousYearData, setPreviousYearData] = useState([]);

  const [customOfftakeDateEnabled, setCustomOfftakeDateEnabled] =
    useState(false);

  // const [privateOfftakeDateEnabled, setPrivateOfftakeDateEnabled] =
  //   useState(false);

  const [showPrivateModal, setShowPrivateModal] = useState(false);

  const [privateRows, setPrivateRows] = useState([
    {
      privateEntity: "",
      offtakeValue: "",
      offtakeDate: new Date().toISOString().split("T")[0],
    },
  ]);

  const [selectedOfftakeDate, setSelectedOfftakeDate] = useState("");

  useEffect(() => {
    console.log("Pre Form Data:", preFormData);
  }, [preFormData]);

  useEffect(() => {
    if (!plantId) return;

    axios
      .post("https://cndofftakencr.in/api/getPlant", { plantId })
      .then((res) => {
        if (res.data.Status === "Success") {
          setPlant(res.data.data);
        } else {
          console.error("Unexpected API response:", res);
          alert("Something went wrong, check logs!");
        }
      })
      .catch((err) => console.error("API Error:", err));

    const getOfftake = async () => {
      try {
        const res = await axios.get("https://cndofftakencr.in/api/getDeptOfftake");
        if (res.data.Status?.toLowerCase() === "success") {
          setOfftake(res.data.data);
        } else {
          alert("Something went wrong, check logs!");
        }
      } catch (err) {
        console.log(err);
      }
    };

    getOfftake();
  }, [submitted, plantId]);

  const handleChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index].offtakeData[0][field] = value;

      if (field === "offtakeValue") {
        updatedData[index].offtakeData[0]["offtakeDate"] =
          selectedOfftakeDate || new Date().toISOString();
      }

      return updatedData;
    });
  };
  const handlePreValueChange = (index, field, value) => {
    setPreFormData((prevData) => {
      const updatedData = [...prevData];

      if (field === "offtakeValue") {
        updatedData[index].offtakeData[0][field] = value;
        updatedData[index].offtakeData[0]["agencyId"] = plantId.split("_")[0];
        updatedData[index].offtakeData[0]["offtakeDate"] =
          selectedOfftakeDate ||
          new Date(previousYear, 11, 31).toISOString().split("T")[0];
      } else {
        updatedData[index].annualTarget[0][field] = value;
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const dataToSend = (previousYearEditOn ? preFormData : formData).filter(
    //   (entry) =>
    //     entry.offtakeData?.some(
    //       (d) => d.offtakeValue && Number(d.offtakeValue) > 0
    //     )
    // );

    const dataToSend = (previousYearEditOn ? preFormData : formData).filter(
      (entry) =>
        entry.offtakeData?.some(
          (d) => d.offtakeValue && Number(d.offtakeValue)
        )
    );

    if (dataToSend.length === 0) {
      alert("No valid entries to update.");
      return;
    }

    try {
      const response = await axios.put(
        "https://cndofftakencr.in/api/updateDeptOfftake",
        dataToSend
      );

      if (response.status === 200) {
        alert("All Department OFFtakes Updated Successfully!");
        setFormData(defaultForm);
        setPreFormData(defaultPreForm);
        setPreviousYearEditOn(false);
        setSubmitted(!submitted);
      } else {
        alert(`Something went wrong! \n ${response.data.error}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrivateSubmit = async () => {
  const validRows = privateRows.filter(
    (r) => r.offtakeValue && Number(r.offtakeValue) !== 0
  );

  if (!validRows.length) {
    alert("Please enter valid private offtake values");
    return;
  }

  const payload = [
    {
      department: "Private",
      offtakeData: validRows.map((r) => ({
        agencyId: "PRIVATE",
        plantId,
        offtakeValue: r.offtakeValue,
        offtakeDate: r.offtakeDate,
        offtakeEntity: r.privateEntity,
      })),
    },
  ];

  try {
    await axios.put(
      "https://cndofftakencr.in/api/updateDeptOfftake",
      payload
    );

    alert("Private Offtake Updated Successfully");
    setShowPrivateModal(false);
    setPrivateRows([
      {
        privateEntity: "",
        offtakeValue: "",
        offtakeDate: new Date().toISOString().split("T")[0],
      },
    ]);
    setSubmitted(!submitted);
  } catch (err) {
    console.error(err);
    alert("Error saving private offtake");
  }
};


  return (
    <div className="w-full">
      {/* ---- Action Panel ---- */}

      <div className="w-full mx-auto p-4 bg-white rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <button
            className="bg-blue-600 text-white font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            onClick={handleSubmit}
          >
            Update
          </button>

          <button
            className="bg-blue-600 text-white font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            onClick={() => setPreviousYearEditOn(!previousYearEditOn)}
          >
            {previousYearEditOn ? "Cancel" : "Edit Previous Year"}
          </button>

          {previousYearEditOn && (
            <div className="flex items-center gap-3">
              <label htmlFor="previousYear" className="font-medium">
                Previous Year:
              </label>
              <input
                type="number"
                id="previousYear"
                value={previousYear}
                onChange={(e) => {
                  setPreviousYear(e.target.value);
                  setPreFormData(
                    defaultPreForm.map((d) => {
                      const offtakeRecord = offtake.find(
                        (of) =>
                          of.department === d.department &&
                          of.finYear ===
                            `${e.target.value}-${+e.target.value + 1}`
                      );
                      return {
                        ...d,
                        annualTarget: [
                          {
                            finYear: `${e.target.value}-${+e.target.value + 1}`,
                            offtakeTarget:
                              offtakeRecord?.annualTarget[0]?.offtakeTarget,
                          },
                        ],
                        offtakeData:
                          offtakeRecord?.offtakeData || d.offtakeData,
                      };
                    })
                  );
                }}
                className="border border-gray-400 rounded-md p-2 focus:outline-none focus:border-gray-500 w-20"
              />
              <input
                type="number"
                id="previousYear"
                value={+previousYear + 1}
                onChange={(e) => setPreviousYear(e.target.value)}
                className="border border-gray-400 rounded-md p-2 focus:outline-none focus:border-gray-500 w-20"
              />
            </div>
          )}

          <button
            className="bg-blue-600 text-white font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            onClick={() =>
              setCustomOfftakeDateEnabled(!customOfftakeDateEnabled)
            }
          >
            {customOfftakeDateEnabled ? "Cancel Date" : "Change Offtake Date"}
          </button>

          {customOfftakeDateEnabled && (
            <div className="mt-2 flex items-center gap-3">
              <label htmlFor="offtakeDate" className="font-medium">
                Pick Offtake Date:
              </label>
              <input
                type="date"
                id="offtakeDate"
                value={selectedOfftakeDate}
                onChange={(e) => setSelectedOfftakeDate(e.target.value)}
                className="border border-gray-400 rounded-md p-2 focus:outline-none focus:border-gray-500"
              />
            </div>
          )}
        </div>

        <button
          className="bg-blue-600 text-white font-medium px-5 py-2 rounded-md hover:bg-blue-700"
          onClick={() => setShowPrivateModal(true)}
        >
          Enter Private Offtake
        </button>

        {showPrivateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[90%] max-w-4xl p-6 shadow-lg">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Private Offtake Entry</h2>
                <button
                  onClick={() => setShowPrivateModal(false)}
                  className="text-red-600 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border border-black border-collapse text-center">
                  <thead>
                    <tr className="bg-[#EAEAEA]">
                      <th className="border border-black p-2">Sno</th>
                      <th className="border border-black p-2">
                        Private Entity
                      </th>
                      <th className="border border-black p-2">Offtake Value</th>
                      <th className="border border-black p-2">Offtake Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {privateRows.map((row, index) => (
                      <tr key={index}>
                        <td className="border border-black">{index + 1}</td>

                        <td className="border border-black">
                          <input
                            type="text"
                            value={row.privateEntity}
                            onChange={(e) => {
                              const updated = [...privateRows];
                              updated[index].privateEntity = e.target.value;
                              setPrivateRows(updated);
                            }}
                            className="w-full p-2 border"
                          />
                        </td>

                        <td className="border border-black">
                          <input
                            type="number"
                            value={row.offtakeValue}
                            onChange={(e) => {
                              const updated = [...privateRows];
                              updated[index].offtakeValue = e.target.value;
                              setPrivateRows(updated);
                            }}
                            className="w-full p-2 border"
                          />
                        </td>

                        <td className="border border-black">
                          <input
                            type="date"
                            value={row.offtakeDate}
                            onChange={(e) => {
                              const updated = [...privateRows];
                              updated[index].offtakeDate = e.target.value;
                              setPrivateRows(updated);
                            }}
                            className="w-full p-2 border"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() =>
                    setPrivateRows([
                      ...privateRows,
                      {
                        privateEntity: "",
                        offtakeValue: "",
                        offtakeDate: new Date().toISOString().split("T")[0],
                      },
                    ])
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  + Add Row
                </button>

                <button
                  onClick={handlePrivateSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                  Save Private Offtake
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---- Form Section ---- */}
      <div className="form-cont mt-6">
        <form>
          <div className="overflow-x-auto">
            <table className="w-full border border-black border-collapse text-center bg-white">
              <thead>
                <tr>
                  <th className="border bg-[#EAEAEA] border-black font-bold text-lg text-[#393735] p-4 w-12">
                    Sno.
                  </th>
                  <th className="border bg-[#EAEAEA] border-black font-bold text-[#393735] text-lg p-4 min-w-[50%]">
                    Department
                  </th>
                  <th className="border bg-[#EAEAEA] border-black font-bold text-lg text-[#393735] p-4">
                    Target
                  </th>
                  {previousYearEditOn && (
                    <th className="border bg-[#EAEAEA] text-[#393735] border-black font-bold text-lg p-4">
                      Offtake Value
                    </th>
                  )}
                  {!previousYearEditOn && (
                    <>
                      <th className="border bg-[#EAEAEA] text-[#393735] border-black font-bold text-lg p-4">
                        Entry So Far
                      </th>
                      <th className="border bg-[#EAEAEA] border-black font-bold text-[#393735] text-lg p-4">
                        New Entry
                      </th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody>
                {(!previousYearEditOn ? formData : preFormData).map(
                  (entry, index) => {
                    const offtakeRecord = offtake.find(
                      (of) => of.department === entry.department
                    );

                    return (
                      <tr key={entry.department}>
                        <td className="border border-black py-3 text-[#393735]">
                          {index + 1}
                        </td>
                        <td className="border border-black bg-[#fbfbfb]  text-[#393735] font-semibold px-6 py-3 text-wrap break-words">
                          {entry.department}
                        </td>
                        <td className="border border-black py-3 text-[#393735]">
                          {offtakeRecord?.annualTarget?.find(
                            (at) =>
                              at.finYear ===
                              `${previousYear}-${+previousYear + 1}`
                          )?.offtakeTarget || "0"}
                        </td>

                        {!previousYearEditOn && (
                          <td className="border border-black py-3 text-[#393735]">
                            <label className="block text-sm">
                              {(() => {
                                const currentDate = new Date();
                                const currentYear = currentDate.getFullYear();
                                const fyStart = new Date(
                                  currentDate.getMonth() >= 3
                                    ? currentYear
                                    : currentYear - 1,
                                  3,
                                  1
                                );
                                const fyEnd = new Date(
                                  currentDate.getMonth() >= 3
                                    ? currentYear + 1
                                    : currentYear,
                                  2,
                                  31,
                                  23,
                                  59,
                                  59
                                );
                                const filteredData =
                                  offtakeRecord?.offtakeData
                                    ?.filter((ofp) => {
                                      const entryDate = new Date(
                                        ofp.offtakeDate
                                      );
                                      return (
                                        ofp.plantId === plantId &&
                                        Number(ofp.offtakeValue) !== 0 &&
                                        entryDate >= fyStart &&
                                        entryDate <= fyEnd
                                      );
                                    })
                                    ?.sort(
                                      (a, b) =>
                                        new Date(b.offtakeDate) -
                                        new Date(a.offtakeDate)
                                    ) || [];
                                const totalValue = filteredData.reduce(
                                  (sum, ofp) => sum + Number(ofp.offtakeValue),
                                  0
                                );
                                const latestEntry = filteredData[0];
                                return (
                                  <>
                                    <b>{totalValue.toFixed(2)}</b>
                                    <br />
                                    <span className="text-xs text-gray-600 block">
                                      {latestEntry
                                        ? `Last: ${
                                            latestEntry.offtakeValue
                                          } on ${new Date(
                                            latestEntry.offtakeDate
                                          ).toLocaleDateString("en-GB")}`
                                        : "No entries this FY"}
                                    </span>
                                  </>
                                );
                              })()}
                            </label>
                          </td>
                        )}

                        <td className="border border-black py-3">
                          <input
                            type="text"
                            value={entry.offtakeData[0].offtakeValue}
                            onChange={(e) =>
                              previousYearEditOn
                                ? handlePreValueChange(
                                    index,
                                    "offtakeValue",
                                    e.target.value
                                  )
                                : handleChange(
                                    index,
                                    "offtakeValue",
                                    e.target.value
                                  )
                            }
                            required
                            className="bg-[#E6E2D9] text-black w-5/6 mx-auto block border border-gray-400 rounded-md p-2 focus:outline-none focus:border-gray-500"
                          />
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOfftake;
