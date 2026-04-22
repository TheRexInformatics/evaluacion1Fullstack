// src/containers/DashboardContainer.jsx
import { useState, useEffect } from "react";
import DashboardView from "../components/DashboardView";
import { bffFacade } from "../facade/BffFacade";

export default function DashboardContainer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función asíncrona dentro del useEffect
    const loadDashboard = async () => {
      try {
        setLoading(true);
        // ¡Magia del Patrón Facade! El contenedor no sabe de dónde vienen los datos.
        const dashboardData = await bffFacade.getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError("Error de conexión con el BFF de SmartLogix.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []); // El array vacío asegura que se ejecute solo una vez al cargar

  return (
    <DashboardView 
      loading={loading} 
      error={error} 
      data={data} 
      activeSection="Dashboard" 
    />
  );
}