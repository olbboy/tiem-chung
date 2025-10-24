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
  ChevronUp,
  TrendingUp,
  Activity,
  Target,
  Award,
  Baby,
  Heart,
  Search
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const formatDateShort = (dateStr: string): string => {
    if (!dateStr || typeof dateStr !== 'string') return 'N/A';
    // Extract just the date part from "HH:MM DD/MM/YYYY" format
    const match = dateStr.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
    if (match) {
      return match[0];
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

  const groupKhangNguyenByAntigen = (records: KhangNguyenRecord[]) => {
    // Group by antigen and organize by dose number
    // Map<antigenKey, Map<doseNumber, record>>
    const grouped = new Map<string, Map<number, KhangNguyenRecord>>();
    
    records.forEach(record => {
      // Create unique key using khang_nguyen_id to handle antigens with same name
      const antigenKey = `${record.khang_nguyen_id}-${record.ten_khang_nguyen}`;
      
      if (!grouped.has(antigenKey)) {
        grouped.set(antigenKey, new Map<number, KhangNguyenRecord>());
      }
      
      const doseMap = grouped.get(antigenKey)!;
      const doseNumber = safeParseNumber(record.thu_tu_mui_tiem) ?? 1;
      
      // Keep the most recent record for each dose (in case of duplicates)
      if (!doseMap.has(doseNumber) || 
          (record.lich_su_tiem_id && doseMap.get(doseNumber)?.lich_su_tiem_id)) {
        doseMap.set(doseNumber, record);
      }
    });
    
    // Sort by thu_tu_hien_thi (display order)
    const sortedGrouped = new Map(
      Array.from(grouped.entries()).sort((a, b) => {
        const recordA = Array.from(a[1].values())[0];
        const recordB = Array.from(b[1].values())[0];
        const orderA = safeParseNumber(recordA.thu_tu_hien_thi) ?? 999;
        const orderB = safeParseNumber(recordB.thu_tu_hien_thi) ?? 999;
        return orderA - orderB;
      })
    );
    
    return sortedGrouped;
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

  const calculateStatistics = () => {
    const totalDoses = khangNguyenRecords.length;
    const completedDoses = khangNguyenRecords.filter(r => r.trang_thai === 2).length;
    const pendingDoses = khangNguyenRecords.filter(r => r.trang_thai === 1).length;
    const uniqueAntigens = groupKhangNguyenByAntigen(khangNguyenRecords).size;
    const completionRate = totalDoses > 0 ? Math.round((completedDoses / totalDoses) * 100) : 0;

    return { totalDoses, completedDoses, pendingDoses, uniqueAntigens, completionRate };
  };

  const groupHistoryByYear = (records: VacxinRecord[]) => {
    const grouped = new Map<number, VacxinRecord[]>();
    
    records.forEach(record => {
      if (!record.ngay_tiem) return;
      
      const match = record.ngay_tiem.match(/\/(\d{4})/);
      if (!match) return;
      
      const year = parseInt(match[1]);
      if (!grouped.has(year)) {
        grouped.set(year, []);
      }
      grouped.get(year)!.push(record);
    });
    
    return new Map([...grouped.entries()].sort((a, b) => b[0] - a[0]));
  };

  const getCompletionPercentage = (doseMap: Map<number, KhangNguyenRecord>) => {
    const maxDose = Math.max(...Array.from(doseMap.keys()));
    const completedDoses = Array.from(doseMap.values()).filter(r => r.trang_thai === 2).length;
    return Math.round((completedDoses / maxDose) * 100);
  };

  const filteredVacxinRecords = vacxinRecords.filter(record => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      record.ten_vacxin?.toLowerCase().includes(query) ||
      record.khang_nguyen?.toLowerCase().includes(query) ||
      record.co_so_tiem_chung?.toLowerCase().includes(query)
    );
  });

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
              <div className="space-y-6">
                {khangNguyenRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Chưa có lịch sử kháng nguyên</p>
                  </div>
                ) : (
                  <>
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Total Doses */}
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 shadow-lg transition-all hover:shadow-xl hover:scale-105">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-100">Tổng mũi tiêm</p>
                            <p className="mt-2 text-3xl font-bold text-white">{calculateStatistics().totalDoses}</p>
                          </div>
                          <div className="rounded-lg bg-white/20 p-2.5">
                            <Syringe className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                          <Syringe className="h-24 w-24 text-white" />
                        </div>
                      </div>

                      {/* Completed */}
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 shadow-lg transition-all hover:shadow-xl hover:scale-105">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-emerald-100">Đã hoàn thành</p>
                            <p className="mt-2 text-3xl font-bold text-white">{calculateStatistics().completedDoses}</p>
                          </div>
                          <div className="rounded-lg bg-white/20 p-2.5">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                          <Award className="h-24 w-24 text-white" />
                        </div>
                      </div>

                      {/* Pending */}
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-5 shadow-lg transition-all hover:shadow-xl hover:scale-105">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-amber-100">Chưa tiêm</p>
                            <p className="mt-2 text-3xl font-bold text-white">{calculateStatistics().pendingDoses}</p>
                          </div>
                          <div className="rounded-lg bg-white/20 p-2.5">
                            <Clock className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                          <Target className="h-24 w-24 text-white" />
                        </div>
                      </div>

                      {/* Completion Rate */}
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-5 shadow-lg transition-all hover:shadow-xl hover:scale-105">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-100">Tỷ lệ hoàn thành</p>
                            <p className="mt-2 text-3xl font-bold text-white">{calculateStatistics().completionRate}%</p>
                          </div>
                          <div className="rounded-lg bg-white/20 p-2.5">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                          <Activity className="h-24 w-24 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Vaccination Table */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-emerald-600" />
                            Lịch sử tiêm theo kháng nguyên
                          </h3>
                          <Badge variant="outline" className="text-sm border-emerald-200 bg-emerald-50 text-emerald-700">
                            {groupKhangNguyenByAntigen(khangNguyenRecords).size} loại kháng nguyên
                          </Badge>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50/80 border-b-2 border-gray-200">
                              <th className="text-left p-4 font-semibold text-sm text-gray-700 sticky left-0 z-10 bg-gray-50/80 backdrop-blur-sm min-w-[180px]">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-gray-500" />
                                  Kháng nguyên
                                </div>
                              </th>
                              {[1, 2, 3, 4, 5].map(doseNum => (
                                <th key={doseNum} className="text-center p-4 font-semibold text-sm text-gray-700 min-w-[150px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                                      {doseNum}
                                    </div>
                                    <span className="text-xs text-gray-500">Mũi {doseNum}</span>
                                  </div>
                                </th>
                              ))}
                              <th className="text-center p-4 font-semibold text-sm text-gray-700 min-w-[120px]">
                                Tiến độ
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {Array.from(groupKhangNguyenByAntigen(khangNguyenRecords)).map(([antigenKey, doseMap]) => {
                              const firstRecord = Array.from(doseMap.values())[0];
                              const antigenName = firstRecord.ten_khang_nguyen;
                              const completion = getCompletionPercentage(doseMap);
                              
                              return (
                                <tr key={antigenKey} className="hover:bg-blue-50/30 transition-colors group">
                                  <td className="p-4 font-medium text-gray-900 text-sm sticky left-0 bg-white group-hover:bg-blue-50/30 transition-colors">
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                                      {antigenName}
                                    </div>
                                  </td>
                                  {[1, 2, 3, 4, 5].map(doseNum => {
                                    const record = doseMap.get(doseNum);
                                    
                                    if (!record) {
                                      return (
                                        <td key={doseNum} className="p-4 text-center">
                                          <div className="rounded-lg p-3 bg-gray-50/50 border border-dashed border-gray-200">
                                            <span className="text-xs text-gray-400">—</span>
                                          </div>
                                        </td>
                                      );
                                    }
                                    
                                    return (
                                      <td key={doseNum} className="p-4">
                                        <div className={`rounded-lg p-3 text-center transition-all shadow-sm hover:shadow-md ${
                                          record.trang_thai === 2 
                                            ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300' 
                                            : 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200'
                                        }`}>
                                          {record.ngay_tiem && (
                                            <div className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-center gap-1">
                                              <Calendar className="h-3 w-3" />
                                              {formatDateShort(record.ngay_tiem)}
                                            </div>
                                          )}
                                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                            record.trang_thai === 2 
                                              ? 'bg-emerald-600 text-white' 
                                              : 'bg-gray-400 text-white'
                                          }`}>
                                            {record.trang_thai === 2 ? (
                                              <><CheckCircle className="h-3 w-3" /> Hoàn thành</>
                                            ) : (
                                              <><Clock className="h-3 w-3" /> Chưa tiêm</>
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                    );
                                  })}
                                  <td className="p-4">
                                    <div className="flex flex-col items-center gap-2">
                                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all duration-500 ${
                                            completion === 100 
                                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                                              : 'bg-gradient-to-r from-blue-500 to-blue-600'
                                          }`}
                                          style={{ width: `${completion}%` }}
                                        ></div>
                                      </div>
                                      <span className={`text-xs font-bold ${
                                        completion === 100 ? 'text-emerald-600' : 'text-blue-600'
                                      }`}>
                                        {completion}%
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* Tab 3: History */}
            <TabsContent active={activeTab === 'history'}>
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm vaccine, kháng nguyên hoặc cơ sở..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm px-3 py-1.5 border-blue-200 bg-blue-50 text-blue-700">
                      <Syringe className="h-3.5 w-3.5 mr-1.5" />
                      {filteredVacxinRecords.length} kết quả
                    </Badge>
                  </div>
                </div>

                {vacxinRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <Syringe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Chưa có lịch sử vaccine</p>
                  </div>
                ) : filteredVacxinRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Không tìm thấy kết quả phù hợp</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Array.from(groupHistoryByYear(filteredVacxinRecords)).map(([year, yearRecords]) => (
                      <div key={year} className="relative">
                        {/* Year Header */}
                        <div className="sticky top-20 z-20 mb-6">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
                            <Calendar className="h-4 w-4" />
                            <span className="font-bold text-sm">Năm {year}</span>
                            <Badge variant="outline" className="ml-1 bg-white/20 border-white/30 text-white text-xs">
                              {yearRecords.length} mũi
                            </Badge>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative pl-8 space-y-6">
                          {/* Timeline Line */}
                          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-emerald-300 to-emerald-200"></div>

                          {yearRecords.map((record, index) => (
                            <div
                              key={`vacxin-${record.lich_su_tiem_id}-${record.thu_tu_mui_tiem}-${index}`}
                              onClick={() => handleVaccineClick(record)}
                              className="relative group cursor-pointer"
                            >
                              {/* Timeline Dot */}
                              <div className="absolute -left-[23px] top-6 z-10">
                                <div className="relative">
                                  <div className="h-4 w-4 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 border-4 border-white shadow-lg group-hover:scale-125 transition-transform"></div>
                                  <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20"></div>
                                </div>
                              </div>

                              {/* Card */}
                              <div className="ml-2 rounded-xl border-2 border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden group-hover:scale-[1.02]">
                                <div className="p-5">
                                  <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all">
                                        <Syringe className="h-6 w-6 text-emerald-700" />
                                      </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      {/* Header */}
                                      <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">
                                            {record.ten_vacxin || 'Chưa rõ tên vaccine'}
                                          </h3>
                                          <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                            <Shield className="h-3.5 w-3.5 text-gray-400" />
                                            {record.khang_nguyen}
                                          </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                          {getStatusBadge(record.trang_thai)}
                                          {record.thu_tu_mui_tiem && (
                                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                              Mũi {record.thu_tu_mui_tiem}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>

                                      {/* Details Grid */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                        {record.ngay_tiem && (
                                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                                            <Clock className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                            <div className="flex-1">
                                              <div className="text-xs text-gray-500">Ngày tiêm</div>
                                              <div className="text-sm font-semibold text-gray-900">{formatDate(record.ngay_tiem)}</div>
                                            </div>
                                          </div>
                                        )}
                                        {record.co_so_tiem_chung && (
                                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                                            <Building2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                              <div className="text-xs text-gray-500">Cơ sở</div>
                                              <div className="text-sm font-semibold text-gray-900 truncate">{record.co_so_tiem_chung}</div>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Footer */}
                                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                          <FileText className="h-3 w-3" />
                                          Nhấn để xem chi tiết
                                        </div>
                                        <div className="text-emerald-600 group-hover:translate-x-1 transition-transform">
                                          <ChevronDown className="h-4 w-4 -rotate-90" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 4: Phac Do (Vaccination Schedule) */}
            <TabsContent active={activeTab === 'schedule'}>
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Clipboard className="h-6 w-6 text-emerald-600" />
                      Phác đồ tiêm chủng
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Lịch trình tiêm chủng theo độ tuổi</p>
                  </div>
                  <Badge variant="outline" className="text-sm px-3 py-1.5 border-purple-200 bg-purple-50 text-purple-700">
                    <Shield className="h-3.5 w-3.5 mr-1.5" />
                    {groupPhacDoByAntibody(phacDoRecords).size} phác đồ
                  </Badge>
                </div>

                {phacDoRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <Clipboard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Chưa có phác đồ tiêm chủng</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.from(groupPhacDoByAntibody(phacDoRecords)).map(([antibodyName, records]) => {
                      const isExpanded = expandedSchedules.has(antibodyName);
                      const totalDoses = records[0]?.tong_so_mui || records.length;
                      
                      // Calculate completion progress by checking actual vaccination history
                      const completedDoses = khangNguyenRecords.filter(
                        kr => kr.ten_khang_nguyen === antibodyName && kr.trang_thai === 2
                      ).length;
                      const completionPercentage = totalDoses > 0 ? Math.round((completedDoses / totalDoses) * 100) : 0;

                      return (
                        <div
                          key={antibodyName}
                          className="rounded-xl border-2 border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all"
                        >
                          {/* Header - Clickable */}
                          <div
                            onClick={() => toggleScheduleExpanded(antibodyName)}
                            className="p-5 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                {/* Icon */}
                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                                  <Shield className="w-6 h-6 text-blue-700" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                                    {antibodyName}
                                  </h3>
                                  
                                  {/* Progress Bar */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-gray-600 font-medium">
                                        {completedDoses} / {totalDoses} mũi hoàn thành
                                      </span>
                                      <span className={`font-bold ${
                                        completionPercentage === 100 ? 'text-emerald-600' : 'text-blue-600'
                                      }`}>
                                        {completionPercentage}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all duration-700 ${
                                          completionPercentage === 100
                                            ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700'
                                            : 'bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600'
                                        }`}
                                        style={{ width: `${completionPercentage}%` }}
                                      ></div>
                                    </div>
                                  </div>

                                  {/* Stats */}
                                  <div className="flex items-center gap-3 mt-3">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                      <CheckCircle className="h-3 w-3" />
                                      {completedDoses} hoàn thành
                                    </div>
                                    {(totalDoses - completedDoses) > 0 && (
                                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                                        <Clock className="h-3 w-3" />
                                        {totalDoses - completedDoses} còn lại
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Toggle Icon */}
                              <div className="flex-shrink-0 pt-2">
                                <div className={`p-2 rounded-lg transition-all ${
                                  isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                                }`}>
                                  {isExpanded ? (
                                    <ChevronUp className="w-5 h-5" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="border-t-2 border-gray-200">
                              {/* Description */}
                              {records[0]?.mo_ta && (
                                <div className="p-5 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-200">
                                  <div className="flex items-center gap-2 mb-3">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <div className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                                      Thông tin bệnh
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed pl-6">
                                    {records[0].mo_ta}
                                  </p>
                                </div>
                              )}

                              {/* Dose Schedule */}
                              <div className="p-5">
                                <div className="flex items-center gap-2 mb-4">
                                  <Calendar className="h-4 w-4 text-purple-600" />
                                  <div className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                                    Lịch trình tiêm ({records.length} liều)
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  {records.map((dose, index) => {
                                    // Check if this dose is completed
                                    const isCompleted = khangNguyenRecords.some(
                                      kr => kr.ten_khang_nguyen === antibodyName && 
                                            kr.thu_tu_mui_tiem === dose.thu_tu &&
                                            kr.trang_thai === 2
                                    );

                                    const getAgeIcon = (donVi: number) => {
                                      if (donVi === 3) return Baby; // months
                                      if (donVi === 2) return User; // years
                                      return Heart; // days
                                    };

                                    const AgeIcon = getAgeIcon(dose.don_vi_tuoi_tiem);

                                    return (
                                      <div
                                        key={`${dose.phac_do_id}-${dose.thu_tu}`}
                                        className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                                          isCompleted
                                            ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-300 shadow-sm'
                                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                                        }`}
                                      >
                                        {/* Completion Ribbon */}
                                        {isCompleted && (
                                          <div className="absolute top-0 right-0">
                                            <div className="relative">
                                              <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-emerald-600 border-r-transparent"></div>
                                              <CheckCircle className="absolute top-1 right-1 h-4 w-4 text-white z-10" />
                                            </div>
                                          </div>
                                        )}

                                        <div className="p-4 flex items-center gap-4">
                                          {/* Dose Number */}
                                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold flex-shrink-0 shadow-sm ${
                                            isCompleted
                                              ? 'bg-emerald-600 text-white'
                                              : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                                          }`}>
                                            {dose.thu_tu}
                                          </div>

                                          {/* Info */}
                                          <div className="flex-1">
                                            <div className="text-base font-bold text-gray-900 mb-1">
                                              Mũi {dose.thu_tu}
                                              {dose.tong_so_mui && <span className="text-gray-400 font-normal"> / {dose.tong_so_mui}</span>}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                              <AgeIcon className="h-4 w-4 text-gray-400" />
                                              <span className="font-medium">
                                                Độ tuổi: {formatAgeUnit(dose.tuoi_tiem, dose.don_vi_tuoi_tiem)}
                                              </span>
                                            </div>
                                          </div>

                                          {/* Status Badge */}
                                          <div>
                                            {isCompleted ? (
                                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                Đã tiêm
                                              </div>
                                            ) : (
                                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold shadow-sm">
                                                <Target className="h-3.5 w-3.5" />
                                                {formatAgeUnit(dose.tuoi_tiem, dose.don_vi_tuoi_tiem)}
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Connecting Line for next dose */}
                                        {index < records.length - 1 && (
                                          <div className="flex justify-center py-1">
                                            <div className="w-0.5 h-4 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
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
