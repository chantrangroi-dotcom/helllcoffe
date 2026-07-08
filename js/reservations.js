// =========================
// Coffee Booking Admin
// Quản lý đặt bàn
// =========================

let reservations = [];

loadReservations();

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
        title: "🗑 Xóa đơn đặt bàn?",
        text: "Bạn chắc chắn muốn xóa đơn đặt bàn này khỏi hệ thống?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        reverseButtons: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d"
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}

// =========================
// Load danh sách đơn đặt bàn từ API
// =========================

function loadReservations() {
    if (typeof API_RESERVATIONS === 'undefined') {
        console.error("Chưa cấu hình biến API_RESERVATIONS ở api.js!");
        return;
    }

    fetch(API_RESERVATIONS)
        .then(res => res.json())
        .then(data => {
            reservations = data;
            renderTable(data);
        })
        .catch(() => {
            errorAlert("Không thể tải danh sách đơn đặt bàn từ máy chủ.");
        });
}

// =========================
// Hiển thị dữ liệu ra bảng
// =========================

function renderTable(list) {
    const tbody = document.getElementById("tableReservation");
    if (!tbody) return;
    
    if (!list || list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox fs-3 d-block mb-1"></i> Không tìm thấy đơn đặt bàn phù hợp
                </td>
            </tr>
        `;
        return;
    }

    let html = "";

    list.forEach((item, index) => {
        // Dự phòng lấy đúng ID dù dữ liệu trả về có khác tên trường đi nữa
        const itemId = item.id || item._id || item.reservationId || (index + 1);
        const customerName = item.customerName || item.name || "Chưa có tên";
        const phone = item.phone || item.phoneNumber || "";
        const tableName = item.tableName || item.table || "Chưa chọn";
        const people = item.people || item.guests || 1;
        const date = item.date || "";
        const time = item.time || "";
        const status = item.status || "Chờ xác nhận";

        let badgeClass = "bg-secondary-subtle text-secondary border border-secondary-subtle";
        let dotColor = "bg-secondary";

        if (status === "Chờ xác nhận") {
            badgeClass = "bg-warning-subtle text-warning border border-warning-subtle";
            dotColor = "bg-warning";
        } else if (status === "Đã xác nhận") {
            badgeClass = "bg-success-subtle text-success border border-success-subtle";
            dotColor = "bg-success";
        } else if (status === "Hoàn thành") {
            badgeClass = "bg-primary-subtle text-primary border border-primary-subtle";
            dotColor = "bg-primary";
        } else if (status === "Đã hủy") {
            badgeClass = "bg-danger-subtle text-danger border border-danger-subtle";
            dotColor = "bg-danger";
        }

        html += `
            <tr class="animate__animated animate__fadeIn">
                <td class="text-center fw-semibold text-secondary">#${itemId}</td>
                <td class="fw-bold text-dark">${customerName}</td>
                <td><a href="tel:${phone}" class="text-decoration-none text-dark">${phone}</a></td>
                <td class="fw-semibold text-primary">${tableName}</td>
                <td class="text-center">${people} khách</td>
                <td class="text-center">${date}</td>
                <td class="text-center font-monospace">${time}</td>
                <td class="text-center">
                    <span class="badge ${badgeClass} px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1 justify-content-center">
                        <span class="rounded-circle ${dotColor}" style="width: 6px; height: 6px;"></span>
                        ${status}
                    </span>
                </td>
                <td class="text-center">
                    <button class="btn btn-outline-warning btn-sm rounded-pill px-3 me-1" onclick="editReservation('${itemId}')">
                        <i class="bi bi-pencil me-1"></i> Sửa
                    </button>
                    <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="deleteReservation('${itemId}')">
                        <i class="bi bi-trash me-1"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// =========================
// Lưu thông tin đơn đặt bàn (Thêm / Sửa)
// =========================

function saveReservation() {
    const id = document.getElementById("reservationId").value;
    const reservation = {
        customerName: document.getElementById("customerName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        tableName: document.getElementById("tableName").value,
        people: Number(document.getElementById("people").value),
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        status: document.getElementById("status").value
    };

    if (
        reservation.customerName === "" ||
        reservation.phone === "" ||
        reservation.tableName === "" ||
        reservation.people <= 0 ||
        reservation.date === "" ||
        reservation.time === ""
    ) {
        errorAlert("Vui lòng nhập đầy đủ thông tin đặt bàn hợp lệ.");
        return;
    }

    const url = id === "" ? API_RESERVATIONS : `${API_RESERVATIONS}/${id}`;
    const method = id === "" ? "POST" : "PUT";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reservation)
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(() => {
        const actionText = id === "" ? "Đã thêm đơn đặt bàn thành công!" : "Đã cập nhật đơn đặt bàn thành công!";
        successAlert(actionText);
        showToast(id === "" ? "Đã thêm" : "Đã cập nhật");
        closeModal();
        loadReservations();
    })
    .catch(() => {
        errorAlert("Không thể lưu đơn đặt bàn. Vui lòng thử lại.");
    });
}

// =========================
// Chuẩn bị dữ liệu để Sửa đơn
// =========================

function editReservation(id) {
    const reservation = reservations.find(item => (item.id || item._id || item.reservationId) == id);

    if (!reservation) {
        errorAlert("Không tìm thấy đơn đặt bàn.");
        return;
    }

    document.getElementById("reservationId").value = reservation.id || reservation._id || reservation.reservationId || id;
    document.getElementById("customerName").value = reservation.customerName || reservation.name || "";
    document.getElementById("phone").value = reservation.phone || reservation.phoneNumber || "";
    document.getElementById("tableName").value = reservation.tableName || reservation.table || "";
    document.getElementById("people").value = reservation.people || reservation.guests || "";
    document.getElementById("date").value = reservation.date || "";
    document.getElementById("time").value = reservation.time || "";
    document.getElementById("status").value = reservation.status || "Chờ xác nhận";

    const modalEl = document.getElementById("reservationModal");
    if (modalEl) {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
}

// =========================
// Xóa đơn đặt bàn
// =========================

function deleteReservation(id) {
    confirmDelete(function () {
        fetch(`${API_RESERVATIONS}/${id}`, {
            method: "DELETE"
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(() => {
            successAlert("Đã xóa đơn đặt bàn thành công!");
            showToast("Đã xóa");
            loadReservations();
        })
        .catch(() => {
            errorAlert("Không thể xóa đơn đặt bàn này.");
        });
    });
}

// =========================
// Đóng và Reset Modal
// =========================

function closeModal() {
    document.getElementById("reservationId").value = "";
    document.getElementById("customerName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("tableName").value = "";
    document.getElementById("people").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    document.getElementById("status").value = "Chờ xác nhận";

    const modalElement = document.getElementById("reservationModal");
    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
        modal.hide();
    }
}

// Lắng nghe sự kiện mở modal thêm mới để reset form sạch sẽ
document.querySelector('[data-bs-target="#reservationModal"]')?.addEventListener("click", () => {
    closeModal();
});

// =========================
// Tìm kiếm theo thời gian thực
// =========================

document.getElementById("searchReservation")?.addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();
    applyFilters(keyword, document.getElementById("filterStatus")?.value || "");
});

// =========================
// Lọc trạng thái kết hợp tìm kiếm
// =========================

const filterStatusEl = document.getElementById("filterStatus");
if (filterStatusEl) {
    filterStatusEl.addEventListener("change", function () {
        const keyword = document.getElementById("searchReservation")?.value.toLowerCase().trim() || "";
        applyFilters(keyword, this.value);
    });
}

function applyFilters(keyword, statusValue) {
    let result = reservations;

    if (keyword) {
        result = result.filter(item =>
            (item.customerName || item.name || "").toLowerCase().includes(keyword) ||
            (item.phone || item.phoneNumber || "").toLowerCase().includes(keyword) ||
            (item.tableName || item.table || "").toLowerCase().includes(keyword)
        );
    }

    if (statusValue) {
        result = result.filter(item => item.status === statusValue);
    }

    renderTable(result);
}