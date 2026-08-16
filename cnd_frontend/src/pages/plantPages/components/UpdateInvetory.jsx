import axios from "axios";
import { useEffect, useState } from "react";

const UpdateInvetory = ({plantId}) => {
    const defaultForm = {
    plantId,
    prodDetails: [
      {
        prodName: "",
        addedQnt: "",
      },
    ],
  };

  const [formData, setFormData] = useState(defaultForm);

  const [prodList, setProdList] = useState([]);
  const [submited, setSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get("https://cndofftakencr.in/api/get_products")
      .then((res) => {
        console.log(res);
        if (res.data.status === "success") {
          setProdList(res.data.data);
        } else {
          alert("something wrong, check logs !!");
        }
      })
      .catch((err) => console.log(err));
  }, [submited]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://cndofftakencr.in/api/update_inventory",
        formData
      );
      if (response.data.Status === "Success") {
        alert("product added Successfully !!");
        setFormData(defaultForm);
        setSubmitted(!submited);
      } else {
        alert(`something wrong !! \n ${response.data.error}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

    return (
        <div className="w-full p-4">
  <h2 className="text-xl font-semibold text-[#393735] mb-6">Update Inventory</h2>

  <div className="form-cont">
    <form>
      <table className="w-full border border-black border-collapse text-center">
        <thead>
          <tr>
            <th className="border border-black text-[#393735] font-bold text-lg p-4 w-10 bg-[#EAEAEA]">Sno.</th>
            <th className="border border-black text-[#393735] font-bold text-lg p-4 w-1/2 bg-[#EAEAEA]">
              Product Name
            </th>
            <th className="border text-[#393735] border-black font-bold text-lg p-4 bg-[#EAEAEA]">
              Available Quantity
            </th>
            <th className="border text-[#393735] border-black font-bold text-lg p-4 bg-[#EAEAEA]">
              Quantity to Add
            </th>
            <th className="border text-[#393735] border-black font-bold text-lg p-4 bg-[#EAEAEA]">
              Total Quantity
            </th>
          </tr>
        </thead>

        <tbody>
          {prodList &&
            prodList.map((p, index) => {
              const plantIndex = p.plantWise.findIndex(
                (pl) => pl.plantId === plantId
              );

              if (!formData.prodDetails[index]) {
                setFormData((prevData) => {
                  const updatedProdDetails = [...prevData.prodDetails];
                  updatedProdDetails[index] = {
                    prodName: p.prodName,
                    addedQnt: "",
                  };
                  return { ...prevData, prodDetails: updatedProdDetails };
                });
              }

              return (
                <tr key={index}>
                  <td className="border border-black py-3 text-[#393735]">{index + 1}.</td>

                  <td className="border border-black bg-[#e7f8f3] text-[#393735] font-semibold px-6 py-3">
                    {p.prodName}
                  </td>

                  <td className="border text-[#393735] border-black py-3">
                    {plantIndex > -1 ? p.plantWise[plantIndex].qnt : 0}
                  </td>

                  <td className="border text-[#393735] border-black py-3">
                    <input
                      type="text"
                      id={`addedQnt-${index}`}
                      name="addedQnt"
                      value={formData.prodDetails[index]?.addedQnt}
                      onChange={(e) => {
                        const { value } = e.target;
                        setFormData((prevData) => {
                          const updatedProdDetails = [
                            ...prevData.prodDetails,
                          ];
                          updatedProdDetails[index] = {
                            ...updatedProdDetails[index],
                            addedQnt: value,
                            prodName: p.prodName,
                          };
                          return {
                            ...prevData,
                            prodDetails: updatedProdDetails,
                          };
                        });
                      }}
                      required
                      className="bg-[#E6E2D9] w-5/6 mx-auto block border border-gray-400 rounded-md p-2 focus:outline-none focus:border-gray-500"
                    />
                  </td>

                  <td className="border text-[#393735] border-black py-3">
                    {plantIndex > -1 && formData.prodDetails[index]?.addedQnt
                      ? +formData.prodDetails[index].addedQnt +
                        +p.plantWise[plantIndex].qnt
                      : p.plantWise[plantIndex]?.qnt || 0}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Update Inventory
        </button>
      </div>
    </form>
  </div>

  <hr className="my-6 border-gray-400" />
</div>

    )
};

export default UpdateInvetory;