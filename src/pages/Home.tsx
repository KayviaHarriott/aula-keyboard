import { useState, useEffect } from 'react';

const COLORS = ['Red', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta', 'White'];
const COLOR_HEX = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FFFFFF'];
const MODES = ['Static', 'Breathing', 'Wave', 'Rainbow', 'Reactive', 'Ripple', 'Neon', 'Starry'];

export const Home = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardDetected, setKeyboardDetected] = useState<boolean | null>(null);
  
  // Simulated state for visual feedback
  const [currentColor, setCurrentColor] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(2);
  const [currentMode, setCurrentMode] = useState(0);

  useEffect(() => {
    const detectKeyboard = async () => {
      if (window.electronAPI) {
        const result = await window.electronAPI.detectKeyboard();
        setKeyboardDetected(result.success);
        if (!result.success) {
          setMessage(`⚠️ ${result.error}`);
        } else {
          setMessage(`✅ ${result.keyboard?.product || 'Aula F99 Pro'} detected!`);
          setTimeout(() => setMessage(''), 3000);
        }
      } else {
        setMessage('🌐 Browser Demo Mode - Connect Electron for real keyboard control');
        setTimeout(() => setMessage(''), 4000);
      }
    };
    detectKeyboard();
  }, []);

  const handleChangeColor = async () => {
    setIsLoading(true);
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.changeColor();
        if (result.success) {
          setMessage(`✅ ${result.message || 'Color changed successfully!'}`);
          setCurrentColor((prev) => (prev + 1) % COLORS.length);
        } else {
          setMessage(`❌ ${result.error}`);
        }
      } else {
        // Browser demo mode
        const nextColor = (currentColor + 1) % COLORS.length;
        setCurrentColor(nextColor);
        setMessage(`🎨 Color: ${COLORS[nextColor]} (Demo Mode)`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    }
    setIsLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleBreathingFaster = async () => {
    setIsLoading(true);
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.breathingSpeed('faster');
        if (result.success) {
          setMessage(`✅ ${result.message || 'Breathing speed increased!'}`);
          setCurrentSpeed((prev) => Math.min(prev + 1, 4));
        } else {
          setMessage(`❌ ${result.error}`);
        }
      } else {
        // Browser demo mode
        const nextSpeed = Math.min(currentSpeed + 1, 4);
        setCurrentSpeed(nextSpeed);
        setMessage(`💨 Speed: ${nextSpeed}/4 (Demo Mode)`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    }
    setIsLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleBreathingSlower = async () => {
    setIsLoading(true);
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.breathingSpeed('slower');
        if (result.success) {
          setMessage(`✅ ${result.message || 'Breathing speed decreased!'}`);
          setCurrentSpeed((prev) => Math.max(prev - 1, 0));
        } else {
          setMessage(`❌ ${result.error}`);
        }
      } else {
        // Browser demo mode
        const nextSpeed = Math.max(currentSpeed - 1, 0);
        setCurrentSpeed(nextSpeed);
        setMessage(`🌊 Speed: ${nextSpeed}/4 (Demo Mode)`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    }
    setIsLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleToggleLightStyle = async () => {
    setIsLoading(true);
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.toggleLightStyle();
        if (result.success) {
          setMessage(`✅ ${result.message || 'Light style toggled!'}`);
          setCurrentMode((prev) => (prev + 1) % MODES.length);
        } else {
          setMessage(`❌ ${result.error}`);
        }
      } else {
        // Browser demo mode
        const nextMode = (currentMode + 1) % MODES.length;
        setCurrentMode(nextMode);
        setMessage(`💡 Mode: ${MODES[nextMode]} (Demo Mode)`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    }
    setIsLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Aula Keyboard Control Center</h1>
          <p className="text-gray-300 text-lg">macOS Control Panel</p>
          {message && (
            <div className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
              {message}
            </div>
          )}
        </div>

        {/* Current Status Display */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6 shadow-xl border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4 text-center">📊 Current Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Color</div>
              <div className="flex items-center justify-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                  style={{ backgroundColor: COLOR_HEX[currentColor] }}
                ></div>
                <span className="text-white font-bold">{COLORS[currentColor]}</span>
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Speed</div>
              <div className="text-2xl font-bold text-white">{currentSpeed} / 4</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Mode</div>
              <div className="text-lg font-bold text-white">{MODES[currentMode]}</div>
            </div>
          </div>
        </div>

        {/* Control Center */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">🎮 Control Panel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={handleChangeColor}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-8 px-8 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">🎨</div>
              <div className="text-xl font-bold">Change Color</div>
              <div className="text-sm opacity-90 mt-2">Fn + End</div>
            </button>
            
            <button
              onClick={handleBreathingFaster}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-8 px-8 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">💨</div>
              <div className="text-xl font-bold">Breathing Faster</div>
              <div className="text-sm opacity-90 mt-2">Fn + Right Arrow</div>
            </button>
            
            <button
              onClick={handleBreathingSlower}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-8 px-8 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">🌊</div>
              <div className="text-xl font-bold">Breathing Slower</div>
              <div className="text-sm opacity-90 mt-2">Fn + Left Arrow</div>
            </button>
            
            <button
              onClick={handleToggleLightStyle}
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-8 px-8 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">💡</div>
              <div className="text-xl font-bold">Toggle Light Style</div>
              <div className="text-sm opacity-90 mt-2">Quick Control</div>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">📖 How to Use</h3>
          <ul className="text-gray-300 space-y-2">
            <li>• <strong>Browser Mode</strong>: Click buttons to see UI demo with simulated state changes</li>
            <li>• <strong>Electron Mode</strong>: Run with Electron to control actual keyboard via USB</li>
            <li>• 🎨 <strong>Change Color</strong> - Cycles through RGB colors (Fn + End)</li>
            <li>• 💨 <strong>Breathing Faster</strong> - Speed up LED breathing effect (Fn + Right Arrow)</li>
            <li>• 🌊 <strong>Breathing Slower</strong> - Slow down LED breathing effect (Fn + Left Arrow)</li>
            <li>• 💡 <strong>Toggle Light Style</strong> - Switch between lighting modes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
