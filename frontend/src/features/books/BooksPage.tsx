import { useState } from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QueryError } from '@/components/common/QueryError';
import { useManuals } from '@/api/useManuals';

export default function BooksPage() {
  const { data: manuals, isLoading, isError, refetch } = useManuals();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedManual = manuals?.find((manual) => manual.id === selectedId);

  if (isLoading) {
    return <p className="text-[#68756c] italic p-6">Cargando los manuales locales...</p>;
  }

  if (isError) {
    return <QueryError message="No se pudo cargar la lista de manuales locales." onRetry={() => void refetch()} />;
  }

  return (
    <div className="space-y-6">
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca-emblema">📚</div>
          <div>
            <p className="marca-kicker">Biblioteca Local</p>
            <h1>Manuales y Libros de Reglas</h1>
            <p className="marca-descripcion">
              Consulta tus copias PDF oficiales locales directamente en el visor web integrado sin depender de servicios externos.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {manuals?.map((manual) => (
          <article key={manual.id} className="rounded-xl border border-[#e7e0d1] bg-[#fffdf8] p-5 shadow-sm hover:border-[#19352b] transition-all">
            <BookOpen aria-hidden="true" className="mb-3 size-6 text-[#19352b]" />
            <h2 className="font-serif text-xl font-bold text-[#19352b]">{manual.title}</h2>
            <p className={`mt-2 text-xs font-semibold ${manual.available ? 'text-emerald-700' : 'text-[#bd7446]'}`}>
              {manual.available ? '✓ Archivo PDF disponible en el proyecto' : '✗ PDF no encontrado en la raíz'}
            </p>
            <Button
              className="mt-4 w-full bg-[#19352b] hover:bg-[#315746] text-[#fffaf0] font-bold"
              variant={selectedId === manual.id ? 'default' : 'outline'}
              disabled={!manual.available}
              onClick={() => setSelectedId(manual.id)}
            >
              Leer manual
            </Button>
          </article>
        ))}
      </div>

      {selectedManual && (
        <section className="overflow-hidden rounded-xl border border-[#e7e0d1] bg-[#fffdf8] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7e0d1] p-4 bg-[#f8f5ed]">
            <h2 className="font-serif text-xl font-bold text-[#19352b] m-0">{selectedManual.title}</h2>
            <a
              href={`http://localhost:8000${selectedManual.url}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#bd7446] hover:text-[#19352b] transition-colors"
            >
              Abrir en nueva pestaña <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          </div>
          <div className="h-[75vh] w-full">
            <iframe
              src={`http://localhost:8000${selectedManual.url}`}
              title={selectedManual.title}
              className="h-full w-full border-none"
            />
          </div>
        </section>
      )}
    </div>
  );
}
