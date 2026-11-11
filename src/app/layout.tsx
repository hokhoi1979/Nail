import type { Metadata } from "next";
import "./globals.css";
import Providers from "./provider/providers";

export const metadata: Metadata = {
  title: "Tuệ Tuệ Beauty | Nail & Gội đầu thư giãn",
  description:
    "Không gian chăm sóc sắc đẹp tinh tế với dịch vụ nail và gội đầu dưỡng sinh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
