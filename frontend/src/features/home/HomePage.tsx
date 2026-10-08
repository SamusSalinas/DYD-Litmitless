import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HomePage() {
  const cards = [
    { title: "Spells", desc: "Browse and search all spells", link: "/spells", icon: "✨" },
    { title: "Classes", desc: "Discover character classes", link: "/classes", icon: "⚔️" },
    { title: "Races", desc: "Explore playable races", link: "/races", icon: "🧝" },
    { title: "Monsters", desc: "Find foes to fight", link: "/monsters", icon: "🐉" },
    { title: "Equipment", desc: "Gear up for your adventure", link: "/equipment", icon: "🛡️" },
    { title: "Rulebooks", desc: "Read your local PDF books", link: "/books", icon: "📚" },
    { title: "Characters", desc: "Manage your heroes", link: "/characters", icon: "👤" },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#8B0000]">
          D&D Beyond
        </h1>
        <p className="text-xl text-zinc-400">
          Your companion for D&D 5e
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.title} to={card.link}>
            <Card className="bg-zinc-900 border-zinc-800 hover:border-[#8B0000] transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-100">
                  <span>{card.icon}</span>
                  {card.title}
                </CardTitle>
                <CardDescription className="text-zinc-400">
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
