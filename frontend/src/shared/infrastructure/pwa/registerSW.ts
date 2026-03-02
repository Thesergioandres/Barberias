type RegisterSWOptions = { immediate?: boolean };

type RegisterSW = (options?: RegisterSWOptions) => void | Promise<void>;

export const registerSW: RegisterSW = async (options) => {
  if (import.meta.env.DEV) {
    return;
  }

  const moduleId = 'virtual:pwa-register';
  const { registerSW } = await import(/* @vite-ignore */ moduleId);
  registerSW(options);
};
