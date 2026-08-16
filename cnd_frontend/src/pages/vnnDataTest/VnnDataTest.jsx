const VnnDataTest = () => {

    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const [token, setToken] = useState(null);
const fetchWeightData = async () => {
  try {
    setLoading(true);
    const response = await axios.get("/api/vnn-weight-data");

    console.log("response:", response); // Log the full response for debugging
    
    setData(
      response.data?.HistoricalWeight_Data_Res?.HistoricalWeight_Data || []
    );
  } catch (err) {
    console.error(err);
    setError("Failed to fetch data");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    // Initial fetch
    fetchWeightData();

    // Set interval for 15 mins
    // const intervalId = setInterval(() => {
    //   fetchWeightData();
    // }, 15 * 60 * 1000); // 15 minutes

    // // Cleanup
    // return () => clearInterval(intervalId);
  }, []);

    return (
        <></>
    )
};

export default VnnDataTest;