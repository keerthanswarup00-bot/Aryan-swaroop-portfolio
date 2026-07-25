export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const rand = (min, max) => min + Math.random() * (max - min);
export const chance = probability => Math.random() < probability;
export const padScore = score => String(Math.floor(score)).padStart(5, '0').slice(-5);
