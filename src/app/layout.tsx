import type { Metadata } from 'next';
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: 'Shwan Orthodontics',
  description: 'Professional orthodontic care in Duhok, Iraq',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}