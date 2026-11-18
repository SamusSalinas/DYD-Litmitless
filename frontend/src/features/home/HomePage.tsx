import { Link } from 'react-router-dom';
import {
  Sparkles,
  Shield,
  Wand2,
  Swords,
  Users,
  Skull,
  User,
  Dices,
  BookOpen,
} from 'lucide-react';

const cards = [
  { title: "Hechizos", desc: "Listas completas de conjuros organizadas por nivel y clase", link: "/spells", icon: Sparkles },
  { title: "Equipamiento", desc: "Armas, armaduras, herramientas y equipo de aventura", link: "/equipment", icon: Shield },
  { title: "Objetos Mágicos", desc: "Catálogo clasificado por rareza y sintonización", link: "/magic-items", icon: Wand2 },
  { title: "Clases", desc: "Clases oficiales, rasgos y progresión por nivel", link: "/classes", icon: Swords },
  { title: "Razas", desc: "Razas jugables, rasgos y bonificadores de atributo", link: "/races", icon: Users },
  { title: "Monstruos", desc: "Bestiario con valores de desafío y acciones de combate", link: "/monsters", icon: Skull },
  { title: "Hojas de Personaje", desc: "Gestión interactiva y subida de nivel en tiempo real", link: "/characters", icon: User },
  { title: "Tirador de Dados", desc: "Lanzador de dados con animación 3D e historial", link: "/dice", icon: Dices },
  { title: "Manuales PDF", desc: "Lector web de los libros oficiales locales", link: "/books", icon: BookOpen },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Cabecera estilo compendio Proyecto */}
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca-emblema">
            <Dices className="size-8 text-[#19352b]" />
          </div>
          <div>
            <p className="marca-kicker">Compendio SRD 2014</p>
            <h1>Compendio &amp; Gestor D&amp;D</h1>
            <p className="marca-descripcion">
              Reglas, conjuros, objetos mágicos, fichas de aventurero y utilidades para tus partidas de 5ª Edición.
            </p>
          </div>
        </div>
      </header>

      {/* Grid de accesos rápidos */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} to={card.link} className="group no-underline block">
              <div className="bg-[#fffdf8] border border-[#e7e0d1] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#19352b] transition-all duration-200 h-full flex flex-col justify-between group-hover:-translate-y-0.5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-lg bg-[#f8f5ed] border border-[#e7e0d1] text-[#19352b] group-hover:bg-[#19352b] group-hover:text-[#fffaf0] transition-colors">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-[#19352b] group-hover:text-[#bd7446] transition-colors m-0">
                      {card.title}
                    </h2>
                  </div>
                  <p className="text-sm text-[#68756c] leading-relaxed m-0">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e7e0d1] flex items-center text-xs font-bold text-[#bd7446] group-hover:text-[#19352b] transition-colors">
                  Explorar catálogo &rarr;
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
