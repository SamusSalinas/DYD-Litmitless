import { useState, useMemo } from 'react';
import { Shield } from 'lucide-react';
import { useEquipment } from '../../api/useEquipment';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Skeleton } from '../../components/ui/skeleton';
import { QueryError } from '@/components/common/QueryError';
import type { Equipment } from '../../types/equipment';

export default function EquipmentPage() {
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: equipmentList, isLoading, isError, refetch } = useEquipment();

  // Filtrar objetos normales (excluyendo objetos mágicos explícitos con rareza para que aparezcan en su sección)
  const filteredItems = useMemo(() => {
    if (!equipmentList) return [];
    return equipmentList.filter((item) => {
      // Excluir si es exclusivamente un objeto mágico con rareza
      const isMagicItem = item.properties?.rarity && item.properties.rarity !== 'none';
      if (isMagicItem) return false;

      const matchName = !nameFilter || item.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchCat =
        categoryFilter === 'all' ||
        item.category.toLowerCase() === categoryFilter.toLowerCase() ||
        (item.subcategory && item.subcategory.toLowerCase() === categoryFilter.toLowerCase());
      return matchName && matchCat;
    });
  }, [equipmentList, nameFilter, categoryFilter]);

  // Lista de categorías únicas disponibles
  const categories = useMemo(() => {
    if (!equipmentList) return [];
    const set = new Set<string>();
    equipmentList.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set).sort();
  }, [equipmentList]);

  return (
    <div className="space-y-6">
      {/* Cabecera estilo compendio Proyecto */}
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca-emblema">
            <Shield className="size-8 text-[#19352b]" />
          </div>
          <div>
            <p className="marca-kicker">Catálogo de Aventurero</p>
            <h1>Equipamiento y Objetos</h1>
            <p className="marca-descripcion">
              Selecciona cualquier objeto del inventario para desplegar su ficha técnica completa.
            </p>
          </div>
        </div>
      </header>

      {/* Panel principal */}
      <div className="contenido-panel">
        {/* Barra de filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-[#f8f5ed] border border-[#e7e0d1] rounded-lg">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">
              Buscar objeto
            </label>
            <Input
              placeholder="Ej: Longsword, Leather Armor, Rope..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="bg-white border-[#e7e0d1] text-[#26342e] focus:border-[#19352b]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">
              Filtrar por Categoría
            </label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-white border-[#e7e0d1] text-[#26342e]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="bg-[#fffdf8] border-[#e7e0d1] text-[#26342e]">
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Estado de carga y errores */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 bg-[#f8f5ed] rounded-lg" />
            ))}
          </div>
        )}

        {isError && (
          <QueryError message="No se pudo cargar el catálogo de equipamiento." onRetry={() => void refetch()} />
        )}

        {!isLoading && !isError && filteredItems.length === 0 && (
          <p className="p-8 text-center text-[#68756c] italic">
            No hay objetos que coincidan con los filtros en el catálogo.
          </p>
        )}

        {/* Grilla de Objetos (Distribución exacta de Proyecto) */}
        {!isLoading && !isError && (
          <ul className="lista-objetos">
            {filteredItems.map((objeto: Equipment) => {
              const props = objeto.properties || {};
              const damage = props.damage || props.dmg1;
              const ac = props.ac || props.armorClass;

              return (
                <li key={objeto.id}>
                  <details className="objeto-detalle">
                    <summary className="objeto-resumen">
                      <span className="truncate">{objeto.name}</span>
                    </summary>

                    <div className="objeto-informacion">
                      {/* Ficha técnica de metadatos */}
                      <dl className="objeto-ficha-metadatos">
                        <div>
                          <dt>Categoría</dt>
                          <dd>{objeto.category}{objeto.subcategory ? ` (${objeto.subcategory})` : ''}</dd>
                        </div>
                        <div>
                          <dt>Coste</dt>
                          <dd>{objeto.cost || '-'}</dd>
                        </div>
                        {objeto.weight !== null && objeto.weight !== undefined && (
                          <div>
                            <dt>Peso</dt>
                            <dd>{objeto.weight} lb</dd>
                          </div>
                        )}
                        {damage && (
                          <div>
                            <dt>Daño</dt>
                            <dd>{damage}{props.dmgType ? ` (${props.dmgType})` : ''}</dd>
                          </div>
                        )}
                        {ac && (
                          <div>
                            <dt>Clase Armadura</dt>
                            <dd>{ac}</dd>
                          </div>
                        )}
                      </dl>

                      {/* Propiedades */}
                      {props.property && Array.isArray(props.property) && props.property.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">Propiedades</h4>
                          <ul className="objeto-propiedades">
                            {props.property.map((p: any, idx: number) => (
                              <li key={idx} className="objeto-propiedad-badge">
                                {typeof p === 'string' ? p : JSON.stringify(p)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Descripción */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">Descripción</h4>
                        <p className="text-xs text-[#26342e] leading-relaxed whitespace-pre-line">
                          {objeto.description || 'Sin descripción adicional disponible en el catálogo local.'}
                        </p>
                      </div>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
