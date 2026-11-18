import { useState } from 'react';
import { useHomebrewList, useCreateHomebrew } from '../../api/useHomebrew';
import type { Homebrew } from '../../types/homebrew';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { QueryError } from '@/components/common/QueryError';

export default function HomebrewPage() {
  const [filterType, setFilterType] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('spell');
  const [desc, setDesc] = useState('');

  const { data: homebrewList, isLoading, isError, refetch } = useHomebrewList();
  const createMutation = useCreateHomebrew();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && desc) {
      createMutation.mutate({
        name,
        content_type: type,
        description: desc,
        data: { description: desc }
      }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setName('');
          setDesc('');
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca-emblema">🧪</div>
          <div>
            <p className="marca-kicker">Taller de Creación</p>
            <h1>Colección Homebrew</h1>
            <p className="marca-descripcion">
              Crea y consulta reglas, hechizos o criaturas caseras con la etiqueta oficial is_homebrew.
            </p>
          </div>
        </div>
      </header>

      <div className="contenido-panel">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[#e7e0d1]">
          <div className="w-full sm:w-64">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-white border-[#e7e0d1] text-[#26342e]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent className="bg-[#fffdf8] border-[#e7e0d1] text-[#26342e]">
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="spell">Hechizo</SelectItem>
                <SelectItem value="monster">Monstruo</SelectItem>
                <SelectItem value="race">Raza</SelectItem>
                <SelectItem value="class">Clase</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#19352b] hover:bg-[#315746] text-[#fffaf0] font-bold shadow">
                + Crear Nuevo Homebrew
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#fffdf8] border-[#e7e0d1] text-[#26342e] sm:max-w-[500px]">
              <DialogHeader className="border-b border-[#e7e0d1] pb-3">
                <DialogTitle className="text-2xl font-serif font-bold text-[#19352b]">
                  Nuevo Contenido Homebrew
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#68756c] block mb-1">Nombre</label>
                  <Input 
                    placeholder="Ej: Hechizo de Fuego Místico..." 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    className="bg-white border-[#e7e0d1] text-[#26342e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#68756c] block mb-1">Tipo de Entidad</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="bg-white border-[#e7e0d1] text-[#26342e]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#fffdf8] border-[#e7e0d1] text-[#26342e]">
                      <SelectItem value="spell">Hechizo</SelectItem>
                      <SelectItem value="monster">Monstruo</SelectItem>
                      <SelectItem value="race">Raza</SelectItem>
                      <SelectItem value="class">Clase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#68756c] block mb-1">Descripción / Reglas</label>
                  <textarea 
                    placeholder="Detalla cómo funciona esta creación..." 
                    className="w-full bg-white border border-[#e7e0d1] rounded-lg p-3 text-sm text-[#26342e] min-h-[120px] focus:outline-none focus:border-[#19352b]"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#e7e0d1]">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-[#e7e0d1] text-[#19352b] hover:bg-[#f3efe4]">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} className="bg-[#19352b] text-[#fffaf0] hover:bg-[#315746] font-bold">
                    {createMutation.isPending ? 'Guardando...' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-[#f8f5ed] animate-pulse rounded-lg border border-[#e7e0d1]" />
            ))}
          </div>
        ) : isError ? (
          <QueryError message="No se pudo cargar la colección homebrew." onRetry={() => void refetch()} />
        ) : !homebrewList?.length ? (
          <p className="text-[#68756c] italic text-center py-12">
            No hay contenido casero registrado aún. ¡Crea el primero con el botón superior!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homebrewList
              .filter((h: Homebrew) => filterType === 'all' || h.content_type === filterType)
              .map((h: Homebrew) => (
                <div key={h.id} className="bg-[#fffdf8] p-5 rounded-xl border border-[#e7e0d1] shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif font-bold text-xl text-[#19352b]">{h.name}</h3>
                    <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#f3efe4] text-[#bd7446] border border-[#e7e0d1]">
                      {h.content_type}
                    </span>
                  </div>
                  <p className="text-xs text-[#26342e] whitespace-pre-wrap leading-relaxed mt-2">
                    {h.description || h.data?.description}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
