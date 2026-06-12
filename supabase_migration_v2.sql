-- Migration v2: Kết nối React app với Supabase

-- Thêm cột cho React app
ALTER TABLE dang_ky ADD COLUMN IF NOT EXISTS ten_co_so text;
ALTER TABLE dang_ky ADD COLUMN IF NOT EXISTS data_json jsonb;

-- Cho phép anon đọc hồ sơ (Admin panel có password gate riêng trong UI)
CREATE POLICY "select_anon" ON dang_ky FOR SELECT TO anon USING (true);

-- Cho phép admin cập nhật trạng thái qua anon key
CREATE POLICY "update_anon" ON dang_ky FOR UPDATE TO anon USING (true) WITH CHECK (true);
