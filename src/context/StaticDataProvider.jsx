import axios from "axios";
import { useEffect, useState } from "react";
import StaticDataContext from "./staticDataContext";

axios.defaults.baseURL = (import.meta.env.VITE_API_BASE_URL ?? "") + "/";
axios.defaults.withCredentials = true;

const StaticDataProvider = ({ children }) => {
  const [staticData, setStaticData] = useState({});

  useEffect(() => {
    const getStaticData = async () => {
      const response = await axios.get(`index/staticData`);
      setStaticData(response.data || {});
    };
    getStaticData();
  }, []);

  return (
    <StaticDataContext.Provider value={staticData}>
      {children}
    </StaticDataContext.Provider>
  );
};

export default StaticDataProvider;
