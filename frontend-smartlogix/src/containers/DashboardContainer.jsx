// src/containers/DashboardContainer.jsx
import { useState, useEffect } from "react";
import DashboardView from "../components/DashboardView";
import { bffFacade } from "../facade/BffFacade";

export default function DashboardContainer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const dashboardData = await bffFacade.getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError("Error de conexión con el BFF de SmartLogix.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
    const interval = setInterval(loadDashboard, 15_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardView 
      loading={loading} 
      error={error} 
      data={data} 
      activeSection="Dashboard" 
    />
  );
}