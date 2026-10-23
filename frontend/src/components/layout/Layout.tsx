import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-dnd-bg text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-dnd-surface border-t border-dnd-border py-6 text-center text-zinc-500">
        <p className="text-sm">&copy; {new Date().getFullYear()} D&D Beyond Clone &mdash; Built with ⚔️</p>
      </footer>
    </div>
  );
}
