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
  IdCard,
  Shield,
  TrendingUp,
  Activity,
  Heart,
  ArrowRight
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
      'ho_ten',           // Already shown as title (actual API field)
      'ho_va_ten',        // Legacy field name
      'gioi_tinh',        // Already shown as badge
      'ngay_sinh',        // Shown separately
      'dien_thoai',       // Shown separately (actual API field)
      'so_dien_thoai',    // Legacy field name
      'dia_chi',          // Legacy field - now split into multiple address fields
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
        {/* Premium Stats Cards */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Members Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">Tổng thành viên</p>
                <p className="mt-2 text-4xl font-bold text-white">{members.length}</p>
                <p className="mt-2 text-sm text-blue-100 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Đang theo dõi
                </p>
              </div>
              <div className="rounded-lg bg-white/20 p-2.5">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Users className="h-32 w-32 text-white" />
            </div>
          </div>

          {/* Health Status Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-100">Sức khỏe</p>
                <p className="mt-2 text-4xl font-bold text-white">100%</p>
                <p className="mt-2 text-sm text-emerald-100 flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  Theo dõi tốt
                </p>
              </div>
              <div className="rounded-lg bg-white/20 p-2.5">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Heart className="h-32 w-32 text-white" />
            </div>
          </div>

          {/* Vaccination Protection Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-purple-100">Bảo vệ</p>
                <p className="mt-2 text-4xl font-bold text-white">Active</p>
                <p className="mt-2 text-sm text-purple-100 flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  Vaccine đầy đủ
                </p>
              </div>
              <div className="rounded-lg bg-white/20 p-2.5">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Shield className="h-32 w-32 text-white" />
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
                  key={member.doi_tuong_id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 hover:border-blue-300 hover:scale-[1.02] bg-white relative"
                >
                  {/* Gradient Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                  
                  {/* Card Header with gradient */}
                  <CardHeader className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-5 pt-6 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="flex justify-between items-start gap-3 relative z-10">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                          <UserCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {member.ho_ten}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant={member.gioi_tinh === 0 ? 'default' : 'secondary'}
                              className="text-xs font-semibold shadow-sm"
                            >
                              {member.gioi_tinh === 0 ? '👨 Nam' : member.gioi_tinh === 1 ? '👩 Nữ' : 'Khác'}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-emerald-200 bg-emerald-50 text-emerald-700">
                              <Shield className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Card Content */}
                  <CardContent className="pt-6 space-y-4">
                    {/* Primary Information */}
                    {member.ngay_sinh && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-sm">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 font-medium mb-0.5">Ngày sinh</div>
                          <div className="text-sm text-gray-900 font-semibold">
                            {member.ngay_sinh}
                          </div>
                        </div>
                      </div>
                    )}

                    {member.dien_thoai && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-sm">
                          <Phone className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 font-medium mb-0.5">Điện thoại</div>
                          <div className="text-sm text-gray-900 font-semibold">
                            {member.dien_thoai}
                          </div>
                        </div>
                      </div>
                    )}

                    {member.dia_chi && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-sm mt-0.5">
                          <MapPin className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 font-medium mb-0.5">Địa chỉ</div>
                          <div className="text-sm text-gray-900 font-semibold line-clamp-2">
                            {member.dia_chi}
                          </div>
                        </div>
                      </div>
                    )}

                    {member.email && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-sm">
                          <Mail className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 font-medium mb-0.5">Email</div>
                          <div className="text-sm text-gray-900 font-semibold truncate">
                            {member.email}
                          </div>
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
                  <CardFooter className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-t-2 border-gray-100 pt-4">
                    <Button
                      onClick={() => handleViewHistory(member)}
                      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group/btn text-white font-semibold py-3"
                    >
                      <Syringe className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                      Xem lịch sử tiêm chủng
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
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
