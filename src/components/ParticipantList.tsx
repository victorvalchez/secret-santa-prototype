import { X, Gift } from "lucide-react";

interface ParticipantListProps {
  participants: string[];
  onRemove: (index: number) => void;
  disabled?: boolean;
}

const ParticipantList = ({ participants, onRemove, disabled }: ParticipantListProps) => {
  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Aún no hay participantes</p>
        <p className="text-sm mt-1">Agrega al menos 3 personas para iniciar el sorteo</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {participants.map((name, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-3 animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              {index + 1}
            </span>
            <span className="font-medium">{name}</span>
          </div>
          {!disabled && (
            <button
              onClick={() => onRemove(index)}
              className="text-muted-foreground hover:text-destructive transition-colors p-1"
              aria-label={`Eliminar ${name}`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ParticipantList;
