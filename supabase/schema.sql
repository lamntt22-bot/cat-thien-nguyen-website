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

-- ============ RLS — bật, KHÔNG có policy cho anon/authenticated (default-deny) ============
-- Mọi truy cập đọc/viết đều đi qua API route của chính app, dùng
-- SUPABASE_SERVICE_ROLE_KEY (bỏ qua RLS) sau khi server đã tự verify quyền —
-- không dựa vào RLS policy để phân quyền, tránh bug policy phức tạp.
alter table public.members enable row level security;
alter table public.products enable row level security;
alter table public.posts enable row level security;
alter table public.orders enable row level security;

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
