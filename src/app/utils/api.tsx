const BASE_URL = "http://localhost:5000/api";

// Route pour avoir tous les produits
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/product/get-all`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des ventes rapides");
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// recuperer les produits par Id
export const fetchProductById = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/product/${id}`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des ventes rapides");
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
 
};

// Connexion utilisateur
export const userLogin = async () =>{
  try {
    const response = await fetch(`${BASE_URL}/user/register`)
    if (!response.ok) throw new Error("Erreur lors de la récupération des ventes rapides");
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
 
}

// inscription de l'utilisateur
export const register = async () =>{
  try {
    const response = await fetch(`${BASE_URL}/user/register`)
    if (!response.ok) throw new Error("Erreur lors de la récupération des ventes rapides");
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
 
}

// recuperer les plus vendu
export const fetchQuickSales = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/quick-sales`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des ventes rapides");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// recuperer les meilleurs vendeurs
export const fetchBestSellers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/best-sellers`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des meilleures ventes");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// recuperer le produit le plus note
export const fetchTopRated = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/top-rated`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des meilleures notes");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// recuperer les nouveaux produits
export const fetchNewArrivals = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/new-arrivals`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des nouveaux arrivages");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// route pour que admin ajoute des produits 
export const addProduct = async () => {
  try {
    const response = await fetch(`${BASE_URL}/product/add-product`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des ventes rapides");
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};