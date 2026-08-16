import axios from "axios";
import { useEffect, useState } from "react";
import departments from "../data/departments";

const OfftakeTargetUpload = () => {

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
        agencyId: "-1", // Needs user input
        plantId: "-1",
        offtakeValue: "",
        offtakeDate: "",
      },
    ],
  }));

  const [preFormData, setPreFormData] = useState(defaultPreForm);

  const [previousYearEditOn, setPreviousYearEditOn] = useState(false);
  const [previousYear, setPreviousYear] = useState(new Date().getFullYear());
  const [previousYearData, setPreviousYearData] = useState([]);
  const [offtake, setOfftake] = useState([]);

  useEffect(() => {
    console.log("Pre Form Data:", preFormData);
  }, [preFormData]);

  useEffect(() => {
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
  }, []);

  const handlePreValueChange = (index, field, value) => {
    setPreFormData((prevData) => {
      const updatedData = [...prevData];

      if (field === "offtakeValue") {
        updatedData[index].offtakeData[0][field] = value;
        updatedData[index].offtakeData[0]["offtakeDate"] = new Date(
          previousYear,
          11,
          31
        )
          .toISOString()
          .split("T")[0];
        console.log("no-go zone");
      } else {
        updatedData[index].annualTarget[0][field] = value;
        
      }

      return updatedData;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "https://cndofftakencr.in/api/updateDeptOfftakeTarget",
        preFormData // Sending the entire list
      );
      if (response.status === 200) {
        alert("All Department OFFtakes Updated Successfully!");
        setPreFormData(defaultPreForm);
        // setSubmitted(!submitted);
      } else {
        alert(`Something went wrong! \n ${response.data.error}`);
      }
    } catch (err) {
      console.log(err);
    }
  };


    return (
        <></>
    )
};

export default OfftakeTargetUpload;