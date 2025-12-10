import { Sparkles, RotateCcw } from "lucide-react";

interface DrawButtonProps {
  onDraw: () => void;
  onReset: () => void;
  canDraw: boolean;
  hasDrawn: boolean;
  participantCount: number;
}

const DrawButton = ({ onDraw, onReset, canDraw, hasDrawn, participantCount }: DrawButtonProps) => {
  const minParticipants = 3;
  const needed = minParticipants - participantCount;

  if (hasDrawn) {
    return (
      <button
        onClick={onReset}
        className="w-full festive-button-accent flex items-center justify-center gap-2 py-4"
      >
        <RotateCcw className="w-5 h-5" />
        Iniciar un nuevo sorteo
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={onDraw}
        disabled={!canDraw}
        className="w-full festive-button-accent flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <Sparkles className="w-5 h-5" />
        ¡Realizar sorteo del Amigo Invisible!
      </button>
      {!canDraw && participantCount > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Agrega {needed} {needed === 1 ? "persona" : "personas"} más para comenzar
        </p>
      )}
    </div>
  );
};

export default DrawButton;
