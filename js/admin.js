// ===============================
// Coffee Booking Admin Dashboard
// ===============================

function loadDashboard() {

    // Tổng đồ uống
    fetch(API_DRINKS)
        .then(res => res.json())
        .then(data => {
            document.getElementById("totalDrinks").innerText = data.length;
        });

    // Tổng danh mục
    fetch(API_CATEGORIES)
        .then(res => res.json())
        .then(data => {
            document.getElementById("totalCategories").innerText = data.length;
        });

    // Tổng bàn
    fetch(API_TABLES)
        .then(res => res.json())
        .then(data => {
            document.getElementById("totalTables").innerText = data.length;
        });

    // Tổng đơn đặt bàn
    fetch(API_RESERVATIONS)
        .then(res => res.json())
        .then(data => {
            document.getElementById("totalReservations").innerText = data.length;
        });

}

// Tự động load khi mở Dashboard
loadDashboard();