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
    
    // Simulate animation delay
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
      setHistory(prev => [newRoll, ...prev].slice(0, 10)); // Keep last 10
      setIsRolling(false);
    }, 600);
  };

  return (
    <div className="p-6 bg-zinc-950 text-zinc-100 min-h-screen flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-4xl font-serif text-red-700 mb-6 border-b border-red-900 pb-2">Dice Roller</h1>
        
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 mb-8">
          <div className="flex gap-4 mb-6 items-end">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Quantity</label>
              <Input 
                type="number" 
                min="1" 
                max="50"
                value={diceCount} 
                onChange={(e) => setDiceCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 bg-zinc-800 border-zinc-700 text-center"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Modifier (+/-)</label>
              <Input 
                type="number" 
                value={modifier} 
                onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                className="w-24 bg-zinc-800 border-zinc-700 text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {diceTypes.map(sides => (
              <Button
                key={sides}
                onClick={() => rollDice(sides)}
                disabled={isRolling}
                className="h-24 flex flex-col items-center justify-center bg-zinc-800 hover:bg-red-900 border border-zinc-700 hover:border-red-500 transition-all text-xl"
              >
                <span className="text-3xl mb-1 text-red-500 opacity-80">⬡</span>
                <span>d{sides}</span>
              </Button>
            ))}
          </div>
        </div>

        {currentResult && (
          <div className={`bg-zinc-900 p-8 rounded-lg border-2 ${isRolling ? 'border-zinc-700 animate-pulse' : 'border-red-900'} text-center transition-all`}>
            <p className="text-zinc-400 text-lg mb-2">Rolling {currentResult.notation}</p>
            <div className="text-6xl font-serif text-white mb-4">
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

      <div className="w-full md:w-80 bg-zinc-900 border border-zinc-800 rounded-lg p-4 h-fit">
        <h2 className="text-xl font-serif text-red-500 mb-4 border-b border-zinc-800 pb-2">Recent Rolls</h2>
        {history.length === 0 ? (
          <p className="text-zinc-500 italic text-center py-4">No recent rolls</p>
        ) : (
          <div className="space-y-3">
            {history.map(roll => (
              <div key={roll.id} className="bg-zinc-950 p-3 rounded border border-zinc-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-lg text-white">{roll.result}</span>
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
