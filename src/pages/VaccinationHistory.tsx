import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { ThanhVienDetail, VaccinationRecord } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
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
  FileText,
  Pill,
  Building,
  User,
  Activity
} from 'lucide-react';

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
      console.log('[VaccinationHistory] Fetching data for member ID:', id);

      // Fetch member details and vaccination history in parallel
      const [detailResponse, historyResponse] = await Promise.all([
        apiService.getThanhVienDetail(id),
        apiService.getVaccinationHistory(id)
      ]);

      console.log('[VaccinationHistory] Member detail response:', detailResponse);
      console.log('[VaccinationHistory] Vaccination history response:', historyResponse);

      setMemberDetail(detailResponse);

      // Extract vaccination records flexibly
      const recordsData = historyResponse.data || historyResponse || [];
      console.log('[VaccinationHistory] Extracted records data:', recordsData);

      setVaccinationRecords(Array.isArray(recordsData) ? recordsData : [recordsData]);
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

  // Helper function to render fields dynamically
  const renderField = (label: string, value: any, icon?: any) => {
    if (!value || value === '' || value === null || value === undefined) return null;

    const IconComponent = icon;
    return (
      <div className="flex items-start gap-2 text-sm">
        {IconComponent && <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <span className="text-muted-foreground font-medium">{label}:</span>
          <span className="ml-2 text-foreground break-words">{value}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="bg-primary text-primary-foreground p-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-6 w-24 mb-3" />
            <Skeleton className="h-8 w-64" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
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
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Lỗi
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
            <Button onClick={handleBack} className="w-full flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={handleBack}
            variant="secondary"
            size="sm"
            className="mb-3 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div className="flex items-center gap-3">
            <Syringe className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Lịch Sử Tiêm Chủng</h1>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Hồ sơ tiêm chủng chi tiết và thông tin thành viên
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Member Information Card */}
        {memberDetail && (
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2">
                <UserCircle className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl">Thông tin thành viên</CardTitle>
              </div>
              <CardDescription className="text-base mt-2">
                Hồ sơ cá nhân và thông tin liên hệ
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {/* Display all known fields */}
                {renderField('Họ và tên', memberDetail.ho_va_ten, UserCircle)}
                {memberDetail.ngay_sinh && renderField(
                  'Ngày sinh',
                  new Date(memberDetail.ngay_sinh).toLocaleDateString('vi-VN'),
                  Calendar
                )}
                {renderField('Giới tính', memberDetail.gioi_tinh, User)}
                {renderField('Mã thành viên', memberDetail.ma_thanh_vien, IdCard)}
                {renderField('Số điện thoại', memberDetail.so_dien_thoai, Phone)}
                {renderField('Địa chỉ', memberDetail.dia_chi, MapPin)}
                {memberDetail.email && renderField('Email', memberDetail.email, Mail)}
                {memberDetail.cmnd && renderField('CMND', memberDetail.cmnd, IdCard)}
                {memberDetail.cccd && renderField('CCCD', memberDetail.cccd, IdCard)}
                {memberDetail.dan_toc && renderField('Dân tộc', memberDetail.dan_toc, FileText)}
                {memberDetail.nghe_nghiep && renderField('Nghề nghiệp', memberDetail.nghe_nghiep, FileText)}

                {/* Display any additional fields dynamically */}
                {Object.entries(memberDetail)
                  .filter(([key]) => ![
                    'ma_thanh_vien', 'ho_va_ten', 'ngay_sinh', 'gioi_tinh',
                    'dia_chi', 'so_dien_thoai', 'email', 'cmnd', 'cccd',
                    'dan_toc', 'nghe_nghiep'
                  ].includes(key))
                  .map(([key, value]) => {
                    // Format field name
                    const label = key
                      .split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');

                    // Format value
                    let displayValue = value;
                    if (typeof value === 'boolean') {
                      displayValue = value ? 'Có' : 'Không';
                    } else if (value instanceof Date || /^\d{4}-\d{2}-\d{2}/.test(String(value))) {
                      try {
                        displayValue = new Date(value).toLocaleDateString('vi-VN');
                      } catch {
                        displayValue = String(value);
                      }
                    } else if (typeof value === 'object') {
                      displayValue = JSON.stringify(value);
                    } else {
                      displayValue = String(value);
                    }

                    return renderField(label, displayValue, FileText);
                  })
                }
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vaccination History */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Syringe className="w-6 h-6 text-green-600" />
                <CardTitle className="text-2xl">
                  Lịch sử tiêm chủng
                  <Badge variant="secondary" className="ml-3">
                    {vaccinationRecords.length} mũi tiêm
                  </Badge>
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-base mt-2">
              Danh sách tất cả các mũi tiêm đã thực hiện
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {vaccinationRecords.length === 0 ? (
              <div className="text-center py-12">
                <Syringe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground font-medium">Chưa có lịch sử tiêm chủng</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Thành viên này chưa có bản ghi tiêm chủng nào.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {vaccinationRecords.map((record, index) => {
                  // Extract all fields for comprehensive display
                  const knownFields = [
                    'ma_tiem', 'ma_thanh_vien', 'ten_vaccine', 'ngay_tiem',
                    'mui_so', 'lo_vaccine', 'noi_tiem', 'nguoi_tiem', 'phan_ung_sau_tiem'
                  ];

                  return (
                    <Card
                      key={record.ma_tiem || index}
                      className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Pill className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-green-700">
                                {record.ten_vaccine}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-4 mt-1">
                                <span className="flex items-center gap-1">
                                  <Syringe className="w-3 h-3" />
                                  Mũi số {record.mui_so}
                                </span>
                                {record.ma_tiem && (
                                  <span className="flex items-center gap-1">
                                    <IdCard className="w-3 h-3" />
                                    Mã: {record.ma_tiem}
                                  </span>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Đã tiêm
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Main information grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                          {record.ngay_tiem && renderField(
                            'Ngày tiêm',
                            new Date(record.ngay_tiem).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }),
                            Calendar
                          )}
                          {record.lo_vaccine && renderField('Lô vaccine', record.lo_vaccine, Pill)}
                          {record.noi_tiem && renderField('Nơi tiêm', record.noi_tiem, Building)}
                          {record.nguoi_tiem && renderField('Người tiêm', record.nguoi_tiem, User)}

                          {/* Display any additional fields dynamically */}
                          {Object.entries(record)
                            .filter(([key]) => !knownFields.includes(key))
                            .map(([key, value]) => {
                              // Format field name
                              const label = key
                                .split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');

                              // Format value
                              let displayValue = value;
                              if (typeof value === 'boolean') {
                                displayValue = value ? 'Có' : 'Không';
                              } else if (value instanceof Date || /^\d{4}-\d{2}-\d{2}/.test(String(value))) {
                                try {
                                  displayValue = new Date(value).toLocaleDateString('vi-VN');
                                } catch {
                                  displayValue = String(value);
                                }
                              } else if (typeof value === 'object') {
                                displayValue = JSON.stringify(value);
                              } else {
                                displayValue = String(value);
                              }

                              return renderField(label, displayValue, FileText);
                            })
                          }
                        </div>

                        {/* Adverse reactions section */}
                        {record.phan_ung_sau_tiem && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg">
                              <Activity className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-sm font-medium text-amber-900">
                                  Phản ứng sau tiêm:
                                </span>
                                <p className="text-sm text-amber-800 mt-1">
                                  {record.phan_ung_sau_tiem}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back button at bottom */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleBack}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách thành viên
          </Button>
        </div>
      </div>
    </div>
  );
};
