import axios from "axios";
import { useEffect, useState } from "react";

const ProdImageUpload = () => {

    const [prodList, setProdList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const getProds = async () => {
      try {
        const res = await axios.get("https://cndofftakencr.in/api/get_products");
        console.log(res.data.status?.toLowerCase());
        if (res.data.status?.toLowerCase() === "success") {
          setProdList(res.data.data);
        } else {
          alert("Something went wrong, check logs!");
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getAgencies = async () => {
      try {
        const res = await axios.get("https://cndofftakencr.in/api/getAgencies");
        console.log(res);
        if (res.data.Status?.toLowerCase() === "success") {
          setAgencyList(res.data.data);
        } else {
          alert("Something went wrong, check logs!");
        }
      } catch (err) {
        console.log(err);
      }
    };

    getProds();
    getAgencies();
  }, [submitted]);

  const handleProdImageUpload = async (e, prodId, field) => {
    const files = e.target.files;
    const formData = new FormData();

    if (field === "prodImg") {
      formData.append("prodImg", files[0]); // ✅ matches backend's .single("logo")
    }

    try {
      const response = await fetch(
        `https://cndofftakencr.in/api/upload/prodImg/${prodId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Upload successful:", data);
        setSubmitted(!submitted);
        // alert("Upload successful!");
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleAgencyImageUpload = async (e, agencyId, field) => {
    const files = e.target.files;
    const formData = new FormData();

    if (field === "logo") {
      formData.append("logo", files[0]); // ✅ matches backend's .single("logo")
    }

    try {
      const response = await fetch(
        `https://cndofftakencr.in/api/upload/logo/${agencyId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Upload successful:", data);
        setSubmitted(!submitted);
        // alert("Upload successful!");
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

    return (
<div className="w-full flex flex-col md:flex-row gap-4">
  {/* Product Image Table */}
  <div className="w-full bg-gray-50 p-4 rounded shadow-sm overflow-x-auto">
    <h3 className="text-xl font-bold mb-4">Product Image Table</h3>

    <table className="w-full border-collapse border border-black text-sm">
      <thead className="bg-gray-300 font-bold">
        <tr>
          <th className="border border-black px-4 py-2">Sno.</th>
          <th className="border border-black px-4 py-2">Product Name</th>
          <th className="border border-black px-4 py-2">Image Upload</th>
          <th className="border border-black px-4 py-2">Image</th>
        </tr>
      </thead>

      <tbody>
        {prodList.map((prod, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="border border-black px-4 py-2">{index + 1}</td>
            <td className="border border-black px-4 py-2">{prod.prodName}</td>
            <td className="border border-black px-4 py-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleProdImageUpload(e, prod?.prodId, "prodImg")
                }
              />
            </td>
            <td className="border border-black px-4 py-2">
              <img
                src={`https://cndofftakencr.in/api${prod?.prodImg}`}
                alt="Product"
                className="w-[70px] h-[50px] object-cover"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Agency Image Table */}
  <div className="w-full bg-gray-50 p-4 rounded shadow-sm overflow-x-auto">
    <h3 className="text-xl font-bold mb-4">Agency Image Table</h3>

    <table className="w-full border-collapse border border-black text-sm">
      <thead className="bg-gray-300 font-bold">
        <tr>
          <th className="border border-black px-4 py-2">Sno.</th>
          <th className="border border-black px-4 py-2">Agency Name</th>
          <th className="border border-black px-4 py-2">Image Upload</th>
          <th className="border border-black px-4 py-2">Image</th>
        </tr>
      </thead>

      <tbody>
        {agencyList.map((item, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="border border-black px-4 py-2">{index + 1}</td>
            <td className="border border-black px-4 py-2">{item.agency}</td>
            <td className="border border-black px-4 py-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleAgencyImageUpload(e, item?.agencyId, "logo")
                }
              />
            </td>
            <td className="border border-black px-4 py-2">
              <img
                src={`https://cndofftakencr.in/api${item?.logo}`}
                alt="Agency"
                className="w-[70px] h-[50px] object-cover"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    )
};


export default ProdImageUpload;
