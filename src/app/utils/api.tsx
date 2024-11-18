const BASE_URL = "http://localhost:5000/api";

export const fetchProducts = async () => {
  const response = await fetch(`${BASE_URL}/product/get-all`);
  return response.json();
};

export const fetchProductById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/product/${id}`);
  return response.json();
};



const API_BASE_URL = "http://localhost:5000/api/products";

export const fetchQuickSales = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/quick-sales`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des ventes rapides");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchBestSellers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/best-sellers`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des meilleures ventes");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchTopRated = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/top-rated`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des meilleures notes");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchNewArrivals = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/new-arrivals`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des nouveaux arrivages");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
