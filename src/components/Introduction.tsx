/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, Award, ClipboardCheck, Users, HelpCircle, ArrowRight, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AppConfig } from '../types';

interface IntroductionProps {
  onStartRegistration: () => void;
  onGoToDrafts?: () => void;
  onGoToAdmin: () => void;
  totalSubmissions: number;
  appConfig: AppConfig;
}

export default function Introduction({
  onStartRegistration,
  onGoToDrafts,
  onGoToAdmin,
  totalSubmissions,
  appConfig
}: IntroductionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-radial from-emerald-800 to-teal-950 text-white p-8 md:p-12 shadow-xl border border-emerald-700/30"
      >
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3  py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 text-sm font-medium tracking-wide">
            <Leaf className="w-4 h-4 text-emerald-400" />
            {appConfig?.heroTagline || "Dự án Nông nghiệp Xanh & Phát triển bền vững"}
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight leading-tight text-emerald-50">
            {appConfig?.heroHeadingPrefix || "Trở thành Thành viên của"} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-400">
              {appConfig?.heroHeadingTitle || "Phiên Chợ Xanh Tử Tế"}
            </span>
          </h1>
          
          <p className="text-emerald-100/90 text-base md:text-lg leading-relaxed font-sans font-light">
            {appConfig?.heroDescription || "Nơi kết nối các hợp tác xã, doanh nghiệp sạch, các nông hộ tâm huyết hướng đến một nền nông nghiệp organic bền vững, minh bạch và tử tế với người tiêu dùng Việt Nam. Hãy đăng ký hồ sơ tham gia để cùng kiến tạo chuỗi cung ứng thực phẩm tử tế."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onStartRegistration}
              id="btn-intro-start"
              className="px-6 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transform active:scale-95 group"
            >
              <span>Nộp hồ sơ Đăng ký mới</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {onGoToDrafts && (
              <button
                onClick={onGoToDrafts}
                id="btn-intro-drafts"
                className="px-6 py-4 rounded-xl bg-teal-900/40 hover:bg-teal-900/60 text-emerald-200 font-semibold border border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Tiếp tục điền nháp
              </button>
            )}

            <button
              onClick={onGoToAdmin}
              id="btn-intro-admin"
              className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Cổng Thẩm Định (Admin)
              <span className="ml-1 bg-emerald-500 text-teal-950 text-xs px-2 py-0.5 rounded-full font-bold">
                {totalSubmissions} hồ sơ
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 4 Pillars of "Tử Tế" */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-800">4 Giá trị Cốt lõi chúng tôi tìm kiếm</h2>
          <p className="text-slate-500 mt-2 text-sm">Các thành viên dự án phải đảm bảo thực thi đúng triết lý canh tác sạch.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            {
              icon: Leaf,
              title: "GỐC SẠCH",
              color: "bg-emerald-50 text-emerald-700 border-emerald-100",
              desc: "Nguồn đất, nguồn nước và giống cây được kiểm định chặt chẽ, hoàn toàn không dính dư lượng hóa chất độc hại hay kim loại nặng."
            },
            {
              icon: ShieldCheck,
              title: "SẢN PHẨM LÀNH",
              color: "bg-teal-50 text-teal-700 border-teal-100",
              desc: "Sơ chế và chế biến giữ trọn định lượng dưỡng chất tự nhiên. Nói không với chất bảo quản hóa học tổng hợp và hóa sắc phụ gia độc hại."
            },
            {
              icon: FileCheck,
              title: "MINH BẠCH PHÁP LÝ",
              color: "bg-cyan-50 text-cyan-700 border-cyan-100",
              desc: "Đầy đủ chứng nhận tự công bố sản phẩm, báo cáo test mẫu từ các trung tâm đo lường tiêu chuẩn ISO/HACCP uy tín."
            },
            {
              icon: Award,
              title: "SỰ TỬ TẾ",
              color: "bg-amber-50 text-amber-700 border-amber-100",
              desc: "Cam kết giữ đạo đức kinh doanh, trung thực về giá bán và nỗ lực nâng tầm đời sống của người nông dân tại hợp tác xã."
            }
          ].map((pillar, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className={`p-6 rounded-2xl border ${pillar.color} transition-all hover:shadow-md hover:-translate-y-1`}
            >
              <div className="p-3 rounded-lg bg-white inline-block shadow-sm">
                <pillar.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg mt-4 mb-2 tracking-wide text-slate-800">{pillar.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">{pillar.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Guide Cards and Process Chain */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {/* Stepwise Instruction card */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-slate-800">Quy trình Đăng ký & Thẩm định</h3>
          
          <div className="relative border-l border-emerald-200 pl-6 ml-4 space-y-8">
            {[
              {
                step: "01",
                title: "Khai báo Thông tin & Sản phẩm",
                desc: "Điền lý lịch doanh nghiệp, chức danh đại diện hợp pháp. Cung cấp danh sách các sản phẩm nông sản chế biến dự định tham gia phiên chợ kèm đầy đủ định lượng đóng gói, giá cả và hình ảnh."
              },
              {
                step: "02",
                title: "Cung cấp Hồ sơ Giấy phép Chứng chỉ",
                desc: "Nhập số hiệu, ngày cấp và tải lên file scan (PDF/Hình ảnh) của Giấy phép kinh doanh, Chứng nhận cơ sở đủ điều kiện VSATTP (HACCP/ISO) và Chứng chỉ vùng trồng (VietGAP, GlobalGAP, Bio...)."
              },
              {
                step: "03",
                title: "Cung cấp Tài nguyên Truyền thông",
                desc: "Đính kèm hình ảnh mô tả thực tế về ứng dụng sản phẩm, dây chuyền sản xuất cơ khí/thủ công, các sự kiện xúc tiến thương mại đã tham gia cùng đánh giá hài lòng của người dùng thực tế."
              },
              {
                step: "04",
                title: "Cam kết Trách nhiệm & Ban thẩm định khảo sát",
                desc: "Ký cam kết trực tuyến về chất lượng. Hội đồng Phiên chợ Xanh Tử tế sẽ thẩm duyệt hồ sơ gốc và lên lịch khảo sát trực tiếp tại nông trại/nhà máy trước khi cấp thẻ thành viên chính thức."
              }
            ].map((stepInfo, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-10 top-0.5 bg-emerald-500 text-teal-950 font-bold w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm shadow-emerald-500/20">
                  {stepInfo.step}
                </span>
                <h4 className="font-sans font-bold text-base text-slate-800">{stepInfo.title}</h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed font-sans font-light">{stepInfo.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits panel & Stats */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Quyền lợi Thành viên
            </h4>
            
            <ul className="space-y-3 text-slate-600 text-sm">
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Tham gia trực tiếp các sự kiện Phiên chợ Xanh Tử tế tổ chức định kỳ hàng tuần tại TP. Hồ Chí Minh.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Hỗ trợ xúc tiến thương mại, truyền thông thương hiệu sạch trên các kênh truyền thông chính thống.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Kết nối trực tiếp tới cộng đồng hàng vạn khách hàng trung thành ưa chuộng thực phẩm organic tế nhị.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Được sự tư vấn chuyên môn từ các chuyên gia hàng đầu về nông nghiệp sinh học, bảo quản và chuỗi lạnh.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/30 text-center space-y-1">
            <div className="text-2xl font-display font-bold text-emerald-800">100%</div>
            <div className="text-xs text-slate-500 font-medium font-sans">Minh bạch - Uy tín - Công tâm</div>
          </div>

          <button
            onClick={onStartRegistration}
            id="btn-intro-cta"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold transition-all shadow-sm cursor-pointer text-center text-sm"
          >
            Đăng ký tham gia ngay
          </button>
        </div>
      </div>
    </div>
  );
}
