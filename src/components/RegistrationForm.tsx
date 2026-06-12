/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  MapPin, 
  Boxes, 
  FileCheck, 
  Image, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Calendar,
  Sparkles,
  ShieldCheck,
  ClipboardCheck,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BusinessRegistration, 
  ProductItem, 
  UploadedFile, 
  ApplicationStatus, 
  ContactInfo 
} from '../types';
import { VIETNAM_PROVINCES } from '../mockData';
import FileUploader from './FileUploader';

interface RegistrationFormProps {
  onSaveAndSubmit: (data: BusinessRegistration) => void;
  onSaveDraft: (data: BusinessRegistration) => void;
  initialDraft: BusinessRegistration | null;
  onBackToHome: () => void;
}

const emptyRegistration = (): BusinessRegistration => {
  const uniqId = 'reg_' + Math.random().toString(36).substr(2, 9);
  return {
    id: uniqId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: ApplicationStatus.DRAFT,
    companyName: '',
    contact: {
      fullName: '',
      position: '',
      phoneNumber: '',
      email: ''
    },
    province: '',
    hqAddress: '',
    hqImages: [],
    branchAddress: '',
    branchImages: [],
    factoryAddress: '',
    factoryImages: [],
    materialAddress: '',
    materialImages: [],
    companyHistory: '',
    companyHistoryFile: null,
    products: [],
    businessLicense: { docNumber: '', issueDate: '', expiryDate: '', hasExpiry: false, file: null },
    factoryStandard: { docNumber: '', issueDate: '', expiryDate: '', hasExpiry: true, certType: '', file: null },
    materialStandard: { docNumber: '', issueDate: '', expiryDate: '', hasExpiry: true, certType: '', file: null },
    productAnnouncement: { docNumber: '', issueDate: '', expiryDate: '', hasExpiry: false, file: null },
    mediaProductUsage: [],
    mediaProductionLine: [],
    mediaTradePromotion: [],
    mediaCustomerReview: [],
    isCommitted: false,
    committerName: ''
  };
};

const STEP_TITLES = [
  "I. THÔNG TIN CHÍNH DOANH NGHIỆP",
  "DANH SÁCH SẢN PHẨM ĐĂNG KÝ",
  "II. HỒ SƠ PHÁP LÝ & TIÊU CHUẨN",
  "III. HÌNH ẢNH TRUYỀN THÔNG",
  "IV. XÁC NHẬN & CAM KẾT"
];

export default function RegistrationForm({
  onSaveAndSubmit,
  onSaveDraft,
  initialDraft,
  onBackToHome
}: RegistrationFormProps) {
  // Use either initialDraft or a brand new template
  const [formData, setFormData] = useState<BusinessRegistration>(
    initialDraft ? initialDraft : emptyRegistration()
  );

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [tempProduct, setTempProduct] = useState<Partial<ProductItem>>({
    name: '',
    packingUnit: '',
    salesPrice: 0,
    imageUrl: '',
    ingredients: '',
    preservation: '',
    announcement: { docNumber: '', issueDate: '', expiryDate: '', hasExpiry: false, file: null }
  });
  const [productErrors, setProductErrors] = useState<string | null>(null);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationBanner, setShowValidationBanner] = useState<boolean>(false);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState<boolean>(false);

  // Auto-save feedback
  useEffect(() => {
    if (formData.companyName || formData.contact.fullName) {
      const timer = setTimeout(() => {
        onSaveDraft({ ...formData, updatedAt: new Date().toISOString() });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formData]);

  const handleUpdateContact = (field: keyof ContactInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const handleUpdateLicense = (
    key: 'businessLicense' | 'factoryStandard' | 'materialStandard' | 'productAnnouncement',
    field: string,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  // Image Presets for testing
  const presets = {
    hq: [
      { name: 'tru-so-co-so-san-xuat.jpg', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=650' }
    ],
    branch: [
      { name: 'cua-hang-gioi-thieu.jpg', url: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=650' }
    ],
    factory: [
      { name: 'dây-chuyền-nông-nghiệp.jpg', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=650' }
    ],
    material: [
      { name: 'cánh-đồng-rau-gắp.jpg', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=650' }
    ],
    product: [
      { name: 'Xà-lách.jpg', url: 'https://images.unsplash.com/photo-1556801712-74c736d3f974?auto=format&fit=crop&q=80&w=650' },
      { name: 'Bột-Trà-Xanh.jpg', url: 'https://images.unsplash.com/photo-1610970881699-44a5587caaec?auto=format&fit=crop&q=80&w=650' },
      { name: 'Dầu-Dừa.jpg', url: 'https://images.unsplash.com/photo-1622484211148-71649987f2fa?auto=format&fit=crop&q=80&w=650' }
    ],
    mediaUsage: [
      { name: 'mon-an-rau-tron.jpg', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=650' }
    ],
    mediaLine: [
      { name: 'may-say-lanh.jpg', url: 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=650' }
    ],
    mediaTrade: [
      { name: 'hoi-cho-nong-nghiep.jpg', url: 'https://images.unsplash.com/photo-1488459718957-3901b054cb25?auto=format&fit=crop&q=80&w=650' }
    ],
    mediaReview: [
      { name: 'danh-gia-khach-hang.jpg', url: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=650' }
    ]
  };

  // Demo Autofill Function
  const handleDemoAutofill = () => {
    const demoId = 'reg_demo_' + Math.random().toString(36).substr(2, 5);
    const demoData: BusinessRegistration = {
      id: demoId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: ApplicationStatus.DRAFT,
      companyName: 'Hợp tác xã Thảo Mộc Đất Sen Hồng',
      contact: {
        fullName: 'Trần Sen Vàng',
        position: 'Phó Ban Quản Trị HTX',
        phoneNumber: '0909555123',
        email: 'sen.vang@datsenhong.org'
      },
      province: 'Đồng Tháp',
      hqAddress: '158 Lý Thường Kiệt, Phường 2, Thành phố Cao Lãnh, Tỉnh Đồng Tháp',
      hqImages: [
        { id: 'fhq_demo', name: 'văn-phòng-caolãnh.jpg', size: 104500, type: 'image/jpeg', url: presets.hq[0].url }
      ],
      branchAddress: 'Chi nhánh Sài Gòn: 82 Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh',
      branchImages: [
        { id: 'fbr_demo', name: 'showroom-saigon.jpg', size: 135000, type: 'image/jpeg', url: presets.branch[0].url }
      ],
      factoryAddress: 'Cụm chế biến nông sản sạch Sa Đéc, Đồng Tháp',
      factoryImages: [
        { id: 'ffac_demo', name: 'he-thong-say-lanh.jpg', size: 212000, type: 'image/jpeg', url: presets.factory[0].url }
      ],
      materialAddress: 'Vùng canh tác Sen hoàng kim và trà cỏ ngọt quy mô 8 hecta tại Lấp Vò, Đồng Tháp',
      materialImages: [
        { id: 'fmat_demo', name: 'dam-sen-lap-vo.jpg', size: 345000, type: 'image/jpeg', url: presets.material[0].url }
      ],
      companyHistory: 'Thành lập từ năm 2021 bởi tập thể các kỹ sư nông học trẻ tuổi của vùng hữu ngạn sông Tiền. Trả qua nhiều giai đoạn thử thách, chúng tôi đã đồng hành cùng 35 hộ dân chuyển đổi hữu cơ cho sáu chân sen bản địa chất lượng cao gắn với bảo tồn di sản thảo mộc tự nhiên. Toàn bộ quy trình sấy và nghiền đều dùng điện sạch thân thiện và công nghệ sấy sương lạnh tiệt trùng.',
      companyHistoryFile: { id: 'file_hist_demo', name: 'de-an-canh-tac-sen-hong.docx', size: 180000, type: 'application/octet-stream', url: '#' },
      products: [
        {
          id: 'p_demo_1',
          name: 'Trà Củ Sen Sấy Lạnh Cỏ Ngọt',
          packingUnit: 'Hộp thiếc 200g (20 túi lọc)',
          salesPrice: 85000,
          imageUrl: presets.product[1].url,
          ingredients: '80% Lõi củ sen Đồng Tháp tuyển chọn, 20% lá cỏ ngọt sấy hữu cơ điều vị.',
          preservation: 'Bảo quản nơi mát mẻ sấy ráo, đậy kín nắp hộp thiếc sau mỗi lần dùng.',
          announcement: {
            docNumber: 'CB-SH-TRACUSEN-01',
            issueDate: '2022-10-15',
            expiryDate: '',
            hasExpiry: false,
            file: { id: 'l_demo_4_1', name: 'cb-tra-cu-sen-sadec.pdf', size: 1350000, type: 'application/pdf', url: '#' }
          }
        },
        {
          id: 'p_demo_2',
          name: 'Bột Lá Sen Tươi Sấy Thăng Hoa',
          packingUnit: 'Lọ thủy tinh 100g',
          salesPrice: 120000,
          imageUrl: presets.product[2].url,
          ingredients: '100% lá sen non trà mộc rửa ozone sấy thăng hoa.',
          preservation: 'Tránh nhiệt cao, đậy hũ tủ ẩm mát để giữ sắc xanh diệp lục thơm ngon.',
          announcement: {
            docNumber: 'CB-SH-BOTLASEN-02',
            issueDate: '2022-11-20',
            expiryDate: '',
            hasExpiry: false,
            file: { id: 'l_demo_4_2', name: 'cb-bot-la-sen-thang-hoa.pdf', size: 1420000, type: 'application/pdf', url: '#' }
          }
        }
      ],
      businessLicense: {
        docNumber: '1401392810',
        issueDate: '2021-05-14',
        expiryDate: '',
        hasExpiry: false,
        file: { id: 'l_demo_1', name: 'gpkd-dat-sen-hong-signed.pdf', size: 1120000, type: 'application/pdf', url: '#' }
      },
      factoryStandard: {
        docNumber: 'ISO-22000-SEN-HONG',
        issueDate: '2022-09-10',
        expiryDate: '2027-09-10',
        hasExpiry: true,
        certType: 'ISO 22000:2018 Nông trại sấy chế biến',
        file: { id: 'l_demo_2', name: 'chung-chi-vsattp-sadec.pdf', size: 1850000, type: 'application/pdf', url: '#' }
      },
      materialStandard: {
        docNumber: 'ORGANIC-PGS-31122',
        issueDate: '2023-03-12',
        expiryDate: '2026-03-12',
        hasExpiry: true,
        certType: 'ORGANIC PGS Đồng Tháp Mười',
        file: { id: 'l_demo_3', name: 'chung-nhan-organic-vung-trong.pdf', size: 980000, type: 'application/pdf', url: '#' }
      },
      productAnnouncement: {
        docNumber: 'CB-SH-TRACUSEN-01',
        issueDate: '2022-10-15',
        expiryDate: '',
        hasExpiry: false,
        file: { id: 'l_demo_4', name: 'bao-cao-test-mau-vinhlonglab.pdf', size: 1350000, type: 'application/pdf', url: '#' }
      },
      mediaProductUsage: [
        { id: 'med_u1', name: 'uong_tra_sen_chieu.jpg', size: 120000, type: 'image/jpeg', url: presets.mediaUsage[0].url }
      ],
      mediaProductionLine: [
        { id: 'med_p1', name: 'day_chuyen_nghien_sen.jpg', size: 175000, type: 'image/jpeg', url: presets.mediaLine[0].url }
      ],
      mediaTradePromotion: [
        { id: 'med_t1', name: 'trien_lam_ocop_dongthap.jpg', size: 210000, type: 'image/jpeg', url: presets.mediaTrade[0].url }
      ],
      mediaCustomerReview: [
        { id: 'med_r1', name: 'khach_trai_nghiem_viet.jpg', size: 110000, type: 'image/jpeg', url: presets.mediaReview[0].url }
      ],
      isCommitted: true,
      committerName: 'Trần Sen Vàng'
    };

    setFormData(demoData);
    setIsSavedSuccessfully(true);
    setTimeout(() => setIsSavedSuccessfully(false), 2000);
  };

  // Step Switch helpers
  const handleNext = () => {
    // Save draft on every step transition
    onSaveDraft(formData);
    setCurrentStep(prev => Math.min(prev + 1, STEP_TITLES.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleManualSaveDraft = () => {
    onSaveDraft(formData);
    setIsSavedSuccessfully(true);
    setTimeout(() => setIsSavedSuccessfully(false), 2000);
  };

  // Form Submission Validation
  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.companyName.trim()) errors.push("Thiếu tên Doanh nghiệp/Công ty.");
    if (!formData.contact.fullName.trim()) errors.push("Bạn chưa điền Tên liên hệ chủ doanh nghiệp.");
    if (!formData.contact.phoneNumber.trim()) errors.push("Thiếu số điện thoại liên hệ.");
    if (!formData.contact.email.trim()) errors.push("Thiếu email liên hệ của doanh nghiệp.");
    if (!formData.province) errors.push("Vui lòng chọn Tỉnh thành.");
    if (!formData.hqAddress.trim()) errors.push("Bắt buộc điền Địa chỉ Trụ sở chính.");
    if (formData.hqImages.length === 0) errors.push("Bắt buộc đính kèm hình ảnh thực tế của Trụ sở chính.");
    
    if (!formData.factoryAddress.trim()) errors.push("Thiếu Địa chỉ nhà máy sản xuất.");
    if (formData.factoryImages.length === 0) errors.push("Bắt buộc đính kèm hình ảnh của nhà máy sản xuất.");
    
    if (!formData.materialAddress.trim()) errors.push("Thiếu Địa chỉ vùng nguyên liệu.");
    if (formData.materialImages.length === 0) errors.push("Bắt buộc đính kèm hình ảnh vùng nguyên liệu.");

    if (!formData.companyHistory.trim() && !formData.companyHistoryFile) {
      errors.push("Cần cung cấp bảng giới thiệu lịch sử thông tin công ty và quy trình dệt/canh tác.");
    }

    if (formData.products.length === 0) {
      errors.push("Bạn phải đăng ký ít nhất một (1) sản phẩm tham gia.");
    }

    // Checking Documents (Section II) - Flexible but mandatory choice: at least one complete certification
    if (!formData.businessLicense.docNumber.trim()) errors.push("Chưa nhập số Giấy phép kinh doanh.");
    if (!formData.businessLicense.file) errors.push("Chưa đính kèm file Giấy phép kinh doanh.");

    const isFactoryAttempted = !!(formData.factoryStandard.file || formData.factoryStandard.docNumber.trim() || formData.factoryStandard.certType.trim());
    const isFactoryComplete = !!(formData.factoryStandard.file && formData.factoryStandard.docNumber.trim() && formData.factoryStandard.certType.trim());

    const isMaterialAttempted = !!(formData.materialStandard.file || formData.materialStandard.docNumber.trim() || formData.materialStandard.certType.trim());
    const isMaterialComplete = !!(formData.materialStandard.file && formData.materialStandard.docNumber.trim() && formData.materialStandard.certType.trim());

    if (!isFactoryComplete && !isMaterialComplete) {
      if (!isFactoryAttempted && !isMaterialAttempted) {
        errors.push("Yêu cầu bắt buộc: Doanh nghiệp phải hoàn tất và cung cấp ít nhất một (1) trong hai chỉ tiêu pháp lý: Tiêu chuẩn Nhà xưởng & VSATTP (2) HOẶC Tiêu chuẩn vùng trồng/sản xuất/canh tác (3).");
      } else {
        // If they attempted factory but didn't complete and didn't complete material either
        if (isFactoryAttempted && !isFactoryComplete) {
          if (!formData.factoryStandard.certType.trim()) {
            errors.push("Bạn chưa điền Loại tiêu chuẩn đạt được cho mục số (2) Tiêu chuẩn Nhà xưởng & VSATTP.");
          }
          if (!formData.factoryStandard.docNumber.trim()) {
            errors.push("Bạn chưa điền Số chứng chỉ / mã cấp phép cho mục số (2) Tiêu chuẩn Nhà xưởng & VSATTP.");
          }
          if (!formData.factoryStandard.file) {
            errors.push("Bạn chưa đính kèm file quyết định/chứng nhận cho mục số (2) Tiêu chuẩn Nhà xưởng & VSATTP.");
          }
        }
        // If they attempted material but didn't complete and didn't complete factory either
        if (isMaterialAttempted && !isMaterialComplete) {
          if (!formData.materialStandard.certType.trim()) {
            errors.push("Bạn chưa điền Loại tiêu chuẩn vùng trồng cho mục số (3) Tiêu chuẩn vùng trồng/sản xuất/canh tác.");
          }
          if (!formData.materialStandard.docNumber.trim()) {
            errors.push("Bạn chưa điền Mã vùng trồng / Số chứng thư cho mục số (3) Tiêu chuẩn vùng trồng/sản xuất/canh tác.");
          }
          if (!formData.materialStandard.file) {
            errors.push("Bạn chưa đính kèm file chứng thư/chứng nhận cho mục số (3) Tiêu chuẩn vùng trồng/sản xuất/canh tác.");
          }
        }
        // General warning because neither of them is fully complete
        errors.push("Quy chế bắt buộc: Vui lòng hoàn tất biểu mẫu đầy đủ cho ít nhất 1 trong 2 tiêu chuẩn (Nhà xưởng hoặc Vùng trồng) để hồ sơ đạt chuẩn nộp.");
      }
    } else {
      // One is complete, but what if the OTHER is attempted and incomplete?
      if (isFactoryComplete && isMaterialAttempted && !isMaterialComplete) {
        if (!formData.materialStandard.certType.trim()) {
          errors.push("Bạn đã điền thông tin vùng trồng nhưng thiếu Loại tiêu chuẩn vùng trồng ở mục số (3).");
        }
        if (!formData.materialStandard.docNumber.trim()) {
          errors.push("Bạn đã điền thông tin vùng trồng nhưng thiếu Mã vùng trồng / Số chứng thư ở mục số (3).");
        }
        if (!formData.materialStandard.file) {
          errors.push("Bạn đã điền thông tin vùng trồng nhưng chưa đính kèm tài liệu chứng nhận cho mục số (3).");
        }
      }

      if (isMaterialComplete && isFactoryAttempted && !isFactoryComplete) {
        if (!formData.factoryStandard.certType.trim()) {
          errors.push("Bạn đã điền thông tin nhà xưởng nhưng thiếu Loại tiêu chuẩn đạt được ở mục số (2).");
        }
        if (!formData.factoryStandard.docNumber.trim()) {
          errors.push("Bạn đã điền thông tin nhà xưởng nhưng thiếu Số chứng chỉ / mã cấp phép ở mục số (2).");
        }
        if (!formData.factoryStandard.file) {
          errors.push("Bạn đã điền thông tin nhà xưởng nhưng chưa đính kèm tài liệu chứng nhận cho mục số (2).");
        }
      }
    }

    // Validate each registered product's self-declaration
    if (formData.products.length === 0) {
      errors.push("Bạn phải đăng ký ít nhất một (1) sản phẩm tham gia.");
    } else {
      formData.products.forEach((prod, idx) => {
        const ann = prod.announcement;
        if (!ann || !ann.docNumber?.trim()) {
          errors.push(`Sản phẩm số ${idx + 1} ("${prod.name}"): Chưa nhập số hiệu tự công bố.`);
        }
        if (!ann || !ann.file) {
          errors.push(`Sản phẩm số ${idx + 1} ("${prod.name}"): Chưa đính kèm file Tự công bố & Kết quả test mẫu.`);
        }
      });
    }

    if (!formData.isCommitted) {
      errors.push("Bạn phải tick dấu cam kết các thông tin khai báo là hoàn toàn trung thực.");
    }
    if (!formData.committerName.trim()) {
      errors.push("Vui lòng gõ tên người đại diện ký cam kết.");
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationBanner(true);
      // Go to final step to see errors, or stay
      setCurrentStep(STEP_TITLES.length - 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } else {
      setShowValidationBanner(false);
      const finalised = {
        ...formData,
        status: ApplicationStatus.PENDING,
        updatedAt: new Date().toISOString()
      };
      onSaveAndSubmit(finalised);
    }
  };

  // Add a product logic
  const handleOpenAddProduct = () => {
    setTempProduct({
      id: 'p_temp_' + Math.random().toString(36).substr(2, 5),
      name: '',
      packingUnit: '',
      salesPrice: 0,
      imageUrl: '',
      ingredients: '',
      preservation: '',
      announcement: { docNumber: '', issueDate: '', expiryDate: '', hasExpiry: false, file: null }
    });
    setProductErrors(null);
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (!tempProduct.name?.trim()) {
      setProductErrors("Vui lòng điền tên sản phẩm.");
      return;
    }
    if (!tempProduct.packingUnit?.trim()) {
      setProductErrors("Vui lòng nhập quy cách đóng gói (ví dụ: Gói 300g, Chai 500ml).");
      return;
    }
    if (!tempProduct.salesPrice || tempProduct.salesPrice <= 0) {
      setProductErrors("Giá bán phải lớn hơn 0 VND.");
      return;
    }
    if (!tempProduct.ingredients?.trim()) {
      setProductErrors("Vui lòng điền thành phần.");
      return;
    }
    if (!tempProduct.preservation?.trim()) {
      setProductErrors("Vui lòng điền điều kiện bảo quản.");
      return;
    }

    const readyProd: ProductItem = {
      id: tempProduct.id || 'p_' + Math.random().toString(36).substr(2, 5),
      name: tempProduct.name,
      packingUnit: tempProduct.packingUnit,
      salesPrice: tempProduct.salesPrice,
      imageUrl: tempProduct.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300', // Default green photo
      ingredients: tempProduct.ingredients,
      preservation: tempProduct.preservation,
      announcement: tempProduct.announcement || { docNumber: '', issueDate: '', expiryDate: '', hasExpiry: false, file: null }
    };

    setFormData(prev => ({
      ...prev,
      products: [...prev.products, readyProd]
    }));

    setShowProductModal(false);
  };

  const handleRemoveProduct = (prodId: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== prodId)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header and Wizard tracker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5 font-display">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin-slow" />
            Hệ thống quản lý đăng ký thành viên
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-800">
            Hồ sơ dự án Phiên chợ Xanh Tử tế
          </h2>
          <p className="text-xs text-slate-500 font-sans font-light">
            Nhờ có thuật toán autosave, thông tin của bạn được lưu trữ an toàn chống mất mát dữ liệu.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="btn-autofill-demo"
            onClick={handleDemoAutofill}
            className="px-3.5 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Sử dụng dữ liệu nông canh tác sen hồng của tỉnh Đồng Tháp để test nhanh toàn diện"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Điền mẫu nhanh (Demo)
          </button>

          <button
            type="button"
            id="btn-save-draft"
            onClick={handleManualSaveDraft}
            className="px-3.5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            Lưu nháp
          </button>
        </div>
      </div>

      {/* Auto-save notification bubble */}
      <AnimatePresence>
        {isSavedSuccessfully && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl text-xs flex items-center gap-2 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Đã tự động sao lưu bản nháp thành công vào hệ thống dữ liệu cục bộ! Bạn có thể đóng tab hoặc tải lại trang bất kỳ lúc nào để điền tiếp.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Wizard Steps index indicators */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 bg-slate-100/50 p-2 rounded-2xl border border-slate-200/50">
        {STEP_TITLES.map((title, idx) => {
          const isActive = currentStep === idx;
          const isDone = currentStep > idx;
          return (
            <button
              key={idx}
              id={`step-indicator-${idx}`}
              type="button"
              onClick={() => {
                onSaveDraft(formData);
                setCurrentStep(idx);
              }}
              className={`p-3 rounded-xl transition-all cursor-pointer text-left flex flex-col space-y-0.5 ${
                isActive 
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-700/10' 
                  : isDone
                    ? 'hover:bg-emerald-50 text-emerald-700 bg-white/70 border border-emerald-100/50'
                    : 'hover:bg-slate-100/80 text-slate-500 bg-transparent'
              }`}
            >
              <span className="text-[10px] font-bold opacity-75 font-mono">BƯỚC {idx + 1}</span>
              <span className="text-xs font-semibold tracking-tight truncate w-full">
                {title.replace(/^[IVX]+\.\s*/, '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step Contents wrapper */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-150 shadow-xs">
        
        {/* STEP 0: I. THÔNG TIN CHÍNH DOANH NGHIỆP */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-emerald-600" />
              I. Thông Tin Chính Doanh Nghiệp / Cơ Sở Canh Tác
            </h3>

            {/* Doanh nghiệp & Liên hệ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên Doanh nghiệp / Hợp tác xã / Cơ sở sản xuất *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hợp tác xã Nông sản Hữu cơ Sen Hồng"
                  value={formData.companyName}
                  onChange={e => setFormData(p => ({ ...p, companyName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 transition-all font-sans text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ tên chủ doanh nghiệp/Người đại diện pháp luật *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={formData.contact.fullName}
                    onChange={e => handleUpdateContact('fullName', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 transition-all font-sans text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Chức vụ đại diện *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Giám đốc / Hợp tác chủ nhiệm"
                  value={formData.contact.position}
                  onChange={e => handleUpdateContact('position', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 transition-all font-sans text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912345678"
                  value={formData.contact.phoneNumber}
                  onChange={e => handleUpdateContact('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 transition-all font-sans text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email liên hệ *</label>
                <input
                  type="email"
                  required
                  placeholder="Ví dụ: lienhe@congty.com"
                  value={formData.contact.email}
                  onChange={e => handleUpdateContact('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 transition-all font-sans text-sm"
                />
              </div>
            </div>

            {/* Trụ sở & Tỉnh thành */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="font-serif text-base font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Vị trí Trụ sở chính & Địa bàn hoạt động
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tỉnh thành đặt trụ sở chính *</label>
                  <select
                    required
                    value={formData.province}
                    onChange={e => setFormData(p => ({ ...p, province: e.target.value }))}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white transition-all font-sans text-sm"
                  >
                    <option value="">-- Chọn Tỉnh thành --</option>
                    {VIETNAM_PROVINCES.map((prov) => (
                      <option key={prov.code} value={prov.name}>{prov.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Địa chỉ trụ sở chính chi tiết *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Số 23 Quốc Lộ 1A, Phường 4, TP. Tân An"
                    value={formData.hqAddress}
                    onChange={e => setFormData(p => ({ ...p, hqAddress: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 transition-all font-sans text-sm"
                  />
                </div>
              </div>

              {/* HQ Actual Image Attachment */}
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150">
                <FileUploader
                  id="uploader-hq-images"
                  label="Hình ảnh thực tế Trụ sở chính công ty *"
                  description="Kéo thả hoặc duyệt tìm ảnh văn phòng đại diện hoặc mặt tiền cơ sở"
                  uploadedFiles={formData.hqImages}
                  onUploadSuccess={(files) => setFormData(p => ({ ...p, hqImages: files }))}
                  onRemoveFile={(id) => setFormData(p => ({ ...p, hqImages: p.hqImages.filter(f => f.id !== id) }))}
                  presetSamples={presets.hq}
                />
              </div>
            </div>

            {/* Branch address (Optional) */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-base font-bold text-slate-800">
                  Địa chỉ chi nhánh khác (nếu có)
                </h4>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-sans">Không bắt buộc</span>
              </div>
              
              <input
                type="text"
                placeholder="Ví dụ: Cửa hàng trưng bày nông sản Quận 3, số 45 Cách Mạng Tháng Tám, Quận 3, TP.HCM"
                value={formData.branchAddress}
                onChange={e => setFormData(p => ({ ...p, branchAddress: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 transition-all font-sans text-sm"
              />

              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150">
                <FileUploader
                  id="uploader-branch-images"
                  label="Hình ảnh chi nhánh trưng bày (nếu có)"
                  description="Upload hình ảnh showroom, biển hiệu chi nhánh"
                  uploadedFiles={formData.branchImages}
                  onUploadSuccess={(files) => setFormData(p => ({ ...p, branchImages: files }))}
                  onRemoveFile={(id) => setFormData(p => ({ ...p, branchImages: p.branchImages.filter(f => f.id !== id) }))}
                  presetSamples={presets.branch}
                />
              </div>
            </div>

            {/* factory address & material uploader */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              {/* Factory Address card */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-slate-800">Địa chỉ nhà máy sản xuất / xưởng đóng gói *</h4>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Khu chế biến OCOP số 4, Xã Mỹ Xuyên, Sóc Trăng"
                  value={formData.factoryAddress}
                  onChange={e => setFormData(p => ({ ...p, factoryAddress: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 transition-all font-sans text-sm"
                />
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150">
                  <FileUploader
                    id="uploader-factory-images"
                    label="Hình ảnh thực tế nhà máy sản xuất *"
                    description="Upload ảnh khu sơ chế, khu đóng gói thành phẩm hữu cơ"
                    uploadedFiles={formData.factoryImages}
                    onUploadSuccess={(files) => setFormData(p => ({ ...p, factoryImages: files }))}
                    onRemoveFile={(id) => setFormData(p => ({ ...p, factoryImages: p.factoryImages.filter(f => f.id !== id) }))}
                    presetSamples={presets.factory}
                  />
                </div>
              </div>

              {/* Material Area address */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-slate-800">Địa chỉ vùng nguyên liệu / trang trại trồng canh tác *</h4>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Vùng trồng thanh long Mỹ Tịnh An, Chợ Gạo, Tiền Giang"
                  value={formData.materialAddress}
                  onChange={e => setFormData(p => ({ ...p, materialAddress: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 transition-all font-sans text-sm"
                />
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150">
                  <FileUploader
                    id="uploader-material-images"
                    label="Hình ảnh thực tế vùng nguyên liệu *"
                    description="Upload ảnh đồng ruộng vườn cây, hệ thống nhà lưới, nhà màng"
                    uploadedFiles={formData.materialImages}
                    onUploadSuccess={(files) => setFormData(p => ({ ...p, materialImages: files }))}
                    onRemoveFile={(id) => setFormData(p => ({ ...p, materialImages: p.materialImages.filter(f => f.id !== id) }))}
                    presetSamples={presets.material}
                  />
                </div>
              </div>
            </div>

            {/* History Description + Detail attachment */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="font-serif text-base font-bold text-slate-800">
                Lịch sử cơ sở, phương pháp sản xuất & quy trình canh tác *
              </h4>
              <p className="text-xs text-slate-500 font-sans">
                Hãy viết một đoạn văn mô tả lịch sử phát triển, quy cách kiểm định đất, quy trình canh sinh học, bón phân phân hữu cơ và thu hoạch an sinh bảo vệ thiên nhiên.
              </p>
              
              <textarea
                required
                rows={5}
                placeholder="Ví dụ: HTX chúng tôi ứng dụng nông nghiệp sinh thái tuần hoàn..."
                value={formData.companyHistory}
                onChange={e => setFormData(p => ({ ...p, companyHistory: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 transition-all font-sans text-sm resize-y"
              />

              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150">
                <FileUploader
                  id="uploader-history-doc"
                  accept=".pdf,.doc,.docx,.xlsx"
                  label="Đính kèm tài liệu thuyết minh chi tiết quy trình canh tác (nếu có)"
                  description="Kéo thả đề án canh tác chi tiết hoặc chứng nhận quy trình gieo hạt sấy khô"
                  uploadedFiles={formData.companyHistoryFile ? [formData.companyHistoryFile] : []}
                  onUploadSuccess={(files) => setFormData(p => ({ ...p, companyHistoryFile: files[0] || null }))}
                  onRemoveFile={() => setFormData(p => ({ ...p, companyHistoryFile: null }))}
                />
              </div>
            </div>

          </div>
        )}

        {/* STEP 1: REGISTERED PRODUCTS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-emerald-600" />
                Danh Sách Sản Phẩm Đăng Ký Tham Gia Phiên Chợ *
              </h3>
              
              <button
                type="button"
                id="btn-add-product-trigger"
                onClick={handleOpenAddProduct}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/10"
              >
                <Plus className="w-4 h-4" />
                Thêm sản phẩm mới
              </button>
            </div>

            <p className="text-xs text-slate-500 font-sans">
              Mỗi đơn vị đăng ký tham gia ít nhất 1 sản phẩm tử tế đáp ứng tiêu chuẩn vệ sinh, không chất bảo quản công nghiệp. Vui lòng liệt kê tên sản phẩm, bao bì, giá, thành phần, mẫu hình sản phẩm và bảo quản kỹ lưỡng.
            </p>

            {/* Inline products grid */}
            {formData.products.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3">
                <div className="p-3 bg-white rounded-full text-slate-400 border border-slate-100 shadow-xs">
                  <Boxes className="w-8 h-8" />
                </div>
                <h4 className="font-sans font-bold text-slate-700 text-sm">Chưa có sản phẩm nào đăng ký</h4>
                <p className="text-xs text-slate-400 font-sans font-light max-w-sm">
                  Click nút "Thêm sản phẩm mới" ở góc trên bên phải để kê khai sản phẩm. Điền giá, bao gói và hướng dẫn sấy mát nhé!
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 rounded-lg bg-white border border-emerald-500/30 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Thêm sản phẩm đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.products.map((prod) => (
                  <div 
                    key={prod.id} 
                    className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex gap-4 relative overflow-hidden group hover:border-emerald-200 transition-colors"
                  >
                    <img 
                      src={prod.imageUrl} 
                      alt={prod.name} 
                      className="w-20 h-20 object-cover rounded-xl border border-slate-100 flex-shrink-0 bg-slate-50"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0 space-y-1.5 font-sans">
                      <h4 className="font-bold text-sm text-slate-800 truncate" title={prod.name}>{prod.name}</h4>
                      
                      <div className="grid grid-cols-1 gap-0.5 text-xs text-slate-500">
                        <div><strong className="text-slate-600 font-medium">Bao gói:</strong> {prod.packingUnit}</div>
                        <div><strong className="text-slate-600 font-medium">Đơn giá:</strong> <span className="text-emerald-700 font-bold">{prod.salesPrice.toLocaleString()} VND</span></div>
                        <div className="truncate"><strong className="text-slate-600 font-medium">Thành phần:</strong> {prod.ingredients}</div>
                        <div className="truncate"><strong className="text-slate-600 font-medium">Bảo quản:</strong> {prod.preservation}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(prod.id)}
                      className="absolute right-3.5 top-3.5 p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 transition-colors opacity-80 hover:opacity-100 cursor-pointer"
                      title="Xóa khỏi danh sách sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CERTIFICATIONS & LEGISLATION */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              II. Hồ Sơ Doanh Nghiệp & Tiêu Chuẩn Chất Lượng
            </h3>
            
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              Trình đại lý ban quản lý thông tin các văn bản chứng chỉ. Đánh dấu hạn sử dụng chi tiết hoặc click "Không thời hạn" đối với giấy phép vĩnh viễn. Đính kèm bản gốc scan chất lượng tốt.
            </p>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200/50 rounded-2xl text-xs text-teal-950 space-y-1.5 font-sans">
              <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Lưu ý Quy chế Đăng ký hồ sơ:
              </span>
              <p className="leading-relaxed text-slate-600">
                Doanh nghiệp bắt buộc cung cấp <strong>Giấy phép Kinh doanh (1)</strong> và có thể linh hoạt chọn cung cấp <strong>1 trong 2</strong> hoặc <strong>cả 2</strong> tiêu chí pháp lý sau:
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-emerald-800/90">
                <li><strong>(2) Tiêu chuẩn Nhà xưởng & VSATTP</strong> (ISO 22000, HACCP, VSATTP...)</li>
                <li><strong>(3) Tiêu chuẩn vùng trồng/sản xuất/canh tác</strong> (VietGAP, GlobalGAP, Hữu cơ PGS, USDA...)</li>
              </ul>
              <p className="text-[10px] text-slate-400 italic">
                * Nếu Quý doanh nghiệp chọn khai báo tiêu chí nào thì cần hoàn tất đầy đủ cả thông tin Số hiệu lẫn đính kèm File minh chứng của riêng chỉ tiêu đó.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Giấy phép Kinh doanh */}
              <div className="p-5 rounded-2xl border border-slate-200 text-slate-700 space-y-4 font-sans bg-slate-50/20">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-emerald-500 text-teal-950 flex items-center justify-center font-bold text-xs">1</span>
                  <h4 className="font-bold text-sm text-slate-800">Giấy phép Đăng ký Kinh doanh *</h4>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Số Giấy phép / Mã số thuế *</label>
                    <input
                      type="text"
                      required
                      placeholder="Số GCNDKKD / Đăng kí"
                      value={formData.businessLicense.docNumber}
                      onChange={e => handleUpdateLicense('businessLicense', 'docNumber', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày cấp mảnh giấy *</label>
                    <input
                      type="date"
                      required
                      value={formData.businessLicense.issueDate}
                      onChange={e => handleUpdateLicense('businessLicense', 'issueDate', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Hạn dùng (nếu có)</label>
                    <input
                      type="date"
                      disabled={!formData.businessLicense.hasExpiry}
                      value={formData.businessLicense.expiryDate}
                      onChange={e => handleUpdateLicense('businessLicense', 'expiryDate', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!formData.businessLicense.hasExpiry}
                        onChange={e => handleUpdateLicense('businessLicense', 'hasExpiry', !e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Đăng ký kinh doanh không có thời hạn (Vĩnh viễn)</span>
                    </label>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-150">
                  <FileUploader
                    id="uploader-doc-license"
                    accept=".pdf,.jpg,.jpeg,.png"
                    label="Bản đính kèm GPKD/Mã số thuế *"
                    description="Upload file PDF hoặc ảnh chụp rõ nét"
                    uploadedFiles={formData.businessLicense.file ? [formData.businessLicense.file] : []}
                    onUploadSuccess={(files) => handleUpdateLicense('businessLicense', 'file', files[0] || null)}
                    onRemoveFile={() => handleUpdateLicense('businessLicense', 'file', null)}
                  />
                </div>
              </div>

              {/* 2. Tiêu chuẩn nhà xưởng */}
              <div className="p-5 rounded-2xl border border-slate-200 text-slate-700 space-y-4 font-sans bg-slate-50/20">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-emerald-500 text-teal-950 flex items-center justify-center font-bold text-xs">2</span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-800">Tiêu chuẩn Nhà xưởng & VSATTP</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Chọn nộp mục (2) hoặc (3), hoặc cả hai</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Loại tiêu chuẩn đạt được (nếu chọn nộp)</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: HACCP CODEX / ISO 22000 / VSATTP của Sở Y Tế"
                      value={formData.factoryStandard.certType}
                      onChange={e => handleUpdateLicense('factoryStandard', 'certType', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Số chứng chỉ / mã cấp phép (nếu chọn nộp)</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: ATTP-321/2024/Sở Y Tế"
                      value={formData.factoryStandard.docNumber}
                      onChange={e => handleUpdateLicense('factoryStandard', 'docNumber', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày cấp</label>
                    <input
                      type="date"
                      value={formData.factoryStandard.issueDate}
                      onChange={e => handleUpdateLicense('factoryStandard', 'issueDate', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày hết hạn</label>
                    <input
                      type="date"
                      value={formData.factoryStandard.expiryDate}
                      onChange={e => handleUpdateLicense('factoryStandard', 'expiryDate', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-150">
                  <FileUploader
                    id="uploader-doc-factory"
                    accept=".pdf,.jpg,.jpeg,.png"
                    label="Danh chứng HACCP/ISO/VSATTP (nếu chọn nộp)"
                    description="Upload file PDF hoặc ảnh chụp chứng chỉ ban hành"
                    uploadedFiles={formData.factoryStandard.file ? [formData.factoryStandard.file] : []}
                    onUploadSuccess={(files) => handleUpdateLicense('factoryStandard', 'file', files[0] || null)}
                    onRemoveFile={() => handleUpdateLicense('factoryStandard', 'file', null)}
                  />
                </div>
              </div>

              {/* 3. Tiêu chuẩn vùng nguyên liệu */}
              <div className="p-5 rounded-2xl border border-slate-200 text-slate-700 space-y-4 font-sans bg-slate-50/20">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-emerald-500 text-teal-950 flex items-center justify-center font-bold text-xs">3</span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-800">Tiêu chuẩn vùng trồng/sản xuất/canh tác</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Chọn nộp mục (2) hoặc (3), hoặc cả hai</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Loại tiêu chuẩn vùng trồng (nếu chọn nộp)</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: VIETGAP / GLOBAL GAP / ORGANIC PGS / USDA"
                      value={formData.materialStandard.certType}
                      onChange={e => handleUpdateLicense('materialStandard', 'certType', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Mã vùng trồng / Số chứng thư (nếu chọn nộp)</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Số hiệu chứng chỉ / Giấy chứng nhận"
                      value={formData.materialStandard.docNumber}
                      onChange={e => handleUpdateLicense('materialStandard', 'docNumber', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày chứng nhận</label>
                    <input
                      type="date"
                      value={formData.materialStandard.issueDate}
                      onChange={e => handleUpdateLicense('materialStandard', 'issueDate', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày hết hạn chứng chỉ</label>
                    <input
                      type="date"
                      value={formData.materialStandard.expiryDate}
                      onChange={e => handleUpdateLicense('materialStandard', 'expiryDate', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-150">
                  <FileUploader
                    id="uploader-doc-material"
                    accept=".pdf,.jpg,.jpeg,.png"
                    label="Tài liệu chứng nhận VietGAP / hữu cơ (nếu chọn nộp)"
                    description="Upload tài liệu scan quyết định hoặc chứng chỉ"
                    uploadedFiles={formData.materialStandard.file ? [formData.materialStandard.file] : []}
                    onUploadSuccess={(files) => handleUpdateLicense('materialStandard', 'file', files[0] || null)}
                    onRemoveFile={() => handleUpdateLicense('materialStandard', 'file', null)}
                  />
                </div>
              </div>

              {/* 4. Công bố chất lượng sản phẩm & Bảng test mẫu */}
              <div className="p-5 rounded-2xl border border-slate-200 text-slate-700 space-y-4 font-sans bg-slate-50/20 col-span-1 md:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-emerald-500 text-teal-950 flex items-center justify-center font-bold text-xs animate-pulse">4</span>
                    <h4 className="font-bold text-sm text-slate-800">Tự công bố & Kết quả test mẫu cho từng sản phẩm *</h4>
                  </div>
                  <div className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200 shadow-xs self-start">
                    Yêu cầu {formData.products.length} bộ hồ sơ công bố tương ứng
                  </div>
                </div>

                {formData.products.length === 0 ? (
                  <div className="text-center py-8 px-4 bg-amber-50/40 border border-dashed border-amber-200 rounded-2xl space-y-2">
                    <p className="text-xs text-amber-800 font-bold">Chưa có sản phẩm nào được nhập ở Bước 1!</p>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      Quy chế bắt buộc đính kèm tờ tự công bố & báo cáo kiểm thử tương ứng cho từng dòng sản phẩm. Vui lòng quay lại Bước 1 để làm danh sách sản phẩm.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formData.products.map((prod, pIdx) => {
                      const announcement = prod.announcement || { docNumber: '', issueDate: '', expiryDate: '', hasExpiry: false, file: null };
                      return (
                        <div key={prod.id} className="p-4.5 bg-white border border-slate-200 rounded-2xl space-y-4.5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                            <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 object-cover rounded-xl border border-slate-100 bg-slate-50 flex-shrink-0" referrerPolicy="no-referrer" />
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs text-slate-800 truncate">{prod.name}</h5>
                              <p className="text-[10px] text-slate-400 font-medium">Bản tự công bố & kết quả test riêng biệt *</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Số hiệu tờ tự công bố hoặc báo cáo test *</label>
                              <input
                                type="text"
                                required
                                placeholder="Ví dụ: TCB-01/DATSENHONG/2024"
                                value={announcement.docNumber}
                                onChange={e => {
                                  const updatedProducts = [...formData.products];
                                  updatedProducts[pIdx] = {
                                    ...prod,
                                    announcement: { ...announcement, docNumber: e.target.value }
                                  };
                                  setFormData(p => ({ ...p, products: updatedProducts }));
                                }}
                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-250 outline-none focus:border-emerald-500 bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Ngày lập công bố / kiểm thử *</label>
                              <input
                                type="date"
                                required
                                value={announcement.issueDate}
                                onChange={e => {
                                  const updatedProducts = [...formData.products];
                                  updatedProducts[pIdx] = {
                                    ...prod,
                                    announcement: { ...announcement, issueDate: e.target.value }
                                  };
                                  setFormData(p => ({ ...p, products: updatedProducts }));
                                }}
                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-250 outline-none focus:border-emerald-500 bg-white"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <div className="bg-slate-50/50 p-2 rounded-xl border border-dashed border-slate-200">
                                <FileUploader
                                  id={`uploader-prod-announcement-${prod.id}`}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  label={`Hồ sơ tự công bố & Kết quả test mẫu của: ${prod.name} *`}
                                  description="File PDF scan hoặc ảnh chụp đầy đủ mộc đỏ của cơ quan kiểm thử"
                                  uploadedFiles={announcement.file ? [announcement.file] : []}
                                  onUploadSuccess={(files) => {
                                    const updatedProducts = [...formData.products];
                                    updatedProducts[pIdx] = {
                                      ...prod,
                                      announcement: { ...announcement, file: files[0] || null }
                                    };
                                    setFormData(p => ({ ...p, products: updatedProducts }));
                                  }}
                                  onRemoveFile={() => {
                                    const updatedProducts = [...formData.products];
                                    updatedProducts[pIdx] = {
                                      ...prod,
                                      announcement: { ...announcement, file: null }
                                    };
                                    setFormData(p => ({ ...p, products: updatedProducts }));
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: MEDIA CHANNELS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Image className="w-5 h-5 text-emerald-600" />
              III. Hình Ảnh Truyền Thông & Minh Chứng Sản Phẩm
            </h3>
            
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              Vui lòng cung cấp tư liệu hình ảnh chân thực về cách ứng dụng nông sản vào chế biến nấu ăn, cảnh dây chuyền thiết bị xưởng cơ khí, các phiên chợ/sự kiện OCOP từng tham gia và feedback chất lượng của khách hàng.
            </p>

            <div className="space-y-6">
              
              {/* 1. Hình ảnh thực tế ứng dụng sản phẩm */}
              <div className="p-4 bg-slate-50/30 rounded-2xl border border-slate-200 font-sans">
                <FileUploader
                  id="uploader-media-usage"
                  multiple={true}
                  label="1. Hình ảnh thực tế ứng dụng sản phẩm *"
                  description="Kéo thả hoặc duyệt nhiều ảnh chế biến món ăn ngon, lát gắp dùng"
                  uploadedFiles={formData.mediaProductUsage}
                  onUploadSuccess={(files) => setFormData(p => ({ ...p, mediaProductUsage: files }))}
                  onRemoveFile={(id) => setFormData(p => ({ ...p, mediaProductUsage: p.mediaProductUsage.filter(f => f.id !== id) }))}
                  presetSamples={presets.mediaUsage}
                />
              </div>

              {/* 2. Hình ảnh dây chuyền sản xuất & quy mô công ty */}
              <div className="p-4 bg-slate-50/30 rounded-2xl border border-slate-200 font-sans">
                <FileUploader
                  id="uploader-media-line"
                  multiple={true}
                  label="2. Hình ảnh dây chuyền sản xuất & quy mô công ty *"
                  description="Upload ảnh lò sấy, hệ thống rửa bồn sục ozone, lọc máy"
                  uploadedFiles={formData.mediaProductionLine}
                  onUploadSuccess={(files) => setFormData(p => ({ ...p, mediaProductionLine: files }))}
                  onRemoveFile={(id) => setFormData(p => ({ ...p, mediaProductionLine: p.mediaProductionLine.filter(f => f.id !== id) }))}
                  presetSamples={presets.mediaLine}
                />
              </div>

              {/* 3. Hình ảnh về các chương trình xúc tiến thương mại */}
              <div className="p-4 bg-slate-50/30 rounded-2xl border border-slate-200 font-sans">
                <FileUploader
                  id="uploader-media-trade"
                  multiple={true}
                  label="3. Hình ảnh về các chương trình xúc tiến thương mại công ty đã tham gia"
                  description="Ảnh trưng bày gian hàng OCOP địa phương, ngày hội nông sản xanh"
                  uploadedFiles={formData.mediaTradePromotion}
                  onUploadSuccess={(files) => setFormData(p => ({ ...p, mediaTradePromotion: files }))}
                  onRemoveFile={(id) => setFormData(p => ({ ...p, mediaTradePromotion: p.mediaTradePromotion.filter(f => f.id !== id) }))}
                  presetSamples={presets.mediaTrade}
                />
              </div>

              {/* 4. Hình ảnh về đánh giá của khách hàng */}
              <div className="p-4 bg-slate-50/30 rounded-2xl border border-slate-200 font-sans">
                <FileUploader
                  id="uploader-media-review"
                  multiple={true}
                  label="4. Hình ảnh về đánh giá/nhận xét của khách hàng *"
                  description="Chụp màn hình feedback qua MXH, tin nhắn Zalo hoặc thư khen tặng từ người tiêu dùng"
                  uploadedFiles={formData.mediaCustomerReview}
                  onUploadSuccess={(files) => setFormData(p => ({ ...p, mediaCustomerReview: files }))}
                  onRemoveFile={(id) => setFormData(p => ({ ...p, mediaCustomerReview: p.mediaCustomerReview.filter(f => f.id !== id) }))}
                  presetSamples={presets.mediaReview}
                />
              </div>

            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION & COMMITMENT */}
        {currentStep === 4 && (
          <div className="space-y-6 font-sans">
            <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ClipboardCheck className="w-5 h-5 text-emerald-600" />
              IV. Xác Nhận Kiểm Tra & Ký Cam Kết Trực Tuyến
            </h3>

            {/* Verification checklist summary validation */}
            <div className="p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-emerald-100 space-y-3.5">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase font-display">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Kiểm định tóm lược trạng thái khai báo của bạn:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className={formData.companyName ? "text-emerald-500 font-bold" : "text-amber-500"}>
                    {formData.companyName ? "✓" : "✗"}
                  </span>
                  <span><strong>Tên Doanh nghiệp:</strong> {formData.companyName || "Chưa nhập"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={formData.contact.fullName ? "text-emerald-500 font-bold" : "text-amber-500"}>
                    {formData.contact.fullName ? "✓" : "✗"}
                  </span>
                  <span><strong>Người đại diện:</strong> {formData.contact.fullName || "Chưa nhập"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={formData.province ? "text-emerald-500 font-bold" : "text-amber-500"}>
                    {formData.province ? "✓" : "✗"}
                  </span>
                  <span><strong>Tỉnh thành hoạt động:</strong> {formData.province || "Chưa chọn"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={formData.hqImages.length > 0 ? "text-emerald-500 font-bold" : "text-amber-500"}>
                    {formData.hqImages.length > 0 ? "✓" : "✗"}
                  </span>
                  <span><strong>Hình ảnh Trụ sở:</strong> {formData.hqImages.length} ảnh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={formData.factoryAddress && formData.factoryImages.length > 0 ? "text-emerald-500 font-bold" : "text-amber-500"}>
                    {formData.factoryAddress && formData.factoryImages.length > 0 ? "✓" : "✗"}
                  </span>
                  <span><strong>Cơ sở xưởng máy:</strong> {formData.factoryImages.length} ảnh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={formData.materialAddress && formData.materialImages.length > 0 ? "text-emerald-500 font-bold" : "text-amber-500"}>
                    {formData.materialAddress && formData.materialImages.length > 0 ? "✓" : "✗"}
                  </span>
                  <span><strong>Vùng nguyên liệu:</strong> {formData.materialImages.length} ảnh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={formData.products.length > 0 ? "text-emerald-500 font-bold" : "text-amber-500"}>
                    {formData.products.length > 0 ? "✓" : "✗"}
                  </span>
                  <span><strong>Sản phẩm đăng ký:</strong> {formData.products.length} dòng sản phẩm</span>
                </div>
                 <div className="flex items-center gap-2">
                   <span className={(
                     formData.businessLicense.file && 
                     (formData.factoryStandard.file || formData.materialStandard.file) && 
                     formData.products.length > 0 && 
                     formData.products.every(p => p.announcement && p.announcement.file && p.announcement.docNumber?.trim())
                   ) ? "text-emerald-500 font-bold" : "text-amber-500"}>
                     {(
                       formData.businessLicense.file && 
                       (formData.factoryStandard.file || formData.materialStandard.file) && 
                       formData.products.length > 0 && 
                       formData.products.every(p => p.announcement && p.announcement.file && p.announcement.docNumber?.trim())
                     ) ? "✓" : "✗"}
                   </span>
                   <span><strong>Hồ sơ pháp lý gốc:</strong> Đầy đủ GPKD, Xưởng hoặc Vùng trồng & Toàn bộ Tự công bố sản phẩm</span>
                 </div>
              </div>
            </div>

            {/* Error banner block */}
            {showValidationBanner && validationErrors.length > 0 && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col gap-2 error-summary">
                <span className="text-sm font-bold text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-600" />
                  Bạn chưa thể nộp hồ sơ do một số lỗi khai báo dưới đây:
                </span>
                <ul className="text-xs text-rose-700 list-disc pl-5 space-y-1">
                  {validationErrors.map((err, errIdx) => (
                    <li key={errIdx}>{err}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-500 italic mt-1 bg-white/50 p-2 rounded-lg">
                  💡 Tips: Hãy bấm nút <strong>&quot;Điền mẫu nhanh (Demo)&quot;</strong> ở thanh công cụ phía trên để điền nhanh đầy đủ hồ sơ đạt chuẩn nhằm rút ngắn quy trình kiểm tra thử nghiệm.
                </p>
              </div>
            )}

            {/* Commitment Box */}
            <div className="p-5 border border-slate-200 rounded-2xl space-y-4 bg-emerald-50/10">
              <h4 className="font-serif font-bold text-sm text-slate-800">
                Cam Kết Của Thành Viên Dự Án:
              </h4>

              <div className="text-xs text-slate-600 leading-relaxed space-y-2 font-sans font-light">
                <p>1. Chúng tôi xin cam kết bằng cả uy tín và đạo đức của doanh nghiệp rằng toàn bộ các thông tin kê khai, tài liệu số của văn bản chứng nhận có hiệu lực pháp lý chính xác 100%.</p>
                <p>2. Cam kết toàn thể nông sản khô hay nông thực tươi đăng ký không bón bồi chất hóa học bảo quản độc hại, cam kết không chứa hóa học trừ sâu hay kim loại nặng vượt ngưỡng luật pháp qui định bảo đảm sức khỏe tuyệt hảo cho thực khách.</p>
                <p>3. Luôn sẵn sàng chuẩn bị hợp lực và nhiệt tình chào đón ban kỹ thuật/chuyên gia khảo sát của Phiên Chợ Xanh Tử Tế đáp cánh trực tiếp tại trang trại canh tác nông sản cũng như cụm cơ sở đóng gói thành phẩm sấy khô.</p>
              </div>

              <div className="pt-3 flex flex-col md:flex-row items-stretch md:items-center gap-5">
                <div className="flex-1">
                  <label className="inline-flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.isCommitted}
                      onChange={e => setFormData(p => ({ ...p, isCommitted: e.target.checked }))}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>Tôi đại diện đồng ý cam kết thực thi các nghĩa vụ trên *</span>
                  </label>
                </div>

                <div className="w-full md:w-64">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chữ ký - Gõ họ tên người đại diện ký cam kết *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={formData.committerName}
                    onChange={e => setFormData(p => ({ ...p, committerName: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Action Controls Footer */}
        <div className="flex justify-between items-center pt-5 border-t border-slate-100">
          <div>
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-800 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Quay lại bước trước
              </button>
            ) : (
              <button
                type="button"
                onClick={onBackToHome}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-800 font-semibold text-xs transition-all cursor-pointer"
              >
                Huỷ & Quay lại trang chủ
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {currentStep < STEP_TITLES.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Tiếp tục</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                id="btn-submit-registration"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs transition-all shadow-md shadow-emerald-500/15 flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4.5 h-4.5" />
                NỘP HỒ SƠ ĐĂNG KÝ
              </button>
            )}
          </div>
        </div>

      </form>

      {/* MODAL OF ADDING PRODUCT ITEMS */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-2xl relative flex flex-col"
            >
              {/* Modal header */}
              <div className="px-6 py-4.5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex justify-between items-center">
                <span className="font-serif font-bold text-base flex items-center gap-1.5">
                  <Boxes className="w-5 h-5 text-emerald-300" />
                  Khai báo chi tiết Sản phẩm đăng ký
                </span>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="text-white/80 hover:text-white rounded-full bg-slate-900/10 hover:bg-slate-900/20 p-1 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
                {productErrors && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-100 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{productErrors}</span>
                  </div>
                )}

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tên sản phẩm đăng ký *</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Mỳ tươi củ dền vàng sấy thăng hoa"
                      value={tempProduct.name}
                      onChange={e => setTempProduct(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Quy cách đóng gói *</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Gói giấy 250g / Chai thủy tinh 500ml"
                        value={tempProduct.packingUnit}
                        onChange={e => setTempProduct(p => ({ ...p, packingUnit: e.target.value }))}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Giá bán đề xuất (VND) *</label>
                      <input
                        type="number"
                        placeholder="Giá bán bán lẻ"
                        value={tempProduct.salesPrice || ''}
                        onChange={e => setTempProduct(p => ({ ...p, salesPrice: Number(e.target.value) }))}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Attachment of image preset */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Ảnh sản phẩm mẫu có sẵn cho Demo</label>
                    <div className="grid grid-cols-3 gap-2">
                      {presets.product.map((samp, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setTempProduct(p => ({ ...p, imageUrl: samp.url }))}
                          className={`p-1 border rounded-lg overflow-hidden relative cursor-pointer group ${
                            tempProduct.imageUrl === samp.url ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img src={samp.url} alt="sample" className="h-12 w-full object-cover rounded-md" referrerPolicy="no-referrer" />
                          <div className="text-[9px] text-slate-500 text-center mt-0.5 truncate">{samp.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual photo URL fallback input instead of uploading if they wish */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hoặc sử dụng ảnh liên kết URL tự chọn (Tập hợp sành điệu)</label>
                    <input
                      type="text"
                      placeholder="Nhập link hình ảnh"
                      value={tempProduct.imageUrl}
                      onChange={e => setTempProduct(p => ({ ...p, imageUrl: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Thành phần chi tiết *</label>
                    <textarea
                      rows={2}
                      placeholder="Ví dụ: 95% bột gạo lứt, 5% bột ép củ dền organic."
                      value={tempProduct.ingredients}
                      onChange={e => setTempProduct(p => ({ ...p, ingredients: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phương pháp bảo quản tối ưu *</label>
                    <textarea
                      rows={2}
                      placeholder="Ví dụ: Bảo quản nơi khô ráo thoáng tránh bay màu diệp lục"
                      value={tempProduct.preservation}
                      onChange={e => setTempProduct(p => ({ ...p, preservation: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500 bg-white resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="button"
                  id="btn-confirm-save-product"
                  onClick={handleSaveProduct}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Lưu vào danh sách
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
