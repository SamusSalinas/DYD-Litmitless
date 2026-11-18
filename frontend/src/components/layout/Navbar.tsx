import { Link, useLocation } from 'react-router-dom';
import { Dices } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Personajes', to: '/characters' },
  { label: 'Homebrew', to: '/homebrew' },
  { label: 'Tirador de Dados', to: '/dice' },
];

const compendiumLinks = [
  { label: 'Hechizos', to: '/spells' },
  { label: 'Objetos y Equipamiento', to: '/equipment' },
  { label: 'Objetos Mágicos', to: '/magic-items' },
  { label: 'Clases', to: '/classes' },
  { label: 'Razas', to: '/races' },
  { label: 'Monstruos', to: '/monsters' },
  { label: 'Manuales PDF', to: '/books' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-[#19352b] text-[#fffaf0] border-b-4 border-[#bd7446] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#d9b66d] text-[#19352b] flex items-center justify-center border-2 border-[#fffaf0]/80 shadow -rotate-6 group-hover:rotate-0 transition-transform">
              <Dices className="size-5 text-[#19352b]" />
            </div>
            <div>
              <span className="text-xl font-serif font-bold tracking-tight text-[#fffaf0]">Compendio 5e</span>
              <span className="hidden sm:inline-block ml-2 text-[0.68rem] uppercase font-bold tracking-widest text-[#d9b66d] border border-[#d9b66d]/40 px-1.5 py-0.5 rounded-full">SRD 2014</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant="ghost"
                  className={`text-[#f3efe4] hover:text-[#d9b66d] hover:bg-white/10 transition-colors text-sm font-semibold ${
                    location.pathname === link.to ? 'text-[#d9b66d] bg-white/15' : ''
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`text-[#f3efe4] hover:text-[#d9b66d] hover:bg-white/10 transition-colors text-sm font-semibold ${
                    location.pathname.match(/^\/(spells|classes|races|monsters|equipment|magic-items|books)/) ? 'text-[#d9b66d] bg-white/15' : ''
                  }`}
                >
                  Compendio ▾
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#fffdf8] border-[#e7e0d1] shadow-xl text-[#26342e]">
                {compendiumLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link
                      to={link.to}
                      className="cursor-pointer text-[#26342e] hover:text-[#19352b] hover:bg-[#f3efe4] font-medium transition-colors py-2 px-3"
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
