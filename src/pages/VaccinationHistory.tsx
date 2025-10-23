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
      const doiTuongId = safeParseNumber(memberId);
      const maThanhVien = location.state?.ma_thanh_vien;

      console.log('[VaccinationHistory] IDs:', {
        doi_tuong_id: doiTuongId,
        ma_thanh_vien: maThanhVien
      });

      if (doiTuongId) {
        fetchData(doiTuongId, maThanhVien);
      } else {
        setError('ID không hợp lệ');
        setLoading(false);
      }
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

      // Extract and sort khang nguyen records
      const khangNguyenData = khangNguyenResponse.data || khangNguyenResponse || [];
      const khangNguyenArray = Array.isArray(khangNguyenData) ? khangNguyenData : [khangNguyenData];
      setKhangNguyenRecords(sortByDate(khangNguyenArray));

      // Extract and sort vacxin records
      const vacxinData = vacxinResponse.data || vacxinResponse || [];
      const vacxinArray = Array.isArray(vacxinData) ? vacxinData : [vacxinData];
      setVacxinRecords(sortVacxinRecords(vacxinArray));

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

  // Safe number parsing - handles floats like 37208227.0
  const safeParseNumber = (value: any): number | null => {
    if (value === null || value === undefined || value === '') return null;

    const num = typeof value === 'string' ? parseFloat(value) : Number(value);

    if (isNaN(num) || !isFinite(num)) return null;

    return Math.floor(num); // Convert float to integer
  };

  // Safe number formatting with thousand separators
  const formatNumber = (value: any): string => {
    const num = safeParseNumber(value);
    if (num === null) return 'N/A';

    return num.toLocaleString('vi-VN');
  };

  // Parse Vietnamese date format "10:12 02/11/2022" or return as-is
  const formatDate = (dateStr: string): string => {
    if (!dateStr || typeof dateStr !== 'string') return 'N/A';

    // If already in format "HH:MM DD/MM/YYYY", return as-is
    if (/^\d{1,2}:\d{2}\s+\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
      return dateStr;
    }

    // Try to parse ISO format or other formats
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    } catch (e) {
      console.warn('[VaccinationHistory] Date parse error:', e);
    }

    return dateStr; // Return original string if can't parse
  };

  // Format reaction object to readable string
  const formatReaction = (reaction: any): string | null => {
    if (!reaction) return null;

    // If it's already a string, return it
    if (typeof reaction === 'string') {
      return reaction;
    }

    // If it's an object, format it properly
    if (typeof reaction === 'object') {
      const parts: string[] = [];

      if (reaction.loai_phan_ung) {
        parts.push(`Loại: ${reaction.loai_phan_ung}`);
      }

      if (reaction.ket_qua) {
        parts.push(`Kết quả: ${reaction.ket_qua}`);
      }

      if (reaction.ngay_phan_ung) {
        parts.push(`Ngày: ${formatDate(reaction.ngay_phan_ung)}`);
      }

      return parts.length > 0 ? parts.join(' • ') : null;
    }

    return null;
  };

  // Sort records by date (newest first)
  const sortByDate = (records: KhangNguyenRecord[]): KhangNguyenRecord[] => {
    return [...records].sort((a, b) => {
      // If one doesn't have date, put it at the end
      if (!a.ngay_tiem) return 1;
      if (!b.ngay_tiem) return -1;

      // Try to compare dates
      try {
        const dateA = parseDateString(a.ngay_tiem);
        const dateB = parseDateString(b.ngay_tiem);
        return dateB.getTime() - dateA.getTime(); // Newest first
      } catch (e) {
        return 0;
      }
    });
  };

  // Sort vacxin records by display order, then by dose order
  const sortVacxinRecords = (records: VacxinRecord[]): VacxinRecord[] => {
    return [...records].sort((a, b) => {
      // First sort by thu_tu_hien_thi if available
      const orderA = safeParseNumber(a.thu_tu_hien_thi) ?? 999;
      const orderB = safeParseNumber(b.thu_tu_hien_thi) ?? 999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Then sort by thu_tu_mui_tiem
      const doseA = safeParseNumber(a.thu_tu_mui_tiem) ?? 999;
      const doseB = safeParseNumber(b.thu_tu_mui_tiem) ?? 999;

      return doseA - doseB;
    });
  };

  // Parse date string "10:12 02/11/2022" to Date object
  const parseDateString = (dateStr: string): Date => {
    // Format: "HH:MM DD/MM/YYYY"
    const match = dateStr.match(/(\d{1,2}):(\d{2})\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/);

    if (match) {
      const [, hours, minutes, day, month, year] = match;
      return new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-indexed
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );
    }

    // Fallback to standard parsing
    return new Date(dateStr);
  };

  // Get vaccination status badge with proper null handling
  const getStatusBadge = (trangThai?: number) => {
    if (trangThai === undefined || trangThai === null) {
      return null; // Don't show badge if status is not available
    }

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
                      key={`khang-nguyen-${record.lich_su_tiem_id}-${record.khang_nguyen_id}-${index}`}
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
                                {record.ten_khang_nguyen || 'Chưa rõ tên'}
                              </CardTitle>
                              {record.ngay_tiem && (
                                <div className="flex items-center gap-2 mt-1.5 text-sm text-gray-600">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(record.ngay_tiem)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {getStatusBadge(record.trang_thai)}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="grid md:grid-cols-3 gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <IdCard className="w-3 h-3 flex-shrink-0" />
                            <span>ID: {formatNumber(record.lich_su_tiem_id)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-3 h-3 flex-shrink-0" />
                            <span>KN: {formatNumber(record.khang_nguyen_id)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span>ĐT: {formatNumber(record.doi_tuong_id)}</span>
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
                      key={`vacxin-${record.lich_su_tiem_id}-${record.thu_tu_mui_tiem}-${index}`}
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
                                {record.ten_vaccine || 'Chưa rõ tên vaccine'}
                              </CardTitle>
                              <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-600">
                                {record.thu_tu_mui_tiem !== undefined && record.thu_tu_mui_tiem !== null && (
                                  <Badge variant="outline" className="text-xs">
                                    Mũi {record.thu_tu_mui_tiem}
                                  </Badge>
                                )}
                                {record.ngay_tiem && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(record.ngay_tiem)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(record.trang_thai)}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-3">
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

                          {record.thu_tu_hien_thi !== undefined && record.thu_tu_hien_thi !== null && (
                            <div className="flex items-center gap-2.5 p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <Activity className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-blue-700">Thứ tự hiển thị</div>
                                <div className="text-sm font-semibold text-blue-900">
                                  #{record.thu_tu_hien_thi}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {formatReaction(record.phan_ung_sau_tiem) && (
                          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-lg">
                            <Activity className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-amber-900 mb-1">
                                Phản ứng sau tiêm
                              </div>
                              <p className="text-sm text-amber-800">
                                {formatReaction(record.phan_ung_sau_tiem)}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Technical IDs (collapsed, smaller) */}
                        <div className="pt-2 border-t border-gray-100">
                          <details className="text-xs text-gray-500">
                            <summary className="cursor-pointer hover:text-gray-700">
                              Thông tin kỹ thuật
                            </summary>
                            <div className="mt-2 space-y-1 pl-4">
                              <div>Lịch sử ID: {formatNumber(record.lich_su_tiem_id)}</div>
                              <div>Đối tượng ID: {formatNumber(record.doi_tuong_id)}</div>
                            </div>
                          </details>
                        </div>
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
