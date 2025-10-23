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
