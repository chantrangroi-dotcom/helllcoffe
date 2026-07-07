// =========================
// Coffee Booking Admin
// Quản lý Đồ uống
// =========================

let drinks = [];

loadDrinks();

// =========================
// Cấu hình Toast (SweetAlert2)
// =========================

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#212529",
    color: "#fff"
});

// =========================
// Popup thành công (Kèm Confetti)
// =========================

function successAlert(message) {
    confetti({
        particleCount: 180,
        spread: 120,
        origin: { y: 0.6 }
    });

    Swal.fire({
        icon: "success",
        title: "🎉 Thành công",
        html: `<h4>${message}</h4>`,
        confirmButtonColor: "#198754",
        width: 650,
        background: "#fff",
        backdrop: `
            rgba(0,0,0,.6)
            blur(8px)
        `,
        showClass: {
            popup: "animate__animated animate__zoomIn"
        },
        hideClass: {
            popup: "animate__animated animate__zoomOut"
        }
    });
}

// =========================
// Popup lỗi
// =========================

function errorAlert(message) {
    Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra!",
        text: message,
        confirmButtonColor: "#dc3545"
    });
}

// =========================
// Toast nhỏ thông báo nhanh
// =========================

function showToast(message) {
    Toast.fire({
        icon: "success",
        title: message
    });
}

// =========================
// Hộp thoại xác nhận xóa
// =========================

function confirmDelete(callback) {
    Swal.fire({
        title: "🗑 Xóa đồ uống?",
        html: "<b>Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống!</b>",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}

// =========================
// Load danh sách đồ uống từ API
// =========================

function loadDrinks() {
    fetch(API_DRINKS)
        .then(res => res.json())
        .then(data => {
            drinks = data;
            renderTable(drinks);
        })
        .catch(() => {
            errorAlert("Không thể tải danh sách đồ uống từ máy chủ.");
        });
}

// =========================
// Hiển thị dữ liệu ra bảng
// =========================

function renderTable(list) {
    const tbody = document.getElementById("tableDrink");
    
    if (!list || list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox fs-3 d-block mb-1"></i> Không tìm thấy đồ uống phù hợp
                </td>
            </tr>
        `;
        return;
    }

    let html = "";

    list.forEach(drink => {
        html += `
            <tr class="animate__animated animate__fadeIn align-middle">
                <td class="text-center fw-semibold text-secondary">#${drink.id}</td>
                <td class="text-center">
                    <img src="${drink.image}" width="65" height="65" class="shadow-sm" style="object-fit: cover; border-radius: 12px;" onerror="this.src='https://placehold.co/65x65?text=No+Img'">
                </td>
                <td class="fw-bold text-dark">${drink.name}</td>
                <td class="text-danger fw-bold font-monospace">
                    ${Number(drink.price).toLocaleString()} đ
                </td>
                <td>
                    <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 rounded-pill">
                        ${drink.category}
                    </span>
                </td>
                <td class="text-center">
                    <button class="btn btn-outline-warning btn-sm rounded-pill px-3 me-1" onclick="editDrink('${drink.id}')">
                        <i class="bi bi-pencil me-1"></i> Sửa
                    </button>
                    <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="deleteDrink('${drink.id}')">
                        <i class="bi bi-trash me-1"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// =========================
// Lưu thông tin đồ uống (Thêm / Sửa)
// =========================

function saveDrink() {
    const id = document.getElementById("drinkId").value;
    const drink = {
        name: document.getElementById("name").value.trim(),
        price: Number(document.getElementById("price").value),
        category: document.getElementById("category").value.trim(),
        image: document.getElementById("image").value.trim(),
        description: document.getElementById("description").value.trim()
    };

    if (
        drink.name === "" ||
        drink.price <= 0 ||
        drink.category === "" ||
        drink.image === ""
    ) {
        errorAlert("Vui lòng nhập đầy đủ thông tin hợp lệ (giá tiền > 0).");
        return;
    }

    const url = id === "" ? API_DRINKS : `${API_DRINKS}/${id}`;
    const method = id === "" ? "POST" : "PUT";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(drink)
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(() => {
        const actionText = id === "" ? "Đã thêm đồ uống thành công!" : "Đã cập nhật đồ uống thành công!";
        successAlert(actionText);
        showToast(id === "" ? "Đã thêm đồ uống" : "Đã cập nhật");
        closeModal();
        loadDrinks();
    })
    .catch(() => {
        errorAlert("Không thể lưu đồ uống. Vui lòng thử lại.");
    });
}

// =========================
// Chuẩn bị dữ liệu để Sửa đồ uống
// =========================

function editDrink(id) {
    const drink = drinks.find(item => item.id == id);

    if (!drink) {
        errorAlert("Không tìm thấy đồ uống.");
        return;
    }

    document.getElementById("drinkId").value = drink.id;
    document.getElementById("name").value = drink.name;
    document.getElementById("price").value = drink.price;
    document.getElementById("category").value = drink.category;
    document.getElementById("image").value = drink.image;
    document.getElementById("description").value = drink.description;

    new bootstrap.Modal(document.getElementById("drinkModal")).show();
}

// =========================
// Xóa đồ uống
// =========================

function deleteDrink(id) {
    confirmDelete(function () {
        fetch(`${API_DRINKS}/${id}`, {
            method: "DELETE"
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(() => {
            successAlert("Đã xóa đồ uống thành công!");
            showToast("Đã xóa đồ uống");
            loadDrinks();
        })
        .catch(() => {
            errorAlert("Không thể xóa đồ uống này.");
        });
    });
}

// =========================
// Đóng và Reset Modal
// =========================

function closeModal() {
    document.getElementById("drinkId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").value = "";
    document.getElementById("image").value = "";
    document.getElementById("description").value = "";

    const modalElement = document.getElementById("drinkModal");
    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
        modal.hide();
    }
}

// Lắng nghe sự kiện mở modal thêm mới để reset form sạch sẽ
document.querySelector('[data-bs-target="#drinkModal"]')?.addEventListener("click", () => {
    closeModal();
});

// =========================
// Tìm kiếm theo thời gian thực
// =========================

document.getElementById("searchAdmin")?.addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();
    const result = drinks.filter(item =>
        item.name.toLowerCase().includes(keyword)
    );
    renderTable(result);
});