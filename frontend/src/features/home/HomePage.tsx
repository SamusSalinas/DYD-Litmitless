import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const cards = [
  { title: "Spells", desc: "Browse and search all spells", link: "/spells", icon: "✨" },
  { title: "Classes", desc: "Discover character classes", link: "/classes", icon: "⚔️" },
  { title: "Races", desc: "Explore playable races", link: "/races", icon: "🧝" },
  { title: "Monsters", desc: "Find foes to fight", link: "/monsters", icon: "🐉" },
  { title: "Equipment", desc: "Gear up for your adventure", link: "/equipment", icon: "🛡️" },
  { title: "Rulebooks", desc: "Read your local PDF books", link: "/books", icon: "📚" },
  { title: "Characters", desc: "Manage your heroes", link: "/characters", icon: "👤" },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-16">
        <h1 className="text-5xl md:text-7xl font-serif font-bold bg-gradient-to-r from-dnd-gold via-dnd-teal to-dnd-gold bg-clip-text text-transparent animate-pulse">
          D&D Beyond
        </h1>
        <p className="text-xl text-zinc-400 max-w-md mx-auto">
          Your companion for D&D 5th Edition — explore, create, and adventure.
        </p>
        <div className="w-24 h-1 mx-auto bg-gradient-to-r from-dnd-teal to-dnd-gold rounded-full mt-4" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.title} to={card.link}>
            <Card className="bg-dnd-card border-dnd-border hover:border-dnd-teal/60 transition-all duration-300 cursor-pointer h-full group hover:shadow-[0_0_25px_rgba(49,170,169,0.12)] hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-zinc-100 group-hover:text-dnd-gold transition-colors">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{card.icon}</span>
                  {card.title}
                </CardTitle>
                <CardDescription className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {card.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
