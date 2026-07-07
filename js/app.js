// =====================================
// COFFEE BOOKING APP
// app.js (Đã tối ưu & sửa lỗi)
// =====================================

// ==========================
// BIẾN TOÀN CỤC
// ==========================

let drinks = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ==========================
// KHI TRANG LOAD
// ==========================

document.addEventListener("DOMContentLoaded", () => {
    loadDrinks();
    updateCartCount();
    renderCart();
    initSearch();
    initCategory();
    initPayment(); // Đảm bảo hàm này được khai báo bên dưới
});

// ==========================
// LẤY DANH SÁCH ĐỒ UỐNG
// ==========================

function loadDrinks() {
    fetch(API_DRINKS)
        .then(res => {
            if (!res.ok) {
                throw new Error("Không lấy được dữ liệu");
            }
            return res.json();
        })
        .then(data => {
            drinks = data;
            renderDrinks(drinks);
        })
        .catch(err => {
            console.error(err);
            alert("Không thể tải danh sách đồ uống.");
        });
}

// ==========================
// HIỂN THỊ MENU
// ==========================

function renderDrinks(list) {
    const drinkList = document.getElementById("drinkList");
    if (!drinkList) return;

    if (list.length === 0) {
        drinkList.innerHTML = `<div class="col-12 text-center text-muted py-4">Không tìm thấy sản phẩm phù hợp.</div>`;
        return;
    }

    let html = "";
    list.forEach(drink => {
        html += `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 shadow">
                <div class="position-relative">
                    <img src="${drink.image}" class="card-img-top" style="height:220px;object-fit:cover;" alt="${drink.name}">
                    <span class="badge bg-danger position-absolute top-0 end-0 m-2">BEST SELLER</span>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="fw-bold">${drink.name}</h5>
                    <p class="text-secondary">
                        <i class="bi bi-tag-fill text-warning"></i> ${drink.category}
                    </p>
                    <h4 class="text-danger">${Number(drink.price).toLocaleString()} đ</h4>
                    <p>
                        ⭐⭐⭐⭐⭐ <small class="text-muted">(4.9)</small>
                    </p>
                    <button class="btn btn-warning mb-2" onclick="showDetail('${drink.id}')">
                        <i class="bi bi-eye-fill"></i> Xem chi tiết
                    </button>
                    <button class="btn btn-success mt-auto" onclick="addToCart('${drink.id}')">
                        <i class="bi bi-cart-plus-fill"></i> Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
        `;
    });
    drinkList.innerHTML = html;
}

// ==========================
// TÌM KIẾM
// ==========================

function initSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
        const keyword = this.value.trim().toLowerCase();
        if (keyword === "") {
            renderDrinks(drinks);
            return;
        }

        const result = drinks.filter(drink =>
            drink.name.toLowerCase().includes(keyword) ||
            drink.category.toLowerCase().includes(keyword)
        );
        renderDrinks(result);
    });
}

// ==========================
// LỌC THEO DANH MỤC
// ==========================

function initCategory() {
    const buttons = document.querySelectorAll(".category-btn");
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            // Xử lý active class cho button (tuỳ chọn giao diện)
            buttons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const category = this.dataset.category;
            if (category === "Tất cả") {
                renderDrinks(drinks);
                return;
            }

            const result = drinks.filter(drink => drink.category === category);
            renderDrinks(result);
        });
    });
}

// ==========================
// KHỞI TẠO THANH TOÁN (Bổ sung hàm thiếu)
// ==========================

function initPayment() {
    const btnFinish = document.getElementById("btnFinishPayment");
    if (btnFinish) {
        btnFinish.addEventListener("click", finishPayment);
    }
}

// ==========================
// MODAL CHI TIẾT
// ==========================

function showDetail(id) {
    const drink = drinks.find(item => String(item.id) === String(id));
    if (!drink) return;

    document.getElementById("modalImage").src = drink.image;
    document.getElementById("modalName").innerText = drink.name;
    document.getElementById("modalPrice").innerText = Number(drink.price).toLocaleString() + " đ";
    document.getElementById("modalCategory").innerText = drink.category;
    document.getElementById("modalDescription").innerText = drink.description;

    const modalEl = document.getElementById("drinkModal");
    if (modalEl) {
        new bootstrap.Modal(modalEl).show();
    }
}

// ==========================
// THÊM VÀO GIỎ HÀNG
// ==========================

function addToCart(id) {
    const drink = drinks.find(item => String(item.id) === String(id));
    if (!drink) {
        alert("Không tìm thấy sản phẩm!");
        return;
    }

    const index = cart.findIndex(item => String(item.id) === String(id));
    if (index >= 0) {
        cart[index].quantity++;
    } else {
        cart.push({
            id: drink.id,
            name: drink.name,
            price: Number(drink.price),
            image: drink.image,
            quantity: 1
        });
    }

    saveCart();
    alert("🛒 Đã thêm vào giỏ hàng!");
}

// ==========================
// LƯU GIỎ HÀNG
// ==========================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// ==========================
// CẬP NHẬT BADGE GIỎ HÀNG
// ==========================

function updateCartCount() {
    const badge = document.getElementById("cartCount");
    if (!badge) return;

    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.innerText = total;
}

// ==========================
// HIỂN THỊ GIỎ HÀNG
// ==========================

function renderCart() {
    const body = document.getElementById("cartBody");
    if (!body) return;

    body.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        body.innerHTML = `
        <tr>
            <td colspan="5" class="text-center text-muted py-3">
                Giỏ hàng đang trống
            </td>
        </tr>
        `;
        document.getElementById("cartTotal").innerText = "0 đ";
        const payment = document.getElementById("paymentTotal");
        if (payment) payment.innerText = "0 đ";
        return; // Dừng lại luôn nếu giỏ hàng trống
    }

    let html = "";
    cart.forEach(item => {
        const money = item.price * item.quantity;
        total += money;
        html += `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" width="60" height="60" class="rounded me-2" style="object-fit:cover;" alt="${item.name}">
                    <strong>${item.name}</strong>
                </div>
            </td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="changeQuantity('${item.id}', -1)">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-sm btn-secondary" onclick="changeQuantity('${item.id}', 1)">+</button>
            </td>
            <td>${Number(item.price).toLocaleString()} đ</td>
            <td class="text-danger fw-bold">${Number(money).toLocaleString()} đ</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeCart('${item.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });

    body.innerHTML = html;

    const cartTotalEl = document.getElementById("cartTotal");
    if (cartTotalEl) cartTotalEl.innerText = total.toLocaleString() + " đ";

    const payment = document.getElementById("paymentTotal");
    if (payment) payment.innerText = total.toLocaleString() + " đ";
}

// ==========================
// THAY ĐỔI SỐ LƯỢNG
// ==========================

function changeQuantity(id, value) {
    const item = cart.find(x => String(x.id) === String(id));
    if (!item) return;

    item.quantity += value;
    if (item.quantity <= 0) {
        cart = cart.filter(x => String(x.id) !== String(id));
    }

    saveCart();
}

// ==========================
// XÓA 1 SẢN PHẨM
// ==========================

function removeCart(id) {
    cart = cart.filter(item => String(item.id) !== String(id));
    saveCart();
}

// ==========================
// XÓA TOÀN BỘ GIỎ HÀNG
// ==========================

function clearCart() {
    if (!confirm("Bạn muốn xóa toàn bộ giỏ hàng?")) return;
    cart = [];
    saveCart();
}

// ==========================
// THANH TOÁN
// ==========================

function finishPayment() {
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = {
        customer: "Khách lẻ",
        date: new Date().toLocaleString("vi-VN"),
        total: total,
        status: "Đã thanh toán",
        items: cart
    };

    fetch(API_ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(() => {
        alert("🎉 Thanh toán thành công!");
        cart = [];
        saveCart();

        const modalEl = document.getElementById("paymentModal");
        if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
    })
    .catch(() => {
        alert("Không thể lưu đơn hàng!");
    });
}