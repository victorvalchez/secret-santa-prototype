import { useState } from "react";
import { Gift, Eye, EyeOff, Search } from "lucide-react";

interface CheckAssignmentProps {
  onCheck: (name: string, pin: string) => Promise<string | null>;
}

const CheckAssignment = ({ onCheck }: CheckAssignmentProps) => {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || pin.length < 4) return;

    setLoading(true);
    const receiver = await onCheck(name.trim(), pin);
    setLoading(false);
    setResult(receiver);
    setChecked(true);
  };

  const handleReset = () => {
    setName("");
    setPin("");
    setResult(null);
    setChecked(false);
  };

  if (checked && result) {
    return (
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 animate-bounce-subtle">
          <Gift className="w-10 h-10 text-accent" />
        </div>
        
        <div className="space-y-2">
          <p className="text-lg text-muted-foreground">
            {name}, you are giving a gift to:
          </p>
          <p className="font-display text-3xl sm:text-4xl font-bold text-accent animate-scale-in">
            {result}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Remember: keep it a secret! 🤫
        </p>

        <button
          onClick={handleReset}
          className="festive-button"
        >
          Check Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleCheck} className="space-y-4">
      <div className="text-center mb-6">
        <Gift className="w-12 h-12 mx-auto text-accent mb-2" />
        <p className="text-muted-foreground">
          Enter your name and PIN to see who you're gifting
        </p>
      </div>

      <div>
        <label htmlFor="check-name" className="block text-sm font-medium text-foreground mb-1">
          Your Name
        </label>
        <input
          id="check-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          className="festive-input w-full"
          disabled={loading}
          maxLength={30}
        />
      </div>

      <div>
        <label htmlFor="check-pin" className="block text-sm font-medium text-foreground mb-1">
          Your PIN
        </label>
        <div className="relative">
          <input
            id="check-pin"
            type={showPin ? "text" : "password"}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Your 4-digit PIN"
            className="festive-input w-full pr-10"
            disabled={loading}
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
      </div>

      <button
        type="submit"
        disabled={loading || !name.trim() || pin.length < 4}
        className="w-full festive-button-accent flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <Search className="w-5 h-5" />
        {loading ? "Checking..." : "Check My Assignment"}
      </button>

      {checked && !result && (
        <p className="text-center text-sm text-destructive">
          Could not find your assignment. Check your name and PIN.
        </p>
      )}
    </form>
  );
};

export default CheckAssignment;
