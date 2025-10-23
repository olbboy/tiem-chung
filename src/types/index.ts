// API Types
export interface LoginRequest {
  phoneNumber: string;
  pass: string;
  osType: string;
  osVersion: string;
  deviceId: string;
  notificationToken: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  userId?: string;
  [key: string]: any;
}

// Caregiver (Người chăm sóc)
export interface NguoiChamSoc {
  ho_ten: string;
  nam_sinh: number;
  so_dien_thoai: string;
  cmnd?: string | null;
  quan_he: number; // 1 = parent, etc.
  mac_dinh: number; // 1 = default
}

export interface ThanhVien {
  ma_thanh_vien: number;
  doi_tuong_id: number; // ID for vaccination history API
  ho_ten: string; // Actual API field
  ngay_sinh: string;
  gioi_tinh: number; // 0 = male, 1 = female
  dien_thoai: string; // Actual API field
  email?: string;
  [key: string]: any;
}

export interface ThanhVienResponse {
  data: ThanhVien[];
  [key: string]: any;
}

export interface ThanhVienDetail extends ThanhVien {
  ma_doi_tuong?: string;
  cmnd?: string;
  cccd?: string;
  dan_toc_id?: number;
  ten_dan_toc?: string; // Ethnicity name
  co_so_id?: number;
  ten_co_so?: string; // Healthcare facility name

  // Permanent address (Hộ khẩu)
  ho_khau_tinh_id?: number | null;
  ho_khau_huyen_id?: number | null;
  ho_khau_xa_id?: number | null;
  ho_khau_thon_ap_id?: number | null;
  ho_khau_tinh?: string | null;
  ho_khau_huyen?: string | null;
  ho_khau_xa?: string | null;
  ho_khau_thon_ap?: string | null;
  ho_khau_dia_chi?: string | null;

  // Temporary address (Tạm trú)
  tam_tru_tinh_id?: number | null;
  tam_tru_huyen_id?: number | null;
  tam_tru_xa_id?: number | null;
  tam_tru_thon_ap_id?: number | null;
  tam_tru_tinh?: string | null;
  tam_tru_huyen?: string | null;
  tam_tru_xa?: string | null;
  tam_tru_thon_ap?: string | null;
  tam_tru_dia_chi?: string | null;

  theo_doi?: number;
  hien_thi_mac_dinh?: string;
  avatar?: string;
  avatar_id?: number | null;
  avatar_file_type?: string | null;
  ds_nguoi_cham_soc?: NguoiChamSoc[];

  [key: string]: any;
}

// Khang Nguyen (Disease/Antibody) Record
export interface KhangNguyenRecord {
  lich_su_tiem_id: number;
  khang_nguyen_id: number;
  doi_tuong_id: number;
  ten_khang_nguyen: string; // Disease name
  trang_thai: number; // 2 = vaccinated, 1 = not vaccinated
  ngay_tiem: string; // Format: "10:12 02/11/2022"
  [key: string]: any;
}

export interface KhangNguyenResponse {
  data: KhangNguyenRecord[];
  [key: string]: any;
}

// Vacxin (Vaccine) Record
export interface VacxinRecord {
  lich_su_tiem_id: number;
  doi_tuong_id: number;
  vacxin_id: number;
  ten_vacxin: string; // Actual API field name
  khang_nguyen: string; // Antibody name
  ngay_tiem: string;
  thu_tu_mui_tiem: number; // Dose order
  thu_tu_hien_thi?: number; // Display order
  lo_vacxin?: string; // Actual API field name
  co_so_tiem_chung?: string; // Actual API field name
  nguoi_tiem?: string;
  phan_ung_sau_tiem?: {
    ngay_phan_ung: string | null;
    loai_phan_ung: string | null;
    ket_qua: string | null;
  } | string;
  trang_thai?: number;
  seo?: string | null;
  truoc_24h?: string | null;
  [key: string]: any;
}

export interface VacxinResponse {
  data: VacxinRecord[];
  [key: string]: any;
}

// Phac Do (Vaccination Schedule) Record
export interface PhacDoRecord {
  phac_do_id: number;
  doi_tuong_id: number | null;
  khang_nguyen_id: number;
  ten_khang_nguyen: string; // Antibody/disease name
  thu_tu: number; // Dose order (1, 2, 3, 4)
  tong_so_mui: number | null; // Total doses (can be null)
  mo_ta: string | null; // Description (can be null or very long)
  tuoi_tiem: number; // Age to vaccinate
  don_vi_tuoi_tiem: number; // Age unit (3 = months)
  [key: string]: any;
}

export interface PhacDoResponse {
  code: number;
  message: string;
  data: PhacDoRecord[];
}

// Legacy type - kept for backward compatibility
export interface VaccinationRecord {
  ma_tiem: number;
  ma_thanh_vien: number;
  ten_vaccine: string;
  ngay_tiem: string;
  mui_so: number;
  lo_vaccine: string;
  noi_tiem: string;
  nguoi_tiem?: string;
  phan_ung_sau_tiem?: string;
  [key: string]: any;
}

export interface VaccinationHistoryResponse {
  data: VaccinationRecord[];
  [key: string]: any;
}
