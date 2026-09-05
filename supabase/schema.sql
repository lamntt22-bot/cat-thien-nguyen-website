-- Chạy trong Supabase SQL Editor (Project → SQL Editor → New query).
-- An toàn để chạy lại nhiều lần: dùng IF NOT EXISTS / OR REPLACE khi có thể.

-- ============ MEMBERS (khách đăng ký qua popup + tài khoản đăng nhập mua lẻ) ============
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  email text not null unique,
  password_hash text not null,
  role text not null default 'member' check (role in ('member', 'admin')),
  interested_product text,
  must_change_password boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists members_phone_idx on public.members (phone);
create index if not exists members_email_idx on public.members (lower(email));

-- ============ PRODUCTS (admin thêm/sửa/xoá; trang chủ đọc để hiển thị) ============
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null check (category in ('tra-dong-y', 'ngoc-am', 'bach')),
  name text not null,
  description text not null default '',
  price text not null default 'Đang cập nhật',
  badge text,
  cbmp text,
  image text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category, sort_order);

-- Giá dạng số, dùng để tính tiền giỏ hàng — chỉ set cho sản phẩm đã có giá bán thật.
-- Sản phẩm còn "Đang cập nhật"/"Sắp ra mắt" giữ NULL, không cho thêm vào giỏ hàng (chỉ "Quan tâm mua").
alter table public.products add column if not exists price_amount numeric;

-- Nội dung chi tiết (thành phần, công dụng, hướng dẫn sử dụng...) hiển thị ở trang chi tiết sản phẩm —
-- tách riêng khỏi "description" (mô tả ngắn hiển thị ở thẻ sản phẩm ngoài danh sách).
alter table public.products add column if not exists content_detail text;

-- Video phản hồi khách hàng (link YouTube) hiển thị ở trang chi tiết sản phẩm — admin nhập link,
-- không cần code lại. Mảng chuỗi URL, VD ["https://www.youtube.com/watch?v=..."].
alter table public.products add column if not exists feedback_videos jsonb not null default '[]'::jsonb;

-- Ẩn sản phẩm "sắp ra mắt" khỏi trang công khai mà không cần xoá — admin bật lại khi có hàng thật.
alter table public.products add column if not exists published boolean not null default true;

-- Đánh dấu sản phẩm đang có mẫu dùng thử — chỉ những sản phẩm này mới hiện trong form
-- "Đăng ký dùng thử" ở trang chủ để đối tác chọn.
alter table public.products add column if not exists trial_available boolean not null default false;

-- ============ POSTS (Thông báo / Tin tức — admin đăng, trang public đọc) ============
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null check (category in ('thong-bao', 'tin-tuc')),
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  published boolean not null default true,
  published_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_category_idx on public.posts (category, published_at desc);

-- Ảnh/video đính kèm bài viết, upload từ máy admin lên Supabase Storage (bucket "post-media").
-- Mảng các object dạng {"type": "image"|"video", "url": "https://..."}.
alter table public.posts add column if not exists media jsonb not null default '[]'::jsonb;

-- Ảnh đại diện bài viết (khung 3:4) + các trường SEO — tuỳ chọn, để trống thì dùng mặc định
-- (tiêu đề/sapo bài viết) khi tạo thẻ meta.
alter table public.posts add column if not exists image text;
alter table public.posts add column if not exists seo_title text;
alter table public.posts add column if not exists seo_description text;
alter table public.posts add column if not exists seo_keywords text;

-- ============ PAGE_SECTIONS (nội dung các trang tĩnh — admin sửa, không cần code lại) ============
-- Mỗi slug ứng với 1 khối nội dung có thể chỉnh (Về chúng tôi, Người bảo chứng, Đại lý & Đối tác...).
-- items: mảng {"title": "...", "value": "..."} dùng cho gạch đầu dòng / số liệu / bảng chiết khấu tuỳ ngữ cảnh.
create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  eyebrow text,
  heading text,
  body text,
  note text,
  image text,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- ============ ORDERS (yêu cầu mua lẻ của thành viên — admin theo dõi & xác nhận tay) ============
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  quantity int not null default 1 check (quantity > 0),
  note text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists orders_member_idx on public.orders (member_id);
create index if not exists orders_status_idx on public.orders (status);

-- ============ CHECKOUTS (mua hàng thật qua giỏ hàng — chuyển khoản / COD) ============
create table if not exists public.checkouts (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  full_name text not null,
  phone text not null,
  address text not null,
  payment_method text not null check (payment_method in ('bank_transfer', 'cod')),
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'shipping', 'completed', 'cancelled')
  ),
  total_amount numeric not null default 0,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.checkout_items (
  id uuid primary key default gen_random_uuid(),
  checkout_id uuid not null references public.checkouts(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  unit_price numeric not null,
  quantity int not null check (quantity > 0)
);

create index if not exists checkouts_member_idx on public.checkouts (member_id);
create index if not exists checkouts_status_idx on public.checkouts (status);
create index if not exists checkout_items_checkout_idx on public.checkout_items (checkout_id);

-- ============ TRIAL_REQUESTS (đối tác đăng ký sản phẩm dùng thử ở trang chủ — admin theo dõi & chăm sóc) ============
create table if not exists public.trial_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  occupation text not null,
  product_ids jsonb not null default '[]'::jsonb,
  product_names jsonb not null default '[]'::jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'done')),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists trial_requests_status_idx on public.trial_requests (status);

-- ============ RLS — bật, KHÔNG có policy cho anon/authenticated (default-deny) ============
-- Mọi truy cập đọc/viết đều đi qua API route của chính app, dùng
-- SUPABASE_SERVICE_ROLE_KEY (bỏ qua RLS) sau khi server đã tự verify quyền —
-- không dựa vào RLS policy để phân quyền, tránh bug policy phức tạp.
alter table public.members enable row level security;
alter table public.products enable row level security;
alter table public.posts enable row level security;
alter table public.orders enable row level security;
alter table public.checkouts enable row level security;
alter table public.checkout_items enable row level security;
alter table public.page_sections enable row level security;
alter table public.trial_requests enable row level security;

-- ============ SEED DATA — nội dung hiện có trên site, để trang không trống sau khi chạy schema ============
-- An toàn để chạy lại: on conflict (slug) do nothing.

insert into public.products (slug, category, name, description, price, badge, cbmp, image, sort_order) values
('hong-nguyet-tra', 'tra-dong-y', 'Hồng Nguyệt Trà', 'Sản phẩm đầu tiên trong dòng Trà Đông Y chủ đạo — bài trà túi lọc tiện dụng, hộp 50g (10 gói x 5g). Thành phần, công dụng chi tiết và giá bán đang được hoàn thiện.', 'Đang cập nhật', 'Sản phẩm chủ lực', null, '/assets/products/hồng nguyệt trà.jpg', 0),
('duong-sinh-cao-tuoi', 'tra-dong-y', 'Dưỡng sinh người cao tuổi', 'Bồi bổ khí huyết, hỗ trợ tim mạch và xương khớp.', 'Sắp ra mắt', 'Sắp ra mắt', null, null, 1),
('an-than-mat-ngu', 'tra-dong-y', 'An thần / mất ngủ', 'An thần, hỗ trợ cải thiện giấc ngủ.', 'Sắp ra mắt', 'Sắp ra mắt', null, null, 2),
('ho-tro-tieu-duong-huyet-ap', 'tra-dong-y', 'Hỗ trợ tiểu đường / huyết áp', 'Đặc trị các vấn đề chuyển hóa.', 'Sắp ra mắt', 'Sắp ra mắt', null, null, 3),
('giai-doc-van-phong', 'tra-dong-y', 'Giải độc văn phòng', 'Giải gió, thanh lọc, chống stress cho dân văn phòng.', 'Sắp ra mắt', 'Sắp ra mắt', null, null, 4),
('tien-man-kinh', 'tra-dong-y', 'Phụ nữ tiền mãn kinh', 'Chăm sóc sắc đẹp và sức khỏe nữ tính.', 'Sắp ra mắt', 'Sắp ra mắt', null, null, 5),
('qua-bieu-tet', 'tra-dong-y', 'Quà biếu Tết doanh nghiệp', 'Set quà cao cấp từ các bài trà chủ lực.', 'Sắp ra mắt', 'Sắp ra mắt', null, null, 6),
('ngoc-am-kim', 'ngoc-am', 'Ngọc Am Bạch Nguyệt Kim', 'Dầu hạnh nhân, Jojoba, Dừa, Khuynh diệp, Bách, Bạc hà, Cam bergamot, Trầm hương — dưỡng ẩm, làm mềm da, hỗ trợ massage thư giãn.', '440.000₫', null, '444/25/CBMP-PT', '/assets/products/ngọc am bạch nguyệt kim.png', 0),
('ngoc-am-moc', 'ngoc-am', 'Ngọc Am Lục Hoa Mộc', 'Dầu hạnh nhân, Jojoba, Dừa, Bách, Sả chanh, Gừng, Hoa hồng, Đàn hương — dưỡng ẩm, mịn da, hỗ trợ massage xoa bóp.', '440.000₫', null, '442/25/CBMP-PT', '/assets/products/ngọc am lục hoa mộc.png', 1),
('ngoc-am-thuy', 'ngoc-am', 'Ngọc Am Huyền Thủy', 'Dầu hạnh nhân, Jojoba, Dừa, Bách, Cam, Oải hương, Cúc La Mã, Trầm hương — dưỡng ẩm, mềm mại, thư giãn khi massage.', '440.000₫', null, '444/25/CBMP-PT', '/assets/products/tinh dầu ngọc am huyền thuỷ.png', 2),
('ngoc-am-hoa', 'ngoc-am', 'Ngọc Am Hồng Viêm Hỏa', 'Dầu hạnh nhân, Jojoba, Dừa, Quế, Bách, Cam bergamot, Gừng, Hoa hồng — dưỡng ẩm, làm mềm da, hỗ trợ massage xoa bóp.', '440.000₫', null, '440/25/CBMP-PT', '/assets/products/ngọc am hồng viêm hoả.png', 3),
('ngoc-am-tho', 'ngoc-am', 'Ngọc Am Hoàng Long Thổ', 'Dầu hạnh nhân, Jojoba, Dừa, Bách, Gừng, Đàn hương, Ngải cứu, Thông — dưỡng ẩm, làm mềm da, thư giãn khi massage.', '440.000₫', null, '443/25/CBMP-PT', '/assets/products/ngọc am hoàng long thổ.png', 4),
('kem-bach-nhat', 'bach', 'Kem Bạch Nhật', 'Kem chống nắng / kem nền ban ngày, nâng tông, thay thế BB cream. Titanium Dioxide, Zinc Oxide, Bisabolol.', '499.000₫', null, '367/25/CBMP-PT', '/assets/products/kem bạch nhật.png', 0),
('sua-rua-mat-bach-linh', 'bach', 'Sữa rửa mặt Bạch Linh', 'Làm sạch da hằng ngày, giữ ẩm nhẹ. Nấm linh chi (Ganoderma Lucidum), Nhân sâm (Panax Ginseng), Panthenol.', '330.000₫', null, '366/25/CBMP-PT', '/assets/products/sữa rửa mặt bạch linh.png', 1),
('dung-dich-ve-sinh-bach-trau', 'bach', 'Dung dịch vệ sinh Bạch Trầu', 'Vệ sinh phụ nữ dịu nhẹ, giữ thông thoáng. Lá trầu không, Cam thảo, chiết xuất Hoa hồng, Neem.', '290.000₫', null, '368/25/CBMP-PT', '/assets/products/dung dịch vệ sinh bạch trầu.png', 2)
on conflict (slug) do nothing;

-- Backfill giá dạng số cho các sản phẩm đã có giá bán thật (để tính giỏ hàng) —
-- an toàn để chạy lại, chỉ set theo đúng giá hiển thị đã có ở trên.
update public.products set price_amount = 440000 where slug in ('ngoc-am-kim', 'ngoc-am-moc', 'ngoc-am-thuy', 'ngoc-am-hoa', 'ngoc-am-tho') and price_amount is null;
update public.products set price_amount = 499000 where slug = 'kem-bach-nhat' and price_amount is null;
update public.products set price_amount = 330000 where slug = 'sua-rua-mat-bach-linh' and price_amount is null;
update public.products set price_amount = 290000 where slug = 'dung-dich-ve-sinh-bach-trau' and price_amount is null;

-- Mặc định bật "có mẫu dùng thử" cho các sản phẩm đã ra mắt thật (không phải "sắp ra mắt") —
-- admin vào từng sản phẩm trong trang quản trị để tắt/bật lại cho đúng thực tế tồn kho mẫu.
update public.products set trial_available = true where published = true and price != 'Sắp ra mắt';

insert into public.posts (slug, category, title, excerpt, content, published_at) values
('ra-mat-chuong-trinh-dai-ly-doi-tac', 'thong-bao', 'Ra mắt Chương trình Đại lý & Đối tác Cát Thiên Nguyên',
 'Hai hình thức hợp tác dành cho đối tác: Đại lý (rào cản thấp, chiết khấu 10–40%) và Đối tác độc quyền khu vực.',
 'Cát Thiên Nguyên chính thức mở Chương trình Đại lý & Đối tác, dành cho những ai muốn kinh doanh trà Đông y, dược liệu mà không cần đánh cược uy tín vào nguồn hàng trôi nổi.

Đại lý: chỉ cần một đơn hàng từ 3 sản phẩm bất kỳ để bắt đầu, chiết khấu tăng dần theo doanh số nhập hàng mỗi tháng — từ 10% ở mức khởi điểm đến 40% ở mức doanh số 1 tỷ đồng/tháng.

Đối tác độc quyền: dành cho nhà đầu tư muốn sở hữu một điểm bán trà Đông y độc quyền tại khu vực của mình, với đơn hàng đầu tiên từ 50.000.000₫ và mở điểm bán vật lý đúng chuẩn nhận diện thương hiệu.

Cả hai hình thức đều được cung cấp sản phẩm đóng gói sẵn, đầy đủ hình ảnh, nội dung và giấy tờ chứng nhận để đăng bán ngay. Xem chi tiết tại mục "Đại lý & Đối tác" trên trang chủ.',
 '2026-08-11'),
('chuoi-kiem-soat-nguon-goc-4-lop', 'thong-bao', 'Chuỗi Kiểm Soát Nguồn Gốc 4 Lớp — cam kết minh bạch của Cát Thiên Nguyên',
 'Cát Thiên Nguyên công khai quy trình kiểm soát chất lượng dược liệu từ chọn nguyên liệu đến đóng gói.',
 'Thị trường trà và dược liệu Đông y hiện chưa có đơn vị nào làm chuẩn hóa bài bản. Người tiêu dùng tự mua dược liệu rời ngoài chợ dễ gặp hàng bã dược liệu, hàng nấm mốc, hóa chất chống mốc và không có giấy tờ truy vết nguồn gốc.

Để giải quyết vấn đề này, Cát Thiên Nguyên xây dựng Chuỗi Kiểm Soát Nguồn Gốc 4 Lớp: Giáo sư Viện sĩ Lương Ngọc Huỳnh trực tiếp chọn nguyên liệu; sản xuất tại nhà máy có kiểm soát chất lượng, không qua trung gian chợ dược liệu trôi nổi; đầy đủ giấy tờ công bố sản phẩm và chứng nhận nguồn gốc; đóng gói sẵn theo liều dùng chuẩn.

Đây là cam kết minh bạch xuyên suốt mọi dòng sản phẩm của Cát Thiên Nguyên, từ trà Đông y đến tinh dầu phong thủy và dược mỹ phẩm thiên nhiên.',
 '2026-08-05'),
('hong-nguyet-tra-mo-dau-dong-tra-dong-y', 'tin-tuc', 'Hồng Nguyệt Trà — sản phẩm mở đầu dòng Trà Đông Y',
 'Hồng Nguyệt Trà chính thức là sản phẩm đầu tiên trong dòng Trà Đông Y chủ đạo của Cát Thiên Nguyên.',
 'Hồng Nguyệt Trà là sản phẩm đầu tiên trong dòng Trà Đông Y chủ đạo của Cát Thiên Nguyên — bài trà túi lọc tiện dụng, đóng hộp 50g gồm 10 gói x 5g, mang hoạ tiết chim hạc và vân mây đặc trưng của thương hiệu.

Các dòng trà tiếp theo sẽ ra mắt dần theo 6 ngách ưu tiên: dưỡng sinh người cao tuổi, an thần/mất ngủ, hỗ trợ tiểu đường/huyết áp, giải độc văn phòng, phụ nữ tiền mãn kinh, và quà biếu Tết doanh nghiệp — mỗi dòng gắn với một bài thuốc riêng của Giáo sư Viện sĩ Lương Ngọc Huỳnh.

Thông tin chi tiết về thành phần, công dụng và giá bán của Hồng Nguyệt Trà sẽ được cập nhật khi hoàn tất hồ sơ công bố sản phẩm. Đăng ký quan tâm ngay trên trang chủ để nhận thông báo sớm nhất.',
 '2026-08-10'),
('chien-luoc-da-nganh-duoc-lieu-dong-y', 'tin-tuc', 'Cát Thiên Nguyên công bố định hướng chiến lược đa ngách dược liệu Đông y',
 'Chiến lược tập trung vào 6 ngách ưu tiên dưới một thương hiệu mẹ, lấy niềm tin và minh bạch làm trục định vị chung.',
 'Cát Thiên Nguyên sở hữu ba lợi thế cùng lúc: chuyên môn Đông y thật từ Giáo sư Viện sĩ Lương Ngọc Huỳnh, năng lực sản xuất thật tại nhà máy đạt chuẩn, và nền tảng kinh doanh/marketing sẵn có.

Thay vì chọn một ngách để dồn lực, chiến lược của công ty là triển khai đa ngách song song dưới một thương hiệu mẹ — mỗi ngách có dòng sản phẩm riêng, bao bì riêng, nhưng cùng dẫn về một câu chuyện thương hiệu và một hệ thống chứng nhận/pháp lý.

Hai ngách được chọn triển khai thí điểm đầu tiên là Dưỡng sinh người cao tuổi và Giải độc văn phòng, trước khi mở rộng sang các ngách còn lại theo lộ trình 90 ngày.',
 '2026-08-11')
on conflict (slug) do nothing;

insert into public.page_sections (slug, eyebrow, heading, body, note, image, items) values
(
  've-chung-toi',
  'Câu chuyện thương hiệu',
  'Sức khỏe người Việt đang bị bào mòn mỗi ngày — không phải vì thiếu thuốc, mà vì thừa thuốc',
  'Việt Nam sở hữu nguồn dược liệu quý bậc nhất thế giới — nhưng đang dần mai một trước làn sóng lạm dụng thuốc Tây. Cát Thiên Nguyên ra đời để đưa dược liệu quý cấp 1 của Việt Nam trở lại đời sống hiện đại, xây dựng thói quen chăm sóc sức khỏe chủ động, cải thiện từ gốc rễ một cách nhẹ nhàng nhất — không thay thế y học hiện đại.',
  'Số liệu thị trường tổng hợp, dùng để minh họa nhu cầu chung — không phải cam kết điều trị cho sản phẩm cụ thể.',
  '/assets/products/dược liệu pro.png',
  '[
    {"value": "7 triệu+", "title": "người Việt mắc tiểu đường (60% chưa được chẩn đoán)"},
    {"value": "12 triệu+", "title": "người mắc tăng huyết áp"},
    {"value": "13 triệu", "title": "phụ nữ đang ở giai đoạn tiền mãn kinh"},
    {"value": "42%", "title": "người đi làm thường xuyên căng thẳng, mất ngủ"}
  ]'::jsonb
),
(
  'nguoi-bao-chung',
  'Người bảo chứng chuyên môn',
  'Giáo sư Viện sĩ Lương Ngọc Huỳnh',
  'Các dòng trà Đông y của Cát Thiên Nguyên được phát triển độc quyền dựa trên bài thuốc và công thức của Giáo sư Viện sĩ Lương Ngọc Huỳnh — thương hiệu không chỉ bán trà, mà bán một hệ thống tri thức Đông y có người thật, danh tiếng thật đứng sau.',
  null,
  '/assets/products/ảnh thầy Huỳnh.jpg',
  '[
    {"title": "Người đứng sau công thức của mọi dòng trà Đông y Cát Thiên Nguyên"},
    {"title": "Người sáng lập võ phái Lâm Sơn Động — nắm giữ 2/3 số kỷ lục võ thuật tại Việt Nam"},
    {"title": "Bậc thầy khí công và kỳ kinh bát mạch, xuất thân từ gia đình nhiều đời làm Đông y"},
    {"title": "Từng khám chữa bệnh Đông y cho nhiều chính khách, doanh nhân hàng đầu Việt Nam và thế giới"},
    {"title": "Bậc thầy phong thủy hàng đầu Việt Nam"}
  ]'::jsonb
),
(
  'dai-ly-doi-tac',
  'Kênh kinh doanh cùng Cát Thiên Nguyên',
  'Chương trình Đại lý & Đối tác',
  null, null, null, '[]'::jsonb
),
(
  'dai-ly-doi-tac-dai-ly',
  'Rào cản thấp',
  'Đại lý Cát Thiên Nguyên',
  'Dành cho ai muốn có thêm nguồn thu từ kinh doanh sức khỏe — không cần vốn lớn, không cần mặt bằng. Chỉ cần một đơn hàng từ 3 sản phẩm để bắt đầu.',
  'Sản phẩm đã đóng gói sẵn, có đầy đủ hình ảnh, nội dung, giấy tờ để đăng bán ngay.',
  null,
  '[
    {"title": "Đơn từ 3 sản phẩm bất kỳ", "value": "10%"},
    {"title": "Từ 5.000.000₫", "value": "15%"},
    {"title": "Từ 15.000.000₫", "value": "20%"},
    {"title": "Từ 30.000.000₫", "value": "25%"},
    {"title": "Từ 100.000.000₫", "value": "30%"},
    {"title": "Từ 300.000.000₫", "value": "34%"},
    {"title": "Từ 500.000.000₫", "value": "37%"},
    {"title": "Từ 1.000.000.000₫", "value": "40%"}
  ]'::jsonb
),
(
  'dai-ly-doi-tac-doi-tac',
  'Độc quyền khu vực',
  'Đối tác độc quyền Cát Thiên Nguyên',
  'Dành cho nhà đầu tư/chủ kinh doanh muốn sở hữu một điểm bán trà Đông y độc quyền tại khu vực của mình — dòng sản phẩm chủ lực chỉ có tại điểm bán của bạn.',
  'Mỗi khu vực/thành phố chỉ có một Đối tác độc quyền.',
  null,
  '[
    {"title": "Điều kiện gia nhập", "value": "Đơn đầu tiên ≥ 50.000.000₫ + mở điểm bán vật lý"},
    {"title": "Chiết khấu", "value": "Ưu đãi riêng, cao hơn Đại lý thường"},
    {"title": "Hỗ trợ triển khai", "value": "Bộ hồ sơ concept, bảng hiệu chuẩn"}
  ]'::jsonb
),
(
  'hanh-trinh-cua-chung-toi',
  'Hành trình của chúng tôi',
  'Những thước phim từ Cát Thiên Nguyên',
  null, null, null,
  '[
    {"value": "https://www.youtube.com/watch?v=FMz0bPr-Ca4&list=PL19GifvfBe2Dgg435cfsk2ozwwEezCMNA"},
    {"value": "https://www.youtube.com/watch?v=S01mW8pmzxw&list=PL19GifvfBe2D11y5Il3DeSBhb3IDJjSJu"},
    {"value": "https://www.youtube.com/watch?v=HkymPhqJsFk&list=PL19GifvfBe2AGD7sganqg1Py-Ug3Or4yO&index=5"}
  ]'::jsonb
)
on conflict (slug) do nothing;
