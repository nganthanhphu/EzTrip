function setActiveUser(url) {
    fetch(url, {
        method: 'POST',
    }).then(res => {
        if (res.ok) {
            location.reload();
        }
        else {
            alert("Có lỗi xảy ra khi cập nhật trạng thái người dùng.");
        }
    });
}