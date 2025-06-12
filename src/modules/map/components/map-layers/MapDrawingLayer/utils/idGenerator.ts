/**
 * Generates unique IDs for map areas using crypto.randomUUID()
 * This ensures no collisions even under high load
 */
export const generateAreaId = (): string => {
  return `area-${crypto.randomUUID()}`;
};

// Fallback counter-based generator in case crypto.randomUUID is not available
let counter = 0;
const generateCounterBasedId = (): string => {
  return `area-${Date.now()}-${counter++}`;
};

export const getAreaIdGenerator = () => {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? generateAreaId
    : generateCounterBasedId;
};
