import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { ThanhVien } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
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
  Users,
  LogOut,
  Syringe,
  AlertCircle,
  IdCard
} from 'lucide-react';

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
      setError('');
      console.log('[PersonalInfo] Fetching members...');
      const response = await apiService.getThanhVien();
      console.log('[PersonalInfo] Members response:', response);

      // Extract data flexibly - could be response.data or response itself
      const membersData = response.data || response || [];
      console.log('[PersonalInfo] Extracted members data:', membersData);

      setMembers(Array.isArray(membersData) ? membersData : [membersData]);
      console.log('[PersonalInfo] Members set successfully, count:', Array.isArray(membersData) ? membersData.length : 1);
    } catch (err: any) {
      console.error('[PersonalInfo] Error fetching members:', err);
      const errorMessage = err.message || 'Không thể tải thông tin thành viên';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = (member: ThanhVien) => {
    console.log('[PersonalInfo] Navigating to vaccination history for member:', {
      ma_thanh_vien: member.ma_thanh_vien,
      doi_tuong_id: member.doi_tuong_id
    });

    // Pass doi_tuong_id in URL (for vaccination history API)
    // Pass ma_thanh_vien in state (for member detail API)
    navigate(`/vaccination-history/${member.doi_tuong_id}`, {
      state: { ma_thanh_vien: member.ma_thanh_vien }
    });
  };

  const handleLogout = () => {
    console.log('[PersonalInfo] Logging out...');
    logout();
    navigate('/login');
  };

  // Helper function to determine if a field should be shown to users
  const shouldShowField = (key: string): boolean => {
    // Hide technical/system fields
    const hiddenFields = [
      'ma_thanh_vien',    // Technical ID (already shown in header)
      'doi_tuong_id',     // Technical ID for API
      'ho_va_ten',        // Already shown as title
      'gioi_tinh',        // Already shown as badge
      'ngay_sinh',        // Shown separately
      'so_dien_thoai',    // Shown separately
      'dia_chi',          // Shown separately
      'email',            // Shown separately
    ];

    if (hiddenFields.includes(key)) return false;
    if (key.endsWith('_id')) return false;  // Hide all technical IDs
    if (key.startsWith('ho_khau_')) return false;  // Hide household registration fields
    if (key.startsWith('created') || key.startsWith('updated')) return false;

    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-96 mb-8" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <Skeleton className="h-7 w-40 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
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
          <CardFooter className="flex gap-3">
            <Button onClick={fetchMembers} className="flex-1">
              Thử lại
            </Button>
            <Button onClick={handleLogout} variant="outline" className="flex-1">
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Quản Lý Thành Viên
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Thông tin và lịch sử tiêm chủng
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Danh sách thành viên
                </h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  {members.length > 0
                    ? `${members.length} thành viên đang theo dõi`
                    : 'Chưa có thành viên nào'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        {members.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <UserCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chưa có thành viên
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Danh sách thành viên trống. Vui lòng liên hệ quản trị viên để thêm thành viên.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => {
              // Extract only user-relevant fields
              const userFields = Object.entries(member).filter(([key]) => shouldShowField(key));

              return (
                <Card
                  key={member.ma_thanh_vien}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200"
                >
                  {/* Card Header with gradient */}
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <UserCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg text-gray-900 leading-tight line-clamp-2">
                            {member.ho_va_ten}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge
                              variant={member.gioi_tinh === 'Nam' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {member.gioi_tinh}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Card Content */}
                  <CardContent className="pt-6 space-y-3.5">
                    {/* Primary Information */}
                    {member.ngay_sinh && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-600">Ngày sinh:</span>
                          <span className="ml-2 text-gray-900 font-medium">
                            {new Date(member.ngay_sinh).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    )}

                    {member.so_dien_thoai && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-600">Điện thoại:</span>
                          <span className="ml-2 text-gray-900 font-medium">
                            {member.so_dien_thoai}
                          </span>
                        </div>
                      </div>
                    )}

                    {member.dia_chi && (
                      <div className="flex items-start gap-2.5 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-600">Địa chỉ:</span>
                          <span className="ml-2 text-gray-900 font-medium line-clamp-2">
                            {member.dia_chi}
                          </span>
                        </div>
                      </div>
                    )}

                    {member.email && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 text-gray-900 font-medium truncate block">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Additional Fields */}
                    {userFields.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        {userFields.slice(0, 3).map(([key, value]) => {
                          const fieldLabels: Record<string, string> = {
                            'cmnd': 'CMND',
                            'cccd': 'CCCD',
                            'dan_toc': 'Dân tộc',
                            'nghe_nghiep': 'Nghề nghiệp',
                          };

                          const label = fieldLabels[key] || key.split('_')
                            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ');

                          let displayValue = value;
                          if (typeof value === 'boolean') {
                            displayValue = value ? 'Có' : 'Không';
                          } else if (/^\d{4}-\d{2}-\d{2}/.test(String(value))) {
                            try {
                              displayValue = new Date(value).toLocaleDateString('vi-VN');
                            } catch {
                              displayValue = String(value);
                            }
                          }

                          return (
                            <div key={key} className="flex items-center gap-2.5 text-sm">
                              <IdCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-gray-600">{label}:</span>
                                <span className="ml-2 text-gray-900 font-medium">
                                  {String(displayValue)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>

                  {/* Card Footer */}
                  <CardFooter className="bg-gray-50 border-t border-gray-100">
                    <Button
                      onClick={() => handleViewHistory(member)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                    >
                      <Syringe className="w-4 h-4 mr-2" />
                      Xem lịch sử tiêm chủng
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
