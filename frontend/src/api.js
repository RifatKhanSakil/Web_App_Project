// frontend/src/api.js

const BASE_URL = "http://127.0.0.1:8000";
const API_BASE_URL = `${BASE_URL}/api`;

// --- Token & User Session Helpers ---
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getAuthToken = () => localStorage.getItem("token");

export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Helper function to handle fetch responses and throw cleanly formatted error strings
const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: res.statusText }));
    let errorMessage = "API Request Failed";
    
    if (typeof errorData.detail === "string") {
      errorMessage = errorData.detail;
    } else if (Array.isArray(errorData.detail)) {
      errorMessage = errorData.detail.map(err => err.msg || JSON.stringify(err)).join(", ");
    } else if (errorData.message) {
      errorMessage = errorData.message;
    } else if (typeof errorData === "string") {
      errorMessage = errorData;
    } else {
      errorMessage = JSON.stringify(errorData);
    }
    
    throw new Error(errorMessage);
  }
  return res.json();
};

// Helper for authorized headers
export const getAuthHeaders = (isFormData = false) => {
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const authHeader = getAuthHeader();
  if (authHeader.Authorization) {
    headers["Authorization"] = authHeader.Authorization;
  }

  return headers;
};

// --- Authentication Requests ---
export const signIn = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await handleResponse(response);
  if (data.access_token) {
    setAuthToken(data.access_token);
  }
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
};

export const signUp = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await handleResponse(response);
  if (data.access_token) {
    setAuthToken(data.access_token);
  }
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
};

export const signOut = () => {
  setAuthToken(null);
  localStorage.removeItem("user");
  return Promise.resolve(true);
};

// Aliases for Auth Functions
export const login = signIn;
export const register = signUp;
export const logout = signOut;

export const fetchCurrentUser = () =>
  fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  }).then(handleResponse);

// --- GET Requests ---

export const getInquiries = () =>
  fetch(`${API_BASE_URL}/inquiries/`, { headers: getAuthHeaders() })
    .then(handleResponse);

// Livestock / Animals Listing with filtering
export const getLivestock = (category, isFeatured) => {
  let url = `${API_BASE_URL}/animals/`;
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (isFeatured !== undefined && isFeatured !== null) {
    params.append("is_featured", isFeatured);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  return fetch(url).then(handleResponse);
};

export const getLivestockById = (id) =>
  fetch(`${API_BASE_URL}/animals/${id}`).then(handleResponse);

// Aliases for Livestock/Animals
export const getAnimals = getLivestock;
export const fetchAnimals = getLivestock;
export const getAnimalById = getLivestockById;

// General Content Queries
export const getGallery = () =>
  fetch(`${API_BASE_URL}/gallery/`).then(handleResponse);

export const getContact = () =>
  fetch(`${API_BASE_URL}/contact/`).then(handleResponse);

export const getFaq = () =>
  fetch(`${API_BASE_URL}/faq/`).then(handleResponse);

export const getVisitingInfo = () =>
  fetch(`${API_BASE_URL}/visiting-info/`).then(handleResponse);

export const getLivestockWeight = () =>
  fetch(`${API_BASE_URL}/livestock-weight/`).then(handleResponse);

export const getEidSales = () =>
  fetch(`${API_BASE_URL}/eid-sales/`).then(handleResponse);

export const getQurbaniPrep = () =>
  fetch(`${API_BASE_URL}/qurbani-prep/`).then(handleResponse);

export const getPremiumQurbani = () =>
  fetch(`${API_BASE_URL}/premium-qurbani/`).then(handleResponse);

export const getEidBooking = () =>
  fetch(`${API_BASE_URL}/bookings/`).then(handleResponse);

export const getAboutUs = () =>
  fetch(`${API_BASE_URL}/about-us/`).then(handleResponse);

// --- POST / PUT / PATCH / DELETE Requests ---

export const uploadAnimalWithImage = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/animals/`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: formData,
  });
  return handleResponse(response);
};

export const createInquiry = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/inquiries/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return handleResponse(response);
};

export const submitContactForm = createInquiry;

export const submitContactMessage = async (formData) => {
  const payload = {
    name: formData.fullName || formData.name,
    email: formData.email,
    message: formData.message,
  };

  const response = await fetch(`${API_BASE_URL}/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const deleteInquiry = async (inquiryId) => {
  const response = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createEidBooking = async (bookingData) => {
  const response = await fetch(`${API_BASE_URL}/bookings/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData),
  });
  return handleResponse(response);
};

export const createAnimal = async (animalData) => {
  const response = await fetch(`${API_BASE_URL}/animals/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(animalData),
  });
  return handleResponse(response);
};

export const updateAnimal = async (animalId, animalData) => {
  const response = await fetch(`${API_BASE_URL}/animals/${animalId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(animalData),
  });
  return handleResponse(response);
};

export const updateAnimalStatus = async (animalId, availabilityStatus) => {
  const response = await fetch(`${API_BASE_URL}/animals/${animalId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ availability_status: availabilityStatus }),
  });
  return handleResponse(response);
};

export const deleteAnimal = async (animalId) => {
  const response = await fetch(`${API_BASE_URL}/animals/${animalId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// --- Combined Default Object ---
export const api = {
  signIn,
  signUp,
  signOut,
  login,
  register,
  logout,
  getCurrentUser,
  fetchCurrentUser,
  getInquiries,
  getLivestock,
  getLivestockById,
  getAnimals,
  fetchAnimals,
  getAnimalById,
  getGallery,
  getContact,
  getFaq,
  getVisitingInfo,
  getLivestockWeight,
  getEidSales,
  getQurbaniPrep,
  getPremiumQurbani,
  getEidBooking,
  getAboutUs,
  api_uploadAnimalWithImage: uploadAnimalWithImage,
  createInquiry,
  submitContactForm,
  submitContactMessage,
  deleteInquiry,
  createEidBooking,
  createAnimal,
  updateAnimal,
  updateAnimalStatus,
  deleteAnimal,
};

export default api;