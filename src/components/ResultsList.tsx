import ResultCard from "./ResultCard";
import { TreePine } from "lucide-react";

interface ResultsListProps {
  assignments: { giver: string; receiver: string }[];
}

const ResultsList = ({ assignments }: ResultsListProps) => {
  if (assignments.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-3 py-4">
        <TreePine className="w-6 h-6 text-primary" />
        <h2 className="font-display text-2xl font-semibold text-center">
          Secret Santa Assignments
        </h2>
        <TreePine className="w-6 h-6 text-primary" />
      </div>
      <p className="text-center text-muted-foreground text-sm mb-6">
        Tap each card to reveal who that person is gifting
      </p>
      <div className="space-y-3">
        {assignments.map((assignment, index) => (
          <ResultCard
            key={index}
            giver={assignment.giver}
            receiver={assignment.receiver}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
