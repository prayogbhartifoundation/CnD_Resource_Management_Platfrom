import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ProductList = () => {
  const products = [
    {
      id: 1,
      name: "GSB 53 - 200mm",
      category: "Aggregated Clearance",
      subcategory: "Aggregate 53-200mm (PCA)",
      image: "/api/placeholder/200/150"
    },
    {
      id: 2,
      name: "Blocks 400x200x200 mm (M40 Grade)",
      category: "Blocks",
      image: "/api/placeholder/200/150"
    },
    {
      id: 3,
      name: "Paver & Tiles (600mm) (M40 Grade)",
      category: "Paver & Tiles",
      image: "/api/placeholder/200/150"
    },
    {
      id: 4,
      name: "Manufacturing Sand (M40 Grade)",
      category: "Manufacturing Sand",
      image: "/api/placeholder/200/150"
    },
    {
      id: 5,
      name: "Stone Dust",
      category: "Stone Dust",
      image: "/api/placeholder/200/150"
    },
    {
      id: 6,
      name: "Bricks 230x115x75 mm (M5 Grade)",
      category: "Bricks",
      image: "/api/placeholder/200/150"
    },
    {
      id: 7,
      name: "Chippings Tiles (25mm) (M40 Grade)",
      category: "Chippings Tiles",
      image: "/api/placeholder/200/150"
    },
    {
      id: 8,
      name: "Recycled Aggregate 20mm (M)",
      category: "Recycled Aggregate",
      image: "/api/placeholder/200/150"
    },
    {
      id: 9,
      name: "Screened Soil",
      category: "Screened Soil",
      image: "/api/placeholder/200/150"
    },
    {
      id: 10,
      name: "Kerb Stone 300x200x100 mm (M25 Grade)",
      category: "Kerb Stone",
      image: "/api/placeholder/200/150"
    },
    {
      id: 11,
      name: "Tech Tiles (60mm) (M40 Grade)",
      category: "Tech Tiles",
      image: "/api/placeholder/200/150"
    },
    {
      id: 12,
      name: "Recycled Aggregate 20mm (M)",
      category: "Recycled Aggregate",
      image: "/api/placeholder/200/150"
    },
    {
      id: 13,
      name: "Blocks 400x200x200 mm (M40 Grade)",
      category: "Blocks",
      image: "/api/placeholder/200/150"
    },
    {
      id: 14,
      name: "Paver & Tiles (60mm) (M40 Grade)",
      category: "Paver & Tiles",
      image: "/api/placeholder/200/150"
    },
    {
      id: 15,
      name: "Recycled Aggregate 40mm (M)",
      category: "Recycled Aggregate",
      image: "/api/placeholder/200/150"
    },
    {
      id: 16,
      name: "Blocks 400x200x200 mm (M40 Grade)",
      category: "Blocks",
      image: "/api/placeholder/200/150"
    },
    {
      id: 17,
      name: "Paver & Tiles (60mm) (M40 Grade)",
      category: "Paver & Tiles",
      image: "/api/placeholder/200/150"
    }
  ];
  const navigate = useNavigate();

  const [productList, setProductList] = useState([]);
  const [filteredProdList, setFilteredProdList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [agency, setAgency] = useState([]);
  const [selectedProd, setSelectedProd] = useState(-1);
  const [prodName, setProdName] = useState("");

  useEffect(() => {
    const getProds = async () => {
      try {
        const res = await axios.get("https://cndofftakencr.in/api/get_products");
        if (res.data.status?.toLowerCase() === "success") {
          setProductList(res.data.data);
          setFilteredProdList(res.data.data);
        } else {
          console.log("something went wrong, check logs")
        }
      } catch (error) {
        console.error(error);
      }
    }

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

    const getPlants = async () => {
      try {
        const res = await axios.get("https://cndofftakencr.in/api/getPlants");
        console.log(res);
        if (res.data.Status?.toLowerCase() === "success") {
          setPlantList(res.data.data);
        } else {
          alert("Something went wrong, check logs!");
        }
      } catch (err) {
        console.log(err);
      }
    };

    getProds();
    getAgencies();
    getPlants();

  }, [])

  useEffect(() => {
    if (selectedProd !== -1) {
      const selectedProduct = filteredProdList[selectedProd];
      if (selectedProduct) {
        const agencies = Array.from(
          new Set(
            selectedProduct?.plantWise
              .map((pw) =>
                agencyList.find((a) =>
                  a.plants.some((ap) => ap.plantId === pw.plantId)
                )
              )
              .filter(Boolean) // Removes undefined values
          )
        );
        setAgency(agencies);
      }
    }
  }, [selectedProd, filteredProdList, agencyList])
  console.log("filtered: ", filteredProdList);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-6">C&D Product List</h1>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={prodName}
            onChange={(e) => {
              setProdName(e.target.value);
              setFilteredProdList(
                productList.filter((p) =>
                  p.prodName
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
                )
              );
            }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProdList.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Product Image */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <div className="w-full h-full bg-[#F9FAFB] flex items-center justify-center">
                  {product.prodImg ? (
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                        <img
                          src={product?.prodImg ? `https://cndofftakencr.in/api${product?.prodImg}` : product.prodName}
                          alt={product.prodName}
                          className="w-full h-full object-cover rounded"
                        /></div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500">Product Image</p>
                    </div>
                  )}
                  {/* <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500">Product Image</p>
                  </div> */}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200">
                <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                  {product.prodName}
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                  {product.category}
                </p>

                {/* View Inventory Button */}
                <button
                  onClick={() =>
                      navigate("/inventory", {
                        state: { filterProd: product.prodName },
                      })
                    }
                    className="w-full bg-green-700 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  View Inventory
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          {/* <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
            Load More Products
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductList;