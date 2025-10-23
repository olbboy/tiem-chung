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

export interface ThanhVien {
  ma_thanh_vien: number;
  doi_tuong_id: number; // ID for vaccination history API
  ho_va_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  dia_chi: string;
  so_dien_thoai: string;
  email?: string;
  [key: string]: any;
}

export interface ThanhVienResponse {
  data: ThanhVien[];
  [key: string]: any;
}

export interface ThanhVienDetail extends ThanhVien {
  cmnd?: string;
  cccd?: string;
  dan_toc?: string;
  nghe_nghiep?: string;
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
  ten_vaccine: string;
  ngay_tiem: string;
  thu_tu_mui_tiem: number; // Dose order
  thu_tu_hien_thi: number; // Display order
  lo_vaccine?: string;
  noi_tiem?: string;
  nguoi_tiem?: string;
  phan_ung_sau_tiem?: string;
  trang_thai?: number;
  [key: string]: any;
}

export interface VacxinResponse {
  data: VacxinRecord[];
  [key: string]: any;
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
