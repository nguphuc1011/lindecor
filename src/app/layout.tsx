import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinDecor | Chuyên gia Trang trí Tiệc",
  description: "Biến mọi khoảnh khắc trở nên đặc biệt với dịch vụ thiết kế và trang trí tiệc chuyên nghiệp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
