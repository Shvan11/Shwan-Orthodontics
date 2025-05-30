import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - Supabase CMS',
  description: 'Content Management System powered by Supabase',
  robots: 'noindex, nofollow', // Prevent search engines from indexing admin pages
};

export default function AdminSupabaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}