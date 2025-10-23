import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  ThanhVienResponse,
  ThanhVienDetail,
  VaccinationHistoryResponse
} from '../types';

const BASE_URL = 'https://api-stc-v2.vncdc.gov.vn';

// Create axios instance with default config
const createApiInstance = (token?: string): AxiosInstance => {
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'vi',
      'content-type': 'application/json;charset=UTF-8',
      'origin': 'https://sotiemchung.vncdc.gov.vn',
      'referer': 'https://sotiemchung.vncdc.gov.vn/',
      'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
    }
  };

  if (token) {
    config.headers = {
      ...config.headers,
      'authorization': `Bearer ${token}`
    };
  }

  return axios.create(config);
};

// API Service
class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async login(phoneNumber: string, password: string): Promise<LoginResponse> {
    const api = createApiInstance();

    const requestData: LoginRequest = {
      phoneNumber,
      pass: password,
      osType: '',
      osVersion: '',
      deviceId: '',
      notificationToken: ''
    };

    const response = await api.post<LoginResponse>('/auth', requestData);

    if (response.data.token) {
      this.setToken(response.data.token);
    }

    return response.data;
  }

  async getThanhVien(): Promise<ThanhVienResponse> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const api = createApiInstance(token);
    const response = await api.get<ThanhVienResponse>('/thanh_vien?theo_doi=1');
    return response.data;
  }

  async getThanhVienDetail(memberId: number): Promise<ThanhVienDetail> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const api = createApiInstance(token);
    const response = await api.get<ThanhVienDetail>(`/thanh_vien/${memberId}`);
    return response.data;
  }

  async getVaccinationHistory(memberId: number): Promise<VaccinationHistoryResponse> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const api = createApiInstance(token);
    const response = await api.get<VaccinationHistoryResponse>(
      `/lich_su_tiem/khang_nguyen?doi_tuong_id=${memberId}`
    );
    return response.data;
  }
}

export const apiService = new ApiService();
