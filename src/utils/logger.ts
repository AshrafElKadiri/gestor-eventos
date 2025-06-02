/* eslint-disable @typescript-eslint/no-explicit-any */
export const logInfo = (message: string, data?: any) => {
  console.info(`[INFO] ${message}`, data);
};

export const logWarn = (message: string, data?: any) => {
  console.warn(`[WARN] ${message}`, data);
};

export const logError = (message: string, data?: any) => {
  console.error(`[ERROR] ${message}`, data);
};
