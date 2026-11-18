import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen text-[#26342e] flex flex-col selection:bg-[#bd7446]/20 selection:text-[#19352b]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <Outlet />
      </main>
      <footer className="bg-[#fffdf8] border-t border-[#e7e0d1] py-6 text-center text-[#68756c] font-serif text-sm">
        <p>&copy; {new Date().getFullYear()} Compendio D&amp;D 5e &mdash; Compatible con SRD 5.1 (CC-BY-4.0)</p>
      </footer>
    </div>
  );
}
