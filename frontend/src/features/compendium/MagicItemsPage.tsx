import { useState, useMemo } from 'react';
import { useEquipment } from '../../api/useEquipment';
import { Input } from '../../components/ui/input';
import { Skeleton } from '../../components/ui/skeleton';
import { QueryError } from '@/components/common/QueryError';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Equipment } from '../../types/equipment';

const RAREZAS = [
  { label: 'Todos', slug: 'all' },
  { label: 'Common', slug: 'common' },
  { label: 'Uncommon', slug: 'uncommon' },
  { label: 'Rare', slug: 'rare' },
  { label: 'Very Rare', slug: 'very rare' },
  { label: 'Legendary', slug: 'legendary' },
  { label: 'Artifact', slug: 'artifact' },
];

export default function MagicItemsPage() {
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<Equipment | null>(null);

  const { data: allEquipment, isLoading, isError, refetch } = useEquipment();

  // Filtrar exclusivamente los objetos que son mágicos (tienen propiedad rarity y no es 'none')
  const magicItems = useMemo(() => {
    if (!allEquipment) return [];
    return allEquipment.filter((item) => {
      const rarity = item.properties?.rarity;
      return rarity && rarity !== 'none';
    });
  }, [allEquipment]);

  // Filtrar por rareza seleccionada y término de búsqueda
  const filteredMagicItems = useMemo(() => {
    return magicItems.filter((item) => {
      const itemRarity = (item.properties?.rarity || '').toLowerCase().replace('-', ' ');
      const targetRarity = selectedRarity.toLowerCase();
      const matchRarity = selectedRarity === 'all' || itemRarity === targetRarity;
      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRarity && matchSearch;
    });
  }, [magicItems, selectedRarity, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Cabecera estilo compendio Proyecto */}
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca-emblema">✨</div>
          <div>
            <p className="marca-kicker">Catálogo Arcano</p>
            <h1>Objetos Mágicos</h1>
            <p className="marca-descripcion">
              Explora el catálogo por rareza según el SRD 5.1. Haz clic en cualquier objeto para ver su descripción completa.
            </p>
          </div>
        </div>
      </header>

      {/* Panel principal */}
      <div className="contenido-panel">
        {/* Barra de filtros por Rareza (Distribución Proyecto) */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-2">
            Filtrar por Rareza:
          </label>
          <div className="rareza-filtros">
            {RAREZAS.map((r) => {
              const isActive = selectedRarity === r.slug;
              return (
                <button
                  key={r.slug}
                  type="button"
                  onClick={() => setSelectedRarity(r.slug)}
                  className={`rareza-filtro ${isActive ? 'active' : ''}`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Buscador de objetos mágicos */}
        <div className="mb-6 max-w-md">
          <Input
            placeholder="Buscar objeto mágico por nombre o tipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border-[#e7e0d1] text-[#26342e] focus:border-[#19352b]"
          />
        </div>

        {/* Encabezado de sección activa */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e7e0d1]">
          <h2 className="text-xl font-serif font-bold text-[#19352b] m-0">
            {selectedRarity === 'all'
              ? 'Todos los Objetos Mágicos'
              : `Objetos Mágicos: ${RAREZAS.find((r) => r.slug === selectedRarity)?.label}`}
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f3efe4] text-[#19352b] border border-[#e7e0d1]">
            {filteredMagicItems.length} objetos
          </span>
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 bg-[#f8f5ed] w-full rounded" />
            ))}
          </div>
        )}

        {isError && (
          <QueryError message="No se pudo cargar el catálogo de objetos mágicos." onRetry={() => void refetch()} />
        )}

        {!isLoading && !isError && filteredMagicItems.length === 0 && (
          <p className="p-8 text-center text-[#68756c] italic">
            No se encontraron objetos mágicos en esta categoría.
          </p>
        )}

        {/* Tabla de Objetos Mágicos (Exacta de Proyecto) */}
        {!isLoading && !isError && filteredMagicItems.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-[#e7e0d1]">
            <table className="tabla-objetos-magicos">
              <thead>
                <tr>
                  <th scope="col">Objeto</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Rareza</th>
                  <th scope="col">Sintonización</th>
                  <th scope="col">Fuente</th>
                </tr>
              </thead>
              <tbody>
                {filteredMagicItems.map((item) => {
                  const props = item.properties || {};
                  const reqAttune = props.reqAttune
                    ? typeof props.reqAttune === 'string'
                      ? `Sí (${props.reqAttune})`
                      : 'Requiere'
                    : 'No';
                  const rarity = props.rarity || 'Common';
                  const source = (item as any).source_book || 'SRD 5.1';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setActiveItem(item)}
                      className="cursor-pointer transition-colors"
                    >
                      <th scope="row" className="font-semibold text-[#86502f] hover:text-[#19352b] underline">
                        {item.name}
                      </th>
                      <td className="text-[#26342e]">{item.category}</td>
                      <td className="capitalize text-[#68756c] font-medium">{rarity}</td>
                      <td className="text-[#26342e]">{reqAttune}</td>
                      <td className="text-[#68756c] text-xs font-semibold">{source}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Detalle de Objeto Mágico (Distribución de ficha.php / detalle.php) */}
        <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
          <DialogContent className="max-w-2xl bg-[#fffdf8] border-[#e7e0d1] text-[#26342e]">
            {activeItem && (
              <div className="space-y-4">
                <DialogHeader className="border-b border-[#e7e0d1] pb-3">
                  <DialogTitle className="text-2xl font-serif font-bold text-[#19352b]">
                    {activeItem.name}
                  </DialogTitle>
                </DialogHeader>

                {/* Metadatos en cuadrícula (objeto-ficha-metadatos) */}
                <dl className="objeto-ficha-metadatos">
                  <div>
                    <dt>Rareza</dt>
                    <dd className="capitalize">{activeItem.properties?.rarity || 'Desconocida'}</dd>
                  </div>
                  <div>
                    <dt>Tipo</dt>
                    <dd>{activeItem.category}</dd>
                  </div>
                  <div>
                    <dt>Sintonización</dt>
                    <dd>
                      {activeItem.properties?.reqAttune
                        ? typeof activeItem.properties.reqAttune === 'string'
                          ? activeItem.properties.reqAttune
                          : 'Requiere sintonización'
                        : 'No requiere'}
                    </dd>
                  </div>
                  <div>
                    <dt>Fuente</dt>
                    <dd>{(activeItem as any).source_book || 'SRD 5.1'}</dd>
                  </div>
                </dl>

                {/* Descripción */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#68756c] mb-2 font-serif">
                    Descripción
                  </h3>
                  <div className="text-sm text-[#26342e] leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto pr-2">
                    {activeItem.description || 'No hay una descripción detallada disponible en el catálogo local.'}
                  </div>
                </div>

                {/* Aviso legal de licencia SRD 5.1 */}
                <div className="aviso-catalogo">
                  Este objeto forma parte del compendio de reglas abiertas System Reference Document 5.1 (&quot;SRD 5.1&quot;) de Wizards of the Coast LLC, disponible bajo licencia Creative Commons Attribution 4.0 International (CC-BY-4.0).
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
