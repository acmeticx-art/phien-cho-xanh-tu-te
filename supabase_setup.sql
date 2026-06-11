-- Tạo bảng lưu hồ sơ đăng ký
CREATE TABLE IF NOT EXISTS dang_ky (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  trang_thai text DEFAULT 'cho_duyet',

  -- Thông tin liên hệ
  ho_ten text,
  chuc_vu text,
  so_dien_thoai text,
  email text,
  tinh_thanh text,

  -- Địa chỉ
  tru_so_chinh jsonb,
  chi_nhanh jsonb,
  nha_may jsonb,
  vung_nguyen_lieu jsonb,

  -- Lịch sử công ty
  lich_su_cong_ty text,
  lich_su_file text,

  -- Sản phẩm
  san_pham jsonb DEFAULT '[]',

  -- Hồ sơ doanh nghiệp
  gpkd jsonb,
  tieu_chuan_nha_xuong jsonb DEFAULT '{}',
  tieu_chuan_vung_nl jsonb DEFAULT '{}',
  cong_bo_san_pham jsonb DEFAULT '[]',

  -- Truyền thông
  hinh_ung_dung text[],
  hinh_day_chuyen text[],
  hinh_xuc_tien text[],
  hinh_danh_gia text[]
);

-- Cho phép anon key INSERT (ai cũng có thể nộp hồ sơ)
ALTER TABLE dang_ky ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phep nop ho so"
  ON dang_ky FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Chi admin doc"
  ON dang_ky FOR SELECT
  TO authenticated
  USING (true);

-- Tạo storage bucket cho file đính kèm
INSERT INTO storage.buckets (id, name, public)
VALUES ('ho-so-dang-ky', 'ho-so-dang-ky', true)
ON CONFLICT DO NOTHING;

-- Cho phép anon upload file
CREATE POLICY "Cho phep upload"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'ho-so-dang-ky');

CREATE POLICY "Cho phep doc public"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'ho-so-dang-ky');
