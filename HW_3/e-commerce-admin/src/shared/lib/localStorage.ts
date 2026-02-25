export const loadState = <T>(key: string): T | undefined => {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return undefined;
    return JSON.parse(serialized) as T;
  } catch {
    return undefined;
  }
};

export const saveState = <T>(key: string, state: T): void => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(key, serialized);
  } catch {
    // ignore
  }
};

export const removeState = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};
