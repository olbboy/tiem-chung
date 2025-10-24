### Flown Login

```sh
curl 'https://api-stc-v2.vncdc.gov.vn/auth' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: vi' \
  -H 'authorization;' \
  -H 'content-type: application/json;charset=UTF-8' \
  -H 'origin: https://sotiemchung.vncdc.gov.vn' \
  -H 'priority: u=1, i' \
  -H 'referer: https://sotiemchung.vncdc.gov.vn/' \
  -H 'sec-ch-ua: "Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' \
  --data-raw '{"phoneNumber":"0969901566","pass":"2219@Leo","osType":"","osVersion":"","deviceId":"","notificationToken":""}'
```

##### Payload:
```json
{"phoneNumber":"0912165555","pass":"2212@Leo","osType":"","osVersion":"","deviceId":"","notificationToken":""}
```

##### Response: 
```json
{
    "code": 1,
    "message": "Thành công",
    "data": {
        "user_info": {
            "thue_bao_id": 193375.0,
            "ho_ten": null,
            "phone_number": "0912165555",
            "email": null,
            "avatar": null
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IjA5MTIxNjU1NTUiLCJzdWIiOiIwOTEyMTY1NTU1IiwidXNlcklkIjoiMTkzMzc1IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6IjQxNGUxOTI3YTM4ODRmNjhhYmM3OWY3MjgzODM3ZmQxIiwiZXhwIjoxNzYxNDA0NDQzLCJuYmYiOjE3NjEzMTgwNDN9.s1cUFzzkVcOzaq43SZt-AsHHkc41p2hAE337z-E6Dmo",
        "tokenType": "bearer"
    }
}
```

### Flown Lấy thông tin user

```sh
curl 'https://api-stc-v2.vncdc.gov.vn/thanh_vien?theo_doi=1' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: vi' \
  -H 'authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IjA5Njk5MDE1NjYiLCJzdWIiOiIwOTY5OTAxNTY2IiwidXNlcklkIjoiMTkzMzc2IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6IjQxNGUxOTI3YTM4ODRmNjhhYmM3OWY3MjgzODM3ZmQxIiwiZXhwIjoxNzYxMjkwMzAzLCJuYmYiOjE3NjEyMDM5MDN9.miFO5DYKBw3n_cA-85dJL4ssRr-a8xsg4sNVDBLxeoA' \
  -H 'origin: https://sotiemchung.vncdc.gov.vn' \
  -H 'priority: u=1, i' \
  -H 'referer: https://sotiemchung.vncdc.gov.vn/' \
  -H 'sec-ch-ua: "Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
```

##### Payload:
```json
theo_doi=1
```

##### Response: 
```json
{
    "code": 1,
    "message": "Thành công",
    "data": [
        {
            "doi_tuong_id": 33983054.0,
            "ma_doi_tuong": "101031319930280",
            "ho_ten": "Phan Hoàng Anh",
            "ngay_sinh": "16/07/1993",
            "gioi_tinh": 1,
            "dan_toc_id": 1,
            "ten_dan_toc": "Kinh",
            "dien_thoai": "0912165555",
            "co_so_id": 796.0,
            "ten_co_so": "TYT Phường Xuân La",
            "ho_khau_tinh_id": 101.0,
            "ho_khau_huyen_id": 10103.0,
            "ho_khau_xa_id": 1010313.0,
            "ho_khau_thon_ap_id": null,
            "ho_khau_tinh": "Hà Nội",
            "ho_khau_huyen": "Quận Tây Hồ",
            "ho_khau_xa": "Phường Xuân La",
            "ho_khau_thon_ap": null,
            "ho_khau_dia_chi": null,
            "tam_tru_tinh_id": 101.0,
            "tam_tru_huyen_id": 10103.0,
            "tam_tru_xa_id": 1010313.0,
            "tam_tru_thon_ap_id": null,
            "tam_tru_tinh": "Hà Nội",
            "tam_tru_huyen": "Quận Tây Hồ",
            "tam_tru_xa": "Phường Xuân La",
            "tam_tru_thon_ap": null,
            "tam_tru_dia_chi": "14a - 603/23 lạc long quân",
            "theo_doi": 1.0,
            "hien_thi_mac_dinh": "0",
            "avatar": "",
            "avatar_id": null,
            "avatar_file_type": null,
            "ds_nguoi_cham_soc": []
        },
        {
            "doi_tuong_id": 66424589.0,
            "ma_doi_tuong": "101234320240074",
            "ho_ten": "Doãn Huy Khôi",
            "ngay_sinh": "14/05/2024",
            "gioi_tinh": 0,
            "dan_toc_id": 1,
            "ten_dan_toc": "Kinh",
            "dien_thoai": null,
            "co_so_id": 587.0,
            "ten_co_so": "Trạm y tế xã Ngọc Hồi",
            "ho_khau_tinh_id": 101.0,
            "ho_khau_huyen_id": 10123.0,
            "ho_khau_xa_id": 1012343.0,
            "ho_khau_thon_ap_id": null,
            "ho_khau_tinh": "Hà Nội",
            "ho_khau_huyen": "Huyện Thanh Trì",
            "ho_khau_xa": "Xã Ngọc Hồi",
            "ho_khau_thon_ap": null,
            "ho_khau_dia_chi": null,
            "tam_tru_tinh_id": 101.0,
            "tam_tru_huyen_id": 10123.0,
            "tam_tru_xa_id": 1012343.0,
            "tam_tru_thon_ap_id": null,
            "tam_tru_tinh": "Hà Nội",
            "tam_tru_huyen": "Huyện Thanh Trì",
            "tam_tru_xa": "Xã Ngọc Hồi",
            "tam_tru_thon_ap": null,
            "tam_tru_dia_chi": null,
            "theo_doi": 1.0,
            "hien_thi_mac_dinh": "0",
            "avatar": "",
            "avatar_id": null,
            "avatar_file_type": null,
            "ds_nguoi_cham_soc": [
                {
                    "ho_ten": "Phan Hoàng Oanh",
                    "nam_sinh": null,
                    "so_dien_thoai": null,
                    "cmnd": null,
                    "quan_he": 1,
                    "mac_dinh": 1
                }
            ]
        },
        {
            "doi_tuong_id": 0.0,
            "ma_doi_tuong": null,
            "ho_ten": "Doãn Minh Quân",
            "ngay_sinh": "19/11/2021",
            "gioi_tinh": 0,
            "dan_toc_id": 1,
            "ten_dan_toc": "Kinh",
            "dien_thoai": "0912165555",
            "co_so_id": 0.0,
            "ten_co_so": null,
            "ho_khau_tinh_id": 101.0,
            "ho_khau_huyen_id": 10103.0,
            "ho_khau_xa_id": 1010313.0,
            "ho_khau_thon_ap_id": null,
            "ho_khau_tinh": "Hà Nội",
            "ho_khau_huyen": "Quận Tây Hồ",
            "ho_khau_xa": "Phường Xuân La",
            "ho_khau_thon_ap": null,
            "ho_khau_dia_chi": null,
            "tam_tru_tinh_id": 101.0,
            "tam_tru_huyen_id": 10103.0,
            "tam_tru_xa_id": 1010313.0,
            "tam_tru_thon_ap_id": null,
            "tam_tru_tinh": "Hà Nội",
            "tam_tru_huyen": "Quận Tây Hồ",
            "tam_tru_xa": "Phường Xuân La",
            "tam_tru_thon_ap": null,
            "tam_tru_dia_chi": null,
            "theo_doi": null,
            "hien_thi_mac_dinh": null,
            "avatar": "",
            "avatar_id": null,
            "avatar_file_type": null,
            "ds_nguoi_cham_soc": []
        }
    ]
}
```

### Flown Lấy thông tin kháng nguyên

```sh
curl 'https://api-stc-v2.vncdc.gov.vn/lich_su_tiem/khang_nguyen?doi_tuong_id=37208227' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: vi' \
  -H 'authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IjA5Njk5MDE1NjYiLCJzdWIiOiIwOTY5OTAxNTY2IiwidXNlcklkIjoiMTkzMzc2IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6IjQxNGUxOTI3YTM4ODRmNjhhYmM3OWY3MjgzODM3ZmQxIiwiZXhwIjoxNzYxMjkwMzAzLCJuYmYiOjE3NjEyMDM5MDN9.miFO5DYKBw3n_cA-85dJL4ssRr-a8xsg4sNVDBLxeoA' \
  -H 'origin: https://sotiemchung.vncdc.gov.vn' \
  -H 'priority: u=1, i' \
  -H 'referer: https://sotiemchung.vncdc.gov.vn/' \
  -H 'sec-ch-ua: "Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
```

##### Payload: 

```sh
doi_tuong_id=33983054
```

##### Response: 

```json
{
    "code": 1,
    "message": "Thành công",
    "data": [
        {
            "lich_su_tiem_id": 256552994.0,
            "khang_nguyen_id": 17.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Cúm",
            "trang_thai": 2,
            "ngay_tiem": "11:33 06/01/2023",
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 0
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 12.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Dại",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 0
        },
        {
            "lich_su_tiem_id": 302555885.0,
            "khang_nguyen_id": 17.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Cúm",
            "trang_thai": 2,
            "ngay_tiem": "14:56 28/01/2024",
            "thu_tu_mui_tiem": 2,
            "thu_tu_hien_thi": 0
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 270.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Lao",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 1
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 3.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Viêm gan B",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 2
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 3.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Viêm gan B",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 2,
            "thu_tu_hien_thi": 2
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 3.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Viêm gan B",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 3,
            "thu_tu_hien_thi": 2
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 3.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Viêm gan B",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 4,
            "thu_tu_hien_thi": 2
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 2.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Bại liệt",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 3
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 2.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Bại liệt",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 2,
            "thu_tu_hien_thi": 3
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 2.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Bại liệt",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 3,
            "thu_tu_hien_thi": 3
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 5.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Bạch Hầu",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 4
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 5.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Bạch Hầu",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 2,
            "thu_tu_hien_thi": 4
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 5.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Bạch Hầu",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 3,
            "thu_tu_hien_thi": 4
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 5.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Bạch Hầu",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 4,
            "thu_tu_hien_thi": 4
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 290.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Ho gà",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 5
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 290.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Ho gà",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 2,
            "thu_tu_hien_thi": 5
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 290.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Ho gà",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 3,
            "thu_tu_hien_thi": 5
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 290.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Ho gà",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 4,
            "thu_tu_hien_thi": 5
        },
        {
            "lich_su_tiem_id": 201240583.0,
            "khang_nguyen_id": 291.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Uốn ván",
            "trang_thai": 2,
            "ngay_tiem": "16:17 22/07/2021",
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 6
        },
        {
            "lich_su_tiem_id": 207174724.0,
            "khang_nguyen_id": 291.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Uốn ván",
            "trang_thai": 2,
            "ngay_tiem": "10:35 06/09/2021",
            "thu_tu_mui_tiem": 2,
            "thu_tu_hien_thi": 6
        },
        {
            "lich_su_tiem_id": 302555856.0,
            "khang_nguyen_id": 291.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Uốn ván",
            "trang_thai": 2,
            "ngay_tiem": "14:56 28/01/2024",
            "thu_tu_mui_tiem": 3,
            "thu_tu_hien_thi": 6
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 291.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Uốn ván",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 4,
            "thu_tu_hien_thi": 6
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 172.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Hib",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 7
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 172.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Hib",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 2,
            "thu_tu_hien_thi": 7
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 172.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Hib",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 3,
            "thu_tu_hien_thi": 7
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 8.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Sởi",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 8
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 8.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Sởi",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 2,
            "thu_tu_hien_thi": 8
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 9.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Viêm não Nhật Bản",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 9
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 9.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Viêm não Nhật Bản",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 2,
            "thu_tu_hien_thi": 9
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 9.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Viêm não Nhật Bản",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 3,
            "thu_tu_hien_thi": 9
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 13.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Thương Hàn",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 10
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 6.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Tả",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 11
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 176.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Rubella",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 1,
            "thu_tu_hien_thi": 11
        },
        {
            "lich_su_tiem_id": null,
            "khang_nguyen_id": 6.0,
            "doi_tuong_id": 33983054.0,
            "ten_khang_nguyen": "Tả",
            "trang_thai": 1,
            "ngay_tiem": null,
            "thu_tu_mui_tiem": 2,
            "thu_tu_hien_thi": 11
        }
    ]
}
```

### Flow lấy lịch sử tiêm

```sh
curl 'https://api-stc-v2.vncdc.gov.vn/lich_su_tiem/vacxin?doi_tuong_id=33983054' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: vi' \
  -H 'authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IjA5MTIxNjU1NTUiLCJzdWIiOiIwOTEyMTY1NTU1IiwidXNlcklkIjoiMTkzMzc1IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6IjQxNGUxOTI3YTM4ODRmNjhhYmM3OWY3MjgzODM3ZmQxIiwiZXhwIjoxNzYxNDA0NDQzLCJuYmYiOjE3NjEzMTgwNDN9.s1cUFzzkVcOzaq43SZt-AsHHkc41p2hAE337z-E6Dmo' \
  -H 'origin: https://sotiemchung.vncdc.gov.vn' \
  -H 'priority: u=1, i' \
  -H 'referer: https://sotiemchung.vncdc.gov.vn/' \
  -H 'sec-ch-ua: "Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
```

##### Payload: 

```sh
doi_tuong_id=33983054
```

##### Response: 

```json
{
    "code": 1,
    "message": "Thành công",
    "data": [
        {
            "lich_su_tiem_id": 302555856.0,
            "doi_tuong_id": 33983054.0,
            "vacxin_id": 328.0,
            "ten_vacxin": "Vắc xin uốn ván hấp phụ (TT) (Lọ 1 liều)",
            "khang_nguyen": "Uốn ván",
            "trang_thai": 2,
            "ngay_tiem": "14:56 28/01/2024",
            "thu_tu_mui_tiem": 3,
            "co_so_tiem_chung": "Trung tâm tiêm chủng VNVC Lạc Long Quân",
            "seo": null,
            "truoc_24h": null,
            "lo_vacxin": "196-01-22",
            "phan_ung_sau_tiem": {
                "ngay_phan_ung": null,
                "loai_phan_ung": null,
                "ket_qua": null
            }
        },
        {
            "lich_su_tiem_id": 302555885.0,
            "doi_tuong_id": 33983054.0,
            "vacxin_id": 478.0,
            "ten_vacxin": "Vaxigrip Tetra 0.5ml ",
            "khang_nguyen": "Cúm",
            "trang_thai": 2,
            "ngay_tiem": "14:56 28/01/2024",
            "thu_tu_mui_tiem": 2,
            "co_so_tiem_chung": "Trung tâm tiêm chủng VNVC Lạc Long Quân",
            "seo": null,
            "truoc_24h": null,
            "lo_vacxin": "X3F741V",
            "phan_ung_sau_tiem": {
                "ngay_phan_ung": null,
                "loai_phan_ung": null,
                "ket_qua": null
            }
        },
        {
            "lich_su_tiem_id": 256552994.0,
            "doi_tuong_id": 33983054.0,
            "vacxin_id": 478.0,
            "ten_vacxin": "Vaxigrip Tetra 0.5ml ",
            "khang_nguyen": "Cúm",
            "trang_thai": 2,
            "ngay_tiem": "11:33 06/01/2023",
            "thu_tu_mui_tiem": 1,
            "co_so_tiem_chung": "Trung tâm tiêm chủng VNVC 180 Trường Chinh",
            "seo": null,
            "truoc_24h": null,
            "lo_vacxin": null,
            "phan_ung_sau_tiem": {
                "ngay_phan_ung": null,
                "loai_phan_ung": null,
                "ket_qua": null
            }
        },
        {
            "lich_su_tiem_id": 207174724.0,
            "doi_tuong_id": 33983054.0,
            "vacxin_id": 328.0,
            "ten_vacxin": "Vắc xin uốn ván hấp phụ (TT) (Lọ 1 liều)",
            "khang_nguyen": "Uốn ván",
            "trang_thai": 2,
            "ngay_tiem": "10:35 06/09/2021",
            "thu_tu_mui_tiem": 2,
            "co_so_tiem_chung": "Trung tâm kiếm soát bệnh tật thành phố Hà Nội",
            "seo": null,
            "truoc_24h": null,
            "lo_vacxin": "168-01-20",
            "phan_ung_sau_tiem": {
                "ngay_phan_ung": null,
                "loai_phan_ung": "Không có phản ứng",
                "ket_qua": null
            }
        },
        {
            "lich_su_tiem_id": 201240583.0,
            "doi_tuong_id": 33983054.0,
            "vacxin_id": 328.0,
            "ten_vacxin": "Vắc xin uốn ván hấp phụ (TT) (Lọ 1 liều)",
            "khang_nguyen": "Uốn ván",
            "trang_thai": 2,
            "ngay_tiem": "16:17 22/07/2021",
            "thu_tu_mui_tiem": 1,
            "co_so_tiem_chung": "Trung tâm kiếm soát bệnh tật thành phố Hà Nội",
            "seo": null,
            "truoc_24h": null,
            "lo_vacxin": "168-01-20",
            "phan_ung_sau_tiem": {
                "ngay_phan_ung": null,
                "loai_phan_ung": "Không có phản ứng",
                "ket_qua": null
            }
        }
    ]
}
```

### Flow lấy thông tin phác đồ tiêm

```sh
curl 'https://api-stc-v2.vncdc.gov.vn/phac_do_tiem_chung?doi_tuong_id=33983054' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: vi' \
  -H 'authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IjA5MTIxNjU1NTUiLCJzdWIiOiIwOTEyMTY1NTU1IiwidXNlcklkIjoiMTkzMzc1IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6IjQxNGUxOTI3YTM4ODRmNjhhYmM3OWY3MjgzODM3ZmQxIiwiZXhwIjoxNzYxNDA0NDQzLCJuYmYiOjE3NjEzMTgwNDN9.s1cUFzzkVcOzaq43SZt-AsHHkc41p2hAE337z-E6Dmo' \
  -H 'origin: https://sotiemchung.vncdc.gov.vn' \
  -H 'priority: u=1, i' \
  -H 'referer: https://sotiemchung.vncdc.gov.vn/' \
  -H 'sec-ch-ua: "Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
```

##### Payload: 

```sh
doi_tuong_id=33983054
```

##### Response: 

```json
{
    "code": 1,
    "message": "Thành công",
    "data": [
        {
            "phac_do_id": 17.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 290.0,
            "ten_khang_nguyen": "Ho gà",
            "thu_tu": 3,
            "tong_so_mui": 4,
            "mo_ta": "Ho gà là một bệnh lý truyền qua đường hô hấp & do vi khuẩn ho gà gây ra. Bệnh biểu hiện đặc trưng bằng các cơn ho kịch phát và kéo dài - với nguy cơ co thắt khí - phế quản của trẻ. Trẻ thường tử vong do suy hô hấp hoặc do tổn thương não, đặc biệt nguy cơ này xảy ra rất cao ở những trẻ dưới 6 tháng tuổi.",
            "tuoi_tiem": 4,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 25.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 290.0,
            "ten_khang_nguyen": "Ho gà",
            "thu_tu": 4,
            "tong_so_mui": 4,
            "mo_ta": "Ho gà là một bệnh lý truyền qua đường hô hấp & do vi khuẩn ho gà gây ra. Bệnh biểu hiện đặc trưng bằng các cơn ho kịch phát và kéo dài - với nguy cơ co thắt khí - phế quản của trẻ. Trẻ thường tử vong do suy hô hấp hoặc do tổn thương não, đặc biệt nguy cơ này xảy ra rất cao ở những trẻ dưới 6 tháng tuổi.",
            "tuoi_tiem": 18,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 13.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 290.0,
            "ten_khang_nguyen": "Ho gà",
            "thu_tu": 2,
            "tong_so_mui": 4,
            "mo_ta": "Ho gà là một bệnh lý truyền qua đường hô hấp & do vi khuẩn ho gà gây ra. Bệnh biểu hiện đặc trưng bằng các cơn ho kịch phát và kéo dài - với nguy cơ co thắt khí - phế quản của trẻ. Trẻ thường tử vong do suy hô hấp hoặc do tổn thương não, đặc biệt nguy cơ này xảy ra rất cao ở những trẻ dưới 6 tháng tuổi.",
            "tuoi_tiem": 3,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 5.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 290.0,
            "ten_khang_nguyen": "Ho gà",
            "thu_tu": 1,
            "tong_so_mui": 4,
            "mo_ta": "Ho gà là một bệnh lý truyền qua đường hô hấp & do vi khuẩn ho gà gây ra. Bệnh biểu hiện đặc trưng bằng các cơn ho kịch phát và kéo dài - với nguy cơ co thắt khí - phế quản của trẻ. Trẻ thường tử vong do suy hô hấp hoặc do tổn thương não, đặc biệt nguy cơ này xảy ra rất cao ở những trẻ dưới 6 tháng tuổi.",
            "tuoi_tiem": 2,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 42.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 290.0,
            "ten_khang_nguyen": "Ho gà",
            "thu_tu": 1,
            "tong_so_mui": null,
            "mo_ta": "Ho gà là một bệnh lý truyền qua đường hô hấp & do vi khuẩn ho gà gây ra. Bệnh biểu hiện đặc trưng bằng các cơn ho kịch phát và kéo dài - với nguy cơ co thắt khí - phế quản của trẻ. Trẻ thường tử vong do suy hô hấp hoặc do tổn thương não, đặc biệt nguy cơ này xảy ra rất cao ở những trẻ dưới 6 tháng tuổi.",
            "tuoi_tiem": 0,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 18.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 291.0,
            "ten_khang_nguyen": "Uốn ván",
            "thu_tu": 3,
            "tong_so_mui": 4,
            "mo_ta": "Bệnh Uốn ván do vi trùng uốn ván thường gặp trong đất hoặc bất kỳ phần rỉ sét nào trong môi trường sống. Vi khuẩn thường xâm nhập vào cơ thể qua các vết thương hở như: cắt rốn trong khi sinh, mổ xẻ... hoặc thậm chí khi chỉ bị vết cắt rất nhỏ. Độc tố sinh ra từ vi khuẩn sẽ tấn công vào hệ thống thần kinh và gây hậu quả co thắt toàn bộ các cơ của cơ thể và dẫn đến nguy cơ tử vong rất cao, đặc biệt với trẻ sơ sinh.",
            "tuoi_tiem": 4,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 26.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 291.0,
            "ten_khang_nguyen": "Uốn ván",
            "thu_tu": 4,
            "tong_so_mui": 4,
            "mo_ta": "Bệnh Uốn ván do vi trùng uốn ván thường gặp trong đất hoặc bất kỳ phần rỉ sét nào trong môi trường sống. Vi khuẩn thường xâm nhập vào cơ thể qua các vết thương hở như: cắt rốn trong khi sinh, mổ xẻ... hoặc thậm chí khi chỉ bị vết cắt rất nhỏ. Độc tố sinh ra từ vi khuẩn sẽ tấn công vào hệ thống thần kinh và gây hậu quả co thắt toàn bộ các cơ của cơ thể và dẫn đến nguy cơ tử vong rất cao, đặc biệt với trẻ sơ sinh.",
            "tuoi_tiem": 18,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 6.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 291.0,
            "ten_khang_nguyen": "Uốn ván",
            "thu_tu": 1,
            "tong_so_mui": 4,
            "mo_ta": "Bệnh Uốn ván do vi trùng uốn ván thường gặp trong đất hoặc bất kỳ phần rỉ sét nào trong môi trường sống. Vi khuẩn thường xâm nhập vào cơ thể qua các vết thương hở như: cắt rốn trong khi sinh, mổ xẻ... hoặc thậm chí khi chỉ bị vết cắt rất nhỏ. Độc tố sinh ra từ vi khuẩn sẽ tấn công vào hệ thống thần kinh và gây hậu quả co thắt toàn bộ các cơ của cơ thể và dẫn đến nguy cơ tử vong rất cao, đặc biệt với trẻ sơ sinh.",
            "tuoi_tiem": 2,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 11.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 291.0,
            "ten_khang_nguyen": "Uốn ván",
            "thu_tu": 2,
            "tong_so_mui": 4,
            "mo_ta": "Bệnh Uốn ván do vi trùng uốn ván thường gặp trong đất hoặc bất kỳ phần rỉ sét nào trong môi trường sống. Vi khuẩn thường xâm nhập vào cơ thể qua các vết thương hở như: cắt rốn trong khi sinh, mổ xẻ... hoặc thậm chí khi chỉ bị vết cắt rất nhỏ. Độc tố sinh ra từ vi khuẩn sẽ tấn công vào hệ thống thần kinh và gây hậu quả co thắt toàn bộ các cơ của cơ thể và dẫn đến nguy cơ tử vong rất cao, đặc biệt với trẻ sơ sinh.",
            "tuoi_tiem": 3,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 43.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 12.0,
            "ten_khang_nguyen": "Dại",
            "thu_tu": 1,
            "tong_so_mui": null,
            "mo_ta": null,
            "tuoi_tiem": 0,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 41.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 12.0,
            "ten_khang_nguyen": "Dại",
            "thu_tu": 1,
            "tong_so_mui": null,
            "mo_ta": null,
            "tuoi_tiem": 0,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 19.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 2.0,
            "ten_khang_nguyen": "Bại liệt",
            "thu_tu": 3,
            "tong_so_mui": 3,
            "mo_ta": "Bại liệt là bệnh lý thần kinh vô cùng nguy hiểm do vi-rút Bại liệt gây ra. Vi-rút gây tổn thương hệ thống thần kinh dẫn đến nguy cơ tử vong do suy hô hấp. Các di chứng liệt một hoặc cả hai  chi không hồi phục làm trẻ bị tàn tật suốt đời.",
            "tuoi_tiem": 4,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 8.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 2.0,
            "ten_khang_nguyen": "Bại liệt",
            "thu_tu": 1,
            "tong_so_mui": 3,
            "mo_ta": "Bại liệt là bệnh lý thần kinh vô cùng nguy hiểm do vi-rút Bại liệt gây ra. Vi-rút gây tổn thương hệ thống thần kinh dẫn đến nguy cơ tử vong do suy hô hấp. Các di chứng liệt một hoặc cả hai  chi không hồi phục làm trẻ bị tàn tật suốt đời.",
            "tuoi_tiem": 2,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 10.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 2.0,
            "ten_khang_nguyen": "Bại liệt",
            "thu_tu": 2,
            "tong_so_mui": 3,
            "mo_ta": "Bại liệt là bệnh lý thần kinh vô cùng nguy hiểm do vi-rút Bại liệt gây ra. Vi-rút gây tổn thương hệ thống thần kinh dẫn đến nguy cơ tử vong do suy hô hấp. Các di chứng liệt một hoặc cả hai  chi không hồi phục làm trẻ bị tàn tật suốt đời.",
            "tuoi_tiem": 3,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 2.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 3.0,
            "ten_khang_nguyen": "Viêm gan B",
            "thu_tu": 1,
            "tong_so_mui": 4,
            "mo_ta": "Viêm gan B là một bệnh gan nghiêm trọng gây ra bởi virus viêm gan B (HBV). Đối với một số người, bệnh viêm gan B lây nhiễm trở thành mãn tính, dẫn đến suy gan, ung thư gan, hoặc xơ gan - một tình trạng gây ra sẹo vĩnh viễn ở gan.",
            "tuoi_tiem": 0,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 15.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 3.0,
            "ten_khang_nguyen": "Viêm gan B",
            "thu_tu": 4,
            "tong_so_mui": 4,
            "mo_ta": "Viêm gan B là một bệnh gan nghiêm trọng gây ra bởi virus viêm gan B (HBV). Đối với một số người, bệnh viêm gan B lây nhiễm trở thành mãn tính, dẫn đến suy gan, ung thư gan, hoặc xơ gan - một tình trạng gây ra sẹo vĩnh viễn ở gan.",
            "tuoi_tiem": 4,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 3.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 3.0,
            "ten_khang_nguyen": "Viêm gan B",
            "thu_tu": 2,
            "tong_so_mui": 4,
            "mo_ta": "Viêm gan B là một bệnh gan nghiêm trọng gây ra bởi virus viêm gan B (HBV). Đối với một số người, bệnh viêm gan B lây nhiễm trở thành mãn tính, dẫn đến suy gan, ung thư gan, hoặc xơ gan - một tình trạng gây ra sẹo vĩnh viễn ở gan.",
            "tuoi_tiem": 2,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 9.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 3.0,
            "ten_khang_nguyen": "Viêm gan B",
            "thu_tu": 3,
            "tong_so_mui": 4,
            "mo_ta": "Viêm gan B là một bệnh gan nghiêm trọng gây ra bởi virus viêm gan B (HBV). Đối với một số người, bệnh viêm gan B lây nhiễm trở thành mãn tính, dẫn đến suy gan, ung thư gan, hoặc xơ gan - một tình trạng gây ra sẹo vĩnh viễn ở gan.",
            "tuoi_tiem": 3,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 4.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 5.0,
            "ten_khang_nguyen": "Bạch Hầu",
            "thu_tu": 1,
            "tong_so_mui": 4,
            "mo_ta": "Bạch hầu là bệnh do vi khuẩn gây ra và thường lây qua đường hô hấp (hắt hơi, ho...)\nBệnh biểu hiện đặc trưng hội chứng nhiễm trùng nhiễm độc nặng nề với sốt cao, viêm họng nặng kèm giả mạc dẫn đến nguy cơ tử vong do suy hô hấp, tổn thương thần kinh và tim mạch...",
            "tuoi_tiem": 2,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 16.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 5.0,
            "ten_khang_nguyen": "Bạch Hầu",
            "thu_tu": 3,
            "tong_so_mui": 4,
            "mo_ta": "Bạch hầu là bệnh do vi khuẩn gây ra và thường lây qua đường hô hấp (hắt hơi, ho...)\nBệnh biểu hiện đặc trưng hội chứng nhiễm trùng nhiễm độc nặng nề với sốt cao, viêm họng nặng kèm giả mạc dẫn đến nguy cơ tử vong do suy hô hấp, tổn thương thần kinh và tim mạch...",
            "tuoi_tiem": 4,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 24.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 5.0,
            "ten_khang_nguyen": "Bạch Hầu",
            "thu_tu": 4,
            "tong_so_mui": 4,
            "mo_ta": "Bạch hầu là bệnh do vi khuẩn gây ra và thường lây qua đường hô hấp (hắt hơi, ho...)\nBệnh biểu hiện đặc trưng hội chứng nhiễm trùng nhiễm độc nặng nề với sốt cao, viêm họng nặng kèm giả mạc dẫn đến nguy cơ tử vong do suy hô hấp, tổn thương thần kinh và tim mạch...",
            "tuoi_tiem": 18,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 12.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 5.0,
            "ten_khang_nguyen": "Bạch Hầu",
            "thu_tu": 2,
            "tong_so_mui": 4,
            "mo_ta": "Bạch hầu là bệnh do vi khuẩn gây ra và thường lây qua đường hô hấp (hắt hơi, ho...)\nBệnh biểu hiện đặc trưng hội chứng nhiễm trùng nhiễm độc nặng nề với sốt cao, viêm họng nặng kèm giả mạc dẫn đến nguy cơ tử vong do suy hô hấp, tổn thương thần kinh và tim mạch...",
            "tuoi_tiem": 3,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 31.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 6.0,
            "ten_khang_nguyen": "Tả",
            "thu_tu": 1,
            "tong_so_mui": 2,
            "mo_ta": null,
            "tuoi_tiem": 24,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 32.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 6.0,
            "ten_khang_nguyen": "Tả",
            "thu_tu": 2,
            "tong_so_mui": 2,
            "mo_ta": null,
            "tuoi_tiem": 24,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 21.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 8.0,
            "ten_khang_nguyen": "Sởi",
            "thu_tu": 1,
            "tong_so_mui": 2,
            "mo_ta": "Bệnh Sởi là bệnh do vi-rút sởi gây ra phát ban, ho, chảy nước mũi, ngứa mắt và sốt.\nBệnh Sởi có thể dẫn đến nhiễm trùng tai, viêm phổi, động kinh, tổn thương não, và tử vong.",
            "tuoi_tiem": 9,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 22.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 8.0,
            "ten_khang_nguyen": "Sởi",
            "thu_tu": 2,
            "tong_so_mui": 2,
            "mo_ta": "Bệnh Sởi là bệnh do vi-rút sởi gây ra phát ban, ho, chảy nước mũi, ngứa mắt và sốt.\nBệnh Sởi có thể dẫn đến nhiễm trùng tai, viêm phổi, động kinh, tổn thương não, và tử vong.",
            "tuoi_tiem": 18,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 27.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 9.0,
            "ten_khang_nguyen": "Viêm não Nhật Bản",
            "thu_tu": 1,
            "tong_so_mui": 3,
            "mo_ta": "Viêm não Nhật Bản là bệnh truyền nhiễm do virus cấp tính. Virus viêm não Nhật Bản có ái lực với tế bào thần kinh nên khi xâm nhập vào máu, chúng tấn công vào hệ thần kinh trung ương gây tử vong hoặc để lại di chứng nặng nề.",
            "tuoi_tiem": 12,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 28.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 9.0,
            "ten_khang_nguyen": "Viêm não Nhật Bản",
            "thu_tu": 2,
            "tong_so_mui": 3,
            "mo_ta": "Viêm não Nhật Bản là bệnh truyền nhiễm do virus cấp tính. Virus viêm não Nhật Bản có ái lực với tế bào thần kinh nên khi xâm nhập vào máu, chúng tấn công vào hệ thần kinh trung ương gây tử vong hoặc để lại di chứng nặng nề.",
            "tuoi_tiem": 12,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 29.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 9.0,
            "ten_khang_nguyen": "Viêm não Nhật Bản",
            "thu_tu": 3,
            "tong_so_mui": 3,
            "mo_ta": "Viêm não Nhật Bản là bệnh truyền nhiễm do virus cấp tính. Virus viêm não Nhật Bản có ái lực với tế bào thần kinh nên khi xâm nhập vào máu, chúng tấn công vào hệ thần kinh trung ương gây tử vong hoặc để lại di chứng nặng nề.",
            "tuoi_tiem": 24,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 30.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 13.0,
            "ten_khang_nguyen": "Thương Hàn",
            "thu_tu": 1,
            "tong_so_mui": 1,
            "mo_ta": null,
            "tuoi_tiem": 36,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 1.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 270.0,
            "ten_khang_nguyen": "Lao",
            "thu_tu": 1,
            "tong_so_mui": 1,
            "mo_ta": "Bệnh lao là một bệnh nhiễm khuẩn, một bệnh lây. Nguyên nhân gây bệnh lao là do vi khuẩn lao từ người bệnh sang người lành. Nguồn lây là những bệnh nhân lao nói chung, đặc biệt là lao phổi khạc ra vi khuẩn lao trong đờm tìm thấy được bằng phương pháp nhuộm soi trực tiếp là nguồn lây bệnh nguy hiểm nhất.",
            "tuoi_tiem": 0,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 14.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 172.0,
            "ten_khang_nguyen": "Hib",
            "thu_tu": 2,
            "tong_so_mui": 3,
            "mo_ta": "Các bệnh lý thường gặp là viêm màng não mũ, viêm phổi, viêm nắp thanh quản, nhiễm trùng máu... Viêm màng não mủ do vi khuẩn Hib thương gây tử vong cao hoặc dẫn đến các di chứng thần kinh không hồi phục. Vi khuẩn thường gây ra bệnh cho các trẻ em dưới 5 tuổi, trong đó nhóm trẻ em dưới 1 tuổi là đối tượng dễ mắc bệnh nhất.",
            "tuoi_tiem": 3,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 20.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 172.0,
            "ten_khang_nguyen": "Hib",
            "thu_tu": 3,
            "tong_so_mui": 3,
            "mo_ta": "Các bệnh lý thường gặp là viêm màng não mũ, viêm phổi, viêm nắp thanh quản, nhiễm trùng máu... Viêm màng não mủ do vi khuẩn Hib thương gây tử vong cao hoặc dẫn đến các di chứng thần kinh không hồi phục. Vi khuẩn thường gây ra bệnh cho các trẻ em dưới 5 tuổi, trong đó nhóm trẻ em dưới 1 tuổi là đối tượng dễ mắc bệnh nhất.",
            "tuoi_tiem": 4,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 7.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 172.0,
            "ten_khang_nguyen": "Hib",
            "thu_tu": 1,
            "tong_so_mui": 3,
            "mo_ta": "Các bệnh lý thường gặp là viêm màng não mũ, viêm phổi, viêm nắp thanh quản, nhiễm trùng máu... Viêm màng não mủ do vi khuẩn Hib thương gây tử vong cao hoặc dẫn đến các di chứng thần kinh không hồi phục. Vi khuẩn thường gây ra bệnh cho các trẻ em dưới 5 tuổi, trong đó nhóm trẻ em dưới 1 tuổi là đối tượng dễ mắc bệnh nhất.",
            "tuoi_tiem": 2,
            "don_vi_tuoi_tiem": 3
        },
        {
            "phac_do_id": 23.0,
            "doi_tuong_id": null,
            "khang_nguyen_id": 176.0,
            "ten_khang_nguyen": "Rubella",
            "thu_tu": 1,
            "tong_so_mui": 1,
            "mo_ta": "Vi rút Rubella gây phát ban, viêm khớp (chủ yếu ở phụ nữ) và sốt nhẹ\nRubella là bệnh nguy hiểm và nghiêm trọng đối với phụ nữ mang thai và thai nhi. Nếu một phụ nữ bị Rubella trong khi đang mang thai, bé có thể bị dị tật bẩm sinh như các vấn đề về tim mạch, mất khả năng nghe và nhìn, ảnh hưởng trí não, bị tổn thương gan hoặc  lá lách. Các tổn thương bẩm sinh nghiêm trọng là phổ biến nếu thai phụ bị nhiễm rubella trong thời kỳ đầu mang thai, đặc biệt trong 12 tuần đầu tiên. Bị nhiễm rubella khi mang thai đồng thời có thể gây sẩy thai hoặc sinh non.\nCác bệnh này lây lan từ người này sang người khác qua mầm bệnh lan truyền trong không khí. Bé yêu và thậm chí bạn có thể dễ dàng nhiễm bệnh do ở gần một ai đó đã bị nhiễm bệnh.",
            "tuoi_tiem": 18,
            "don_vi_tuoi_tiem": 3
        }
    ]
}
```

### Flow change password

#### Step 1: Call API recover_pass_by_sms

```sh
curl 'https://api-stc-v2.vncdc.gov.vn/recover_pass_by_sms?phoneNumber=0912165555' \
  -X 'POST' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: vi' \
  -H 'authorization;' \
  -H 'content-length: 0' \
  -H 'origin: https://sotiemchung.vncdc.gov.vn' \
  -H 'priority: u=1, i' \
  -H 'referer: https://sotiemchung.vncdc.gov.vn/' \
  -H 'sec-ch-ua: "Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
```

##### Payload: 

```sh
phoneNumber=0912165555
```

##### Response: 

```json
{"code":1,"message":"Mã xác nhận đã gởi về số điện thoại của bạn"}
```

#### Step 2: Call API activate

```sh
curl 'https://api-stc-v2.vncdc.gov.vn/activate' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: vi' \
  -H 'authorization;' \
  -H 'content-type: application/json;charset=UTF-8' \
  -H 'origin: https://sotiemchung.vncdc.gov.vn' \
  -H 'priority: u=1, i' \
  -H 'referer: https://sotiemchung.vncdc.gov.vn/' \
  -H 'sec-ch-ua: "Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' \
  --data-raw '{"phoneNumber":"0912165555","otp":"870790"}'
```

##### Payload: 

```json
{"phoneNumber":"0912165555","otp":"870790"}
```

##### Response: 
```json
{
    "code": 1,
    "message": "Kích hoạt tài khoản thành công.",
    "data": {
        "user_info": {
            "thue_bao_id": 193375.0,
            "ho_ten": null,
            "phone_number": "0912165555",
            "email": null,
            "avatar": null
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IjA5MTIxNjU1NTUiLCJzdWIiOiIwOTEyMTY1NTU1IiwidXNlcklkIjoiMTkzMzc1IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6IjQxNGUxOTI3YTM4ODRmNjhhYmM3OWY3MjgzODM3ZmQxIiwiZXhwIjoxNzYxNDAwOTAwLCJuYmYiOjE3NjEzMTQ1MDB9.djASoe_uKZ2b5t12t7NgW-xB16UYXiodDyVCA03lTCw",
        "tokenType": "bearer"
    }
}
```

#### Step 3: Call API change_pass_by_token

```sh
  curl 'https://api-stc-v2.vncdc.gov.vn/change_pass_by_token' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: vi' \
  -H 'authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IjA5MTIxNjU1NTUiLCJzdWIiOiIwOTEyMTY1NTU1IiwidXNlcklkIjoiMTkzMzc1IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6IjQxNGUxOTI3YTM4ODRmNjhhYmM3OWY3MjgzODM3ZmQxIiwiZXhwIjoxNzYxNDAwOTAwLCJuYmYiOjE3NjEzMTQ1MDB9.djASoe_uKZ2b5t12t7NgW-xB16UYXiodDyVCA03lTCw' \
  -H 'content-type: application/json;charset=UTF-8' \
  -H 'origin: https://sotiemchung.vncdc.gov.vn' \
  -H 'priority: u=1, i' \
  -H 'referer: https://sotiemchung.vncdc.gov.vn/' \
  -H 'sec-ch-ua: "Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' \
  --data-raw '{"phoneNumber":"0912165555","password":"2212@Leo"}'
  ```

  ##### Payload: 
  ```json
  {"phoneNumber":"0912165555","password":"2212@Leo"}
  ```

  ##### Response: 
```json
{
    "code": 1,
    "message": "Thiết lập mật khẩu thành công",
    "data": {
        "user_info": {
            "thue_bao_id": 193375.0,
            "ho_ten": null,
            "phone_number": "0912165555",
            "email": null,
            "avatar": null
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IjA5MTIxNjU1NTUiLCJzdWIiOiIwOTEyMTY1NTU1IiwidXNlcklkIjoiMTkzMzc1IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6IjQxNGUxOTI3YTM4ODRmNjhhYmM3OWY3MjgzODM3ZmQxIiwiZXhwIjoxNzYxNDAwOTIxLCJuYmYiOjE3NjEzMTQ1MjF9.JM1HNmELSRzVtivrTJDzowJulvBiwddEs1MfgReNlKY",
        "tokenType": "bearer"
    }
}
```