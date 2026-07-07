// =============================
// Tải danh sách bàn
// =============================

loadTables();

function loadTables() {

    fetch(API_TABLES)
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(table => {

                if (table.status === "Trống") {

                    html += `
                        <option value="${table.id}">
                            ${table.name} (${table.capacity} người)
                        </option>
                    `;

                }

            });

            document.getElementById("table").innerHTML = html;

        })
        .catch(err => console.log(err));

}

// =============================
// Không cho chọn ngày quá khứ
// =============================

const dateInput = document.getElementById("date");

dateInput.min = new Date().toISOString().split("T")[0];

// =============================
// Đặt bàn
// =============================

document.getElementById("bookingForm")
.addEventListener("submit", function (e) {

    e.preventDefault();

    const tableSelect = document.getElementById("table");

    const reservation = {

        customerName: document.getElementById("customerName").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        tableId: tableSelect.value,

        tableName: tableSelect.options[tableSelect.selectedIndex].text,

        date: document.getElementById("date").value,

        time: document.getElementById("time").value,

        status: "Chờ xác nhận"

    };

    // Kiểm tra nhập liệu

    if (
        reservation.customerName === "" ||
        reservation.phone === "" ||
        reservation.date === "" ||
        reservation.time === ""
    ) {

        alert("Vui lòng nhập đầy đủ thông tin!");

        return;

    }

    // Kiểm tra SĐT

    if (!/^0\d{9}$/.test(reservation.phone)) {

        alert("Số điện thoại không hợp lệ!");

        return;

    }

    // Kiểm tra ngày giờ

    const now = new Date();

    const bookingTime = new Date(
        reservation.date + "T" + reservation.time
    );

    if (bookingTime <= now) {

        alert("Không thể đặt bàn trong quá khứ!");

        return;

    }

    // Lưu đơn đặt

    fetch(API_RESERVATIONS, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(reservation)

    })

    .then(res => res.json())

    .then(() => {

        alert("🎉 Đặt bàn thành công!");

        document.getElementById("bookingForm").reset();

    })

    .catch(err => {

        console.log(err);

        alert("Có lỗi xảy ra!");

    });

});