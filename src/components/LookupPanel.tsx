/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Lock, 
  Building2, 
  PhoneCall, 
  Mail, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Clock, 
  ChevronRight,
  ShieldAlert,
  Boxes,
  HelpCircle,
  FileCheck,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BusinessRegistration, ApplicationStatus } from '../types';

interface LookupPanelProps {
  registrations: BusinessRegistration[];
}

export default function LookupPanel({ registrations }: LookupPanelProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [foundRecord, setFoundRecord] = useState<BusinessRegistration | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);

    const phoneClean = phoneNumber.replace(/[\s.-]/g, '').trim();
    const nameClean = companyName.trim().toLowerCase();

    const record = registrations.find(reg => {
      const regPhoneClean = reg.contact.phoneNumber.replace(/[\s.-]/g, '').trim();
      const regNameClean = reg.companyName.trim().toLowerCase();
      
      // Match exactly phone, and name matches (either fully or partially for convenience, 
      // but demanding both to ensure security of personal data)
      const isPhoneMatch = regPhoneClean === phoneClean && phoneClean !== '';
      const isNameMatch = regNameClean === nameClean || regNameClean.includes(nameClean);
      return isPhoneMatch && isNameMatch;
    });

    setFoundRecord(record || null);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED:
        return {
          label: 'ĐÃ DUYỆT THÀNH VIÊN',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />,
          progress: 100,
          desc: 'Chúc mừng! Hồ sơ doanh nghiệp đã đạt chuẩn 4 tiêu chí của Phiên Chợ Xanh Tử Tế.'
        };
      case ApplicationStatus.REJECTED:
        return {
          label: 'KHÔNG ĐẠT YÊU CẦU',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className="w-5 h-5 text-rose-600" />,
          progress: 100,
          desc: 'Rất tiếc, hồ sơ chưa đạt chuẩn thẩm định. Vui lòng xem ý kiến từ hội đồng bên dưới.'
        };
      case ApplicationStatus.ADDITIONAL_REQUIRED:
        return {
          label: 'YÊU CẦU BỔ SUNG HỒ SƠ',
          color: 'bg-amber-50 text-amber-800 border-amber-250',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          progress: 60,
          desc: 'Có thông tin/giấy chứng nhận bị thiếu hoặc chưa trùng khớp. Vui lòng cập nhật sớm.'
        };
      case ApplicationStatus.REVIEWING:
        return {
          label: 'ĐANG THẨM ĐỊNH TRỰC TIẾP',
          color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          icon: <Clock className="w-5 h-5 text-cyan-600 animate-spin" style={{ animationDuration: '3s' }} />,
          progress: 80,
          desc: 'Hội đồng đang tiến hành khảo sát và kiểm định mẫu thực tế tại nông sản/nhà xưởng.'
        };
      case ApplicationStatus.PENDING:
        return {
          label: 'CHỜ DUYỆT',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Clock className="w-5 h-5 text-blue-600" />,
          progress: 30,
          desc: 'Hồ sơ đã được gửi thành công và đang được Ban thư ký phân loại thẩm duyệt bước đầu.'
        };
      default:
        return {
          label: 'HỒ SƠ BẢN NHÁP',
          color: 'bg-slate-100 text-slate-600 border-slate-200',
          icon: <FileText className="w-5 h-5 text-slate-500" />,
          progress: 10,
          desc: 'Bản khai nháp tạm thời lưu trữ cục bộ trên trình duyệt máy khách.'
        };
    }
  };

  const handleDownloadFile = (fileName: string) => {
    alert(`Tải tài liệu "${fileName}" mô phỏng thành công!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Introduction Info */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200/50 rounded-full text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          Cổng thông tin bảo mật cho thành viên
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Tra Cứu Hồ Sơ Cơ Sở</h2>
        <p className="text-xs text-slate-500 font-sans leading-relaxed">
          Nhập đúng <strong>Số điện thoại</strong> liên hệ và <strong>Tên của doanh nghiệp/Hợp tác xã</strong> đã đăng ký để kiểm tra tiến trình thẩm duyệt của Ban thẩm định.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Search Module */}
        <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs h-fit space-y-4">
          <h3 className="font-bold text-xs text-slate-800 font-mono tracking-wider uppercase border-b border-slate-100 pb-2.5 flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-600" />
            Nhập cổng tra cứu
          </h3>

          <form onSubmit={handleSearch} className="space-y-4 font-sans">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Số điện thoại liên hệ *</label>
              <div className="relative">
                <PhoneCall className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 0981178399"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-250 outline-none focus:border-emerald-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Tên Doanh nghiệp / HTX *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đất Sen Hồng"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-250 outline-none focus:border-emerald-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Bắt đầu kiểm tra
            </button>
          </form>

          <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-[10px] text-slate-500 font-sans leading-relaxed flex gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>Mọi thay đổi dữ liệu cần chỉnh sửa sau khi gửi hồ sơ, vui lòng gọi hotline hỗ trợ ở chân trang.</span>
          </div>
        </div>

        {/* Results Screen */}
        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            {!searchAttempted ? (
              <motion.div 
                key="awaiting-search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-3 h-full flex flex-col items-center justify-center min-h-[300px]"
              >
                <div className="p-4 bg-white rounded-full shadow-xs border border-slate-100">
                  <Lock className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-700">Yêu cầu xác thực chủ sở hữu</h4>
                  <p className="text-[11px] max-w-xs mx-auto mt-1 leading-relaxed">
                    Vui lòng sử dụng số điện thoại của người đại diện/liên hệ và Tên đơn vị chính xác để bắt đầu dò tìm hồ sơ của bạn.
                  </p>
                </div>
              </motion.div>
            ) : foundRecord ? (
              <motion.div 
                key={foundRecord.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Visual application status bar card */}
                {(() => {
                  const sInfo = getStatusBadge(foundRecord.status);
                  return (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Tình trạng hồ sơ gốc</p>
                          <h4 className="font-serif text-lg font-bold text-slate-800 mt-0.5">{foundRecord.companyName}</h4>
                        </div>
                        <div className={`p-1.5 px-3.5 text-xs rounded-full font-black border flex items-center gap-1.5 w-fit ${sInfo.color}`}>
                          {sInfo.icon}
                          <span>{sInfo.label}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span className="font-bold">Tiến độ quy trình thẩm duyệt:</span>
                          <span className="font-mono font-bold text-slate-700">{sInfo.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${sInfo.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-emerald-800 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/30 font-medium">
                          💡 {sInfo.desc}
                        </p>
                      </div>

                      {/* Decisive board review feedback */}
                      {foundRecord.adminNotes && (
                        <div className="p-4 rounded-xl border border-rose-150 bg-rose-50/20 text-xs text-slate-700 space-y-2 relative">
                          <div className="absolute top-3 right-3 text-[9px] bg-rose-100 text-rose-800 border border-rose-200 rounded font-bold px-1 py-0.5">HỘI ĐỒNG PHẢN HỒI</div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            📌 Ghi chú thẩm định & Yêu cầu từ Ban tổ chức:
                          </p>
                          <div className="whitespace-pre-wrap leading-relaxed text-slate-600 bg-white p-3 rounded-lg border border-slate-100 antialiased font-serif italic text-base">
                            &quot;{foundRecord.adminNotes}&quot;
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Main Registration Profile Brief tabs */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                  <h4 className="font-serif text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Building2 className="w-4.5 h-4.5 text-emerald-600" />
                    I. Thông tin Doanh nghiệp đã đăng ký
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Tên chính thức:</span>
                      <strong className="text-slate-800 text-sm">{foundRecord.companyName}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Người liên hệ chịu trách nhiệm:</span>
                      <strong className="text-slate-800">{foundRecord.contact.fullName} ({foundRecord.contact.position})</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Số điện thoại liên lạc:</span>
                      <strong className="text-slate-800 font-mono text-[13px]">{foundRecord.contact.phoneNumber}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Email tiếp nhận:</span>
                      <strong className="text-slate-800 font-mono">{foundRecord.contact.email}</strong>
                    </div>

                    <div className="md:col-span-2">
                      <span className="text-slate-400 block mb-0.5">Trụ sở chính:</span>
                      <strong className="text-slate-800">{foundRecord.hqAddress} ({foundRecord.province})</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Địa chỉ nhà máy sản xuất:</span>
                      <strong className="text-slate-800">{foundRecord.factoryAddress}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Địa chỉ vùng trồng/canh tác:</span>
                      <strong className="text-slate-800">{foundRecord.materialAddress}</strong>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-150">
                      <span className="text-slate-400 block mb-1">Giới thiệu lịch sử, quy trình sản xuất sạch:</span>
                      <p className="text-slate-700 italic leading-relaxed text-[11px] font-sans">
                        {foundRecord.companyHistory || 'Chưa cung cấp bài viết giới thiệu sơ bộ.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document checklist (Securing that they can download and verify files) */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="font-serif text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <FileCheck className="w-4.5 h-4.5 text-emerald-600" />
                    II. Minh chứng Giấy phép & Chứng chỉ Pháp Lý
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. GPKD */}
                    <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/10 space-y-2">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">BẮT BUỘC</span>
                      <h5 className="font-bold text-xs text-slate-800">Giấy phép Kinh doanh / MST</h5>
                      <div className="text-[11px] text-slate-600 space-y-0.5 font-sans">
                        <div>Số hiệu: <strong>{foundRecord.businessLicense.docNumber}</strong></div>
                        <div>Ngày cấp: {foundRecord.businessLicense.issueDate ? new Date(foundRecord.businessLicense.issueDate).toLocaleDateString('vi-VN') : '—'}</div>
                      </div>
                      {foundRecord.businessLicense.file && (
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(foundRecord.businessLicense.file!.name)}
                          className="w-full mt-2 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 text-slate-600 hover:text-emerald-700 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-600" />
                          Xem: {foundRecord.businessLicense.file.name}
                        </button>
                      )}
                    </div>

                    {/* 2. Factory Standard (Optional flexible check) */}
                    <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">LINH HOẠT LỰA CHỌN</span>
                        {foundRecord.factoryStandard.file ? (
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 rounded">ĐÃ NỘP</span>
                        ) : (
                          <span className="text-[9px] bg-slate-150 text-slate-500 font-bold px-1.5 rounded">BỎ QUA</span>
                        )}
                      </div>
                      <h5 className="font-bold text-xs text-slate-800">Tiêu chuẩn Nhà xưởng & VSATTP</h5>
                      {foundRecord.factoryStandard.file ? (
                        <>
                          <div className="text-[11px] text-slate-600 space-y-0.5 font-sans">
                            <div>Loại: <strong>{foundRecord.factoryStandard.certType || 'Chưa rõ'}</strong></div>
                            <div>Mã hiệu: <strong>{foundRecord.factoryStandard.docNumber}</strong></div>
                            <div>Ngày cấp: {foundRecord.factoryStandard.issueDate ? new Date(foundRecord.factoryStandard.issueDate).toLocaleDateString('vi-VN') : '—'}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDownloadFile(foundRecord.factoryStandard.file!.name)}
                            className="w-full mt-2 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 text-slate-600 hover:text-emerald-700 shadow-2xs transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            Xem: {foundRecord.factoryStandard.file.name}
                          </button>
                        </>
                      ) : (
                        <p className="text-[11px] text-slate-450 italic py-2">Chọn không kê khai tài liệu nhà xưởng (sản xuất thủ công/liên kết).</p>
                      )}
                    </div>

                    {/* 3. Material Standard (Optional flexible check) */}
                    <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">LINH HOẠT LỰA CHỌN</span>
                        {foundRecord.materialStandard.file ? (
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 rounded">ĐÃ NỘP</span>
                        ) : (
                          <span className="text-[9px] bg-slate-150 text-slate-500 font-bold px-1.5 rounded">BỎ QUA</span>
                        )}
                      </div>
                      <h5 className="font-bold text-xs text-slate-800">Tiêu chuẩn vùng trồng/canh tác</h5>
                      {foundRecord.materialStandard.file ? (
                        <>
                          <div className="text-[11px] text-slate-600 space-y-0.5 font-sans">
                            <div>Loại: <strong>{foundRecord.materialStandard.certType || 'VietGAP'}</strong></div>
                            <div>Số chứng thư: <strong>{foundRecord.materialStandard.docNumber}</strong></div>
                            <div>Ngày cấp: {foundRecord.materialStandard.issueDate ? new Date(foundRecord.materialStandard.issueDate).toLocaleDateString('vi-VN') : '—'}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDownloadFile(foundRecord.materialStandard.file!.name)}
                            className="w-full mt-2 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 text-slate-600 hover:text-emerald-700 shadow-2xs transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            Xem: {foundRecord.materialStandard.file.name}
                          </button>
                        </>
                      ) : (
                        <p className="text-[11px] text-slate-450 italic py-2">Chọn không kê khai chứng nhận vùng nguyên liệu riêng biệt.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submissions of product specific announcements as of current business */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="font-serif text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Boxes className="w-4.5 h-4.5 text-emerald-600" />
                    III. Danh sách sản phẩm & Hồ sơ tự công bố chất lượng
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {foundRecord.products.map(prod => (
                      <div key={prod.id} className="p-3.5 border border-slate-200 rounded-xl bg-white flex flex-col justify-between gap-3 text-xs">
                        <div className="flex gap-3">
                          <img src={prod.imageUrl} alt={prod.name} className="h-12 w-12 object-cover rounded-lg border border-slate-100 flex-shrink-0 bg-slate-50" referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <h5 className="font-bold text-slate-800 truncate">{prod.name}</h5>
                            <p className="text-[11px] text-slate-500 mt-0.5">Đóng gói: {prod.packingUnit}</p>
                            <p className="text-emerald-700 font-bold">{prod.salesPrice.toLocaleString('vi-VN')} VND</p>
                          </div>
                        </div>

                        {/* Self declaration info specific per product */}
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 text-[10px] space-y-1">
                          <div className="font-bold text-slate-700 flex justify-between">
                            <span>📄 Bản tự công bố & Kết quả test:</span>
                            <span className="text-[8px] text-teal-800 bg-teal-50 px-1 border border-teal-100 rounded">Bắt buộc</span>
                          </div>
                          {prod.announcement ? (
                            <>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Số quyết định:</span>
                                <strong>{prod.announcement.docNumber || '—'}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Ngày lập hồ sơ:</span>
                                <strong>{prod.announcement.issueDate ? new Date(prod.announcement.issueDate).toLocaleDateString('vi-VN') : '—'}</strong>
                              </div>
                              {prod.announcement.file ? (
                                <button
                                  type="button"
                                  onClick={() => handleDownloadFile(prod.announcement!.file!.name)}
                                  className="w-full mt-2 py-1 bg-white border border-slate-150 rounded text-[9px] font-semibold flex items-center justify-center gap-1 text-slate-500 hover:text-emerald-700 cursor-pointer"
                                >
                                  📥 Tải file: {prod.announcement.file.name}
                                </button>
                              ) : (
                                <span className="text-rose-500 block text-right font-medium text-[9px] pt-1">Thiếu file tài liệu!</span>
                              )}
                            </>
                          ) : (
                            <span className="text-rose-500 block text-center py-1">Chưa khai báo bản tự công bố!</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div 
                key="not-found"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-amber-50/50 border border-amber-200 rounded-2xl p-10 text-center space-y-4 h-full min-h-[300px] flex flex-col items-center justify-center"
              >
                <div className="p-3.5 bg-amber-100 rounded-full text-amber-800">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-amber-900">Không tìm thấy thông tin phù hợp!</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                    Hệ thống không tìm thấy bất kỳ hồ sơ nào có Số điện thoại và Tên doanh nghiệp khớp chính xác với thông tin khai báo của bạn.
                  </p>
                </div>
                <div className="p-3.5 bg-white border border-slate-150 rounded-xl text-left max-w-sm text-[11px] text-slate-500 space-y-1.5 font-sans leading-relaxed">
                  <p className="font-bold text-slate-700">💡 Hướng dẫn kiểm tra nhanh:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Hãy cam kết nhập đúng <strong>từng số điện thoại</strong> của chủ cơ sở hoặc người đại diện nộp hồ sơ.</li>
                    <li>Tên doanh nghiệp cần trùng khớp (ví dụ: &quot;Đất Sen Hồng&quot;, &quot;Cần Tây&quot;).</li>
                    <li>Lưu ý: Đối với hồ sơ đang điền nháp (chưa nhấn Nộp chính thức) sẽ không hiển thị trên hệ thống tra cứu công khai.</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
