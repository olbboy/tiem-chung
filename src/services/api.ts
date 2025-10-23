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

// Helper function to extract token from various response structures
const extractToken = (data: any): string | null => {
  // Try different possible token field names
  const tokenFields = ['token', 'accessToken', 'access_token', 'jwt', 'Token', 'AccessToken'];

  for (const field of tokenFields) {
    if (data[field] && typeof data[field] === 'string') {
      console.log(`[API] Token found in field: ${field}`);
      return data[field];
    }
  }

  // Check if token is nested in data object
  if (data.data) {
    for (const field of tokenFields) {
      if (data.data[field] && typeof data.data[field] === 'string') {
        console.log(`[API] Token found in data.${field}`);
        return data.data[field];
      }
    }
  }

  return null;
};

// API Service
class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
    console.log('[API] Token saved to localStorage');
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
    console.log('[API] Token cleared');
  }

  async login(phoneNumber: string, password: string): Promise<LoginResponse> {
    try {
      const api = createApiInstance();

      const requestData: LoginRequest = {
        phoneNumber,
        pass: password,
        osType: '',
        osVersion: '',
        deviceId: '',
        notificationToken: ''
      };

      console.log('[API] Login request:', { phoneNumber });

      const response = await api.post('/auth', requestData);
      console.log('[API] Login response:', response.data);

      // Extract token from response (flexible structure)
      const token = extractToken(response.data);

      if (!token) {
        console.error('[API] No token found in response:', response.data);
        throw new Error('Không tìm thấy token trong phản hồi từ server');
      }

      this.setToken(token);

      // Return normalized response
      return {
        token,
        ...response.data
      };
    } catch (error: any) {
      console.error('[API] Login error:', error);

      if (error.response) {
        // Server responded with error
        const message = error.response.data?.message ||
                       error.response.data?.error ||
                       error.response.data?.msg ||
                       'Đăng nhập thất bại';
        throw new Error(message);
      } else if (error.request) {
        // Request made but no response
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Something else happened
        throw error;
      }
    }
  }

  async getThanhVien(): Promise<ThanhVienResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Vui lòng đăng nhập lại');
      }

      const api = createApiInstance(token);
      console.log('[API] Fetching thanh vien list');

      const response = await api.get('/thanh_vien?theo_doi=1');
      console.log('[API] Thanh vien response:', response.data);

      // Handle both array and object responses
      if (Array.isArray(response.data)) {
        return { data: response.data };
      } else if (response.data.data && Array.isArray(response.data.data)) {
        return response.data;
      } else {
        console.warn('[API] Unexpected response structure:', response.data);
        return { data: [] };
      }
    } catch (error: any) {
      console.error('[API] Get thanh vien error:', error);

      if (error.response?.status === 401) {
        this.clearToken();
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      throw new Error(error.message || 'Không thể tải danh sách thành viên');
    }
  }

  async getThanhVienDetail(memberId: number): Promise<ThanhVienDetail> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Vui lòng đăng nhập lại');
      }

      const api = createApiInstance(token);
      console.log('[API] Fetching member detail:', memberId);

      const response = await api.get(`/thanh_vien/${memberId}`);
      console.log('[API] Member detail response:', response.data);

      // Handle nested data structure
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('[API] Get member detail error:', error);

      if (error.response?.status === 401) {
        this.clearToken();
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      throw new Error(error.message || 'Không thể tải thông tin thành viên');
    }
  }

  async getVaccinationHistory(memberId: number): Promise<VaccinationHistoryResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Vui lòng đăng nhập lại');
      }

      const api = createApiInstance(token);
      console.log('[API] Fetching vaccination history:', memberId);

      const response = await api.get(
        `/lich_su_tiem/khang_nguyen?doi_tuong_id=${memberId}`
      );
      console.log('[API] Vaccination history response:', response.data);

      // Handle both array and object responses
      if (Array.isArray(response.data)) {
        return { data: response.data };
      } else if (response.data.data && Array.isArray(response.data.data)) {
        return response.data;
      } else {
        console.warn('[API] Unexpected response structure:', response.data);
        return { data: [] };
      }
    } catch (error: any) {
      console.error('[API] Get vaccination history error:', error);

      if (error.response?.status === 401) {
        this.clearToken();
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      throw new Error(error.message || 'Không thể tải lịch sử tiêm chủng');
    }
  }
}

export const apiService = new ApiService();
