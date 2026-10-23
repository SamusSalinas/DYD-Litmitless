import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

type RollHistory = {
  id: string;
  notation: string;
  result: number;
  rolls: number[];
  modifier: number;
  time: Date;
};

export default function DiceRollerPage() {
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [history, setHistory] = useState<RollHistory[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [currentResult, setCurrentResult] = useState<RollHistory | null>(null);

  const diceTypes = [4, 6, 8, 10, 12, 20, 100];

  const rollDice = (sides: number) => {
    setIsRolling(true);
    
    setTimeout(() => {
      const rolls = Array.from({ length: diceCount }, () => Math.floor(Math.random() * sides) + 1);
      const total = rolls.reduce((sum, val) => sum + val, 0) + modifier;
      
      const newRoll: RollHistory = {
        id: Math.random().toString(36).substr(2, 9),
        notation: `${diceCount}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`,
        result: total,
        rolls,
        modifier,
        time: new Date()
      };
      
      setCurrentResult(newRoll);
      setHistory(prev => [newRoll, ...prev].slice(0, 10));
      setIsRolling(false);
    }, 600);
  };

  return (
    <div className="p-6 text-zinc-100 flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-4xl font-serif text-dnd-gold mb-6 border-b border-dnd-teal/30 pb-2">Dice Roller</h1>
        
        <div className="bg-dnd-card p-6 rounded-lg border border-dnd-border mb-8">
          <div className="flex gap-4 mb-6 items-end">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Quantity</label>
              <Input 
                type="number" 
                min="1" 
                max="50"
                value={diceCount} 
                onChange={(e) => setDiceCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 bg-dnd-surface border-dnd-border text-center"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Modifier (+/-)</label>
              <Input 
                type="number" 
                value={modifier} 
                onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                className="w-24 bg-dnd-surface border-dnd-border text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {diceTypes.map(sides => (
              <Button
                key={sides}
                onClick={() => rollDice(sides)}
                disabled={isRolling}
                className="h-24 flex flex-col items-center justify-center bg-dnd-surface hover:bg-dnd-teal/20 border border-dnd-border hover:border-dnd-teal transition-all text-xl group"
              >
                <span className="text-3xl mb-1 text-dnd-teal opacity-80 group-hover:opacity-100 transition-opacity">⬡</span>
                <span>d{sides}</span>
              </Button>
            ))}
          </div>
        </div>

        {currentResult && (
          <div className={`bg-dnd-card p-8 rounded-lg border-2 ${isRolling ? 'border-dnd-border animate-pulse' : 'border-dnd-teal'} text-center transition-all`}>
            <p className="text-zinc-400 text-lg mb-2">Rolling {currentResult.notation}</p>
            <div className="text-6xl font-serif text-dnd-gold mb-4">
              {isRolling ? '...' : currentResult.result}
            </div>
            {!isRolling && (
              <p className="text-zinc-500">
                [{currentResult.rolls.join(', ')}] {currentResult.modifier !== 0 && `${currentResult.modifier > 0 ? '+' : ''}${currentResult.modifier}`}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="w-full md:w-80 bg-dnd-card border border-dnd-border rounded-lg p-4 h-fit">
        <h2 className="text-xl font-serif text-dnd-teal mb-4 border-b border-dnd-border pb-2">Recent Rolls</h2>
        {history.length === 0 ? (
          <p className="text-zinc-500 italic text-center py-4">No recent rolls</p>
        ) : (
          <div className="space-y-3">
            {history.map(roll => (
              <div key={roll.id} className="bg-dnd-bg p-3 rounded border border-dnd-border flex justify-between items-center">
                <div>
                  <span className="font-bold text-lg text-dnd-gold">{roll.result}</span>
                  <span className="text-xs text-zinc-500 ml-2">{roll.notation}</span>
                </div>
                <span className="text-xs text-zinc-600">
                  {roll.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
