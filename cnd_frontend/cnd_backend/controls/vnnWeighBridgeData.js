import express from "express";
import axios from "axios";

const vnnrouter = express.Router();

// Proxy route: /api/weight-data
vnnrouter.get("/api/vnn-weight-data/:allData", async (req, res) => {
  try {
    const { allData } = req.params;

    console.log("Received request for allData:", allData); // Debugging line
    
    // Step 1: Get Access Token
    const tokenResponse = await axios.post(
      "https://everenviro-prd-z1veh80q.authentication.in30.hana.ondemand.com/oauth/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id:
          "sb-b5407119-6de1-476b-b3b3-8eddeec34fbb!b2263|it-rt-everenviro-prd-z1veh80q!b148",
        client_secret:
          "d0973dc0-445a-4dd3-be21-ebbce7cd0e2c$_y-Ta7bnPt0fsAd23_loJ8W82LKMdZTcetYxLbFpwx0=",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // console.log("Access Token:", accessToken); // Debugging line

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const ddp = String(today.getDate()-1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const yyyy = today.getFullYear();

    const currentDate = `${dd}-${mm}-${yyyy}`;
    const currentDateP = `${ddp}-${mm}-${yyyy}`;

    const prdResponse = await axios.post(
      "https://everenviro-prd-z1veh80q.it-cpi021-rt.cfapps.in30.hana.ondemand.com/http/HistoricalWeight_Data",
      {
        WeightBridgeID: "2003",
        WeightBridgeNo: "001",
        StartDate: allData === "allData" ? "01-08-2022" : currentDateP,
        EndDate: currentDate,
      },
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("Weight Data Response:", prdResponse); // Debugging line

    // Step 3: Send response back to frontend
    res.json(prdResponse.data["HistoricalWeight_Data_Res"]);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: "Failed to fetch weight data" });
  }
});

export default vnnrouter;
