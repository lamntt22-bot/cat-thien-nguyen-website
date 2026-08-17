import type { Metadata } from "next";
import { Be_Vietnam_Pro, Lora } from "next/font/google";
import "./globals.css";
import { LeadCaptureProvider } from "@/components/LeadCaptureContext";
import { CartProvider } from "@/components/CartContext";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listProducts, type ProductRecord } from "@/lib/product-store";
import { getCurrentMember } from "@/lib/session";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
});

// Trang public (/, /thong-bao, /tin-tuc...) không dùng cookies() nên Next sẽ tự
// prerender tĩnh lúc build — nghĩa là admin sửa sản phẩm/bài viết/giá sau khi đã
// deploy sẽ KHÔNG hiện trên trang cho tới lần deploy kế tiếp. Ép render động mỗi
// request để thay đổi từ /admin hiện ngay, đúng như đã ghi trong project-brief.
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Cát Thiên Nguyên — Dược Trời Ban, Đất Khai Phúc, Sống Lành Tâm",
  description:
    "Cát Thiên Nguyên — trà Đông y, tinh dầu phong thủy Ngọc Am và dược mỹ phẩm thiên nhiên, phát triển độc quyền theo công thức của Giáo sư Viện sĩ Lương Ngọc Huỳnh.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Nếu Supabase chưa cấu hình xong (thiếu env / chưa chạy schema.sql), popup
  // đăng ký vẫn hiển thị được, chỉ dropdown sản phẩm sẽ tạm trống thay vì sập trang.
  let products: ProductRecord[] = [];
  try {
    products = await listProducts();
  } catch (err) {
    console.error("[layout] failed to load products", err);
  }

  const member = await getCurrentMember().catch(() => null);

  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${lora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream-100 text-ink-900 font-sans">
        <CartProvider>
          <LeadCaptureProvider products={products}>
            <TopBar />
            <Header member={member ? { name: member.name } : null} />
            {children}
            <Footer />
          </LeadCaptureProvider>
        </CartProvider>
      </body>
    </html>
  );
}
