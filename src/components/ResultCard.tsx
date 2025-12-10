import { useState } from "react";
import { Gift, Eye, EyeOff } from "lucide-react";

interface ResultCardProps {
  giver: string;
  receiver: string;
  index: number;
}

const ResultCard = ({ giver, receiver, index }: ResultCardProps) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="festive-card p-4 animate-scale-in cursor-pointer hover:shadow-glow transition-shadow"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => setRevealed(!revealed)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Gift className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-display font-semibold text-lg">{giver}</p>
            <p className="text-sm text-muted-foreground">
              {revealed ? (
                <span className="text-primary font-medium animate-fade-in">
                  le regala a <span className="text-accent">{receiver}</span>
                </span>
              ) : (
                "Toca para revelar"
              )}
            </p>
          </div>
        </div>
        <button
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          aria-label={revealed ? "Ocultar asignación" : "Revelar asignación"}
        >
          {revealed ? (
            <EyeOff className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Eye className="w-5 h-5 text-primary" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
