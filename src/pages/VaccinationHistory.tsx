import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import type { ThanhVienDetail, KhangNguyenRecord, VacxinRecord } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  UserCircle,
  Calendar,
  Phone,
  MapPin,
  Mail,
  IdCard,
  Syringe,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Building,
  User,
  Activity,
  Shield,
  XCircle,
  Clock
} from 'lucide-react';

export const VaccinationHistory = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [memberDetail, setMemberDetail] = useState<ThanhVienDetail | null>(null);
  const [khangNguyenRecords, setKhangNguyenRecords] = useState<KhangNguyenRecord[]>([]);
  const [vacxinRecords, setVacxinRecords] = useState<VacxinRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('khang-nguyen');

  useEffect(() => {
    if (memberId) {
      const doiTuongId = parseInt(memberId);
      const maThanhVien = location.state?.ma_thanh_vien;

      console.log('[VaccinationHistory] IDs:', {
        doi_tuong_id: doiTuongId,
        ma_thanh_vien: maThanhVien
      });

      fetchData(doiTuongId, maThanhVien);
    }
  }, [memberId, location.state]);

  const fetchData = async (doiTuongId: number, maThanhVien?: number) => {
    try {
      setLoading(true);
      setError('');
      console.log('[VaccinationHistory] Fetching data with IDs:', {
        doi_tuong_id: doiTuongId,
        ma_thanh_vien: maThanhVien
      });

      const memberIdForDetail = maThanhVien || doiTuongId;

      // Fetch all data in parallel
      const [detailResponse, khangNguyenResponse, vacxinResponse] = await Promise.all([
        apiService.getThanhVienDetail(memberIdForDetail),
        apiService.getKhangNguyenHistory(doiTuongId),
        apiService.getVacxinHistory(doiTuongId)
      ]);

      console.log('[VaccinationHistory] Member detail response:', detailResponse);
      console.log('[VaccinationHistory] Khang nguyen response:', khangNguyenResponse);
      console.log('[VaccinationHistory] Vacxin response:', vacxinResponse);

      setMemberDetail(detailResponse);

      // Extract khang nguyen records
      const khangNguyenData = khangNguyenResponse.data || khangNguyenResponse || [];
      setKhangNguyenRecords(Array.isArray(khangNguyenData) ? khangNguyenData : [khangNguyenData]);

      // Extract vacxin records
      const vacxinData = vacxinResponse.data || vacxinResponse || [];
      setVacxinRecords(Array.isArray(vacxinData) ? vacxinData : [vacxinData]);

      console.log('[VaccinationHistory] Data loaded successfully');
    } catch (err: any) {
      console.error('[VaccinationHistory] Error fetching data:', err);
      const errorMessage = err.message || 'Không thể tải thông tin';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    console.log('[VaccinationHistory] Navigating back to personal info');
    navigate('/personal-info');
  };

  const shouldShowField = (key: string): boolean => {
    const hiddenFields = [
      'ma_thanh_vien', 'doi_tuong_id', 'ho_va_ten', 'gioi_tinh',
      'ngay_sinh', 'so_dien_thoai', 'dia_chi', 'email'
    ];

    if (hiddenFields.includes(key)) return false;
    if (key.endsWith('_id')) return false;
    if (key.startsWith('ho_khau_')) return false;
    if (key.startsWith('created') || key.startsWith('updated')) return false;

    return true;
  };

  // Helper to format number with thousand separators
  const formatNumber = (num: number): string => {
    return num.toLocaleString('vi-VN');
  };

  // Helper to get vaccination status badge
  const getStatusBadge = (trangThai: number) => {
    if (trangThai === 2) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã tiêm
        </Badge>
      );
    } else if (trangThai === 1) {
      return (
        <Badge variant="secondary" className="bg-gray-200 text-gray-700">
          <XCircle className="w-3 h-3 mr-1" />
          Chưa tiêm
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline">
          <Clock className="w-3 h-3 mr-1" />
          Không rõ
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Skeleton className="h-10 w-32 mb-3" />
            <Skeleton className="h-8 w-64" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-4" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-10 w-full max-w-md mb-4" />
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Lỗi tải dữ liệu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Không thể tải dữ liệu</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardContent className="pt-0">
            <Button onClick={handleBack} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="mb-3 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
              <Syringe className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Lịch Sử Tiêm Chủng
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Hồ sơ tiêm chủng chi tiết
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Member Information Card */}
        {memberDetail && (
          <Card className="overflow-hidden border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <UserCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Thông tin thành viên</CardTitle>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Hồ sơ cá nhân và thông tin liên hệ
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Basic Info Section */}
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-600 mb-0.5">Họ và tên</div>
                    <div className="font-semibold text-gray-900">{memberDetail.ho_va_ten}</div>
                  </div>
                </div>

                {memberDetail.ngay_sinh && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-600 mb-0.5">Ngày sinh</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(memberDetail.ngay_sinh).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-600 mb-0.5">Giới tính</div>
                    <div className="font-semibold text-gray-900">{memberDetail.gioi_tinh}</div>
                  </div>
                </div>

                {memberDetail.so_dien_thoai && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-600 mb-0.5">Điện thoại</div>
                      <div className="font-semibold text-gray-900">{memberDetail.so_dien_thoai}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              {(memberDetail.dia_chi || memberDetail.email) && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  {memberDetail.dia_chi && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-600 mb-0.5">Địa chỉ</div>
                        <div className="font-semibold text-gray-900">{memberDetail.dia_chi}</div>
                      </div>
                    </div>
                  )}

                  {memberDetail.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-600 mb-0.5">Email</div>
                        <div className="font-semibold text-gray-900">{memberDetail.email}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Info */}
              {Object.entries(memberDetail).filter(([key]) => shouldShowField(key)).length > 0 && (
                <div className="grid md:grid-cols-2 gap-3 pt-4 border-t border-gray-100 mt-4">
                  {Object.entries(memberDetail)
                    .filter(([key]) => shouldShowField(key))
                    .slice(0, 4)
                    .map(([key, value]) => {
                      const fieldLabels: Record<string, string> = {
                        'cmnd': 'CMND',
                        'cccd': 'CCCD',
                        'dan_toc': 'Dân tộc',
                        'nghe_nghiep': 'Nghề nghiệp',
                      };

                      const label = fieldLabels[key] || key.split('_')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ');

                      return (
                        <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <IdCard className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-600 mb-0.5">{label}</div>
                            <div className="font-semibold text-gray-900">{String(value)}</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Vaccination History with Tabs */}
        <Card className="overflow-hidden border-2">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Lịch sử tiêm chủng
                </CardTitle>
                <p className="text-sm text-gray-600 mt-0.5">
                  Xem theo kháng nguyên hoặc vaccine
                </p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger
                  active={activeTab === 'khang-nguyen'}
                  onClick={() => setActiveTab('khang-nguyen')}
                  className="flex-1 sm:flex-none"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Kháng nguyên ({khangNguyenRecords.length})
                </TabsTrigger>
                <TabsTrigger
                  active={activeTab === 'vacxin'}
                  onClick={() => setActiveTab('vacxin')}
                  className="flex-1 sm:flex-none"
                >
                  <Syringe className="w-4 h-4 mr-2" />
                  Vaccine ({vacxinRecords.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Khang Nguyen Tab Content */}
            <TabsContent active={activeTab === 'khang-nguyen'}>
              {khangNguyenRecords.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                    <Shield className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chưa có lịch sử kháng nguyên
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Thành viên này chưa có bản ghi tiêm kháng nguyên nào trong hệ thống.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {khangNguyenRecords.map((record, index) => (
                    <Card
                      key={record.lich_su_tiem_id || index}
                      className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start flex-wrap gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="bg-blue-100 p-3 rounded-lg">
                              <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg text-blue-700 leading-tight">
                                {record.ten_khang_nguyen}
                              </CardTitle>
                              <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <IdCard className="w-3 h-3" />
                                  ID: {formatNumber(record.doi_tuong_id)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  KN ID: {record.khang_nguyen_id}
                                </span>
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(record.trang_thai)}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-3">
                          {record.ngay_tiem && (
                            <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg">
                              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-600">Ngày tiêm</div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {record.ngay_tiem}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg">
                            <Activity className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-600">Lịch sử tiêm ID</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {formatNumber(record.lich_su_tiem_id)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Vacxin Tab Content */}
            <TabsContent active={activeTab === 'vacxin'}>
              {vacxinRecords.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                    <Syringe className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chưa có lịch sử vaccine
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Thành viên này chưa có bản ghi tiêm vaccine nào trong hệ thống.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vacxinRecords.map((record, index) => (
                    <Card
                      key={record.lich_su_tiem_id || index}
                      className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start flex-wrap gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="bg-green-100 p-3 rounded-lg">
                              <Syringe className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg text-green-700 leading-tight">
                                {record.ten_vaccine}
                              </CardTitle>
                              <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Syringe className="w-3 h-3" />
                                  Mũi số {record.thu_tu_mui_tiem}
                                </span>
                                <span className="flex items-center gap-1">
                                  <IdCard className="w-3 h-3" />
                                  ID: {formatNumber(record.lich_su_tiem_id)}
                                </span>
                              </div>
                            </div>
                          </div>
                          {record.trang_thai !== undefined && getStatusBadge(record.trang_thai)}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-3">
                          {record.ngay_tiem && (
                            <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg">
                              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-600">Ngày tiêm</div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {record.ngay_tiem}
                                </div>
                              </div>
                            </div>
                          )}

                          {record.lo_vaccine && (
                            <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg">
                              <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-600">Lô vaccine</div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {record.lo_vaccine}
                                </div>
                              </div>
                            </div>
                          )}

                          {record.noi_tiem && (
                            <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg">
                              <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-600">Nơi tiêm</div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {record.noi_tiem}
                                </div>
                              </div>
                            </div>
                          )}

                          {record.nguoi_tiem && (
                            <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg">
                              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-600">Người tiêm</div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {record.nguoi_tiem}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2.5 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <Activity className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-blue-700">Thứ tự mũi tiêm</div>
                              <div className="text-sm font-semibold text-blue-900">
                                Mũi {record.thu_tu_mui_tiem}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <Activity className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-blue-700">Thứ tự hiển thị</div>
                              <div className="text-sm font-semibold text-blue-900">
                                {record.thu_tu_hien_thi}
                              </div>
                            </div>
                          </div>
                        </div>

                        {record.phan_ung_sau_tiem && (
                          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-lg">
                            <Activity className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-amber-900 mb-1">
                                Phản ứng sau tiêm
                              </div>
                              <p className="text-sm text-amber-800">
                                {record.phan_ung_sau_tiem}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleBack}
            variant="outline"
            size="lg"
            className="shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách thành viên
          </Button>
        </div>
      </main>
    </div>
  );
};
