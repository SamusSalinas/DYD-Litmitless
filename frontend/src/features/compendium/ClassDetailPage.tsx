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

  if (isLoading) return <div className="p-6 bg-zinc-950 min-h-screen"><Skeleton className="h-64 w-full bg-zinc-800" /></div>;
  if (isError) return <div className="p-6 bg-zinc-950 min-h-screen"><QueryError message="Could not load this class." onRetry={() => void refetch()} /></div>;
  if (!cls) return <div className="p-6 bg-zinc-950 text-white min-h-screen">Class not found</div>;

  return (
    <div className="p-6 bg-zinc-950 text-zinc-100 min-h-screen">
      <Link to="/classes">
        <Button variant="outline" className="mb-6 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          &larr; Back to Classes
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-5xl font-serif text-red-600 mb-2">{cls.name}</h1>
        <p className="text-zinc-400 text-lg">Hit Die: {cls.hit_die}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-zinc-900 border-zinc-800 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="proficiencies">Proficiencies</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="bg-zinc-900 p-6 rounded-md border border-zinc-800">
          <h2 className="text-2xl font-serif text-red-500 mb-4">Description</h2>
          <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{cls.description}</p>
          
          <h3 className="text-xl font-serif text-red-400 mt-6 mb-2">Primary Abilities</h3>
          <div className="flex gap-2">
            {Object.keys(cls.primary_ability).map(k => (
              <Badge key={k} className="bg-zinc-800 text-zinc-200">{k.toUpperCase()}</Badge>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="proficiencies" className="bg-zinc-900 p-6 rounded-md border border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-serif text-red-400 mb-3">Armor & Weapons</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-1">Armor</p>
                  <p className="text-zinc-300">{cls.armor_proficiencies.length ? cls.armor_proficiencies.join(', ') : 'None'}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-1">Weapons</p>
                  <p className="text-zinc-300">{cls.weapon_proficiencies.length ? cls.weapon_proficiencies.join(', ') : 'None'}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-serif text-red-400 mb-3">Skills</h3>
              <p className="text-zinc-300 mb-2">Choose {cls.skill_choices.choose} from:</p>
              <ul className="list-disc list-inside text-zinc-400 space-y-1">
                {cls.skill_choices.from.map(skill => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="bg-zinc-900 p-6 rounded-md border border-zinc-800">
          <Accordion type="multiple" className="w-full">
            {Object.entries(cls.features_by_level || {}).map(([level, features]) => (
              <AccordionItem key={level} value={`level-${level}`} className="border-zinc-800">
                <AccordionTrigger className="text-red-400 hover:text-red-300 font-serif text-xl">
                  Level {level}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-4">
                    {features.map((feat, idx) => (
                      <div key={idx} className="bg-zinc-950 p-4 rounded border border-zinc-800">
                        <h4 className="font-bold text-zinc-200 mb-2">{feat.name}</h4>
                        <p className="text-zinc-400 whitespace-pre-wrap">{feat.description}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
