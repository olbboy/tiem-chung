import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { ThanhVien } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
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
  Users,
  LogOut,
  FileText,
  AlertCircle
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

  const handleViewHistory = (memberId: number) => {
    console.log('[PersonalInfo] Navigating to vaccination history for member:', memberId);
    navigate(`/vaccination-history/${memberId}`);
  };

  const handleLogout = () => {
    console.log('[PersonalInfo] Logging out...');
    logout();
    navigate('/login');
  };

  // Helper function to display all member fields dynamically
  const renderMemberField = (label: string, value: any, icon?: any) => {
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
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Thông Tin Cá Nhân</h1>
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-8" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
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
          <CardFooter className="flex gap-2">
            <Button onClick={fetchMembers} className="flex-1">
              Thử lại
            </Button>
            <Button onClick={handleLogout} variant="outline" className="flex-1">
              Đăng xuất
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Thông Tin Cá Nhân</h1>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Quản lý thông tin và lịch sử tiêm chủng
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-primary" />
            Danh sách thành viên theo dõi
          </h2>
          <p className="text-muted-foreground">
            {members.length > 0
              ? `Có ${members.length} thành viên. Chọn thành viên để xem lịch sử tiêm chủng chi tiết.`
              : 'Chưa có thành viên nào trong danh sách.'
            }
          </p>
        </div>

        {members.length === 0 ? (
          <Card className="text-center p-12">
            <CardContent className="pt-6">
              <UserCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Không có thành viên nào</p>
              <p className="text-sm text-muted-foreground mt-2">
                Danh sách thành viên trống. Vui lòng liên hệ quản trị viên nếu đây là lỗi.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => {
              // Extract all fields dynamically for comprehensive display
              const allFields = Object.entries(member).filter(
                ([key]) => !['ma_thanh_vien', 'ho_va_ten', 'gioi_tinh'].includes(key)
              );

              return (
                <Card
                  key={member.ma_thanh_vien}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-primary" />
                        {member.ho_va_ten}
                      </CardTitle>
                      <Badge variant={member.gioi_tinh === 'Nam' ? 'default' : 'secondary'}>
                        {member.gioi_tinh}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <IdCard className="w-3 h-3" />
                      Mã TV: {member.ma_thanh_vien}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-4">
                    {/* Display known fields with icons */}
                    {member.ngay_sinh && renderMemberField(
                      'Ngày sinh',
                      new Date(member.ngay_sinh).toLocaleDateString('vi-VN'),
                      Calendar
                    )}
                    {member.so_dien_thoai && renderMemberField(
                      'Điện thoại',
                      member.so_dien_thoai,
                      Phone
                    )}
                    {member.dia_chi && renderMemberField(
                      'Địa chỉ',
                      member.dia_chi,
                      MapPin
                    )}
                    {member.email && renderMemberField(
                      'Email',
                      member.email,
                      Mail
                    )}

                    {/* Display any additional fields dynamically */}
                    {allFields.map(([key, value]) => {
                      // Skip already displayed fields
                      if (['ngay_sinh', 'so_dien_thoai', 'dia_chi', 'email'].includes(key)) {
                        return null;
                      }

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

                      return renderMemberField(label, displayValue, FileText);
                    })}
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => handleViewHistory(member.ma_thanh_vien)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Xem lịch sử tiêm chủng
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
