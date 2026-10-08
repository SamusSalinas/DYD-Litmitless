import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="bg-zinc-950 border-b border-[#8B0000]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold text-[#8B0000]">
            D&D Beyond
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="text-zinc-300 hover:text-white">Home</Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-zinc-300 hover:text-white">
                  Compendium
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-zinc-900 border-zinc-800">
                <DropdownMenuItem asChild>
                  <Link to="/spells" className="cursor-pointer text-zinc-100">Spells</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/classes" className="cursor-pointer text-zinc-100">Classes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/races" className="cursor-pointer text-zinc-100">Races</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/monsters" className="cursor-pointer text-zinc-100">Monsters</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/equipment" className="cursor-pointer text-zinc-100">Equipment</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/books" className="cursor-pointer text-zinc-100">My Rulebooks</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/characters">
              <Button variant="ghost" className="text-zinc-300 hover:text-white">Characters</Button>
            </Link>
            
            <Link to="/homebrew">
              <Button variant="ghost" className="text-zinc-300 hover:text-white">Homebrew</Button>
            </Link>
            
            <Link to="/dice">
              <Button variant="ghost" className="text-zinc-300 hover:text-white">Dice Roller</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
