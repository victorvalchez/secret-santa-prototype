import { useState } from "react";
import { Gift, Users, Shield, Search } from "lucide-react";
import Snowfall from "@/components/Snowfall";
import JoinForm from "@/components/JoinForm";
import ParticipantsList from "@/components/ParticipantsList";
import AdminPanel from "@/components/AdminPanel";
import CheckAssignment from "@/components/CheckAssignment";
import { useSecretSanta } from "@/hooks/useSecretSanta";

type Tab = "join" | "check" | "admin";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("join");
  const {
    participants,
    drawState,
    loading,
    addParticipant,
    removeParticipant,
    performDraw,
    checkAssignment,
    resetDraw,
    updateAdminPin,
    wipeParticipants,
  } = useSecretSanta();

  const isDrawn = drawState?.is_drawn ?? false;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; hidden?: boolean }[] = [
    { id: "join", label: "Unirse", icon: <Users className="w-4 h-4" />, hidden: isDrawn },
    { id: "check", label: "Consultar", icon: <Search className="w-4 h-4" />, hidden: !isDrawn },
    { id: "admin", label: "Administrar", icon: <Shield className="w-4 h-4" /> },
  ];

  // Switch to check tab when draw happens and user is on join tab
  const visibleTabs = tabs.filter(tab => !tab.hidden);
  const effectiveTab = (() => {
    if (isDrawn && activeTab === "join") return "check";
    if (!isDrawn && activeTab === "check") return "join";
    return activeTab;
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Gift className="w-12 h-12 mx-auto text-accent animate-bounce-subtle mb-4" />
          <p className="text-muted-foreground">Cargando Amigo Invisible...</p>
        </div>
      </div>
    );
  }

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
            Amigo Invisible
          </h1>
          <p className="text-muted-foreground text-lg">
            {isDrawn 
              ? "¡Sorteo completado! Revisa tu asignación abajo"
              : "Únete a las Navidades de los Sánchez"}
          </p>
          {isDrawn && (
            <div className="inline-flex items-center gap-2 mt-3 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium">
              <Gift className="w-4 h-4" />
              Sorteo completado
            </div>
          )}
        </header>

        {/* Tab Navigation */}
        <nav className="flex justify-center mb-6">
          <div className="inline-flex bg-secondary/50 rounded-lg p-1 gap-1">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  effectiveTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-md mx-auto space-y-6">
          {/* Participants List - Always visible */}
          <section className="festive-card p-4 sm:p-6">
            <ParticipantsList participants={participants} isDrawn={isDrawn} />
          </section>

          {/* Tab Content */}
          {effectiveTab === "join" && !isDrawn && (
            <section className="festive-card p-4 sm:p-6">
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Únete al sorteo
              </h2>
              <JoinForm onJoin={addParticipant} disabled={isDrawn} />
            </section>
          )}

          {effectiveTab === "check" && (
            <section className="festive-card p-4 sm:p-6">
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Consulta tu asignación
              </h2>
              {!isDrawn ? (
                <div className="text-center py-6">
                  <Gift className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">
                    Esperando a que la persona administradora realice el sorteo...
                  </p>
                </div>
              ) : (
                <CheckAssignment onCheck={checkAssignment} />
              )}
            </section>
          )}

          {effectiveTab === "admin" && (
            <AdminPanel
              participants={participants.map(({ id, name }) => ({ id, name }))}
              participantCount={participants.length}
              isDrawn={isDrawn}
              onDraw={performDraw}
              onReset={resetDraw}
              onUpdatePin={updateAdminPin}
              onWipe={wipeParticipants}
              onRemoveParticipant={removeParticipant}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p>¡Felices fiestas! 🎄</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
