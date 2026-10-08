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
    return <p className="text-zinc-400">Loading your local books...</p>;
  }

  if (isError) {
    return <QueryError message="Could not load the local book list." onRetry={() => void refetch()} />;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-4xl font-serif text-[#8B0000]">My rulebooks</h1>
        <p className="mt-2 text-zinc-400">
          Read your PDF copies locally. The files stay in the project folder and are not uploaded to another service.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {manuals?.map((manual) => (
          <article key={manual.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <BookOpen aria-hidden="true" className="mb-3 size-6 text-red-400" />
            <h2 className="font-serif text-xl text-zinc-100">{manual.title}</h2>
            <p className={`mt-2 text-sm ${manual.available ? 'text-emerald-400' : 'text-amber-400'}`}>
              {manual.available ? 'PDF available' : 'PDF not found in the project folder'}
            </p>
            <Button
              className="mt-4 w-full"
              variant={selectedId === manual.id ? 'default' : 'outline'}
              disabled={!manual.available}
              onClick={() => setSelectedId(manual.id)}
            >
              Read book
            </Button>
          </article>
        ))}
      </div>

      {selectedManual && (
        <section className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 p-4">
            <h2 className="font-serif text-xl text-zinc-100">{selectedManual.title}</h2>
            <a
              href={`http://localhost:8000${selectedManual.url}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-200"
            >
              Open in a new tab <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          </div>
          <iframe
            key={selectedManual.id}
            title={selectedManual.title}
            src={`http://localhost:8000${selectedManual.url}`}
            className="h-[75vh] min-h-[36rem] w-full bg-zinc-950"
          />
        </section>
      )}
    </section>
  );
}
