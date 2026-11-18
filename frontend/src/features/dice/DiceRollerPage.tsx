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
        time: new Date(),
      };

      setCurrentResult(newRoll);
      setHistory((prev) => [newRoll, ...prev].slice(0, 10));
      setIsRolling(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca-emblema">🎲</div>
          <div>
            <p className="marca-kicker">Herramientas de Juego</p>
            <h1>Lanzador de Dados Virtual</h1>
            <p className="marca-descripcion">
              Realiza tiradas de dados poliédricos (d4 a d100) con animación 3D y modificadores de tirada.
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="contenido-panel">
            <div className="flex gap-4 mb-6 items-end p-4 bg-[#f8f5ed] border border-[#e7e0d1] rounded-lg">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">
                  Cantidad
                </label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={diceCount}
                  onChange={(e) => setDiceCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 bg-white border-[#e7e0d1] text-[#26342e] text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">
                  Modificador (+/-)
                </label>
                <Input
                  type="number"
                  value={modifier}
                  onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                  className="w-24 bg-white border-[#e7e0d1] text-[#26342e] text-center font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {diceTypes.map((sides) => (
                <Button
                  key={sides}
                  onClick={() => rollDice(sides)}
                  disabled={isRolling}
                  className="h-24 flex flex-col items-center justify-center bg-[#fffdf8] hover:bg-[#f3efe4] border-2 border-[#e7e0d1] hover:border-[#19352b] transition-all text-lg group text-[#19352b]"
                >
                  <span className="text-2xl mb-1 text-[#bd7446] group-hover:scale-110 transition-transform">⬡</span>
                  <span className="font-serif font-bold">d{sides}</span>
                </Button>
              ))}
            </div>
          </div>

          {currentResult && (
            <div
              className={`bg-[#fffdf8] p-8 rounded-xl border-2 ${
                isRolling ? 'border-[#bd7446] animate-pulse dice-rotate' : 'border-[#19352b]'
              } text-center shadow-lg transition-all`}
            >
              <p className="text-[#68756c] text-sm uppercase font-bold tracking-wider mb-1">
                Lanzando {currentResult.notation}
              </p>
              <div className="text-6xl font-serif font-black text-[#19352b] my-3">
                {isRolling ? '...' : currentResult.result}
              </div>
              {!isRolling && (
                <p className="text-sm text-[#68756c] font-medium">
                  Dados: [{currentResult.rolls.join(', ')}]
                  {currentResult.modifier !== 0 &&
                    ` ${currentResult.modifier > 0 ? '+' : ''}${currentResult.modifier}`}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="w-full md:w-80 contenido-panel h-fit">
          <h2 className="text-lg font-serif font-bold text-[#19352b] pb-2 mb-3 border-b border-[#e7e0d1]">
            Historial de Tiradas
          </h2>
          {history.length === 0 ? (
            <p className="text-[#68756c] italic text-center py-6 text-sm">No hay tiradas recientes</p>
          ) : (
            <div className="space-y-2">
              {history.map((roll) => (
                <div
                  key={roll.id}
                  className="bg-[#f8f5ed] p-3 rounded-lg border border-[#e7e0d1] flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold font-serif text-lg text-[#bd7446]">{roll.result}</span>
                    <span className="text-xs font-semibold text-[#68756c] ml-2">{roll.notation}</span>
                  </div>
                  <span className="text-[0.7rem] text-[#68756c]">
                    {roll.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
