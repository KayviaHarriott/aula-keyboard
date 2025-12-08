export interface ElectronAPI {
  readConfig: () => Promise<{ success: boolean; data?: string; error?: string }>;
  writeConfig: (content: string) => Promise<{ success: boolean; error?: string }>;
  changeColor: (colorIndex?: number) => Promise<{ success: boolean; message?: string; error?: string }>;
  breathingSpeed: (direction: 'faster' | 'slower') => Promise<{ success: boolean; message?: string; error?: string }>;
  toggleLightStyle: () => Promise<{ success: boolean; message?: string; error?: string }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
