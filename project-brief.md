# Project Brief — Cát Thiên Nguyên Website

Tổng hợp theo PHẦN A (Frontend) của `HƯỚNG DẪN VIBECODE WEBSITE BÁN HÀNG.docx`. Nội dung lấy trực
tiếp từ 3 tài liệu do bạn cung cấp (Offer hoàn chỉnh, Câu chuyện thương hiệu, Báo cáo chiến lược),
ảnh bao bì Hồng Nguyệt Trà, và file logo PDF — không tự bịa thông tin nghiệp vụ.

## PHẦN A — Frontend (đã dựng)

| Mục | Nội dung |
|---|---|
| Ngành hàng | Trà Đông y, tinh dầu phong thủy, dược mỹ phẩm thiên nhiên |
| Thương hiệu | Cát Thiên Nguyên — "Dược Trời Ban · Đất Khai Phúc · Sống Lành Tâm" |
| Logo | Vẽ lại bằng SVG dựa trên `logo ctn.pdf` (mặc định — cần thay file vector/PNG thật khi có) |
| Màu sắc | (v2 — cập nhật theo mood board cổ phục/cung đình) Đỏ tươi cung đình chủ đạo (#6e0e13, đậm hơn ở footer #3a060a), gold hoạ tiết (#c9a24b), nền ngà/kem cho khối nội dung (#fbf6ec) — không còn phong cách hồng pastel nhẹ nhàng ban đầu |
| Font | Be Vietnam Pro (nội dung/UI) + Lora (heading) — mặc định, font logo thật "iCiel Smoothy Sans" chưa nhúng |
| Hoạ tiết | (v2) Chim hạc bay theo đàn + vân mây nhiều lớp + hoa mẫu đơn (`CraneCloudMotif.tsx`), góc trang trí hồi văn vàng (`OrnamentCorner.tsx`), viền sóng-mây vàng giữa các section (`.imperial-wave-divider`) — vẽ lại theo phong cách cổ phục/cung đình Việt Nam bạn gửi, không sao chép trực tiếp ảnh |
| Bố cục | Tham khảo comem.vn (top bar, sticky header, hero, showcase sản phẩm dạng tab, khối uy tín, blog...), điều chỉnh theo mục đích B2B/đại lý của CTN thay vì giỏ hàng D2C |
| Cấu trúc trang chủ | Hero (Million Dollar Message) → Câu chuyện thương hiệu (rút gọn + số liệu thị trường) → Người bảo chứng (Thầy Huỳnh) → Vì sao chọn CTN (4 lớp kiểm soát nguồn gốc) → Sản phẩm (3 dòng, tab) → Đại lý & Đối tác (2 offer) → FAQ → CTA cuối trang → Footer |
| Popup đăng ký | Bắt buộc theo mục A.4 — hiện sau 3 giây, 3 trường + dropdown sản phẩm, validate, trạng thái cảm ơn + tài khoản mặc định `123456789`, không hiện lại trong cùng session (sessionStorage) |
| Sản phẩm | Đầy đủ 3 dòng từ Offer: Hồng Nguyệt Trà (chủ lực, các thông tin còn thiếu ghi "đang cập nhật"), 6 ngách trà "sắp ra mắt", 5 sản phẩm Ngọc Am (giá 440.000₫, đủ CBMP), 3 sản phẩm dòng Bạch (giá + CBMP đầy đủ) |
| Đại lý & Đối tác | MVP1 (Đại lý, bảng chiết khấu 8 mức 10–40%) và MVP2 (Đối tác độc quyền, đơn ≥50tr + mặt bằng) — đúng theo Offer |

## Ảnh/tài nguyên — mặc định, cần thay trước khi ra mắt

- Ảnh hero (Giáo sư Viện sĩ Lương Ngọc Huỳnh + sản phẩm), ảnh chân dung Thầy Huỳnh, ảnh từng sản
  phẩm: đang là **ảnh tạm** (khối placeholder rõ chữ). Ảnh bao bì Hồng Nguyệt Trà bạn đã gửi trong
  chat chưa có đường dẫn file trên máy — vui lòng lưu các ảnh đó vào
  `public/assets/products/` (hoặc gửi lại đường dẫn file) để tôi thay vào.
- Logo: đã vẽ lại gần đúng bằng SVG. Nếu có file vector (.ai/.svg) hoặc PNG nền trong suốt, gửi vào
  `public/assets/logo/` để dùng logo chính thức thay bản vẽ lại.

## Việc cần xác nhận trước khi go-live (lấy từ ghi chú trong 3 tài liệu gốc)

- Thông tin chi tiết Hồng Nguyệt Trà: thành phần, công dụng, giá, số công bố sản phẩm
- Năm thành lập Cát Thiên Nguyên (chưa có mốc thời gian cho phần "Về chúng tôi")
- Số CBMP của Ngọc Am Kim và Ngọc Am Thủy đang trùng nhau (444/25/CBMP-PT) — cần xác nhận với nhà máy
- Thống nhất 1 số hotline chính thức (đang dùng 0911 556 893 theo trang Liên hệ trong Offer)
- Chính sách đổi trả / bảo hành thật cho Đại lý và Đối tác (bản hiện tại chỉ là dự thảo)

## Thông báo & Tin tức (đã thêm)

Đã thêm 2 mục điều hướng mới, nằm giữa "Đại lý & Đối tác" và "Liên hệ":

- **Thông báo** (`/thong-bao`): kênh cập nhật chính sách/chương trình của công ty cho toàn thể đại lý, đối tác.
- **Tin tức** (`/tin-tuc`): tin về chương trình, sự kiện của công ty và đối tác.

Mỗi mục có trang danh sách (dạng thẻ, giống cách comem.vn trình bày khối "Tin tức") và trang chi
tiết riêng cho từng bài (`/thong-bao/[slug]`, `/tin-tuc/[slug]`). Đã tạo sẵn 4 bài khởi điểm, biên
soạn lại từ đúng nội dung đã xác nhận trong Offer/Báo cáo chiến lược (không bịa thông tin mới) để
bạn xem trước cách hiển thị.

Từ khi có Phần B (xem dưới), admin tự đăng/sửa/xoá bài tại `/admin/posts` — không cần sửa code nữa.
`src/lib/posts.ts` (file tĩnh cũ) đã bị xoá; nội dung 4 bài khởi điểm được nạp vào Supabase qua seed
data trong `supabase/schema.sql`.

## PHẦN B — Backend (đã code xong, còn 3 bước để chạy thật)

Đã dựng đầy đủ theo đúng mẫu bảo mật dùng cho dự án Sâm Xé trước đó (bcrypt cost 12 + JWT session
cookie HttpOnly/Secure/SameSite + RLS bật nhưng deny-all — mọi truy cập đều qua API route đã tự
verify quyền ở server, không dựa vào RLS policy):

- **Đăng ký/đăng nhập khách hàng thật**: `/api/register`, `/api/login`, `/api/logout`,
  `/api/change-password` — nối thẳng Supabase, không còn ghi file JSON tạm.
- **`/dashboard`**: khu vực thành viên — xem thông tin tài khoản, danh sách sản phẩm, bấm "Quan tâm
  mua" để tạo yêu cầu mua hàng (admin theo dõi và liên hệ xác nhận tay — **chưa có** cổng thanh
  toán/giỏ hàng, vì bạn chưa chọn phương thức thanh toán).
- **`/admin`**: xem danh sách khách đăng ký + chi tiết yêu cầu mua hàng của từng người.
- **`/admin/products`**: thêm/sửa/xoá sản phẩm — thay đổi hiện ngay trên trang chủ.
- **`/admin/posts`**: đăng/sửa/xoá Thông báo & Tin tức — thay đổi hiện ngay trên `/thong-bao`,
  `/tin-tuc`.
- Route `/dashboard`, `/change-password`, `/admin/*` được `proxy.ts` chặn — chưa đăng nhập sẽ tự
  chuyển về `/login`; vào `/admin` mà không phải role admin sẽ bị đẩy về `/dashboard`.

### 3 bước để chạy thật (bắt buộc, site đang chạy ở chế độ "chưa nối DB")

1. **Chạy schema**: mở Supabase → SQL Editor → dán toàn bộ nội dung file
   [`supabase/schema.sql`](cat-thien-nguyen-website/supabase/schema.sql) → Run. File này tạo bảng
   + bật RLS + nạp sẵn toàn bộ sản phẩm và 4 bài viết hiện có, an toàn để chạy lại nhiều lần.
2. **Điền `.env.local`**: mở file [`.env.local`](cat-thien-nguyen-website/.env.local) (đã tạo sẵn,
   không commit), điền `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY` — lấy ở Supabase → Project
   Settings → API. `JWT_SECRET` tôi đã tự sinh sẵn một chuỗi ngẫu nhiên, không cần đổi.
3. **Tạo tài khoản admin đầu tiên**: đăng ký 1 tài khoản bất kỳ qua popup trên trang (hoặc form ở
   `/login` sau khi đăng ký), sau đó vào Supabase → Table Editor → bảng `members` → sửa cột `role`
   của dòng đó từ `member` thành `admin`. Đăng nhập lại là vào được `/admin`.

Sau bước 2, khởi động lại `npm run dev` để Next.js đọc `.env.local` mới.

### Còn thiếu, cần bạn quyết định tiếp

1. Khi có người đăng ký/mua hàng mới, có muốn nhận thông báo ngay không (email/Zalo/Telegram)? Gửi
   tới đâu? (chưa code — cần chọn dịch vụ gửi email, ví dụ Resend, giống dự án Sâm Xé)
2. "Quan tâm mua" hiện chỉ tạo yêu cầu chờ admin xác nhận tay — có cần cổng thanh toán online
   (VNPay/Momo/chuyển khoản QR) không, hay giữ cách làm tay qua điện thoại/Zalo như hiện tại?
3. Có hạng thành viên trả phí cao hơn "member" thường không (VIP/đại lý...)? Nếu có, quyền lợi gì
   khác nhau — hiện tại mọi khách mua lẻ đều ngang hàng.
4. Domain đã có chưa, hay dùng domain tạm của Vercel khi deploy?

## Cách xem thử

```bash
cd cat-thien-nguyen-website
npm run dev -- -p 3001
```

Mở `http://localhost:3001`. Trước khi hoàn tất 3 bước Phần B ở trên, trang chủ/sản phẩm/tin tức vẫn
chạy được nhưng danh sách sẽ trống (site tự bắt lỗi, không sập trang) vì chưa có dữ liệu từ Supabase.
