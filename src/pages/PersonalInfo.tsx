import { useState, useEffect, useMemo } from 'react';
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
  ArrowRight,
  Search,
  X,
  Filter,
  SortAsc,
  SortDesc,
  Info,
  RefreshCw,
  ChevronRight
} from 'lucide-react';

type SortOption = 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest';

export const PersonalInfo = () => {
  const [members, setMembers] = useState<ThanhVien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMembers();
    setRefreshing(false);
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

  // Filter and sort members
  const filteredAndSortedMembers = useMemo(() => {
    let filtered = [...members];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member =>
        member.ho_ten?.toLowerCase().includes(query) ||
        member.dien_thoai?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.dia_chi?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.ho_ten || '').localeCompare(b.ho_ten || '', 'vi');
        case 'name-desc':
          return (b.ho_ten || '').localeCompare(a.ho_ten || '', 'vi');
        case 'date-newest':
          return (b.doi_tuong_id || 0) - (a.doi_tuong_id || 0);
        case 'date-oldest':
          return (a.doi_tuong_id || 0) - (b.doi_tuong_id || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [members, searchQuery, sortBy]);

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
      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Top Row: Title and Logout */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg group hover:scale-105 transition-transform duration-300">
                <Users className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  Danh Sách Thành Viên
                </h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  Quản lý thông tin và lịch sử tiêm chủng
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:bg-blue-50 transition-colors"
                aria-label="Làm mới dữ liệu"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Làm mới</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          {!loading && members.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, số điện thoại, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white font-medium hover:border-gray-300"
                  aria-label="Tìm kiếm thành viên"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Xóa tìm kiếm"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-medium text-gray-700 bg-white"
                  aria-label="Bộ lọc và sắp xếp"
                  aria-expanded={showFilters}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Sắp xếp</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                        Sắp xếp theo
                      </div>
                      {[
                        { value: 'name-asc', label: 'Tên A → Z', icon: SortAsc },
                        { value: 'name-desc', label: 'Tên Z → A', icon: SortDesc },
                        { value: 'date-newest', label: 'Mới nhất', icon: TrendingUp },
                        { value: 'date-oldest', label: 'Cũ nhất', icon: Calendar },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as SortOption);
                            setShowFilters(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            sortBy === option.value
                              ? 'bg-blue-50 text-blue-700 shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <option.icon className="w-4 h-4" />
                          {option.label}
                          {sortBy === option.value && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-blue-600"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        {!loading && members.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Members Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105 cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Tổng thành viên</p>
                  <p className="mt-2 text-4xl font-bold text-white tabular-nums">
                    {searchQuery ? `${filteredAndSortedMembers.length} / ${members.length}` : members.length}
                  </p>
                  <p className="mt-2 text-sm text-blue-100 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {searchQuery ? 'Kết quả tìm kiếm' : 'Đang theo dõi'}
                  </p>
                </div>
                <div className="rounded-lg bg-white/20 p-2.5 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Users className="h-32 w-32 text-white" />
              </div>
            </div>

          {/* Health Status Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105 cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-100">Trạng thái</p>
                <p className="mt-2 text-4xl font-bold text-white">Tốt</p>
                <p className="mt-2 text-sm text-emerald-100 flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  Theo dõi đầy đủ
                </p>
              </div>
              <div className="rounded-lg bg-white/20 p-2.5 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Heart className="h-32 w-32 text-white" />
            </div>
          </div>

          {/* Vaccination Protection Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105 cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-purple-100">Bảo vệ</p>
                <p className="mt-2 text-4xl font-bold text-white">100%</p>
                <p className="mt-2 text-sm text-purple-100 flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  Đã được bảo vệ
                </p>
              </div>
              <div className="rounded-lg bg-white/20 p-2.5 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Shield className="h-32 w-32 text-white" />
            </div>
          </div>
          </div>
        )}

        {/* Members Grid */}
        {members.length === 0 ? (
          <Card className="text-center py-20 border-2 border-dashed border-gray-300">
            <CardContent>
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6 shadow-lg">
                <UserCircle className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Chưa có thành viên nào
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
                Danh sách thành viên của bạn hiện đang trống. Vui lòng liên hệ cơ sở y tế hoặc quản trị viên để thêm thành viên vào hệ thống.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  onClick={fetchMembers}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tải lại
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Trợ giúp
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : filteredAndSortedMembers.length === 0 ? (
          <Card className="text-center py-20 border-2 border-dashed border-gray-300">
            <CardContent>
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-6 shadow-lg">
                <Search className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
                Không tìm thấy thành viên nào phù hợp với từ khóa <strong className="text-gray-900">"{searchQuery}"</strong>. Vui lòng thử tìm kiếm với từ khóa khác.
              </p>
              <Button
                onClick={() => setSearchQuery('')}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                <X className="w-4 h-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600">
                  Hiển thị <strong className="text-gray-900 font-semibold">{filteredAndSortedMembers.length}</strong> thành viên
                  {searchQuery && ` khớp với "${searchQuery}"`}
                </p>
                {searchQuery && (
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    <Search className="w-3 h-3 mr-1" />
                    Đang lọc
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedMembers.map((member) => {
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
                          // Comprehensive Vietnamese field labels mapping
                          const fieldLabels: Record<string, string> = {
                            // Identity documents
                            'cmnd': 'CMND',
                            'cccd': 'CCCD',
                            'ma_doi_tuong': 'Mã đối tượng',
                            'ma_thanh_vien': 'Mã thành viên',
                            
                            // Personal info
                            'dan_toc': 'Dân tộc',
                            'ten_dan_toc': 'Dân tộc',
                            'nghe_nghiep': 'Nghề nghiệp',
                            
                            // Healthcare facility
                            'co_so_id': 'Mã cơ sở',
                            'ten_co_so': 'Cơ sở y tế',
                            
                            // Address fields
                            'dia_chi': 'Địa chỉ',
                            'ho_khau_dia_chi': 'Địa chỉ hộ khẩu',
                            'tam_tru_dia_chi': 'Địa chỉ tạm trú',
                            'ho_khau_tinh': 'Tỉnh/TP (HK)',
                            'ho_khau_huyen': 'Quận/Huyện (HK)',
                            'ho_khau_xa': 'Phường/Xã (HK)',
                            'tam_tru_tinh': 'Tỉnh/TP (TT)',
                            'tam_tru_huyen': 'Quận/Huyện (TT)',
                            'tam_tru_xa': 'Phường/Xã (TT)',
                            
                            // Contact
                            'email': 'Email',
                            'dien_thoai': 'Điện thoại',
                            'so_dien_thoai': 'Điện thoại',
                            
                            // Status
                            'theo_doi': 'Theo dõi',
                            'trang_thai': 'Trạng thái',
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
          </>
        )}
      </main>
    </div>
  );
};
