import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { ThanhVien } from '../types';

export const PersonalInfo = () => {
  const [members, setMembers] = useState<ThanhVien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getThanhVien();
      setMembers(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải thông tin thành viên');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = (memberId: number) => {
    navigate(`/vaccination-history/${memberId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchMembers}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Thông Tin Cá Nhân</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Danh sách thành viên theo dõi
          </h2>
          <p className="text-gray-600">Chọn thành viên để xem lịch sử tiêm chủng</p>
        </div>

        {members.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Không có thành viên nào</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {members.map((member) => (
              <div
                key={member.ma_thanh_vien}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {member.ho_va_ten}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Mã TV: {member.ma_thanh_vien}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {member.gioi_tinh}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start">
                    <span className="text-gray-600 text-sm w-32">Ngày sinh:</span>
                    <span className="text-gray-800 text-sm">
                      {new Date(member.ngay_sinh).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 text-sm w-32">Điện thoại:</span>
                    <span className="text-gray-800 text-sm">{member.so_dien_thoai}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 text-sm w-32">Địa chỉ:</span>
                    <span className="text-gray-800 text-sm">{member.dia_chi}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewHistory(member.ma_thanh_vien)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Xem lịch sử tiêm chủng
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
