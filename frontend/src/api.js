const BASE_URL = "http://127.0.0.1:8000";

export const api = {
  // Existing Endpoints
  getInquiries: () => fetch(`${BASE_URL}/inquiry/`).then(res => res.json()),
  getLivestock: () => fetch(`${BASE_URL}/livestock/`).then(res => res.json()),
  getGallery: () => fetch(`${BASE_URL}/gallery/`).then(res => res.json()),
  getContact: () => fetch(`${BASE_URL}/contact/`).then(res => res.json()),
  getFaq: () => fetch(`${BASE_URL}/faq/`).then(res => res.json()),
  getVisitingInfo: () => fetch(`${BASE_URL}/visiting-info/`).then(res => res.json()),
  getLivestockWeight: () => fetch(`${BASE_URL}/livestock-weight/`).then(res => res.json()),
  getEidSales: () => fetch(`${BASE_URL}/eid-sales/`).then(res => res.json()),
  getQurbaniPrep: () => fetch(`${BASE_URL}/qurbani-prep/`).then(res => res.json()),
  getPremiumQurbani: () => fetch(`${BASE_URL}/premium-qurbani/`).then(res => res.json()),

  // Issues #26 and #27
  getEidBooking: () => fetch(`${BASE_URL}/eid-booking/`).then(res => res.json()),
  getAboutUs: () => fetch(`${BASE_URL}/about-us/`).then(res => res.json()),
};