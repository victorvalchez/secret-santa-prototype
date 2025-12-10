import { useState } from "react";
import { UserPlus } from "lucide-react";

interface ParticipantInputProps {
  onAdd: (name: string) => void;
  disabled?: boolean;
}

const ParticipantInput = ({ onAdd, disabled }: ParticipantInputProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      onAdd(trimmedName);
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter participant name..."
        className="festive-input flex-1"
        disabled={disabled}
        maxLength={30}
      />
      <button
        type="submit"
        disabled={disabled || !name.trim()}
        className="festive-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <UserPlus className="w-5 h-5" />
        <span className="hidden sm:inline">Add</span>
      </button>
    </form>
  );
};

export default ParticipantInput;
