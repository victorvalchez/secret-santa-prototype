import { useState } from "react";
import { Shield, Sparkles, RotateCcw, Settings, Eye, EyeOff, Trash2 } from "lucide-react";

interface AdminPanelProps {
  participantCount: number;
  isDrawn: boolean;
  onDraw: (pin: string) => Promise<boolean>;
  onReset: (pin: string) => Promise<boolean>;
  onUpdatePin: (oldPin: string, newPin: string) => Promise<boolean>;
  onWipe: (pin: string) => Promise<boolean>;
}

const AdminPanel = ({ participantCount, isDrawn, onDraw, onReset, onUpdatePin, onWipe }: AdminPanelProps) => {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newPin, setNewPin] = useState("");

  const canDraw = participantCount >= 3 && !isDrawn;

  const handleDraw = async () => {
    if (!pin || pin.length < 4) return;
    setLoading(true);
    await onDraw(pin);
    setLoading(false);
    setPin("");
  };

  const handleReset = async () => {
    if (!pin || pin.length < 4) return;
    setLoading(true);
    await onReset(pin);
    setLoading(false);
    setPin("");
  };

  const handleWipe = async () => {
    if (!pin || pin.length < 4) return;
    if (!confirm("¿Seguro que quieres eliminar a TODAS las personas participantes? Esta acción no se puede deshacer.")) return;
    setLoading(true);
    await onWipe(pin);
    setLoading(false);
    setPin("");
  };

  const handleUpdatePin = async () => {
    if (!pin || !newPin || newPin.length < 4) return;
    setLoading(true);
    const success = await onUpdatePin(pin, newPin);
    setLoading(false);
    if (success) {
      setPin("");
      setNewPin("");
      setShowSettings(false);
    }
  };

  return (
    <div className="festive-card p-4 sm:p-6 border-2 border-accent/30">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-accent" />
        <h2 className="font-display text-xl font-semibold">Controles de administración</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showSettings ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              PIN actual de administración
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="PIN actual"
                className="festive-input w-full pr-10"
                inputMode="numeric"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Nuevo PIN de administración
            </label>
            <input
              type="text"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Nuevo PIN (4+ dígitos)"
              className="festive-input w-full"
              inputMode="numeric"
            />
          </div>
          <button
            onClick={handleUpdatePin}
            disabled={loading || !pin || !newPin || newPin.length < 4}
            className="w-full festive-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Actualizando..." : "Actualizar PIN"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              PIN de administración
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Ingresa el PIN de administración"
                className="festive-input w-full pr-10"
                inputMode="numeric"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              El PIN predeterminado es 0000 — cámbialo en la configuración
            </p>
          </div>

          <div className="flex gap-2">
            {!isDrawn ? (
              <button
                onClick={handleDraw}
                disabled={loading || !canDraw || pin.length < 4}
                className="flex-1 festive-button-accent flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Sparkles className="w-5 h-5" />
                {loading ? "Realizando sorteo..." : "¡Sortear ahora!"}
              </button>
            ) : (
              <button
                onClick={handleReset}
                disabled={loading || pin.length < 4}
                className="flex-1 festive-button flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-5 h-5" />
                {loading ? "Restableciendo..." : "Reiniciar sorteo"}
              </button>
            )}
          </div>

          {!canDraw && !isDrawn && (
            <p className="text-center text-sm text-muted-foreground">
              Faltan {3 - participantCount} participante{3 - participantCount !== 1 ? "s" : ""}
            </p>
          )}

          {participantCount > 0 && (
            <button
              onClick={handleWipe}
              disabled={loading || pin.length < 4}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar a todas las personas participantes
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
