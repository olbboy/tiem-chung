import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import type { ThanhVienDetail, KhangNguyenRecord, VacxinRecord, PhacDoRecord } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../components/ui/dialog';
import {
  User,
  Syringe,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Building2,
  Shield,
  XCircle,
  Clock,
  FileText,
  Phone,
  MapPin,
  Home,
  Users,
  Calendar,
  IdCard,
  Clipboard,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const VaccinationHistory = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [memberDetail, setMemberDetail] = useState<ThanhVienDetail | null>(null);
  const [khangNguyenRecords, setKhangNguyenRecords] = useState<KhangNguyenRecord[]>([]);
  const [vacxinRecords, setVacxinRecords] = useState<VacxinRecord[]>([]);
  const [phacDoRecords, setPhacDoRecords] = useState<PhacDoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('personal-info');
  const [selectedVaccine, setSelectedVaccine] = useState<VacxinRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedSchedules, setExpandedSchedules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (memberId) {
      const doiTuongId = safeParseNumber(memberId);
      const maThanhVien = location.state?.ma_thanh_vien;

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

      const memberIdForDetail = maThanhVien || doiTuongId;

      const [detailResponse, khangNguyenResponse, vacxinResponse, phacDoResponse] = await Promise.all([
        apiService.getThanhVienDetail(memberIdForDetail),
        apiService.getKhangNguyenHistory(doiTuongId),
        apiService.getVacxinHistory(doiTuongId),
        apiService.getPhacDoTiemChung(doiTuongId)
      ]);

      setMemberDetail(detailResponse);

      const khangNguyenData = khangNguyenResponse.data || khangNguyenResponse || [];
      const khangNguyenArray = Array.isArray(khangNguyenData) ? khangNguyenData : [khangNguyenData];
      setKhangNguyenRecords(sortByDate(khangNguyenArray));

      const vacxinData = vacxinResponse.data || vacxinResponse || [];
      const vacxinArray = Array.isArray(vacxinData) ? vacxinData : [vacxinData];
      setVacxinRecords(sortVacxinRecords(vacxinArray));

      const phacDoData = phacDoResponse.data || [];
      setPhacDoRecords(sortPhacDoRecords(phacDoData));
    } catch (err: any) {
      console.error('[VaccinationHistory] Error:', err);
      setError(err.message || 'Không thể tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate('/personal-info');
  const handleVaccineClick = (record: VacxinRecord) => {
    setSelectedVaccine(record);
    setIsDialogOpen(true);
  };

  const safeParseNumber = (value: any): number | null => {
    if (value === null || value === undefined || value === '') return null;
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (isNaN(num) || !isFinite(num)) return null;
    return Math.floor(num);
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr || typeof dateStr !== 'string') return 'N/A';
    if (/^\d{1,2}:\d{2}\s+\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
      return dateStr;
    }
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
    return dateStr;
  };

  const sortByDate = (records: KhangNguyenRecord[]): KhangNguyenRecord[] => {
    return [...records].sort((a, b) => {
      if (!a.ngay_tiem) return 1;
      if (!b.ngay_tiem) return -1;
      try {
        const dateA = parseDateString(a.ngay_tiem);
        const dateB = parseDateString(b.ngay_tiem);
        return dateB.getTime() - dateA.getTime();
      } catch (e) {
        return 0;
      }
    });
  };

  const sortVacxinRecords = (records: VacxinRecord[]): VacxinRecord[] => {
    return [...records].sort((a, b) => {
      const orderA = safeParseNumber(a.thu_tu_hien_thi) ?? 999;
      const orderB = safeParseNumber(b.thu_tu_hien_thi) ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      const doseA = safeParseNumber(a.thu_tu_mui_tiem) ?? 999;
      const doseB = safeParseNumber(b.thu_tu_mui_tiem) ?? 999;
      return doseA - doseB;
    });
  };

  const sortPhacDoRecords = (records: PhacDoRecord[]): PhacDoRecord[] => {
    return [...records].sort((a, b) => {
      // First sort by khang_nguyen_id
      if (a.khang_nguyen_id !== b.khang_nguyen_id) {
        return a.khang_nguyen_id - b.khang_nguyen_id;
      }
      // Then by thu_tu within same antibody
      return a.thu_tu - b.thu_tu;
    });
  };

  const formatAgeUnit = (age: number, unit: number): string => {
    // unit: 3 = months, 2 = years, 1 = days
    if (unit === 3) {
      return age === 0 ? 'Khi sinh' : `${age} tháng`;
    } else if (unit === 2) {
      return `${age} tuổi`;
    } else if (unit === 1) {
      return `${age} ngày`;
    }
    return `${age}`;
  };

  const groupPhacDoByAntibody = (records: PhacDoRecord[]) => {
    const grouped = new Map<string, PhacDoRecord[]>();
    records.forEach(record => {
      const key = record.ten_khang_nguyen;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(record);
    });
    return grouped;
  };

  const toggleScheduleExpanded = (antibodyName: string) => {
    setExpandedSchedules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(antibodyName)) {
        newSet.delete(antibodyName);
      } else {
        newSet.add(antibodyName);
      }
      return newSet;
    });
  };

  const parseDateString = (dateStr: string): Date => {
    const match = dateStr.match(/(\d{1,2}):(\d{2})\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (match) {
      const [, hours, minutes, day, month, year] = match;
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );
    }
    return new Date(dateStr);
  };

  const getStatusBadge = (trangThai?: number) => {
    if (trangThai === undefined || trangThai === null) return null;
    if (trangThai === 2) {
      return (
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã tiêm
        </Badge>
      );
    } else if (trangThai === 1) {
      return (
        <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-600">
          <XCircle className="w-3 h-3 mr-1" />
          Chưa tiêm
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
        <Clock className="w-3 h-3 mr-1" />
        Không rõ
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Lỗi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Không thể tải dữ liệu</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={handleBack} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="mb-3 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100">
              <Syringe className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {memberDetail?.ho_ten || 'Hồ Sơ Tiêm Chủng'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Thông tin cá nhân và lịch sử tiêm chủng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="border-b">
            <Tabs>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  active={activeTab === 'personal-info'}
                  onClick={() => setActiveTab('personal-info')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Cá nhân
                </TabsTrigger>
                <TabsTrigger
                  active={activeTab === 'overview'}
                  onClick={() => setActiveTab('overview')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger
                  active={activeTab === 'history'}
                  onClick={() => setActiveTab('history')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Lịch sử
                </TabsTrigger>
                <TabsTrigger
                  active={activeTab === 'schedule'}
                  onClick={() => setActiveTab('schedule')}
                >
                  <Clipboard className="w-4 h-4 mr-2" />
                  Phác đồ
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-6">
            {/* Tab 1: Personal Info */}
            <TabsContent active={activeTab === 'personal-info'}>
              {memberDetail ? (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-600" />
                      Thông tin cơ bản
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <IdCard className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                          <div className="text-xs text-gray-500">Họ và tên</div>
                          <div className="text-sm font-medium text-gray-900">{memberDetail.ho_ten || 'N/A'}</div>
                        </div>
                      </div>

                      {memberDetail.ma_doi_tuong && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                          <IdCard className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 space-y-1">
                            <div className="text-xs text-gray-500">Mã đối tượng</div>
                            <div className="text-sm font-medium text-gray-900">{memberDetail.ma_doi_tuong}</div>
                          </div>
                        </div>
                      )}

                      {memberDetail.ngay_sinh && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                          <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 space-y-1">
                            <div className="text-xs text-gray-500">Ngày sinh</div>
                            <div className="text-sm font-medium text-gray-900">{memberDetail.ngay_sinh}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                          <div className="text-xs text-gray-500">Giới tính</div>
                          <div className="text-sm font-medium text-gray-900">
                            {memberDetail.gioi_tinh === 0 ? 'Nam' : memberDetail.gioi_tinh === 1 ? 'Nữ' : 'Khác'}
                          </div>
                        </div>
                      </div>

                      {memberDetail.ten_dan_toc && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                          <Users className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 space-y-1">
                            <div className="text-xs text-gray-500">Dân tộc</div>
                            <div className="text-sm font-medium text-gray-900">{memberDetail.ten_dan_toc}</div>
                          </div>
                        </div>
                      )}

                      {memberDetail.dien_thoai && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                          <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 space-y-1">
                            <div className="text-xs text-gray-500">Số điện thoại</div>
                            <div className="text-sm font-medium text-gray-900">{memberDetail.dien_thoai}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Healthcare Facility */}
                  {memberDetail.ten_co_so && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-emerald-600" />
                        Cơ sở y tế
                      </h3>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <Building2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{memberDetail.ten_co_so}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Permanent Address */}
                  {(memberDetail.ho_khau_tinh || memberDetail.ho_khau_huyen || memberDetail.ho_khau_xa || memberDetail.ho_khau_dia_chi) && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Home className="h-4 w-4 text-emerald-600" />
                        Địa chỉ hộ khẩu
                      </h3>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {[
                              memberDetail.ho_khau_dia_chi,
                              memberDetail.ho_khau_thon_ap,
                              memberDetail.ho_khau_xa,
                              memberDetail.ho_khau_huyen,
                              memberDetail.ho_khau_tinh
                            ].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Temporary Address */}
                  {(memberDetail.tam_tru_tinh || memberDetail.tam_tru_huyen || memberDetail.tam_tru_xa || memberDetail.tam_tru_dia_chi) && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        Địa chỉ tạm trú
                      </h3>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {[
                              memberDetail.tam_tru_dia_chi,
                              memberDetail.tam_tru_thon_ap,
                              memberDetail.tam_tru_xa,
                              memberDetail.tam_tru_huyen,
                              memberDetail.tam_tru_tinh
                            ].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Caregivers */}
                  {memberDetail.ds_nguoi_cham_soc && memberDetail.ds_nguoi_cham_soc.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-600" />
                        Người chăm sóc
                      </h3>
                      <div className="space-y-2">
                        {memberDetail.ds_nguoi_cham_soc.map((caregiver, index) => (
                          <div key={`caregiver-${index}-${caregiver.so_dien_thoai}`} className="p-3 rounded-lg bg-gray-50 space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">{caregiver.ho_ten}</span>
                              {caregiver.mac_dinh === 1 && (
                                <Badge variant="outline" className="text-xs border-emerald-200 bg-emerald-50 text-emerald-700">
                                  Mặc định
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pl-6">
                              {caregiver.nam_sinh && (
                                <div>Năm sinh: {caregiver.nam_sinh}</div>
                              )}
                              {caregiver.so_dien_thoai && (
                                <div>SĐT: {caregiver.so_dien_thoai}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Không có thông tin
                </div>
              )}
            </TabsContent>

            {/* Tab 2: Overview */}
            <TabsContent active={activeTab === 'overview'}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Tổng quan kháng nguyên</h2>
                  <Badge variant="outline" className="text-sm">
                    {khangNguyenRecords.length} mũi
                  </Badge>
                </div>
                {khangNguyenRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Chưa có lịch sử kháng nguyên</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {khangNguyenRecords.map((record, index) => (
                      <div
                        key={`khang-nguyen-${record.lich_su_tiem_id}-${record.khang_nguyen_id}-${index}`}
                        className="flex items-start justify-between p-4 rounded-lg border bg-white hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <Shield className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">
                              {record.ten_khang_nguyen || 'Chưa rõ'}
                            </div>
                            {record.ngay_tiem && (
                              <div className="text-sm text-gray-500 mt-1">
                                {formatDate(record.ngay_tiem)}
                              </div>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(record.trang_thai)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 3: History */}
            <TabsContent active={activeTab === 'history'}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Lịch sử tiêm chi tiết</h2>
                  <Badge variant="outline" className="text-sm">
                    {vacxinRecords.length} mũi
                  </Badge>
                </div>
                {vacxinRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <Syringe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Chưa có lịch sử vaccine</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vacxinRecords.map((record, index) => (
                      <div
                        key={`vacxin-${record.lich_su_tiem_id}-${record.thu_tu_mui_tiem}-${index}`}
                        onClick={() => handleVaccineClick(record)}
                        className="p-4 rounded-lg border bg-white hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                            <Syringe className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                                {record.ten_vacxin || 'Chưa rõ tên vaccine'}
                              </h3>
                              {getStatusBadge(record.trang_thai)}
                            </div>
                            {record.co_so_tiem_chung && (
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>tại {record.co_so_tiem_chung}</span>
                              </div>
                            )}
                            {record.ngay_tiem && (
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>lúc {formatDate(record.ngay_tiem)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 4: Phac Do (Vaccination Schedule) */}
            <TabsContent active={activeTab === 'schedule'}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Phác đồ tiêm chủng</h2>
                  <Badge variant="outline" className="text-sm">
                    {groupPhacDoByAntibody(phacDoRecords).size} loại
                  </Badge>
                </div>
                {phacDoRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <Clipboard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Chưa có phác đồ tiêm chủng</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Array.from(groupPhacDoByAntibody(phacDoRecords)).map(([antibodyName, records]) => {
                      const isExpanded = expandedSchedules.has(antibodyName);
                      const totalDoses = records[0]?.tong_so_mui;

                      return (
                        <div
                          key={antibodyName}
                          className="rounded-lg border bg-white overflow-hidden"
                        >
                          {/* Header - Clickable */}
                          <div
                            onClick={() => toggleScheduleExpanded(antibodyName)}
                            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="p-2 rounded-lg bg-blue-100">
                                  <Shield className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900 mb-1">{antibodyName}</h3>
                                  {totalDoses && (
                                    <div className="text-sm text-gray-600">
                                      {totalDoses} mũi tiêm
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {records.length} liều
                                </Badge>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="border-t bg-gray-50">
                              {/* Description */}
                              {records[0]?.mo_ta && (
                                <div className="p-4 border-b bg-blue-50/50">
                                  <div className="text-xs font-medium text-blue-600 mb-2 uppercase tracking-wide">
                                    Thông tin bệnh
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {records[0].mo_ta}
                                  </p>
                                </div>
                              )}

                              {/* Dose Schedule */}
                              <div className="p-4 space-y-2">
                                <div className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                                  Lịch trình tiêm
                                </div>
                                {records.map((dose) => (
                                  <div
                                    key={`${dose.phac_do_id}-${dose.thu_tu}`}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-white border"
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold flex-shrink-0">
                                      {dose.thu_tu}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900">
                                        Mũi {dose.thu_tu}
                                        {dose.tong_so_mui && ` / ${dose.tong_so_mui}`}
                                      </div>
                                      <div className="text-xs text-gray-600 mt-0.5">
                                        Độ tuổi: {formatAgeUnit(dose.tuoi_tiem, dose.don_vi_tuoi_tiem)}
                                      </div>
                                    </div>
                                    <div>
                                      <Badge variant="outline" className="text-xs border-emerald-200 bg-emerald-50 text-emerald-700">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {formatAgeUnit(dose.tuoi_tiem, dose.don_vi_tuoi_tiem)}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedVaccine && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                  <Syringe className="h-5 w-5 text-emerald-600" />
                </div>
                <span>Chi tiết mũi tiêm</span>
              </DialogTitle>
              <DialogClose onClick={() => setIsDialogOpen(false)} />
            </DialogHeader>

            <div className="px-6 py-6 space-y-6">
              {/* Main Vaccine Info */}
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Vắc xin</div>
                <h3 className="text-base font-semibold text-gray-900">{selectedVaccine.ten_vacxin}</h3>
                <p className="text-sm text-gray-600">Kháng nguyên: {selectedVaccine.khang_nguyen}</p>
              </div>

              {/* Status & Dose */}
              <div className="flex items-center gap-3 pt-4 border-t">
                {selectedVaccine.trang_thai !== undefined && getStatusBadge(selectedVaccine.trang_thai)}
                {selectedVaccine.thu_tu_mui_tiem && (
                  <Badge variant="outline" className="border-gray-300 text-gray-700">
                    Mũi {selectedVaccine.thu_tu_mui_tiem}
                  </Badge>
                )}
              </div>

              {/* Vaccination Details */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-semibold text-gray-900">Thông tin tiêm chủng</h4>
                <div className="space-y-3">
                  {selectedVaccine.ngay_tiem && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="text-xs text-gray-500">Ngày tiêm</div>
                        <div className="text-sm font-medium text-gray-900">{formatDate(selectedVaccine.ngay_tiem)}</div>
                      </div>
                    </div>
                  )}

                  {selectedVaccine.co_so_tiem_chung && (
                    <div className="flex items-start gap-3">
                      <Building2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="text-xs text-gray-500">Cơ sở tiêm chủng</div>
                        <div className="text-sm font-medium text-gray-900">{selectedVaccine.co_so_tiem_chung}</div>
                      </div>
                    </div>
                  )}

                  {selectedVaccine.lo_vacxin && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="text-xs text-gray-500">Số lô</div>
                        <div className="text-sm font-mono font-medium text-gray-900">{selectedVaccine.lo_vacxin}</div>
                      </div>
                    </div>
                  )}

                  {selectedVaccine.nguoi_tiem && (
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="text-xs text-gray-500">Người tiêm</div>
                        <div className="text-sm font-medium text-gray-900">{selectedVaccine.nguoi_tiem}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reaction Info */}
              {selectedVaccine.phan_ung_sau_tiem && typeof selectedVaccine.phan_ung_sau_tiem === 'object' && (
                <>
                  {(selectedVaccine.phan_ung_sau_tiem.loai_phan_ung ||
                    selectedVaccine.phan_ung_sau_tiem.ngay_phan_ung ||
                    selectedVaccine.phan_ung_sau_tiem.ket_qua) && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        Phản ứng sau tiêm
                      </h4>
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                        {selectedVaccine.phan_ung_sau_tiem.loai_phan_ung && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Loại</span>
                            <span className="font-medium text-gray-900">{selectedVaccine.phan_ung_sau_tiem.loai_phan_ung}</span>
                          </div>
                        )}
                        {selectedVaccine.phan_ung_sau_tiem.ngay_phan_ung && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Thời gian</span>
                            <span className="font-medium text-gray-900">{formatDate(selectedVaccine.phan_ung_sau_tiem.ngay_phan_ung)}</span>
                          </div>
                        )}
                        {selectedVaccine.phan_ung_sau_tiem.ket_qua && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Kết quả</span>
                            <span className="font-medium text-gray-900">{selectedVaccine.phan_ung_sau_tiem.ket_qua}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2 px-6 pb-6">
              <Button
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
                variant="outline"
              >
                Đóng
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
