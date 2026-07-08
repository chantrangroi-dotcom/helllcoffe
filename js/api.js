// =======================================
// Coffee Booking API Configuration
// =======================================

// Menu
const BASE_URL_DATA = "https://6a4bd218f5eab0bb6b638622.mockapi.io";

const API_DRINKS = `${BASE_URL_DATA}/drinks`;
const API_CATEGORIES = `${BASE_URL_DATA}/categories`;

// Booking
const BASE_URL_BOOKING = "https://6a4bd3e6f5eab0bb6b638a4c.mockapi.io";

const API_TABLES = `${BASE_URL_BOOKING}/tables`;
const API_RESERVATIONS = `${BASE_URL_BOOKING}/reservations`;
const API_ORDERS = `${BASE_URL_BOOKING}/orders`;

// =======================================
// Kiểm tra kết nối API
// =======================================

async function checkApi(url, name) {
    try {
        const res = await fetch(url);

        if (!res.ok) {
            console.error(`❌ ${name}: ${res.status}`);
            return;
        }

        const data = await res.json();
        console.log(`✅ ${name}:`, data);

    } catch (err) {
        console.error(`❌ ${name}:`, err);
    }
}

function checkApiConnections() {
    console.log("========== CHECK API ==========");

    checkApi(API_DRINKS, "Drinks");
    checkApi(API_CATEGORIES, "Categories");
    checkApi(API_TABLES, "Tables");
    checkApi(API_RESERVATIONS, "Reservations");
    checkApi(API_ORDERS, "Orders");
}

checkApiConnections();