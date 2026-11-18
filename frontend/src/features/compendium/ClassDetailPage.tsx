import { useParams, Link } from 'react-router-dom';
import { useClass } from '../../api/useClasses';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import { QueryError } from '@/components/common/QueryError';

export default function ClassDetailPage() {
  const { id } = useParams();
  const { data: cls, isLoading, isError, refetch } = useClass(id);

  if (isLoading) return <div className="p-6"><Skeleton className="h-64 w-full bg-[#f8f5ed]" /></div>;
  if (isError) return <div className="p-6"><QueryError message="No se pudo cargar la clase." onRetry={() => void refetch()} /></div>;
  if (!cls) return <div className="p-6 text-[#26342e]">Clase no encontrada.</div>;

  return (
    <div className="space-y-6">
      <Link to="/classes">
        <Button variant="outline" className="border-[#e7e0d1] text-[#19352b] bg-[#fffdf8] hover:bg-[#f3efe4] transition-colors">
          &larr; Volver a Clases
        </Button>
      </Link>

      <div className="contenido-panel space-y-6">
        <div className="border-b border-[#e7e0d1] pb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#bd7446]">Ficha de Clase</p>
          <h1 className="text-4xl font-serif font-bold text-[#19352b] mt-1">{cls.name}</h1>
          <p className="text-[#68756c] text-sm mt-1">Dado de Golpe: <span className="font-bold text-[#19352b]">{cls.hit_die}</span></p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-[#f8f5ed] border border-[#e7e0d1] mb-6 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#19352b] data-[state=active]:text-[#fffaf0] text-[#68756c] font-bold text-xs">
              Descripción General
            </TabsTrigger>
            <TabsTrigger value="proficiencies" className="data-[state=active]:bg-[#19352b] data-[state=active]:text-[#fffaf0] text-[#68756c] font-bold text-xs">
              Competencias
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-[#19352b] data-[state=active]:text-[#fffaf0] text-[#68756c] font-bold text-xs">
              Rasgos por Nivel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="bg-[#fffdf8] p-6 rounded-lg border border-[#e7e0d1] space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#19352b]">Descripción</h2>
            <p className="text-[#26342e] leading-relaxed whitespace-pre-wrap">{cls.description}</p>

            <h3 className="text-lg font-serif font-bold text-[#19352b] mt-6">Atributos Principales</h3>
            <div className="flex gap-2">
              {Object.keys(cls.primary_ability).map((k) => (
                <Badge key={k} className="bg-[#f3efe4] text-[#19352b] border border-[#e7e0d1] font-bold">
                  {k.toUpperCase()}
                </Badge>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="proficiencies" className="bg-[#fffdf8] p-6 rounded-lg border border-[#e7e0d1]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#19352b] mb-3">Armaduras y Armas</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-[#68756c] text-xs font-bold uppercase tracking-wider mb-1">Armaduras</p>
                    <p className="text-[#26342e]">{cls.armor_proficiencies.length ? cls.armor_proficiencies.join(', ') : 'Ninguna'}</p>
                  </div>
                  <div>
                    <p className="text-[#68756c] text-xs font-bold uppercase tracking-wider mb-1">Armas</p>
                    <p className="text-[#26342e]">{cls.weapon_proficiencies.length ? cls.weapon_proficiencies.join(', ') : 'Ninguna'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold text-[#19352b] mb-3">Salvaciones y Habilidades</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-[#68756c] text-xs font-bold uppercase tracking-wider mb-1">Tiradas de Salvación</p>
                    <div className="flex gap-2">
                      {cls.saving_throws.map((st) => (
                        <Badge key={st} className="bg-[#f3efe4] text-[#19352b] border border-[#e7e0d1] font-bold">
                          {st}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {cls.skill_choices && (
                    <div>
                      <p className="text-[#68756c] text-xs font-bold uppercase tracking-wider mb-1">
                        Habilidades a elegir ({cls.skill_choices.choose})
                      </p>
                      <p className="text-[#26342e]">{cls.skill_choices.from.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="bg-[#fffdf8] p-6 rounded-lg border border-[#e7e0d1]">
            <h3 className="text-xl font-serif font-bold text-[#19352b] mb-4">Rasgos de Clase por Nivel</h3>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {Object.entries(cls.features_by_level).map(([lvl, feats]) => (
                <AccordionItem key={lvl} value={`level-${lvl}`} className="border border-[#e7e0d1] rounded-lg bg-[#f8f5ed] px-4">
                  <AccordionTrigger className="text-[#19352b] font-bold hover:no-underline py-3">
                    Nivel {lvl} &mdash; {feats.map((f: any) => f.name).join(', ')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 pb-4 text-[#26342e] border-t border-[#e7e0d1]">
                    {feats.map((f: any, idx: number) => (
                      <div key={idx}>
                        <h4 className="font-bold text-[#bd7446]">{f.name}</h4>
                        <p className="text-xs leading-relaxed mt-1">{f.description}</p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
