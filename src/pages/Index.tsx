import { useState } from "react";
import { Gift } from "lucide-react";
import { toast } from "sonner";
import Snowfall from "@/components/Snowfall";
import ParticipantInput from "@/components/ParticipantInput";
import ParticipantList from "@/components/ParticipantList";
import DrawButton from "@/components/DrawButton";
import ResultsList from "@/components/ResultsList";
import { performSecretSantaDraw } from "@/lib/secretSanta";

const Index = () => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<{ giver: string; receiver: string }[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleAddParticipant = (name: string) => {
    if (participants.includes(name)) {
      toast.error("This name is already in the list!");
      return;
    }
    setParticipants([...participants, name]);
    toast.success(`${name} added to the list!`);
  };

  const handleRemoveParticipant = (index: number) => {
    const name = participants[index];
    setParticipants(participants.filter((_, i) => i !== index));
    toast.info(`${name} removed from the list`);
  };

  const handleDraw = () => {
    try {
      const results = performSecretSantaDraw(participants);
      setAssignments(results);
      setHasDrawn(true);
      toast.success("Secret Santa draw complete! 🎅", {
        description: "Tap each card to reveal assignments",
      });
    } catch (error) {
      toast.error("Something went wrong with the draw");
    }
  };

  const handleReset = () => {
    setParticipants([]);
    setAssignments([]);
    setHasDrawn(false);
    toast.info("Starting fresh!");
  };

  const canDraw = participants.length >= 3;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowfall />
      
      <div className="container py-8 sm:py-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/10 mb-4 animate-bounce-subtle">
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">
            Secret Santa
          </h1>
          <p className="text-muted-foreground text-lg">
            Draw names for your holiday gift exchange
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {!hasDrawn ? (
            <>
              {/* Add Participants Section */}
              <section className="festive-card p-4 sm:p-6">
                <h2 className="font-display text-xl font-semibold mb-4">
                  Add Participants
                </h2>
                <ParticipantInput 
                  onAdd={handleAddParticipant} 
                  disabled={hasDrawn}
                />
              </section>

              {/* Participants List */}
              <section className="festive-card p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold">
                    Participants
                  </h2>
                  <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    {participants.length} {participants.length === 1 ? "person" : "people"}
                  </span>
                </div>
                <ParticipantList
                  participants={participants}
                  onRemove={handleRemoveParticipant}
                  disabled={hasDrawn}
                />
              </section>
            </>
          ) : (
            /* Results Section */
            <section className="festive-card p-4 sm:p-6">
              <ResultsList assignments={assignments} />
            </section>
          )}

          {/* Draw Button */}
          <section>
            <DrawButton
              onDraw={handleDraw}
              onReset={handleReset}
              canDraw={canDraw}
              hasDrawn={hasDrawn}
              participantCount={participants.length}
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p>Happy Holidays! 🎄</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
