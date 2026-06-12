/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusinessRegistration, ApplicationStatus } from './types';

export const VIETNAM_PROVINCES = [
  { code: 'LD', name: 'Lâm Đồng' },
  { code: 'BT', name: 'Bến Tre' },
  { code: 'DT', name: 'Đồng Tháp' },
  { code: 'KG', name: 'Kiên Giang' },
  { code: 'DL', name: 'Đắk Lắk' },
  { code: 'AG', name: 'An Giang' },
  { code: 'CT', name: 'Cần Thơ' },
  { code: 'HN', name: 'Hà Nội' },
  { code: 'SG', name: 'TP. Hồ Chí Minh' },
  { code: 'HP', name: 'Hải Phòng' },
  { code: 'DN', name: 'Đà Nẵng' },
  { code: 'LA', name: 'Long An' },
  { code: 'TV', name: 'Trà Vinh' },
  { code: 'ST', name: 'Sóc Trăng' },
  { code: 'QN', name: 'Quảng Nam' },
  { code: 'BD', name: 'Bình Dương' },
  { code: 'DNg', name: 'Đồng Nai' },
];

export const SEEDED_REGISTRATIONS: BusinessRegistration[] = [
  {
    id: 'reg_01',
    createdAt: '2026-06-01T08:30:00Z',
    updatedAt: '2026-06-03T14:20:00Z',
    status: ApplicationStatus.APPROVED,
    adminNotes: 'Hồ sơ đầy đủ, minh bạch. Đã thẩm định thực tế vùng trồng tại Đơn Dương đạt chuẩn hữu cơ nghiêm ngặt. Phù hợp tiêu chí Sạch - Lành - Tử tế của Phiên chợ.',
    companyName: 'Hợp tác xã Nông nghiệp Hữu cơ Thiên Sinh',
    contact: {
      fullName: 'Nguyễn Văn Sinh',
      position: 'Chủ nhiệm Hợp tác xã',
      phoneNumber: '0912345678',
      email: 'sinh.nguyen@thiensinhoffice.vn'
    },
    province: 'Lâm Đồng',
    hqAddress: '12 Lâm Viên, Phường 9, Thành phố Đà Lạt, Tỉnh Lâm Đồng',
    hqImages: [
      { id: 'img_hq_1', name: 'tru-so-co-so.jpg', size: 102400, type: 'image/jpeg', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600' }
    ],
    branchAddress: 'Chi nhánh trưng bày: 45 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    branchImages: [
      { id: 'img_br_1', name: 'showroom-hcm.jpg', size: 145000, type: 'image/jpeg', url: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=600' }
    ],
    factoryAddress: 'Nhà máy đóng gói Thiên Sinh, Đường 20, Xã Ka Đơn, Huyện Đơn Dương, Tỉnh Lâm Đồng',
    factoryImages: [
      { id: 'img_fac_1', name: 'nha-may-dong-goi.jpg', size: 210000, type: 'image/jpeg', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600' }
    ],
    materialAddress: 'Nông trại trồng trọt hữu cơ Ka Đơn, Đơn Dương, Tỉnh Lâm Đồng (quy mô 5 Hecta)',
    materialImages: [
      { id: 'img_mat_1', name: 'canh-dong-rau-organic.jpg', size: 312000, type: 'image/jpeg', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600' }
    ],
    companyHistory: 'Được thành lập từ năm 2016 bởi nhóm thạc sĩ sinh học tâm huyết với nông nghiệp sạch bền vững. Khởi đầu từ vùng đất cằn cỗi Ka Đơn, chúng tôi đã cải tạo đất trong 3 năm không hóa chất để đạt chứng nhận hữu cơ. Quy trình sản xuất khép kín: Ủ phân hữu cơ vi sinh - sử dụng thiên địch kiểm soát sâu hại - thu hoạch sáng sớm - đóng gói mát bảo quản lạnh.',
    companyHistoryFile: { id: 'file_hist_1', name: 'gioi-thieu-htx-thien-sinh-chi-tiet.docx', size: 854000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', url: '#' },
    products: [
      {
        id: 'p_01',
        name: 'Xà lách Lolo Xanh Hữu cơ Đà Lạt',
        packingUnit: 'Gói 300g (Khay giấy màng bọc tự hủy)',
        salesPrice: 28000,
        imageUrl: 'https://images.unsplash.com/photo-1556801712-74c736d3f974?auto=format&fit=crop&q=80&w=500',
        ingredients: '100% rau tươi xà lách trồng hữu cơ hữu chuẩn PGS.',
        preservation: 'Bảo quản tốt nhất ở nhiệt độ mát 5 - 8°C, dùng tươi trong 5 ngày.',
        announcement: {
          docNumber: 'CB-TXS-01/XALACH-2023',
          issueDate: '2023-02-10',
          expiryDate: '',
          hasExpiry: false,
          file: { id: 'lic_4_1', name: 'tu-cong-bo-va-tet-mau-la-xanh.pdf', size: 2100000, type: 'application/pdf', url: '#' }
        }
      },
      {
        id: 'p_02',
        name: 'Bột Cần Tây Sấy Lạnh Organic',
        packingUnit: 'Hộp thủy tinh 150g',
        salesPrice: 135000,
        imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587caaec?auto=format&fit=crop&q=80&w=500',
        ingredients: '100% cần tây hữu cơ tươi sấy thăng hoa lạnh nghiền mịn.',
        preservation: 'Nơi khô ráo thoáng mát, tránh ánh sáng trực tiếp, đóng chặt nắp sau khi mở.',
        announcement: {
          docNumber: 'CB-TXS-02/BOTCANTAY-2023',
          issueDate: '2023-02-10',
          expiryDate: '',
          hasExpiry: false,
          file: { id: 'lic_4_2', name: 'tucongbo-botcantay.pdf', size: 2100000, type: 'application/pdf', url: '#' }
        }
      }
    ],
    businessLicense: {
      docNumber: '5801323112',
      issueDate: '2016-04-12',
      expiryDate: '',
      hasExpiry: false,
      file: { id: 'lic_1', name: 'giay-phep-kinh-doanh-thiensinh.pdf', size: 1240000, type: 'application/pdf', url: '#' }
    },
    factoryStandard: {
      docNumber: 'ATTP-223/2022/LD',
      issueDate: '2022-08-20',
      expiryDate: '2027-08-20',
      hasExpiry: true,
      certType: 'ISO 22000 & Vệ sinh ATTP Bộ Y Tế',
      file: { id: 'lic_2', name: 'chung-nhan-iso-nha-xuong.pdf', size: 2150000, type: 'application/pdf', url: '#' }
    },
    materialStandard: {
      docNumber: 'PGS-ORGANIC-0902',
      issueDate: '2023-01-15',
      expiryDate: '2026-11-15',
      hasExpiry: true,
      certType: 'ORGANIC PGS VIETNAM',
      file: { id: 'lic_3', name: 'organic-pgs-thien-sinh.pdf', size: 1890000, type: 'application/pdf', url: '#' }
    },
    productAnnouncement: {
      docNumber: 'CB-TXS-01/2023',
      issueDate: '2023-02-10',
      expiryDate: '',
      hasExpiry: false,
      file: { id: 'lic_4', name: 'tu-cong-bo-va-tet-mau-la-xanh.pdf', size: 4200000, type: 'application/pdf', url: '#' }
    },
    mediaProductUsage: [
      { id: 'm_u_1', name: 'mon-salad-gia-dinh.jpg', size: 185000, type: 'image/jpg', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600' }
    ],
    mediaProductionLine: [
      { id: 'm_p_1', name: 'cong-nhan-phan-loai-rau.jpg', size: 250000, type: 'image/jpg', url: 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=600' }
    ],
    mediaTradePromotion: [
      { id: 'm_t_1', name: 'gian-hang-xanh-hoi-cho.jpg', size: 304000, type: 'image/jpg', url: 'https://images.unsplash.com/photo-1488459718957-3901b054cb25?auto=format&fit=crop&q=80&w=600' }
    ],
    mediaCustomerReview: [
      { id: 'm_c_1', name: 'khach-feedback-tin-nhan.png', size: 95000, type: 'image/png', url: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=600' }
    ],
    isCommitted: true,
    committerName: 'Nguyễn Văn Sinh'
  },
  {
    id: 'reg_02',
    createdAt: '2026-06-08T10:15:00Z',
    updatedAt: '2026-06-08T11:00:00Z',
    status: ApplicationStatus.PENDING,
    adminNotes: 'Đang xếp lịch cử chuyên gia xuống Bến Tre kiểm định nhà xưởng và lấy mẫu kiểm nghiệm đất nước.',
    companyName: 'Công ty Cổ phần Nông sản Xanh Ba Tri',
    contact: {
      fullName: 'Phạm Thị Bến',
      position: 'Giám đốc Điều hành',
      phoneNumber: '0987654321',
      email: 'ben.pham@batrigreen.vn'
    },
    province: 'Bến Tre',
    hqAddress: '312 Hùng Vương, Thị trấn Ba Tri, Tỉnh Bến Tre',
    hqImages: [
      { id: 'img_hq_2', name: 'congty-batre.jpg', size: 140000, type: 'image/jpeg', url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600' }
    ],
    branchAddress: '',
    branchImages: [],
    factoryAddress: 'Cụm công nghiệp nông nghiệp nhỏ Ba Tri, Tỉnh Bến Tre',
    factoryImages: [
      { id: 'img_fac_2', name: 'nha-may-say.png', size: 198000, type: 'image/png', url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600' }
    ],
    materialAddress: 'Vùng canh tác dừa kết hợp xen canh thảo mộc tự nhiên tại Huyện Ba Tri, Bến Tre',
    materialImages: [
      { id: 'img_mat_2', name: 'vuon-dua-organic.jpg', size: 285000, type: 'image/jpeg', url: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=600' }
    ],
    companyHistory: 'Doanh nghiệp gia đình chuyên sản xuất các dòng sản phẩm từ dừa và thảo mộc sấy mộc mạc truyền thống. Sinh ra từ đất lành quê xứ dừa Bến Tre, chúng tôi mong muốn đưa các sản phẩm gia vị thiên nhiên tử thế như muối ớt sấy dừa, dầu dừa ép lạnh chất lượng đỉnh cao đến với gia đình Việt Nam không qua hương liệu tổng hợp hay chất bảo quản phụ gia.',
    companyHistoryFile: null,
    products: [
      {
        id: 'p_03',
        name: 'Dầu Dừa Ép Lạnh Nguyên Chất',
        packingUnit: 'Chai thủy tinh vòi nhấn 250ml',
        salesPrice: 95000,
        imageUrl: 'https://images.unsplash.com/photo-1622484211148-71649987f2fa?auto=format&fit=crop&q=80&w=500',
        ingredients: '100% cơm dừa sấy nguyên chất ép lạnh ly tâm.',
        preservation: 'Tránh nhiệt độ lạnh đông làm đông đặc dầu dừa, bảo quản nơi thoáng mát.',
        announcement: {
          docNumber: 'CB-BT-DAUDUA-04',
          issueDate: '2022-04-15',
          expiryDate: '',
          hasExpiry: false,
          file: { id: 'lic_2_4_a', name: 'tucongbo-daudua.pdf', size: 2100000, type: 'application/pdf', url: '#' }
        }
      },
      {
        id: 'p_04',
        name: 'Muối sấy Tôm Tỏi dừa sấy thơm',
        packingUnit: 'Hũ thủy tinh 120g',
        salesPrice: 42000,
        imageUrl: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=500',
        ingredients: 'Muối Sa Huỳnh hạt mộc, tôm sông tự nhiên thơm ngon, tỏi Lý Sơn, dừa khô Ba Tri bào nhỏ sấy giòn.',
        preservation: 'Đậy kĩ sau khi sử dụng để tránh không khí ẩm.',
        announcement: {
          docNumber: 'CB-BT-MUOITOM-04',
          issueDate: '2022-04-15',
          expiryDate: '',
          hasExpiry: false,
          file: { id: 'lic_2_4_b', name: 'tucongbo-muoitom.pdf', size: 1050000, type: 'application/pdf', url: '#' }
        }
      }
    ],
    businessLicense: {
      docNumber: '1300958190',
      issueDate: '2019-11-20',
      expiryDate: '',
      hasExpiry: false,
      file: { id: 'lic_2_1', name: 'gpkd_batri_green.pdf', size: 980000, type: 'application/pdf', url: '#' }
    },
    factoryStandard: {
      docNumber: 'ATTP-1102/2021/BT',
      issueDate: '2021-12-01',
      expiryDate: '2025-12-01',
      hasExpiry: true,
      certType: 'HACCP chứng nhận xanh',
      file: { id: 'lic_2_2', name: 'haccp-batri-factory.pdf', size: 1450000, type: 'application/pdf', url: '#' }
    },
    materialStandard: {
      docNumber: 'GAP-772183',
      issueDate: '2022-03-10',
      expiryDate: '2025-03-10',
      hasExpiry: true,
      certType: 'VIETGAP Cây ăn quả',
      file: { id: 'lic_2_3', name: 'vietgap-garden-batri.pdf', size: 1110000, type: 'application/pdf', url: '#' }
    },
    productAnnouncement: {
      docNumber: 'CB-BT-DAUDUA-04',
      issueDate: '2022-04-15',
      expiryDate: '',
      hasExpiry: false,
      file: { id: 'lic_2_4', name: 'tucongbo-daudua.pdf', size: 2100000, type: 'application/pdf', url: '#' }
    },
    mediaProductUsage: [
      { id: 'm_u_2', name: 'gia-vi-cho-mon-an-chay.jpg', size: 180000, type: 'image/jpeg', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600' }
    ],
    mediaProductionLine: [
      { id: 'm_p_2', name: 'may-ly-tam-lanh.jpg', size: 232000, type: 'image/jpg', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600' }
    ],
    mediaTradePromotion: [],
    mediaCustomerReview: [],
    isCommitted: true,
    committerName: 'Phạm Thị Bến'
  },
  {
    id: 'reg_03',
    createdAt: '2026-06-09T15:40:00Z',
    updatedAt: '2026-06-10T09:12:00Z',
    status: ApplicationStatus.ADDITIONAL_REQUIRED,
    adminNotes: 'Hồ sơ bị thiếu đính kèm tài liệu: Bảng phân tích thành phần & kết quả kiểm nghiệm kim loại nặng/vi sinh vật gần nhất của sản phẩm Mật Ong Rừng. Vui lòng đính kèm bổ sung vào hồ sơ sản phẩm để được ban kỹ thuật thông qua.',
    companyName: 'Hợp tác xã Mật Ong Rừng Tràm U Minh Thượng',
    contact: {
      fullName: 'Trần Minh Trí',
      position: 'Phó Ban Quản lý HTX',
      phoneNumber: '0979888999',
      email: 'tribanmat@uminhcoop.com'
    },
    province: 'Kiên Giang',
    hqAddress: 'Ấp Rừng Tràm, Xã An Minh Bắc, Huyện U Minh Thượng, Kiên Giang',
    hqImages: [
      { id: 'img_hq_3', name: 'tru-so-co-op-uminh.jpg', size: 110000, type: 'image/jpeg', url: 'https://images.unsplash.com/photo-1464219222984-216ebffaaf85?auto=format&fit=crop&q=80&w=600' }
    ],
    branchAddress: '',
    branchImages: [],
    factoryAddress: 'Văn phòng Sơ chế mật ong, Khu bảo tồn rừng tràm U Minh, Tỉnh Kiên Giang',
    factoryImages: [],
    materialAddress: 'Rừng tràm U Minh Thượng dã sinh',
    materialImages: [
      { id: 'img_mat_3', name: 'lam-dong-mat-ong.jpg', size: 285000, type: 'image/jpeg', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600' }
    ],
    companyHistory: 'HTX quy tụ hơn 40 hộ gác kèo ong rừng truyền thống lâu đời tại vùng lõi U Minh Thượng. Chúng tôi nói KHÔNG với nuôi ong đường, ong di cư vùng phun xịt hóa chất độc hại. Toàn bộ mật được thu hoạch kéo tay bền vững bằng kỹ thuật thổi khói thảo mộc xua đuổi không sát sinh đàn ong, vắt nguội giữ nguyên enzyme có lợi bồi bổ sức khỏe.',
    companyHistoryFile: null,
    products: [
      {
        id: 'p_05',
        name: 'Mật Ong Rừng Tràm Thô Sạch',
        packingUnit: 'Chai thủy tinh nút bấc 500ml',
        salesPrice: 280000,
        imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=500',
        ingredients: '100% mật ong tự nhiên lấy từ tổ ong gác kèo rừng tràm hoang dã.',
        preservation: 'Tránh tủ lạnh dễ bị đóng đường. Đựng hũ thủy tinh sẫm màu đậy kín ở nơi tối mát.',
        announcement: {
          docNumber: 'MISSING',
          issueDate: '',
          expiryDate: '',
          hasExpiry: false,
          file: null
        }
      }
    ],
    businessLicense: {
      docNumber: '1701543290',
      issueDate: '2018-05-18',
      expiryDate: '',
      hasExpiry: false,
      file: { id: 'lic_3_1', name: 'gpkd_uminh_signed.pdf', size: 1450000, type: 'application/pdf', url: '#' }
    },
    factoryStandard: {
      docNumber: 'VSATTP-992/2020/KG',
      issueDate: '2020-09-12',
      expiryDate: '2023-09-12',
      hasExpiry: true, // Hết hạn ngày 2023 rồi -> Cần yêu cầu cập nhật lại chứng thư mới
      certType: 'Chứng Chỉ Vệ Sinh Cơ Sở Bộ Y Tế (Cũ)',
      file: { id: 'lic_3_2', name: 'at-thuc-pham-uminh.pdf', size: 1540000, type: 'application/pdf', url: '#' }
    },
    materialStandard: {
      docNumber: 'WILD-CERT-01',
      issueDate: '2021-02-18',
      expiryDate: '2026-02-18',
      hasExpiry: true,
      certType: 'Tiêu chuẩn khai thác rừng bền vững bản địa',
      file: null
    },
    productAnnouncement: {
      docNumber: 'MISSING',
      issueDate: '',
      expiryDate: '',
      hasExpiry: false,
      file: null
    },
    mediaProductUsage: [],
    mediaProductionLine: [],
    mediaTradePromotion: [],
    mediaCustomerReview: [],
    isCommitted: true,
    committerName: 'Trần Minh Trí'
  }
];
