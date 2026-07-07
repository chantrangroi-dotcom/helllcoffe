// =========================
// Coffee Booking Admin
// Quản lý bàn
// =========================

let tables = [];

loadTables();

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
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
    });

    Swal.fire({
        icon: "success",
        title: "🎉 Thành công",
        text: message,
        confirmButtonColor: "#198754"
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
        title: "🗑 Xóa bàn?",
        text: "Bạn chắc chắn muốn xóa bàn này khỏi hệ thống?",
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
// Load danh sách bàn từ API
// =========================

function loadTables() {
    // Hiển thị trạng thái đang tải nhẹ nếu cần
    fetch(API_TABLES)
        .then(res => res.json())
        .then(data => {
            tables = data;
            renderTable(data);
        })
        .catch(() => {
            errorAlert("Không thể tải danh sách bàn từ máy chủ.");
        });
}

// =========================
// Hiển thị dữ liệu ra bảng
// =========================

function renderTable(list) {
    const tbody = document.getElementById("tableTables");
    
    if (!list || list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox fs-3 d-block mb-1"></i> Không tìm thấy dữ liệu bàn phù hợp
                </td>
            </tr>
        `;
        return;
    }

    let html = "";

    list.forEach(table => {
        let badgeClass = "bg-success-subtle text-success border border-success-subtle";
        let dotColor = "bg-success";

        if (table.status === "Đã đặt") {
            badgeClass = "bg-warning-subtle text-warning border border-warning-subtle";
            dotColor = "bg-warning";
        } else if (table.status === "Đang phục vụ") {
            badgeClass = "bg-danger-subtle text-danger border border-danger-subtle";
            dotColor = "bg-danger";
        }

        html += `
            <tr class="animate__animated animate__fadeIn">
                <td class="text-center fw-semibold text-secondary">#${table.id}</td>
                <td class="ps-3 fw-bold text-dark">${table.name}</td>
                <td class="text-center">${table.capacity} người</td>
                <td class="text-center">
                    <span class="badge ${badgeClass} px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1 justify-content-center">
                        <span class="rounded-circle ${dotColor}" style="width: 6px; height: 6px;"></span>
                        ${table.status}
                    </span>
                </td>
                <td class="text-center">
                    <button class="btn btn-outline-warning btn-sm rounded-pill px-3 me-1" onclick="editTable('${table.id}')">
                        <i class="bi bi-pencil me-1"></i> Sửa
                    </button>
                    <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="deleteTable('${table.id}')">
                        <i class="bi bi-trash me-1"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// =========================
// Lưu thông tin bàn (Thêm / Sửa)
// =========================

function saveTable() {
    const id = document.getElementById("tableId").value;
    const table = {
        name: document.getElementById("tableName").value.trim(),
        capacity: Number(document.getElementById("capacity").value),
        status: document.getElementById("status").value
    };

    if (table.name === "" || table.capacity <= 0) {
        errorAlert("Vui lòng nhập tên bàn hợp lệ và sức chứa lớn hơn 0.");
        return;
    }

    const url = id === "" ? API_TABLES : `${API_TABLES}/${id}`;
    const method = id === "" ? "POST" : "PUT";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(table)
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(() => {
        const actionText = id === "" ? "thêm bàn thành công!" : "cập nhật bàn thành công!";
        successAlert(actionText);
        showToast(id === "" ? "Đã thêm bàn" : "Đã cập nhật");
        closeModal();
        loadTables();
    })
    .catch(() => {
        errorAlert("Không thể lưu thông tin bàn. Vui lòng thử lại.");
    });
}

// =========================
// Chuẩn bị dữ liệu để Sửa bàn
// =========================

function editTable(id) {
    const table = tables.find(item => item.id == id);

    if (!table) {
        errorAlert("Không tìm thấy bàn.");
        return;
    }

    document.getElementById("tableId").value = table.id;
    document.getElementById("tableName").value = table.name;
    document.getElementById("capacity").value = table.capacity;
    document.getElementById("status").value = table.status;

    new bootstrap.Modal(document.getElementById("tableModal")).show();
}

// =========================
// Xóa bàn
// =========================

function deleteTable(id) {
    confirmDelete(function () {
        fetch(`${API_TABLES}/${id}`, {
            method: "DELETE"
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(() => {
            successAlert("Đã xóa bàn thành công!");
            showToast("Đã xóa bàn");
            loadTables();
        })
        .catch(() => {
            errorAlert("Không thể xóa bàn này.");
        });
    });
}

// =========================
// Đóng và Reset Modal
// =========================

function closeModal() {
    document.getElementById("tableId").value = "";
    document.getElementById("tableName").value = "";
    document.getElementById("capacity").value = "";
    document.getElementById("status").value = "Trống";

    const modalElement = document.getElementById("tableModal");
    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
        modal.hide();
    }
}

// Lắng nghe sự kiện click mở modal thêm mới để reset form sạch sẽ
document.querySelector('[data-bs-target="#tableModal"]')?.addEventListener("click", () => {
    closeModal();
});

// =========================
// Tìm kiếm bàn theo thời gian thực
// =========================

document.getElementById("searchTable").addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();
    const result = tables.filter(item =>
        item.name.toLowerCase().includes(keyword)
    );
    renderTable(result);
});