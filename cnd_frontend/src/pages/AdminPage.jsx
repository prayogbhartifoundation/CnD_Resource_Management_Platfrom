import AgencyHome from "./AgencyHome";
import PlantHome from "./plantPages/PlantHome";

const AdminPage = () => {

    const userType = localStorage.getItem("userType");

    return (
        userType === "agency"
        ? <AgencyHome />
        : userType === "plant"
        ? <PlantHome />
        : "Select User Type"
    )
};

export default AdminPage;