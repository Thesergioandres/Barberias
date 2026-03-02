type RegisterSW = (options?: { immediate?: boolean }) => void;

export const registerSW: RegisterSW = () => {
  // No-op in dev to avoid virtual module resolution issues.
};
