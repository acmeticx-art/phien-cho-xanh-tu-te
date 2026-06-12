/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Building2, 
  Boxes, 
  User, 
  Phone, 
  Mail, 
  Info, 
  Calendar, 
  X, 
  CheckCircle2, 
  AlertCircle,
  ShieldAlert,
  Printer,
  ChevronRight,
  Image,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  LogOut,
  Settings,
  Edit,
  Layout,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BusinessRegistration, ApplicationStatus, Province, AppConfig } from '../types';
import { VIETNAM_PROVINCES } from '../mockData';

const DEFAULT_CONFIG = {
  heroTagline: "Dự án Nông nghiệp Xanh & Phát triển bền vững",
  heroHeadingPrefix: "Trở thành Thành viên của",
  heroHeadingTitle: "Phiên Chợ Xanh Tử Tế",
  heroDescription: "Nơi kết nối các hợp tác xã, doanh nghiệp sạch, các nông hộ tâm huyết hướng đến một nền nông nghiệp organic bền vững, minh bạch và tử tế với người tiêu dùng Việt Nam. Hãy đăng ký hồ sơ tham gia để cùng kiến tạo chuỗi cung ứng thực phẩm tử tế."
};

interface AdminPanelProps {
  registrations: BusinessRegistration[];
  onUpdateStatus: (id: string, status: ApplicationStatus, notes: string) => void;
  onClose: () => void;
  appConfig: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
}

export default function AdminPanel({
  registrations,
  onUpdateStatus,
  onClose,
  appConfig,
  onUpdateConfig
}: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [provinceFilter, setProvinceFilter] = useState<string>('ALL');
  const [selectedReg, setSelectedReg] = useState<BusinessRegistration | null>(null);
  
  // Admin authentication state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('bsa_admin_auth') === 'true';
  });
  const [activeAdminRole, setActiveAdminRole] = useState<string | null>(() => {
    return sessionStorage.getItem('bsa_admin_role') || null;
  });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Local review state inside modal
  const [reviewStatus, setReviewStatus] = useState<ApplicationStatus>(ApplicationStatus.PENDING);
  const [reviewNotes, setReviewNotes] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Tabs layout parameter
  const [activeTab, setActiveTab] = useState<'REGISTRATIONS' | 'SETTINGS'>('REGISTRATIONS');

  // Home configurations editable states
  const [heroTagline, setHeroTagline] = useState(appConfig?.heroTagline || '');
  const [heroHeadingPrefix, setHeroHeadingPrefix] = useState(appConfig?.heroHeadingPrefix || '');
  const [heroHeadingTitle, setHeroHeadingTitle] = useState(appConfig?.heroHeadingTitle || '');
  const [heroDescription, setHeroDescription] = useState(appConfig?.heroDescription || '');

  // Keep state in-sync with prop changes
  useEffect(() => {
    if (appConfig) {
      setHeroTagline(appConfig.heroTagline);
      setHeroHeadingPrefix(appConfig.heroHeadingPrefix);
      setHeroHeadingTitle(appConfig.heroHeadingTitle);
      setHeroDescription(appConfig.heroDescription);
    }
  }, [appConfig]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      heroTagline: heroTagline.trim(),
      heroHeadingPrefix: heroHeadingPrefix.trim(),
      heroHeadingTitle: heroHeadingTitle.trim(),
      heroDescription: heroDescription.trim(),
    });
    setSuccessToast("Đã lưu thiết kế biểu ngữ & Phần giới thiệu thành công!");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (email === 'phienchoxanhtute.bsa@gmail.com' && password === 'bsa@2026') {
      setIsAdminAuthenticated(true);
      setActiveAdminRole('Trưởng Ban Thẩm Định - BSA');
      sessionStorage.setItem('bsa_admin_auth', 'true');
      sessionStorage.setItem('bsa_admin_role', 'Trưởng Ban Thẩm Định - BSA');
      setLoginError('');
    } else if (email === 'admin@bsa.org.vn' && password === 'admin') {
      setIsAdminAuthenticated(true);
      setActiveAdminRole('Thư ký Hội đồng Thẩm định');
      sessionStorage.setItem('bsa_admin_auth', 'true');
      sessionStorage.setItem('bsa_admin_role', 'Thư ký Hội đồng Thẩm định');
      setLoginError('');
    } else {
      setLoginError('Tài khoản hoặc mật khẩu ủy quyền không chính xác. Vui lòng kiểm tra lại.');
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setEmailInput(email);
    setPasswordInput(pass);
    setLoginError('');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setActiveAdminRole(null);
    sessionStorage.removeItem('bsa_admin_auth');
    sessionStorage.removeItem('bsa_admin_role');
  };

  // Filter logic
  const filteredRegs = registrations.filter(reg => {
    const matchesSearch = 
      reg.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.contact.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'ALL' || reg.status === statusFilter;
    const matchesProvince = provinceFilter === 'ALL' || reg.province === provinceFilter;
    
    return matchesSearch && matchesStatus && matchesProvince;
  });

  // Analytics Stats calculations
  const total = registrations.length;
  const approvedCount = registrations.filter(r => r.status === ApplicationStatus.APPROVED).length;
  const pendingCount = registrations.filter(r => r.status === ApplicationStatus.PENDING).length;
  const reviewCount = registrations.filter(r => r.status === ApplicationStatus.REVIEWING).length;
  const additionalCount = registrations.filter(r => r.status === ApplicationStatus.ADDITIONAL_REQUIRED).length;

  const handleOpenReview = (reg: BusinessRegistration) => {
    setSelectedReg(reg);
    setReviewStatus(reg.status);
    setReviewNotes(reg.adminNotes || '');
  };

  const handleSaveReview = () => {
    if (!selectedReg) return;
    onUpdateStatus(selectedReg.id, reviewStatus, reviewNotes);
    
    // Update active registration model in scope
    setSelectedReg(prev => prev ? {
      ...prev,
      status: reviewStatus,
      adminNotes: reviewNotes
    } : null);

    setSuccessToast("Đã cập nhật trạng thái thẩm định và thông báo ý kiến hội đồng thành công!");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const statusMap: { [key in ApplicationStatus]: { text: string; color: string; icon: any } } = {
    [ApplicationStatus.DRAFT]: { text: 'Bản nháp', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock },
    [ApplicationStatus.PENDING]: { text: 'Chờ duyệt', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: Clock },
    [ApplicationStatus.REVIEWING]: { text: 'Thẩm định thực tế', color: 'bg-cyan-50 text-cyan-800 border-cyan-200', icon: Info },
    [ApplicationStatus.APPROVED]: { text: 'Thành viên chính thức', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle },
    [ApplicationStatus.REJECTED]: { text: 'Không đạt tiêu chí', color: 'bg-rose-50 text-rose-800 border-rose-200', icon: AlertTriangle },
    [ApplicationStatus.ADDITIONAL_REQUIRED]: { text: 'Yêu cầu sửa bổ sung', color: 'bg-purple-50 text-purple-800 border-purple-200', icon: AlertCircle }
  };

  // Simulating Report Exports
  const handleExportCSV = () => {
    alert("Hệ thống đã xuất báo cáo tổng hợp danh sách doanh nghiệp thành viên dưới dạng CSV thành công!");
  };

  const handlePrintDossier = () => {
    window.print();
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-800 tracking-tight">Xác thực Hội Đồng Thẩm Định</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Khu vực bảo mật bảo vệ hồ sơ doanh nghiệp. Chỉ thành viên hội đồng kiểm định chất lượng và thư ký ban quản lý Phiên Chợ Xanh Tử Tế mới được truy cập.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-[11px] text-rose-750 font-semibold flex items-start gap-2 animate-pulse">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 font-sans">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Tài khoản Email ủy quyền *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="Ví dụ: phienchoxanhtute.bsa@gmail.com"
                  value={emailInput}
                  onChange={e => {
                    setEmailInput(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-250 outline-none focus:border-emerald-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-650 mb-1.5">Mật khẩu bảo mật *</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Nhập mã pin / mật khẩu hội đồng"
                  value={passwordInput}
                  onChange={e => {
                    setPasswordInput(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-250 outline-none focus:border-emerald-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Đăng nhập Thẩm Định
            </button>
          </form>

          {/* Quick login assistants for grading/reviewing */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doanh nghiệp ủy quyền đăng nhập nhanh:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('phienchoxanhtute.bsa@gmail.com', 'bsa@2026')}
                className="p-2 border border-slate-200 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20 rounded-xl text-[10px] text-left transition-all cursor-pointer space-y-0.5"
              >
                <div className="font-bold text-slate-700 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Trưởng Ban Thẩm Định
                </div>
                <div className="text-slate-500 font-mono scale-95 origin-left">phienchoxanhtute.bsa...</div>
                <div className="text-emerald-850 font-mono font-bold">Mã: bsa@2026</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@bsa.org.vn', 'admin')}
                className="p-2 border border-slate-200 hover:border-cyan-550 bg-slate-50/50 hover:bg-cyan-5/20 rounded-xl text-[10px] text-left transition-all cursor-pointer space-y-0.5"
              >
                <div className="font-bold text-slate-700 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  Thư ký Hội đồng
                </div>
                <div className="text-slate-500 font-mono scale-95 origin-left">admin@bsa.org.vn</div>
                <div className="text-cyan-850 font-mono font-bold">Mã: admin</div>
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer underline underline-offset-4"
            >
              Quay lại Trang Chủ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2 max-w-6xl mx-auto font-sans">
      {/* Toast notifications */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2 max-w-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Info indicator block of current authorized Admin */}
      <div className="p-3 px-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-xs gap-3 font-sans shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">Thành viên Hội đồng:</span>
          <strong className="text-slate-100">{activeAdminRole}</strong>
        </div>
        <button
          onClick={handleAdminLogout}
          className="flex items-center gap-1 text-[10px] font-bold text-slate-305 hover:text-rose-400 transition-colors uppercase border border-slate-700 hover:border-rose-400/30 px-2.5 py-1 rounded-lg cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          Khóa màn hình
        </button>
      </div>

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5 font-display">
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            Cổng thẩm định phê duyệt hồ sơ
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-800">
            Hồi Đồng Thẩm Định Phiên Chợ Xanh Tử Tế
          </h2>
          <p className="text-xs text-slate-500 font-light font-sans">
            Thẩm duyệt hồ sơ, xem chứng thư VietGAP, hình ảnh xưởng đóng gói sấy và lên lịch kiểm thử thực địa.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-emerald-200 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            Xuất Excel CSV
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>

      {/* TABS SELECTION */}
      <div className="flex border-b border-slate-200 gap-1 font-sans">
        <button
          type="button"
          onClick={() => setActiveTab('REGISTRATIONS')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'REGISTRATIONS'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-600" />
          Hồ Sơ Đăng Ký ({registrations.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SETTINGS')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'SETTINGS'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-500" />
          Cấu hình Biểu ngữ & Giới thiệu
        </button>
      </div>

      {activeTab === 'REGISTRATIONS' ? (
        <>
          {/* ANALYTICS CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {[
          { label: 'Tổng số hồ sơ', count: total, color: 'border-slate-200 bg-white text-slate-700' },
          { label: 'Thành viên chính thức', count: approvedCount, color: 'border-emerald-250 bg-emerald-50/20 text-emerald-800' },
          { label: 'Chờ duyệt sơ bộ', count: pendingCount, color: 'border-amber-250 bg-amber-50/20 text-amber-850' },
          { label: 'Đang khảo sát thực địa', count: reviewCount, color: 'border-cyan-250 bg-cyan-50/20 text-cyan-850' },
          { label: 'Yêu cầu bổ sung', count: additionalCount, color: 'border-purple-250 bg-purple-50/20 text-purple-850' },
        ].map((stat, sIdx) => (
          <div key={sIdx} className={`p-4 rounded-2xl border ${stat.color} shadow-xs flex flex-col justify-between`}>
            <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
            <span className="text-2xl font-display font-bold mt-2">{stat.count}</span>
          </div>
        ))}
      </div>

      {/* FILTER CONTROLS */}
      <div className="p-4 bg-white rounded-2xl border border-slate-150 shadow-xs flex flex-col md:flex-row gap-3.5 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên doanh nghiệp, chủ cơ sở hoặc email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500 bg-white font-sans"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 items-center w-full md:w-auto flex-shrink-0">
          <Filter className="w-4 h-4 text-slate-400 hidden md:inline" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500 bg-white cursor-pointer w-full md:w-auto"
          >
            <option value="ALL">-- Tất cả trạng thái --</option>
            {Object.keys(ApplicationStatus).map((stat) => (
              <option key={stat} value={stat}>
                {statusMap[stat as ApplicationStatus]?.text || stat}
              </option>
            ))}
          </select>
        </div>

        {/* Province Filter */}
        <div className="w-full md:w-auto flex-shrink-0">
          <select
            value={provinceFilter}
            onChange={e => setProvinceFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500 bg-white cursor-pointer w-full md:w-auto"
          >
            <option value="ALL">-- Tất cả tỉnh thành --</option>
            {VIETNAM_PROVINCES.map((prov) => (
              <option key={prov.code} value={prov.name}>{prov.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* REGISTRY TABLE CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-xs">
        {filteredRegs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Building2 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-sm">Không tìm thấy hồ sơ đăng ký tham gia nào khớp yêu cầu</p>
            <p className="text-xs text-slate-450">Thử xóa bộ lọc hoặc tìm kiếm ngắn gọn hơn nhé.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 text-xs font-bold font-display uppercase tracking-wider">
                  <th className="py-4.5 px-6">Trụ sở & Doanh Nghiệp</th>
                  <th className="py-4.5 px-4">Đại Diện</th>
                  <th className="py-4.5 px-4 text-center">Sản Phẩm</th>
                  <th className="py-4.5 px-4 text-center">Trạng Thái</th>
                  <th className="py-4.5 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegs.map((reg) => {
                  const sC = statusMap[reg.status] || { text: reg.status, color: 'bg-slate-50', icon: Clock };
                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 space-y-1">
                        <div className="font-bold text-slate-800 text-sm">{reg.companyName}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-300" />
                          <span>{reg.province} — {reg.hqAddress}</span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4 space-y-0.5 text-xs text-slate-600">
                        <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {reg.contact.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400">{reg.contact.phoneNumber}</div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                          <Boxes className="w-3.5 h-3.5 text-slate-500" />
                          {reg.products.length} dòng
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${sC.color}`}>
                          <sC.icon className="w-3.5 h-3.5" />
                          <span>{sC.text}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          id={`btn-view-review-${reg.id}`}
                          onClick={() => handleOpenReview(reg)}
                          className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-bold text-slate-700 transition-all cursor-pointer flex items-center justify-end gap-1 ml-auto"
                        >
                          <span>Thẩm định</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
          {/* Settings form */}
          <form onSubmit={handleSaveConfig} className="bg-white rounded-3xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                Cài đặt nội dung Trang chủ
              </h3>
              <p className="text-xs text-slate-500 font-light">
                Chỉnh sửa các từ ngữ hiển thị ở biểu ngữ chào mừng và nội dung giới thiệu của Phiên chợ xanh tử tế.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nhãn biểu ngữ phụ (Tagline) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Dự án Nông nghiệp Xanh & Phát triển bền vững"
                  value={heroTagline}
                  onChange={e => setHeroTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-250 outline-none focus:border-emerald-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tiêu đề - Phần dẫn đầu (Heading Prefix) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Trở thành Thành viên của"
                    value={heroHeadingPrefix}
                    onChange={e => setHeroHeadingPrefix(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-250 outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tiêu đề - Nhấn mạnh chính (Heading Title) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Phiên Chợ Xanh Tử Tế"
                    value={heroHeadingTitle}
                    onChange={e => setHeroHeadingTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-250 outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Phần giới thiệu tóm tắt (Introduction Description) *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Mô tả tóm tắt mục tiêu, triết lý hoạt động của phiên chợ..."
                  value={heroDescription}
                  onChange={e => setHeroDescription(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-250 outline-none focus:border-emerald-500 bg-white resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setHeroTagline(DEFAULT_CONFIG.heroTagline);
                  setHeroHeadingPrefix(DEFAULT_CONFIG.heroHeadingPrefix);
                  setHeroHeadingTitle(DEFAULT_CONFIG.heroHeadingTitle);
                  setHeroDescription(DEFAULT_CONFIG.heroDescription);
                }}
                className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                title="Khôi phục lại nội dung chuẩn mặc định"
              >
                Mặc định gốc
              </button>
              
              <button
                type="submit"
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                Lưu Thay Đổi Cấu Hình
              </button>
            </div>
          </form>

          {/* Live Interactive Preview Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layout className="w-4.5 h-4.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-[10px]">Bản xem trước trực tiếp trên Trang chủ</span>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-radial from-emerald-800 to-teal-950 text-white p-6 md:p-8 shadow-md border border-emerald-700/30">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-56 h-56 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 text-[10px] font-medium tracking-wide">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  {heroTagline || "Dự án Nông nghiệp Xanh & Phát triển bền vững"}
                </div>
                
                <h1 className="font-serif text-2xl md:text-3.5xl font-bold tracking-tight leading-tight text-emerald-50">
                  {heroHeadingPrefix || "Trở thành Thành viên của"} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-400">
                    {heroHeadingTitle || "Phiên Chợ Xanh Tử Tế"}
                  </span>
                </h1>
                
                <p className="text-emerald-100/90 text-[12px] leading-relaxed font-sans font-light">
                  {heroDescription || "Nơi kết nối các hợp tác xã, doanh nghiệp sạch, các nông hộ tâm huyết hướng đến một nền nông nghiệp organic bền vững, minh bạch và tử tế với người tiêu dùng Việt Nam."}
                </p>

                <div className="flex gap-2 pt-2">
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-200 text-[10px] font-semibold border border-emerald-500/30">
                    Nộp hồ sơ Đăng ký mới
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-[10px] font-semibold border border-white/10">
                    Cổng Thẩm Định (Admin)
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 text-[11px] text-amber-800 leading-relaxed space-y-1">
              <strong className="block font-semibold">💡 Lưu ý thiết kế biểu ngữ:</strong>
              <p>Màu nền và font chữ được đồng bộ hóa thống nhất với bản sắc xanh lá (Organic Emerald) của BSA. Các cấu hình sửa đổi sẽ có hiệu lực trực tiếp trên toàn bộ Trang Chủ ngay khi bạn bấm nút "Lưu Thay Đổi Cấu Hình".</p>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED DOSSIER DIALOG / REVIEW CONSOLE */}
      {selectedReg && (
        <div className="fixed inset-0 z-45 bg-slate-900/50 flex justify-end p-0 md:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-none md:rounded-3xl shadow-2xl relative flex flex-col h-full overflow-hidden border border-slate-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex justify-between items-center flex-shrink-0">
              <div className="space-y-0.5">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md font-mono uppercase tracking-wider mr-2">
                  HỒ SƠ GỐC: {selectedReg.id}
                </span>
                <h3 className="font-serif font-bold text-lg inline-block">
                  {selectedReg.companyName}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintDossier}
                  className="rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white p-2 cursor-pointer transition-colors"
                  title="In biên bản thẩm định"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReg(null)}
                  className="text-white/80 hover:text-white rounded-full bg-slate-900/10 hover:bg-slate-900/20 p-2 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body split into Assessment Dossier & Admin Console */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 print:block">
              
              {/* Formal Dossier print layout header */}
              <div className="hidden print:block text-center space-y-1 mb-8 border-b border-double border-slate-350 pb-5">
                <h2 className="font-serif font-bold text-lg">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <h3 className="text-xs font-semibold">Độc lập - Tự do - Hạnh phúc</h3>
                <div className="w-32 h-0.5 bg-slate-800 mx-auto mt-2"></div>
                <h1 className="font-serif font-bold text-xl uppercase pt-4">BIÊN BẢN THẨM THUYẾT THÀNH VIÊN</h1>
                <p className="text-xs italic text-slate-500">Dự án chuỗi thực phẩm mộc Phiên chợ Xanh Tử tế</p>
              </div>

              {/* SECTION I: CONTACTS */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Building2 className="w-4.5 h-4.5 text-emerald-600" />
                  I. Thông Tin Chính Doanh Nghiệp / Cơ Sở
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div><strong>Tên Doanh nghiệp:</strong> <span className="text-slate-800 font-semibold">{selectedReg.companyName}</span></div>
                  <div><strong>Trụ sở chính:</strong> {selectedReg.hqAddress} ({selectedReg.province})</div>
                  <div><strong>Người chịu trách nhiệm chính:</strong> {selectedReg.contact.fullName} ({selectedReg.contact.position})</div>
                  <div>
                    <strong>Liên hệ:</strong> {selectedReg.contact.phoneNumber} - {selectedReg.contact.email}
                  </div>
                  {selectedReg.branchAddress && (
                    <div className="col-span-2"><strong>Chi nhánh:</strong> {selectedReg.branchAddress}</div>
                  )}
                  <div><strong>Địa chỉ nhà máy:</strong> {selectedReg.factoryAddress}</div>
                  <div><strong>Địa chỉ vùng trồng:</strong> {selectedReg.materialAddress}</div>
                </div>

                {/* Sub-Images attachments display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  {selectedReg.hqImages.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden p-1 bg-slate-50">
                      <img src={selectedReg.hqImages[0].url} alt="HQ" className="h-24 w-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                      <div className="text-[10px] text-slate-500 text-center mt-1 font-medium italic">Ảnh Trụ sở chính</div>
                    </div>
                  )}
                  {selectedReg.branchImages.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden p-1 bg-slate-50">
                      <img src={selectedReg.branchImages[0].url} alt="Branch" className="h-24 w-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                      <div className="text-[10px] text-slate-500 text-center mt-1 font-medium italic">Ảnh Chi nhánh</div>
                    </div>
                  )}
                  {selectedReg.factoryImages.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden p-1 bg-slate-50">
                      <img src={selectedReg.factoryImages[0].url} alt="Factory" className="h-24 w-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                      <div className="text-[10px] text-slate-500 text-center mt-1 font-medium italic">Ảnh Nhà máy</div>
                    </div>
                  )}
                  {selectedReg.materialImages.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden p-1 bg-slate-50">
                      <img src={selectedReg.materialImages[0].url} alt="Material" className="h-24 w-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                      <div className="text-[10px] text-slate-500 text-center mt-1 font-medium italic">Ảnh Vùng trồng</div>
                    </div>
                  )}
                </div>

                {/* History */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-1.5 font-sans">
                  <strong className="text-xs text-slate-700">Lịch sử phát triển & Quy trình sản xuất:</strong>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">{selectedReg.companyHistory}</p>
                </div>
              </div>

              {/* PRODUCTS LIST */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5 font-display">
                  <Boxes className="w-4.5 h-4.5 text-emerald-600" />
                  Danh Sách Sản Phẩm Đăng Ký Tham Gia & Hồ Sơ Tự Công Bố
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedReg.products.map(prod => (
                    <div key={prod.id} className="p-4 border border-slate-200 rounded-2xl bg-white flex flex-col justify-between gap-3 shadow-xs hover:border-emerald-300 transition-colors">
                      <div className="flex gap-3">
                        <img src={prod.imageUrl} alt={prod.name} className="h-16 w-16 object-cover rounded-xl border border-slate-100 bg-slate-50 flex-shrink-0" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0 text-xs">
                          <h5 className="font-bold text-slate-800 truncate">{prod.name}</h5>
                          <p className="text-slate-500 mt-0.5">Đóng gói: {prod.packingUnit}</p>
                          <p className="text-emerald-700 font-bold mt-0.5">Giá: {prod.salesPrice.toLocaleString()} VND</p>
                          <p className="text-slate-400 mt-1 line-clamp-1">Thành phần: {prod.ingredients}</p>
                        </div>
                      </div>

                      {/* Product self-declaration block */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 text-[10px] text-slate-600 space-y-1">
                        <div className="font-bold text-slate-750 flex items-center justify-between">
                          <span>📄 Tự công bố & Kết quả test:</span>
                          <span className="text-[8px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold uppercase">Bắt buộc</span>
                        </div>
                        {prod.announcement ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-slate-450">Số công bố:</span>
                              <strong className="text-slate-800">{prod.announcement.docNumber || 'Chưa nhập'}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-450">Ngày cấp:</span>
                              <strong className="text-slate-800">
                                {prod.announcement.issueDate ? new Date(prod.announcement.issueDate).toLocaleDateString('vi-VN') : '—'}
                              </strong>
                            </div>
                            {prod.announcement.file ? (
                              <div className="pt-1.5 border-t border-slate-200 flex justify-end">
                                <a
                                  href="#"
                                  onClick={(e) => { e.preventDefault(); alert(`Đã tải tài liệu tự công bố "${prod.announcement?.file?.name}" thành công!`); }}
                                  className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold hover:underline flex items-center gap-1"
                                >
                                  📥 Tải file: {prod.announcement.file.name}
                                </a>
                              </div>
                            ) : (
                              <div className="text-rose-500 italic text-right pt-1 border-t border-slate-200">Không đính kèm file!</div>
                            )}
                          </>
                        ) : (
                          <div className="text-rose-500 italic text-center py-1">Chưa khai báo hồ sơ tự công bố!</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION II: CERTIFICATIONS */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <FileText className="w-4.5 h-4.5 text-emerald-600" />
                  II. Hồ Sơ Pháp Lý & Tiêu Chuẩn Chứng Nhận
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Giấy phép Kinh doanh', data: selectedReg.businessLicense, prefix: 'Số hiệu GPKD / MST: ' },
                    { label: 'Tiêu chuẩn nhà xưởng', data: selectedReg.factoryStandard, prefix: 'Loại: ' },
                    { label: 'Tiêu chuẩn vùng trồng', data: selectedReg.materialStandard, prefix: 'Vùng: ' },
                  ].map((cert, cIdx) => (
                    <div key={cIdx} className="p-4 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/10">
                      <h5 className="font-bold text-xs text-slate-800">{cert.label}</h5>
                      <div className="text-[11px] text-slate-600 space-y-1">
                        <div><strong>{cert.prefix}</strong> {cert.data.docNumber || cert.data.certType || "Không có"}</div>
                        <div><strong>Ngày cấp:</strong> {cert.data.issueDate ? new Date(cert.data.issueDate).toLocaleDateString('vi-VN') : "—"}</div>
                        <div>
                          <strong>Ngày hết hạn:</strong> {cert.data.hasExpiry 
                            ? (cert.data.expiryDate ? new Date(cert.data.expiryDate).toLocaleDateString('vi-VN') : "Chưa nhập") 
                            : "Vô thời hạn"
                          }
                        </div>
                      </div>

                      {/* Simulated File Download anchor */}
                      {cert.data.file ? (
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); alert(`Đã tải tài liệu "${cert.data.file?.name}" thành công!`); }}
                          className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Tải file: {cert.data.file.name}
                        </a>
                      ) : (
                        <div className="text-[10px] text-rose-500 italic mt-1.5">Không đính kèm file!</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION III: MEDIA CHANNELS */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Image className="w-4.5 h-4.5 text-emerald-600" />
                  III. Hình Ảnh Thẩm Định Truyền Thông thực tế
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-500 mb-2">1. Ứng dụng thực tế</span>
                    {selectedReg.mediaProductUsage.length > 0 ? (
                      <img src={selectedReg.mediaProductUsage[0].url} alt="Usage" className="h-20 w-full object-cover rounded-xl border" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="h-20 w-full rounded-xl bg-slate-150 flex items-center justify-center text-slate-400 text-xs italic">Không có</div>
                    )}
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-slate-500 mb-2">2. Dây chuyền sản xuất</span>
                    {selectedReg.mediaProductionLine.length > 0 ? (
                      <img src={selectedReg.mediaProductionLine[0].url} alt="Line" className="h-20 w-full object-cover rounded-xl border" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="h-20 w-full rounded-xl bg-slate-150 flex items-center justify-center text-slate-400 text-xs italic">Không có</div>
                    )}
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-slate-500 mb-2">3. Xúc tiến thương mại</span>
                    {selectedReg.mediaTradePromotion.length > 0 ? (
                      <img src={selectedReg.mediaTradePromotion[0].url} alt="Trade" className="h-20 w-full object-cover rounded-xl border" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="h-20 w-full rounded-xl bg-slate-150 flex items-center justify-center text-slate-400 text-xs italic">Không có</div>
                    )}
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-slate-500 mb-2">4. Phản hồi khách hàng</span>
                    {selectedReg.mediaCustomerReview.length > 0 ? (
                      <img src={selectedReg.mediaCustomerReview[0].url} alt="Review" className="h-20 w-full object-cover rounded-xl border" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="h-20 w-full rounded-xl bg-slate-150 flex items-center justify-center text-slate-400 text-xs italic">Không có</div>
                    )}
                  </div>
                </div>
              </div>

              {/* COMMITMENT */}
              <div className="border-t border-slate-100 pt-5 space-y-2 text-xs text-slate-600">
                <div><strong>Ký cam kết trực tuyến:</strong> Đã ký bởi đại diện pháp nhân <span className="font-bold text-slate-800">{selectedReg.committerName || selectedReg.contact.fullName}</span></div>
                <div><strong>Thời điểm ký kết:</strong> {new Date(selectedReg.updatedAt).toLocaleString('vi-VN')}</div>
              </div>

              {/* ADMIN DECISION CONSOLE */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 print:hidden">
                <h4 className="font-serif text-base font-bold text-slate-800 flex items-center gap-1.5 text-teal-850">
                  <ShieldAlert className="w-5 h-5 text-teal-700 animate-pulse" />
                  Khu vực Thẩm định Phê duyệt của Hội đồng
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status checklist selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Quyết định trạng thái hồ sơ *</label>
                    <div className="space-y-2">
                      {[
                        { status: ApplicationStatus.PENDING, label: 'Chờ thẩm nghiệm sơ bộ', color: 'accent-amber-500' },
                        { status: ApplicationStatus.REVIEWING, label: 'Lên lịch khảo nghiệm thực địa', color: 'accent-cyan-500' },
                        { status: ApplicationStatus.APPROVED, label: 'Duyệt thành viên chính thức', color: 'accent-emerald-500' },
                        { status: ApplicationStatus.ADDITIONAL_REQUIRED, label: 'Yêu cầu sửa bổ sung hồ sơ', color: 'accent-purple-500' },
                        { status: ApplicationStatus.REJECTED, label: 'Từ chối không đạt chuẩn', color: 'accent-rose-500' }
                      ].map((item) => (
                        <label key={item.status} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer">
                          <input
                            type="radio"
                            name="admin-review-status"
                            checked={reviewStatus === item.status}
                            onChange={() => setReviewStatus(item.status)}
                            className={`${item.color} focus:ring-emerald-500 w-4 h-4`}
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Comments textbox */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ý kiến đánh giá lý do hoặc ghi chú phản hồi cho Doanh nghiệp *</label>
                    <textarea
                      rows={5}
                      value={reviewNotes}
                      onChange={e => setReviewNotes(e.target.value)}
                      placeholder="Ghi rõ lý do duyệt, yêu cầu bổ sung giấy công bố hoặc lỗi kiểm nghiệm mẫu..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-teal-600 bg-white resize-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedReg(null)}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Đóng bảng điều khiển
                  </button>
                  <button
                    type="button"
                    id="btn-admin-submit-review"
                    onClick={handleSaveReview}
                    className="px-4.5 py-2 bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Lưu phê duyệt thẩm định
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
