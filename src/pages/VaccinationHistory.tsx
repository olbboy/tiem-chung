import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { ThanhVienDetail, VaccinationRecord } from '../types';

export const VaccinationHistory = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const [memberDetail, setMemberDetail] = useState<ThanhVienDetail | null>(null);
  const [vaccinationRecords, setVaccinationRecords] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (memberId) {
      fetchData(parseInt(memberId));
    }
  }, [memberId]);

  const fetchData = async (id: number) => {
    try {
      setLoading(true);
      setError('');

      // Fetch member details and vaccination history in parallel
      const [detailResponse, historyResponse] = await Promise.all([
        apiService.getThanhVienDetail(id),
        apiService.getVaccinationHistory(id)
      ]);

      setMemberDetail(detailResponse);
      setVaccinationRecords(historyResponse.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/personal-info');
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
            onClick={handleBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-2 text-sm hover:underline flex items-center"
          >
            ← Quay lại
          </button>
          <h1 className="text-2xl font-bold">Lịch Sử Tiêm Chủng</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Member Information Card */}
        {memberDetail && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin thành viên
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-gray-600 w-32">Họ và tên:</span>
                  <span className="text-gray-800 font-semibold">{memberDetail.ho_va_ten}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Ngày sinh:</span>
                  <span className="text-gray-800">
                    {new Date(memberDetail.ngay_sinh).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Giới tính:</span>
                  <span className="text-gray-800">{memberDetail.gioi_tinh}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Mã TV:</span>
                  <span className="text-gray-800">{memberDetail.ma_thanh_vien}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-gray-600 w-32">Điện thoại:</span>
                  <span className="text-gray-800">{memberDetail.so_dien_thoai}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Địa chỉ:</span>
                  <span className="text-gray-800">{memberDetail.dia_chi}</span>
                </div>
                {memberDetail.email && (
                  <div className="flex">
                    <span className="text-gray-600 w-32">Email:</span>
                    <span className="text-gray-800">{memberDetail.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Vaccination History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Lịch sử tiêm chủng ({vaccinationRecords.length} mũi)
          </h2>

          {vaccinationRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              Chưa có lịch sử tiêm chủng
            </div>
          ) : (
            <div className="space-y-4">
              {vaccinationRecords.map((record, index) => (
                <div
                  key={record.ma_tiem || index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600">
                        {record.ten_vaccine}
                      </h3>
                      <p className="text-sm text-gray-500">Mũi số {record.mui_so}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                      Đã tiêm
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-start">
                      <span className="text-gray-600 text-sm w-32">Ngày tiêm:</span>
                      <span className="text-gray-800 text-sm">
                        {new Date(record.ngay_tiem).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 text-sm w-32">Lô vaccine:</span>
                      <span className="text-gray-800 text-sm">{record.lo_vaccine}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 text-sm w-32">Nơi tiêm:</span>
                      <span className="text-gray-800 text-sm">{record.noi_tiem}</span>
                    </div>
                    {record.nguoi_tiem && (
                      <div className="flex items-start">
                        <span className="text-gray-600 text-sm w-32">Người tiêm:</span>
                        <span className="text-gray-800 text-sm">{record.nguoi_tiem}</span>
                      </div>
                    )}
                  </div>

                  {record.phan_ung_sau_tiem && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-gray-600 text-sm">Phản ứng sau tiêm:</span>
                      <p className="text-gray-800 text-sm mt-1">{record.phan_ung_sau_tiem}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
