import { useState } from "react";
import { UserPlus, Eye, EyeOff } from "lucide-react";

interface JoinFormProps {
  onJoin: (name: string, pin: string) => Promise<boolean>;
  disabled?: boolean;
}

const JoinForm = ({ onJoin, disabled }: JoinFormProps) => {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (!trimmedName || pin.length < 4) return;

    setLoading(true);
    const success = await onJoin(trimmedName, pin);
    setLoading(false);

    if (success) {
      setName("");
      setPin("");
    }
  };

  const isValid = name.trim().length > 0 && pin.length >= 4;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Your Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          className="festive-input w-full"
          disabled={disabled || loading}
          maxLength={30}
        />
      </div>
      
      <div>
        <label htmlFor="pin" className="block text-sm font-medium text-foreground mb-1">
          Your PIN (4+ digits)
        </label>
        <div className="relative">
          <input
            id="pin"
            type={showPin ? "text" : "password"}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="0000"
            className="festive-input w-full pr-10"
            disabled={disabled || loading}
            inputMode="numeric"
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Remember this PIN to check your assignment later
        </p>
      </div>

      <button
        type="submit"
        disabled={disabled || loading || !isValid}
        className="w-full festive-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <UserPlus className="w-5 h-5" />
        {loading ? "Joining..." : "Join Secret Santa"}
      </button>
    </form>
  );
};

export default JoinForm;
