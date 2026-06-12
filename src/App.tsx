/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Sparkles, 
  Award, 
  Bookmark, 
  CheckCircle, 
  ShieldCheck, 
  HelpCircle, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Building2, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BusinessRegistration, ApplicationStatus, AppConfig } from './types';
import { SEEDED_REGISTRATIONS } from './mockData';
import Introduction from './components/Introduction';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './components/AdminPanel';
import LookupPanel from './components/LookupPanel';

type ActiveView = 'HOME' | 'REGISTER' | 'ADMIN' | 'SUCCESS' | 'LOOKUP';

const DEFAULT_CONFIG: AppConfig = {
  heroTagline: "Dự án Nông nghiệp Xanh & Phát triển bền vững",
  heroHeadingPrefix: "Trở thành Thành viên của",
  heroHeadingTitle: "Phiên Chợ Xanh Tử Tế",
  heroDescription: "Nơi kết nối các hợp tác xã, doanh nghiệp sạch, các nông hộ tâm huyết hướng đến một nền nông nghiệp organic bền vững, minh bạch và tử tế với người tiêu dùng Việt Nam. Hãy đăng ký hồ sơ tham gia để cùng kiến tạo chuỗi cung ứng thực phẩm tử tế."
};

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('HOME');
  
  // State for all submitted registrations
  const [registrations, setRegistrations] = useState<BusinessRegistration[]>([]);
  // State for currently active draft
  const [activeDraft, setActiveDraft] = useState<BusinessRegistration | null>(null);
  
  // Store just-submitted registration to show in the success page
  const [latestSubmitted, setLatestSubmitted] = useState<BusinessRegistration | null>(null);

  // App home configuration (tagline, banner heading and intro text)
  const [appConfig, setAppConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  // Load from local storage on boot
  useEffect(() => {
    // 1. Submitted registrations
    const savedSubmissions = localStorage.getItem('px_tute_farm_submissions');
    if (savedSubmissions) {
      try {
        setRegistrations(JSON.parse(savedSubmissions));
      } catch (e) {
        setRegistrations(SEEDED_REGISTRATIONS);
      }
    } else {
      setRegistrations(SEEDED_REGISTRATIONS);
      localStorage.setItem('px_tute_farm_submissions', JSON.stringify(SEEDED_REGISTRATIONS));
    }

    // 2. Drafts
    const savedDraft = localStorage.getItem('px_tute_farm_draft');
    if (savedDraft) {
      try {
        setActiveDraft(JSON.parse(savedDraft));
      } catch (e) {
        // Safe check
      }
    }

    // 3. Configurations
    const savedConfig = localStorage.getItem('px_tute_farm_config');
    if (savedConfig) {
      try {
        setAppConfig(JSON.parse(savedConfig));
      } catch (e) {
        // Safe check
      }
    }
  }, []);

  const handleUpdateConfig = (newConfig: AppConfig) => {
    setAppConfig(newConfig);
    localStorage.setItem('px_tute_farm_config', JSON.stringify(newConfig));
  };

  // Save submissions to local storage when changed
  const saveSubmissionsToStorage = (updatedList: BusinessRegistration[]) => {
    setRegistrations(updatedList);
    localStorage.setItem('px_tute_farm_submissions', JSON.stringify(updatedList));
  };

  // Draft autosave handler
  const handleSaveDraft = (draft: BusinessRegistration) => {
    setActiveDraft(draft);
    localStorage.setItem('px_tute_farm_draft', JSON.stringify(draft));
  };

  // Clear current draft state
  const handleClearDraft = () => {
    setActiveDraft(null);
    localStorage.removeItem('px_tute_farm_draft');
  };

  // Final submit handler
  const handleFinalSubmit = (submissionData: BusinessRegistration) => {
    // Ensure status is PENDING and updated
    const finalSubmission: BusinessRegistration = {
      ...submissionData,
      status: ApplicationStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Prepend to submissions list
    const updatedSubmissions = [finalSubmission, ...registrations];
    saveSubmissionsToStorage(updatedSubmissions);
    
    // Set latest submitted for confirmation view
    setLatestSubmitted(finalSubmission);
    // Clear draft
    handleClearDraft();
    // Redirect to Success tab
    setActiveView('SUCCESS');
  };

  // Admin approval update state handler
  const handleAdminUpdateStatus = (id: string, status: ApplicationStatus, notes: string) => {
    const updated = registrations.map(reg => {
      if (reg.id === id) {
        return {
          ...reg,
          status,
          adminNotes: notes,
          updatedAt: new Date().toISOString()
        };
      }
      return reg;
    });
    saveSubmissionsToStorage(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* GLOBAL ORGANIC BRAND HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all shadow-xs">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          
          {/* Logo Brand markup */}
          <div 
            onClick={() => setActiveView('HOME')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-800 flex items-center justify-center shadow-md shadow-emerald-700/10 transition-transform group-hover:scale-105">
              <Leaf className="w-5.5 h-5.5 text-white" />
            </div>
            
            <div className="space-y-0.5">
              <span className="font-serif font-black text-lg md:text-xl text-slate-800 tracking-tight flex items-center gap-1.5 leading-none">
                Phiên Chợ Xanh Tử Tế
              </span>
              <span className="block text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">
                CỔNG ĐĂNG KÝ THÀNH VIÊN
              </span>
            </div>
          </div>

          {/* Nav pills */}
          <nav className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => setActiveView('HOME')}
              id="nav-home"
              type="button"
              className={`px-3 md:px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                activeView === 'HOME' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Trang chủ
            </button>
            
            <button
              onClick={() => setActiveView('REGISTER')}
              id="nav-register"
              type="button"
              className={`px-3 md:px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                activeView === 'REGISTER' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Khai hồ sơ
            </button>
            
            <button
              onClick={() => setActiveView('LOOKUP')}
              id="nav-lookup"
              type="button"
              className={`px-3 md:px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                activeView === 'LOOKUP' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Tra cứu hồ sơ
            </button>
            
            <button
              onClick={() => setActiveView('ADMIN')}
              id="nav-admin"
              type="button"
              className={`px-3 md:px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                activeView === 'ADMIN' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Hội Đồng (Admin)
            </button>
          </nav>
        </div>
      </header>

      {/* BODY VIEW WRAPPER */}
      <main className="flex-grow px-4 md:px-6 py-6 max-w-6xl w-full mx-auto">
        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME PORTAL */}
          {activeView === 'HOME' && (
            <motion.div
              key="view-home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Restoring Unfinished Draft box alert */}
              {activeDraft && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-800 mt-0.5">
                      <Bookmark className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800">Khôi phục bản khai nháp trước đó của bạn</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Hệ thống đã nhận diện dữ liệu đang kê khai dang dở của cơ sở <strong>&quot;{activeDraft.companyName || "Chưa đặt tên"}&quot;</strong> cập nhật lần cuối vào {new Date(activeDraft.updatedAt).toLocaleDateString('vi-VN')}.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={handleClearDraft}
                      className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
                    >
                      Xóa nháp cũ
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveView('REGISTER')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                    >
                      Tiếp tục nộp hồ sơ
                    </button>
                  </div>
                </div>
              )}

              <Introduction 
                onStartRegistration={() => setActiveView('REGISTER')} 
                onGoToDrafts={activeDraft ? () => setActiveView('REGISTER') : undefined}
                onGoToAdmin={() => setActiveView('ADMIN')}
                totalSubmissions={registrations.length}
                appConfig={appConfig}
              />
            </motion.div>
          )}

          {/* VIEW: REGISTRATION FORM WIZARD */}
          {activeView === 'REGISTER' && (
            <motion.div
              key="view-register"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <RegistrationForm
                initialDraft={activeDraft}
                onSaveDraft={handleSaveDraft}
                onSaveAndSubmit={handleFinalSubmit}
                onBackToHome={() => setActiveView('HOME')}
              />
            </motion.div>
          )}

          {/* VIEW: ADMIN PANEL */}
          {activeView === 'ADMIN' && (
            <motion.div
              key="view-admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <AdminPanel
                registrations={registrations}
                onUpdateStatus={handleAdminUpdateStatus}
                onClose={() => setActiveView('HOME')}
                appConfig={appConfig}
                onUpdateConfig={handleUpdateConfig}
              />
            </motion.div>
          )}

          {/* VIEW: LOOKUP PANEL */}
          {activeView === 'LOOKUP' && (
            <motion.div
              key="view-lookup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <LookupPanel registrations={registrations} />
            </motion.div>
          )}

          {/* VIEW: CONGRATULATIONS SUCCESS VIEW */}
          {activeView === 'SUCCESS' && latestSubmitted && (
            <motion.div
              key="view-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto py-10"
            >
              <div className="bg-white rounded-3xl border border-slate-150 p-8 text-center space-y-6 shadow-sm">
                
                {/* Visual success logo element */}
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm shadow-emerald-500/10">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-mono">
                    Hồ sơ của bạn đã được tiếp nhận!
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-black text-slate-800">
                    Đăng Ký Thành Công!
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    Hồ sơ đăng ký trở thành thành viên Phiên chợ Xanh Tử tế của cơ sở <strong className="text-slate-800 font-semibold">&quot;{latestSubmitted.companyName}&quot;</strong> đã được chuyển giao thành công đến phòng Thẩm định Kỹ thuật dự án.
                  </p>
                </div>

                {/* Tracking checklist */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-150 text-left space-y-3 max-w-md mx-auto">
                  <h4 className="text-xs font-bold text-slate-700 font-display uppercase tracking-wide">Quy trình thẩm định tiếp theo:</h4>
                  
                  <div className="space-y-3">
                    {[
                      { index: '1', title: 'Xét duyệt sơ bộ hồ sơ gốc', desc: 'Hội đồng thẩm định sẽ đối chiếu số hiệu chứng nhận vùng trồng PGS/VietGAP và Giấy phép kinh doanh gốc trong vòng 3 ngày làm việc.' },
                      { index: '2', title: 'Lên lịch khảo nghiệm thực địa', desc: 'Chuyên gia nông nghiệp sẽ liên lạc qua SĐT để lên lịch lấy mẫu đất, mẫu nước tưới ngay tại nông trại của bạn.' },
                      { index: '3', title: 'Cấp Thẻ mã thành viên chính thức', desc: 'Sau khi mẫu kiểm nghiệm đạt kết quả Sạch - Không dư lự lượng thuốc bảo vệ, bạn sẽ được cấp gian hàng trưng bán tại Phiên chợ.' }
                    ].map((step, idx) => (
                      <div key={idx} className="flex gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                          {step.index}
                        </span>
                        <div className="space-y-0.5 text-xs text-slate-600">
                          <strong className="text-slate-700 block font-semibold">{step.title}</strong>
                          <p className="font-light leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => setActiveView('HOME')}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Về trang chủ của dự án
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView('ADMIN')}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs transition-transform transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
                  >
                    <span>Xem vị trí hồ sơ tại Admin panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER ORGANIC BRAND PLATFORM */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Leaf className="w-6 h-6 text-emerald-400" />
              <span className="font-serif font-bold text-lg tracking-tight">Phiên Chợ Xanh Tử Tế</span>
            </div>
            
            <p className="text-xs leading-relaxed text-slate-400 font-sans font-light">
              Dự án sáng lập và phát triển bởi Trung tâm Nghiên cứu Kinh doanh và Hỗ trợ Doanh nghiệp (BSA). Nhằm nâng đỡ nông sản sạch từ tâm hồn tử tế của bà con nông dân Việt Nam.
            </p>
          </div>

          <div className="space-y-3.5 text-xs text-slate-400 font-sans font-light">
            <h4 className="font-bold text-white font-display uppercase tracking-widest text-[10px]">Thông tin liên lạc văn phòng</h4>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Số 60/2 Lý Chính Thắng, Phường Xuân Hoà, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Hotline hỗ trợ: 098 117 8399</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Email tiếp nhận: phienchoxanhtute.bsa@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 text-xs text-slate-400 font-sans font-light">
            <h4 className="font-bold text-white font-display uppercase tracking-widest text-[10px]">Tôn chỉ phát triển chuỗi xanh</h4>
            <p className="leading-relaxed">
              &quot;Sạch từ gốc rễ, Lành từ tâm hồn, Minh bạch trên từng tấm tem nhãn, Tử tế với cộng đồng người tiêu dùng.&quot;
            </p>
            <div className="pt-2">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono font-bold text-[10px]">
                BSA BAN HOẠT ĐỘNG © 2026
              </span>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 mt-8 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono">
          PHÁT TRIỂN THEO TIÊU CHUẨN CODE SẠCH - PHIÊN BẢN CỔNG ĐĂNG KÍ THÀNH VIÊN V1.2.5
        </div>
      </footer>

    </div>
  );
}
