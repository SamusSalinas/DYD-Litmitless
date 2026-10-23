import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Characters', to: '/characters' },
  { label: 'Homebrew', to: '/homebrew' },
  { label: 'Dice Roller', to: '/dice' },
];

const compendiumLinks = [
  { label: 'Spells', to: '/spells' },
  { label: 'Classes', to: '/classes' },
  { label: 'Races', to: '/races' },
  { label: 'Monsters', to: '/monsters' },
  { label: 'Equipment', to: '/equipment' },
  { label: 'My Rulebooks', to: '/books' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-dnd-surface/80 backdrop-blur-md border-b border-dnd-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">⚔️</span>
            <span className="text-2xl font-serif font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-500">D&amp;D Beyond</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant="ghost"
                  className={`text-zinc-300 hover:text-dnd-gold hover:bg-dnd-teal/10 transition-colors ${
                    location.pathname === link.to ? 'text-dnd-gold bg-dnd-teal/5' : ''
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
                  className={`text-zinc-300 hover:text-dnd-gold hover:bg-dnd-teal/10 transition-colors ${
                    location.pathname.match(/^\/(spells|classes|races|monsters|equipment|books)/) ? 'text-dnd-gold bg-dnd-teal/5' : ''
                  }`}
                >
                  Compendium
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-dnd-surface border-dnd-border backdrop-blur-md">
                {compendiumLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link
                      to={link.to}
                      className="cursor-pointer text-zinc-100 hover:text-dnd-gold hover:bg-dnd-teal/10 transition-colors"
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
