/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ApplicationStatus {
  DRAFT = 'DRAFT',           // Bản nháp
  PENDING = 'PENDING',       // Chờ duyệt
  REVIEWING = 'REVIEWING',   // Đang thẩm định
  APPROVED = 'APPROVED',     // Đã duyệt thành viên
  REJECTED = 'REJECTED',     // Không đạt yêu cầu
  ADDITIONAL_REQUIRED = 'ADDITIONAL_REQUIRED' // Yêu cầu bổ sung hồ sơ
}

export interface ContactInfo {
  fullName: string;      // Tên họ
  position: string;      // Chức vụ
  phoneNumber: string;   // Số điện thoại
  email: string;         // Email liên hệ
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number; // in bytes
  type: string; // mime-type
  url: string;  // data URL or mock path
}

export interface ProductItem {
  id: string;
  name: string;        // Tên sản phẩm
  packingUnit: string; // Đơn vị đóng gói
  salesPrice: number;  // Giá bán (VND)
  imageUrl: string;    // Hình ảnh sản phẩm
  ingredients: string; // Thành phần
  preservation: string; // Phương pháp bảo quản
  announcement?: DocumentRecord; // Tự công bố và kết quả test mẫu của riêng sản phẩm này
}

export interface DocumentRecord {
  docNumber: string;    // Số giấy phép / quyết định
  issueDate: string;    // Ngày cấp
  expiryDate: string;   // Ngày hết hạn
  hasExpiry: boolean;   // Có thời hạn không
  certType?: string;    // Loại tiêu chuẩn (vd: HACCP, ISO...)
  file: UploadedFile | null; // File đính kèm
}

export interface BusinessRegistration {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ApplicationStatus;
  adminNotes?: string;   // Ý kiến đánh giá của Admin

  // I. THÔNG TIN CHÍNH DOANH NGHIỆP
  companyName: string;                     // Tên Doanh nghiệp
  contact: ContactInfo;                    // 1. Thông tin liên hệ chủ/người chịu trách nhiệm
  province: string;                        // 2. Tỉnh thành đặt trụ sở
  hqAddress: string;                       // 3. Địa chỉ trụ sở chính
  hqImages: UploadedFile[];                // Hình ảnh trụ sở chính
  branchAddress?: string;                  // 4. Địa chỉ chi nhánh
  branchImages: UploadedFile[];            // Hình ảnh chi nhánh
  factoryAddress: string;                  // 5. Địa chỉ nhà máy sản xuất
  factoryImages: UploadedFile[];           // Hình ảnh nhà máy
  materialAddress: string;                 // 6. Địa chỉ vùng nguyên liệu
  materialImages: UploadedFile[];          // Hình ảnh vùng nguyên liệu
  companyHistory: string;                  // 7. Giới thiệu lịch sử & quy trình canh tác
  companyHistoryFile: UploadedFile | null; // Bảng mô tả đính kèm chi tiết
  products: ProductItem[];                 // 8. Danh sách sản phẩm đăng ký tham gia

  // II. HỒ SƠ DOANH NGHIỆP
  businessLicense: DocumentRecord;         // 1. Giấy phép Kinh doanh
  factoryStandard: DocumentRecord;         // 2. Tiêu chuẩn nhà xưởng
  materialStandard: DocumentRecord;        // 3. Tiêu chuẩn vùng nguyên liệu
  productAnnouncement: DocumentRecord;     // 4. Công bố sản phẩm & Bảng test sản phẩm

  // III. TRUYỀN THÔNG
  mediaProductUsage: UploadedFile[];       // 1. Hình ảnh thực tế ứng dụng sản phẩm
  mediaProductionLine: UploadedFile[];     // 2. Hình ảnh dây chuyền sản xuất & quy mô
  mediaTradePromotion: UploadedFile[];     // 3. Hình ảnh các chương trình xúc tiến thương mại đã tham gia
  mediaCustomerReview: UploadedFile[];     // 4. Hình ảnh đánh giá của khách hàng

  // IV. CAM KẾT
  isCommitted: boolean;                    // Cam kết thông tin trung thực, sản phẩm sạch
  committerName: string;                   // Người đại diện kí tên cam kết
}

export interface Province {
  code: string;
  name: string;
}

export interface AppConfig {
  heroTagline: string;
  heroHeadingPrefix: string;
  heroHeadingTitle: string;
  heroDescription: string;
}

