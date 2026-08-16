import { useState } from "react";
import DownloadComponent from "../components/DownloadComponent";


const Download = (
  {
    setShowForm,
  isRegistered,
  formData,
  setFormData,
  }
) => {
  // const [showForm, setShowForm] = useState(false);
  // const [formData, setFormData] = useState({
  //   name: "",
  //   mobile: "",
  //   email: "",
  //   organisation: "",
  // });

    return (
        <>
       
        <DownloadComponent 
        setShowForm={setShowForm} 
        formData={formData}
        setFormData={setFormData}
        />

        </>
    )
};

export default Download;