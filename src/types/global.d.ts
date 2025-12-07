export {};

declare global {
  interface Window {
    keyboardAPI: {
      sendCommand: (command: string) => void;
    };
  }
}
declare global {
  interface Window {
    keyboard: {
      pressFnEnd: () => void;
    };
  }
}

export{}