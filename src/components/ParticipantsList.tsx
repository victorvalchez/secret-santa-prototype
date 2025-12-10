import { Gift, Users } from "lucide-react";

interface Participant {
  id: string;
  name: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  isDrawn: boolean;
}

const ParticipantsList = ({ participants, isDrawn }: ParticipantsListProps) => {
  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Aún no hay participantes</p>
        <p className="text-sm mt-1">¡Sé la primera persona en unirte!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Users className="w-4 h-4" />
        <span className="text-sm">
          {participants.length} participante{participants.length !== 1 ? "s" : ""}
          {isDrawn && " — sorteo completado"}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {participants.map((participant, index) => (
          <div
            key={participant.id}
            className="inline-flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-2 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
              {index + 1}
            </span>
            <span className="font-medium text-sm">{participant.name}</span>
          </div>
        ))}
      </div>

      {!isDrawn && participants.length < 3 && (
        <p className="text-sm text-muted-foreground text-center pt-2">
          Faltan {3 - participants.length} participante{3 - participants.length !== 1 ? "s" : ""} para iniciar el sorteo
        </p>
      )}
    </div>
  );
};

export default ParticipantsList;
