// =======================================
// Coffee Booking API Configuration
// =======================================

// Cấu hình cơ sở dữ liệu Menu (Đồ uống & Danh mục)
const BASE_URL_DATA = "https://6a4bd218f5eab0bb6b638622.mockapi.io";

const API_DRINKS = `${BASE_URL_DATA}/drinks`;
const API_CATEGORIES = `${BASE_URL_DATA}/categories`;

// =======================================

// Cấu hình cơ sở dữ liệu Booking & Đặt chỗ (Bàn, Đơn đặt bàn, Đơn hàng)
const BASE_URL_BOOKING = "https://6a4bd3e6f5eab0bb6b638a4c.mockapi.io";

const API_TABLES = `${BASE_URL_BOOKING}/tables`;
const API_RESERVATIONS = `${BASE_URL_BOOKING}/reservations`;
const API_ORDERS = `${BASE_URL_BOOKING}/orders`;

// =======================================
// Hàm tiện ích kiểm tra nhanh kết nối API
// =======================================

function checkApiConnections() {
    console.log("🔗 Đang kiểm tra kết nối tới các MockAPI...");
    
    [
        { name: "Drinks API", url: API_DRINKS },
        { name: "Categories API", url: API_CATEGORIES },
        { name: "Tables API", url: API_TABLES },
        { name: "Reservations API", url: API_RESERVATIONS }
    ].forEach(api => {
        fetch(api.url, { method: "HEAD" })
            .then(res => {
                if (res.ok) {
                    console.log(`✅ Kết nối thành công: ${api.name}`);
                } else {
                    console.warn(`⚠️ Phản hồi bất thường từ: ${api.name} (Status: ${res.status})`);
                }
            })
            .catch(() => {
                console.error(`❌ Mất kết nối hoặc lỗi mạng tới: ${api.name}`);
            });
    });
}

// Gọi ngầm kiểm tra kết nối khi nạp file API
checkApiConnections();