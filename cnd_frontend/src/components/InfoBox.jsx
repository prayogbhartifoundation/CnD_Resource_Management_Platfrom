import axios from "axios";
import { useEffect, useState } from "react";

const InfoBox = ({plantOperators}) => {

    const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://cndofftakencr.in/api/getNews");
        setNewsList(response.data.data);
      } catch (err) {
        console.error("Failed to fetch news", err);
      }
    };

    fetchNews();
  },[]);

    return (
        <div className="flex-1 w-full rounded-md flex flex-col items-center p-4 bg-green-800">
  <h3 className="text-xl font-semibold text-white mb-3">Notifications</h3>

  <div className="w-full flex flex-col items-center p-4 bg-white rounded-md shadow-md overflow-auto">
    {newsList.length === 0 ? (
      <p className="text-gray-600">No news messages yet.</p>
    ) : (
      <ul className="list-none w-full m-0 p-0">
        {newsList.map((news, index) => (
          <li
            key={index}
            className="p-3 border-b border-gray-300 mb-2 last:mb-0 last:border-none"
          >
            <p className="mt-1 font-medium text-gray-800">
              {news.message}
              <i className="block text-xs text-gray-500 mt-1">
                {
                  plantOperators?.find(
                    (operator) => operator?.agencyId === news?.sender
                  )?.agency
                }
              </i>
              <i className="block text-xs text-gray-500">
                {new Date(news.date).toLocaleString()}
              </i>
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

    )
};

export default InfoBox;