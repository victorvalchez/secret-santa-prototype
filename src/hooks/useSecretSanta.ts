import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Participant {
  id: string;
  name: string;
  pin: string;
  assigned_to: string | null;
}

export interface DrawState {
  id: string;
  admin_pin: string;
  is_drawn: boolean;
}

export function useSecretSanta() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [drawState, setDrawState] = useState<DrawState | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch draw state
      const { data: stateData, error: stateError } = await supabase
        .from("draw_state")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (stateError) throw stateError;

      let resolvedState = stateData;

      if (!resolvedState) {
        const { data: insertedState, error: insertError } = await supabase
          .from("draw_state")
          .insert({})
          .select()
          .single();

        if (insertError) throw insertError;
        resolvedState = insertedState;
      }

      setDrawState(resolvedState);

      // Fetch participants
      const { data: participantsData, error: participantsError } = await supabase
        .from("participants")
        .select("*")
        .order("created_at", { ascending: true });

      if (participantsError) throw participantsError;
      setParticipants(participantsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = async (name: string, pin: string) => {
    // Check if name already exists
    if (participants.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Ese nombre ya está en la lista");
      return false;
    }

    // Check if draw already happened
    if (drawState?.is_drawn) {
      toast.error("¡El sorteo ya se realizó!");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("participants")
        .insert({ name, pin })
        .select()
        .single();

      if (error) throw error;
      setParticipants([...participants, data]);
      toast.success(`${name} se unió al Amigo Invisible`);
      return true;
    } catch (error) {
      console.error("Error adding participant:", error);
      toast.error("No se pudo agregar a la persona participante");
      return false;
    }
  };

  const removeParticipant = async (id: string, adminPin: string) => {
    if (drawState?.is_drawn) {
      toast.error("No puedes eliminar personas después del sorteo");
      return false;
    }

    if (drawState?.admin_pin !== adminPin) {
      toast.error("PIN de administración inválido");
      return false;
    }

    try {
      const { error } = await supabase.from("participants").delete().eq("id", id);

      if (error) throw error;
      setParticipants(prev => prev.filter(p => p.id !== id));
      toast.info("Persona participante eliminada");
      return true;
    } catch (error) {
      console.error("Error removing participant:", error);
      toast.error("No se pudo eliminar a la persona participante");
      return false;
    }
  };

  const wipeParticipants = async (adminPin: string) => {
    if (drawState?.admin_pin !== adminPin) {
      toast.error("PIN de administración inválido");
      return false;
    }

    try {
      const { error } = await supabase
        .from("participants")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;
      setParticipants([]);
      
      // Also reset draw state if it was drawn
      if (drawState?.is_drawn) {
        await supabase
          .from("draw_state")
          .update({ is_drawn: false, drawn_at: null })
          .eq("id", drawState.id);
        setDrawState({ ...drawState, is_drawn: false });
      }
      
      toast.success("¡Se eliminaron todas las personas participantes!");
      return true;
    } catch (error) {
      console.error("Error wiping participants:", error);
      toast.error("No se pudo eliminar a las personas participantes");
      return false;
    }
  };

  const performDraw = async (adminPin: string) => {
    // Validate admin PIN
    if (drawState?.admin_pin !== adminPin) {
      toast.error("PIN de administración inválido");
      return false;
    }

    if (participants.length < 3) {
      toast.error("¡Necesitas al menos 3 participantes!");
      return false;
    }

    try {
      // Shuffle participants so join order doesn't influence the cycle
      const shuffledParticipants = secureShuffle(participants);

      // Update each participant with the next person in the shuffled cycle
      await Promise.all(
        shuffledParticipants.map((participant, index) => {
          const receiver = shuffledParticipants[(index + 1) % shuffledParticipants.length];
          return supabase
            .from("participants")
            .update({ assigned_to: receiver.id })
            .eq("id", participant.id);
        })
      );

      // Update draw state
      const { error: stateError } = await supabase
        .from("draw_state")
        .update({ is_drawn: true, drawn_at: new Date().toISOString() })
        .eq("id", drawState.id);

      if (stateError) throw stateError;

      setDrawState({ ...drawState, is_drawn: true });
      await fetchData(); // Refresh participants with assignments
      toast.success("¡Sorteo de Amigo Invisible completado! 🎅");
      return true;
    } catch (error) {
      console.error("Error performing draw:", error);
      toast.error("No se pudo realizar el sorteo");
      return false;
    }
  };

  const checkAssignment = async (name: string, pin: string): Promise<string | null> => {
    const participant = participants.find(
      p => p.name.toLowerCase() === name.toLowerCase() && p.pin === pin
    );

    if (!participant) {
      toast.error("Nombre o PIN incorrecto");
      return null;
    }

    if (!drawState?.is_drawn) {
      toast.error("¡El sorteo aún no ocurre!");
      return null;
    }

    if (!participant.assigned_to) {
      toast.error("No encontramos tu asignación");
      return null;
    }

    const receiver = participants.find(p => p.id === participant.assigned_to);
    return receiver?.name || null;
  };

  const resetDraw = async (adminPin: string) => {
    if (drawState?.admin_pin !== adminPin) {
      toast.error("PIN de administración inválido");
      return false;
    }

    try {
      // Clear all assignments
      const { error: clearError } = await supabase
        .from("participants")
        .update({ assigned_to: null })
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Match all

      if (clearError) throw clearError;

      // Reset draw state
      const { error: stateError } = await supabase
        .from("draw_state")
        .update({ is_drawn: false, drawn_at: null })
        .eq("id", drawState.id);

      if (stateError) throw stateError;

      setDrawState({ ...drawState, is_drawn: false });
      await fetchData();
      toast.success("¡Sorteo reiniciado!");
      return true;
    } catch (error) {
      console.error("Error resetting:", error);
      toast.error("No se pudo reiniciar");
      return false;
    }
  };

  const updateAdminPin = async (oldPin: string, newPin: string) => {
    if (drawState?.admin_pin !== oldPin) {
      toast.error("PIN actual inválido");
      return false;
    }

    try {
      const { error } = await supabase
        .from("draw_state")
        .update({ admin_pin: newPin })
        .eq("id", drawState.id);

      if (error) throw error;
      setDrawState({ ...drawState, admin_pin: newPin });
      toast.success("¡PIN de administración actualizado!");
      return true;
    } catch (error) {
      console.error("Error updating PIN:", error);
      toast.error("No se pudo actualizar el PIN");
      return false;
    }
  };

  return {
    participants,
    drawState,
    loading,
    addParticipant,
    wipeParticipants,
    performDraw,
    checkAssignment,
    resetDraw,
    updateAdminPin,
    removeParticipant,
    refetch: fetchData,
  };
}

function secureShuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 1) {
    return 0;
  }

  const cryptoObj = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;

  if (cryptoObj?.getRandomValues) {
    const array = new Uint32Array(1);
    const maxValid = 0xffffffff - (0xffffffff % maxExclusive);
    let randomNumber = 0xffffffff;

    while (randomNumber >= maxValid) {
      cryptoObj.getRandomValues(array);
      randomNumber = array[0];
    }

    return randomNumber % maxExclusive;
  }

  return Math.floor(Math.random() * maxExclusive);
}
