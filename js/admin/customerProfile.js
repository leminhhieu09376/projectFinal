let user;
const avatarMain = document.getElementById("avatar-main");
const accountMain = document.getElementById("account-main");
let $errorNotification = $("#error-notification");

function init() {
    user = JSON.parse(localStorage.getItem("user"));
    if(user === null) {
        location.href = "../../html/index.html";
    }else {
        if(user.account === null || user.password === null || user.role === 1) {
            location.href = "../../html/index.html";
        }else {
            loadStaffAmount();
            loadScheduleAmount();
            loadBookAmount();
            loadPatientAmount();
            loadProfileData();
            loadPatientProfileData();
        }
    }
}

function loadStaffAmount() {
    fetch("http://localhost:3000/staff/amount",{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            const staff = document.getElementById("staff");
            let data = res.data.data.SoLuong;
            staff.innerHTML = data.toString();
    })).catch(error => console.log(error));
}

function loadScheduleAmount() {
    fetch("http://localhost:3000/schedule/amount",{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            const schedule = document.getElementById("schedule");
            let data = res.data.data.SoLuong;
            schedule.innerHTML = data.toString();
    })).catch(error => console.log(error));
}

function loadBookAmount() {
    fetch("http://localhost:3000/book/amount",{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            const book = document.getElementById("book");
            let data = res.data.data.SoLuong;
            book.innerHTML = data.toString();
    })).catch(error => console.log(error));
}

function loadPatientAmount() {
    fetch("http://localhost:3000/patient/amount",{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            const patient = document.getElementById("patient");
            let data = res.data.data.SoLuong;
            patient.innerHTML = data.toString();
    })).catch(error => console.log(error));
}

function loadProfileData() {
    fetch("http://localhost:3000/staff/account/" + user.account,{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result = res.data.data;
            if(result !== null) {
                avatarMain.src = result.HinhAnh;
                accountMain.innerHTML = user.account;
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin cá nhân thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin cá nhân thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function loadPatientProfileData() {
    const customerAccount = window.location.hash.substring(1);
    fetch("http://localhost:3000/patient/" + customerAccount,{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result = res.data.data;
            if(result !== null) {
                document.getElementById("avatar").src = result.HinhAnh;
                document.getElementById("id").value = result.MaKhachHang;
                document.getElementById("surname").value = result.Ho;
                document.getElementById("name").value = result.Ten;
                document.getElementById("gender").value = result.GioiTinh === false ? "Nam" : "Nữ";
                document.getElementById("birth-year").value = result.NamSinh.substring(0, 10);
                document.getElementById("identity").value = result.Cmnd;
                document.getElementById("phone-number").value = result.Sdt;
                document.getElementById("email").value = result.Email;
                document.getElementById("address").value = result.DiaChi;
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy chi tiết khách hàng thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy chi tiết khách hàng thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function checkRole(interfaceId, roleId, interfacePath) {
    fetch("http://localhost:3000/assign/checkRole",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            account: user.account,
            interfaceId: interfaceId,
            roleId: roleId
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result = res.data.data;
            if(result !== null) {
                if(result.KQ === "Y") {
                    location.href = interfacePath;
                }else {
                    window.scroll(0, 0);
                    $errorNotification.find("#error-message")
                        .text("Bạn không có quyền truy cập");
                    $errorNotification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $errorNotification.fadeOut(2000, "linear");
                        }, 2500);
                    });
                }
            }else if(res.data.error !== null) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin quyền thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin quyền thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function logOut() {
    let user = null;
    localStorage.setItem("user", JSON.stringify(user));
    location.href = "../../html/index.html";
}