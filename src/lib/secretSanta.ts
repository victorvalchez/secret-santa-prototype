/**
 * Performs a Secret Santa draw ensuring no one is assigned to themselves.
 * Uses the Fisher-Yates shuffle with derangement validation.
 */
export function performSecretSantaDraw(
  participants: string[]
): { giver: string; receiver: string }[] {
  if (participants.length < 3) {
    throw new Error("Need at least 3 participants for a Secret Santa draw");
  }

  // Create a valid derangement (no one gets themselves)
  const receivers = createDerangement([...participants]);

  return participants.map((giver, index) => ({
    giver,
    receiver: receivers[index],
  }));
}

/**
 * Creates a derangement of the array (a permutation where no element appears in its original position)
 */
function createDerangement(arr: string[]): string[] {
  const n = arr.length;
  let derangement: string[];
  let isValidDerangement = false;
  let attempts = 0;
  const maxAttempts = 1000;

  while (!isValidDerangement && attempts < maxAttempts) {
    attempts++;
    derangement = shuffleArray([...arr]);
    isValidDerangement = arr.every((item, index) => item !== derangement[index]);
  }

  // Fallback: If random shuffle didn't work, create a simple rotation
  if (!isValidDerangement) {
    derangement = [...arr.slice(1), arr[0]];
  }

  return derangement!;
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
