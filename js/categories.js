// =========================
// Coffee Booking Admin
// Quản lý Danh mục
// =========================

let categories = [];

loadCategories();

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
        title: "🗑 Xóa danh mục?",
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
// Load danh sách danh mục từ API
// =========================

function loadCategories() {
    fetch(API_CATEGORIES)
        .then(res => res.json())
        .then(data => {
            categories = data;
            renderTable(categories);
        })
        .catch(() => {
            errorAlert("Không thể tải danh sách danh mục từ máy chủ.");
        });
}

// =========================
// Hiển thị dữ liệu ra bảng
// =========================

function renderTable(list) {
    const tbody = document.getElementById("tableCategory");
    
    if (!list || list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox fs-3 d-block mb-1"></i> Không tìm thấy danh mục phù hợp
                </td>
            </tr>
        `;
        return;
    }

    let html = "";

    list.forEach(category => {
        html += `
            <tr class="animate__animated animate__fadeIn align-middle">
                <td class="text-center fw-semibold text-secondary" style="width: 100px;">#${category.id}</td>
                <td class="fw-bold text-dark ps-3">${category.name}</td>
                <td class="text-center" style="width: 200px;">
                    <button class="btn btn-outline-warning btn-sm rounded-pill px-3 me-1" onclick="editCategory('${category.id}')">
                        <i class="bi bi-pencil me-1"></i> Sửa
                    </button>
                    <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="deleteCategory('${category.id}')">
                        <i class="bi bi-trash me-1"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// =========================
// Lưu thông tin danh mục (Thêm / Sửa)
// =========================

function saveCategory() {
    const id = document.getElementById("categoryId").value;
    const category = {
        name: document.getElementById("categoryName").value.trim()
    };

    if (category.name === "") {
        errorAlert("Vui lòng nhập tên danh mục hợp lệ.");
        return;
    }

    const url = id === "" ? API_CATEGORIES : `${API_CATEGORIES}/${id}`;
    const method = id === "" ? "POST" : "PUT";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(category)
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(() => {
        const actionText = id === "" ? "Đã thêm danh mục thành công!" : "Đã cập nhật danh mục thành công!";
        successAlert(actionText);
        showToast(id === "" ? "Đã thêm danh mục" : "Đã cập nhật");
        closeModal();
        loadCategories();
    })
    .catch(() => {
        errorAlert("Không thể lưu danh mục. Vui lòng thử lại.");
    });
}

// =========================
// Chuẩn bị dữ liệu để Sửa danh mục
// =========================

function editCategory(id) {
    const category = categories.find(item => item.id == id);

    if (!category) {
        errorAlert("Không tìm thấy danh mục.");
        return;
    }

    document.getElementById("categoryId").value = category.id;
    document.getElementById("categoryName").value = category.name;

    new bootstrap.Modal(document.getElementById("categoryModal")).show();
}

// =========================
// Xóa danh mục
// =========================

function deleteCategory(id) {
    confirmDelete(function () {
        fetch(`${API_CATEGORIES}/${id}`, {
            method: "DELETE"
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(() => {
            successAlert("Đã xóa danh mục thành công!");
            showToast("Đã xóa danh mục");
            loadCategories();
        })
        .catch(() => {
            errorAlert("Không thể xóa danh mục này.");
        });
    });
}

// =========================
// Đóng và Reset Modal
// =========================

function closeModal() {
    document.getElementById("categoryId").value = "";
    document.getElementById("categoryName").value = "";

    const modalElement = document.getElementById("categoryModal");
    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
        modal.hide();
    }
}

// Lắng nghe sự kiện mở modal thêm mới để reset form sạch sẽ
document.querySelector('[data-bs-target="#categoryModal"]')?.addEventListener("click", () => {
    closeModal();
});

// =========================
// Tìm kiếm theo thời gian thực
// =========================

document.getElementById("searchCategory")?.addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();
    const result = categories.filter(item =>
        item.name.toLowerCase().includes(keyword)
    );
    renderTable(result);
});