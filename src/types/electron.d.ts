export interface ElectronAPI {
  detectKeyboard: () => Promise<{ success: boolean; keyboard?: any; error?: string }>;
  changeColor: (colorIndex?: number) => Promise<{ success: boolean; message?: string; error?: string }>;
  breathingSpeed: (direction: 'faster' | 'slower') => Promise<{ success: boolean; message?: string; error?: string }>;
  toggleLightStyle: () => Promise<{ success: boolean; message?: string; error?: string }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
