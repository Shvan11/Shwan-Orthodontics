// src/components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center p-6 mt-12">
      <p dir="ltr" className="px-4">© {new Date().getFullYear()} Shwan Orthodontics. All rights reserved.</p>
    </footer>
  );
};

export default Footer;