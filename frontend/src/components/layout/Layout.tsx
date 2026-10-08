import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-zinc-950 py-6 text-center text-zinc-400">
        <p>&copy; {new Date().getFullYear()} D&D Beyond Clone</p>
      </footer>
    </div>
  );
}
