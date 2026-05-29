import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventManager — Premium Event Management Platform",
  description: "Discover, book, and manage events seamlessly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
