// Animation utility functions

export const easeOutQuart = (t) => {
  return 1 - Math.pow(1 - t, 4);
};

export const easeOutCubic = (t) => {
  return 1 - Math.pow(1 - t, 3);
};

export const easeInOutQuad = (t) => {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

export const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const generateDelay = (index, baseDelay = 100) => {
  return index * baseDelay;
};

export const checkReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const checkHoverSupported = () => {
  return window.matchMedia('(hover: hover)').matches;
};

export const checkPointerCoarse = () => {
  return window.matchMedia('(pointer: coarse)').matches;
};
