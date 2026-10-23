import { useParams, Link } from 'react-router-dom';
import { useSpell } from '../../api/useSpells';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { QueryError } from '@/components/common/QueryError';

export default function SpellDetailPage() {
  const { id } = useParams();
  const { data: spell, isLoading, isError, refetch } = useSpell(id ?? '');

  if (isLoading) return <div className="p-6"><Skeleton className="h-64 w-full bg-dnd-surface" /></div>;
  if (isError) return <div className="p-6"><QueryError message="Could not load this spell." onRetry={() => void refetch()} /></div>;
  if (!spell) return <div className="p-6 text-white">Spell not found</div>;

  return (
    <div className="p-6 text-zinc-100">
      <Link to="/spells">
        <Button variant="outline" className="mb-6 border-dnd-border text-zinc-300 hover:bg-dnd-surface hover:text-dnd-gold transition-colors">
          &larr; Back to Spells
        </Button>
      </Link>
      
      <Card className="bg-dnd-card border-dnd-border text-zinc-100">
        <CardHeader className="border-b border-dnd-border">
          <CardTitle className="text-3xl font-serif text-dnd-gold flex items-center justify-between">
            {spell.name}
            <div className="flex gap-2 text-sm font-sans">
              <Badge variant="secondary" className="bg-dnd-surface text-zinc-300">{spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}</Badge>
              <Badge variant="secondary" className="bg-dnd-surface text-zinc-300">{spell.school}</Badge>
              {spell.ritual && <Badge variant="outline" className="text-dnd-teal border-dnd-teal/50">Ritual</Badge>}
              {spell.concentration && <Badge variant="outline" className="text-dnd-gold border-dnd-gold/50">Concentration</Badge>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider">Casting Time</p>
              <p>{spell.casting_time}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider">Range</p>
              <p>{spell.range}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider">Components</p>
              <p>{spell.components} {spell.material && <span className="text-zinc-400 text-sm">({spell.material})</span>}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider">Duration</p>
              <p>{spell.duration}</p>
            </div>
          </div>
          
          <div className="mt-8 border-t border-dnd-border pt-6">
            <h3 className="text-xl font-serif text-dnd-teal mb-2">Description</h3>
            <div className="space-y-4 text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {spell.description}
            </div>
          </div>
          
          {spell.higher_levels && (
            <div className="mt-6">
              <h3 className="text-lg font-serif text-dnd-teal mb-2">At Higher Levels</h3>
              {Object.entries(spell.higher_levels).map(([level, description]) => (
                <p key={level} className="text-zinc-300 leading-relaxed">{description}</p>
              ))}
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-dnd-border">
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-2">Classes</p>
            <div className="flex gap-2">
              {spell.classes.map(c => (
                <Badge key={c} variant="secondary" className="bg-dnd-surface">{c}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
