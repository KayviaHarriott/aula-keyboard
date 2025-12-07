import { useState } from 'react';

export const Home = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');

  const handleKeyPress = (key: string, displayKey?: string) => {
    setActiveKeys(prev => new Set(prev).add(key));
    setMessage(`Pressed: ${displayKey || key}`);
    
    setTimeout(() => {
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }, 200);
  };

  const handleControlFunction = (fn: string) => {
    setMessage(`Function activated: ${fn}`);
    setTimeout(() => setMessage(''), 2000);
  };

  const KeyButton = ({ 
    keyCode, 
    display, 
    className = '', 
    width = 'w-12',
    highlight = false 
  }: { 
    keyCode: string; 
    display?: string; 
    className?: string; 
    width?: string;
    highlight?: boolean;
  }) => (
    <button
      onClick={() => handleKeyPress(keyCode, display || keyCode)}
      className={`
        ${width} h-12 rounded-md font-medium text-sm
        transition-all duration-150 border-2
        ${activeKeys.has(keyCode) 
          ? 'translate-y-1 shadow-sm' 
          : 'shadow-md hover:translate-y-0.5'
        }
        ${highlight 
          ? 'bg-yellow-400 border-yellow-500 hover:bg-yellow-500 text-gray-900' 
          : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-800'
        }
        ${className}
      `}
    >
      <div className="text-xs leading-tight">
        {display ? (
          <div className="flex flex-col">
            {display.split('\n').map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </div>
        ) : keyCode}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Aula Keyboard Simulator</h1>
          <p className="text-gray-300">For macOS Users</p>
          {message && (
            <div className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg">
              {message}
            </div>
          )}
        </div>

        {/* Control Center */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8 shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">🎮 Control Center</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleControlFunction('Color Change (Fn + End)')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="text-lg">🎨 Change Color</div>
              <div className="text-sm opacity-90">Fn + End</div>
            </button>
            
            <button
              onClick={() => handleControlFunction('Breathing Effect - Speed Up (Fn + Right Arrow)')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="text-lg">💨 Breathing Faster</div>
              <div className="text-sm opacity-90">Fn + Right Arrow</div>
            </button>
            
            <button
              onClick={() => handleControlFunction('Breathing Effect - Slow Down (Fn + Left Arrow)')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="text-lg">🌊 Breathing Slower</div>
              <div className="text-sm opacity-90">Fn + Left Arrow</div>
            </button>
            
            <button
              onClick={() => handleControlFunction('Toggle Backlight')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="text-lg">💡 Toggle Light</div>
              <div className="text-sm opacity-90">Quick Control</div>
            </button>
          </div>
        </div>

        {/* Keyboard Layout */}
        <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border-4 border-slate-700">
          {/* Row 1 - Function Keys */}
          <div className="flex gap-1 mb-2 justify-between">
            <div className="flex gap-1">
              <KeyButton keyCode="ESC" display="Esc" highlight={true} />
            </div>
            <div className="flex gap-1">
              <KeyButton keyCode="F1" />
              <KeyButton keyCode="F2" />
              <KeyButton keyCode="F3" />
              <KeyButton keyCode="F4" />
            </div>
            <div className="flex gap-1">
              <KeyButton keyCode="F5" />
              <KeyButton keyCode="F6" />
              <KeyButton keyCode="F7" />
              <KeyButton keyCode="F8" />
            </div>
            <div className="flex gap-1">
              <KeyButton keyCode="F9" />
              <KeyButton keyCode="F10" />
              <KeyButton keyCode="F11" />
              <KeyButton keyCode="F12" />
            </div>
            <div className="flex gap-1">
              <KeyButton keyCode="INS" display="Ins" />
            </div>
          </div>

          {/* Row 2 - Number Row */}
          <div className="flex gap-1 mb-2">
            <KeyButton keyCode="TILDE" display="~\n`" />
            <KeyButton keyCode="1" display="!\n1" />
            <KeyButton keyCode="2" display="@\n2" />
            <KeyButton keyCode="3" display="#\n3" />
            <KeyButton keyCode="4" display="$\n4" />
            <KeyButton keyCode="5" display="%\n5" />
            <KeyButton keyCode="6" display="^\n6" />
            <KeyButton keyCode="7" display="&\n7" />
            <KeyButton keyCode="8" display="*\n8" />
            <KeyButton keyCode="9" display="(\n9" />
            <KeyButton keyCode="0" display=")\n0" />
            <KeyButton keyCode="MINUS" display="_\n-" />
            <KeyButton keyCode="EQUALS" display="+\n=" />
            <KeyButton keyCode="BACKSPACE" display="Backspace" width="w-24" highlight={true} />
            <KeyButton keyCode="DEL" display="Del" />
            <KeyButton keyCode="NUM" display="Num" />
            <KeyButton keyCode="NUMSLASH" display="/" />
            <KeyButton keyCode="NUMSTAR" display="*" />
            <KeyButton keyCode="NUMMINUS" display="-" />
          </div>

          {/* Row 3 - QWERTY Row */}
          <div className="flex gap-1 mb-2">
            <KeyButton keyCode="TAB" display="Tab" width="w-16" />
            <KeyButton keyCode="Q" />
            <KeyButton keyCode="W" />
            <KeyButton keyCode="E" />
            <KeyButton keyCode="R" />
            <KeyButton keyCode="T" />
            <KeyButton keyCode="Y" />
            <KeyButton keyCode="U" />
            <KeyButton keyCode="I" />
            <KeyButton keyCode="O" />
            <KeyButton keyCode="P" />
            <KeyButton keyCode="LBRACKET" display="{\n[" />
            <KeyButton keyCode="RBRACKET" display="}\n]" />
            <KeyButton keyCode="BACKSLASH" display="|\n\\" />
            <KeyButton keyCode="PGUP" display="PgUp" />
            <KeyButton keyCode="NUM7" display="7" />
            <KeyButton keyCode="NUM8" display="8" />
            <KeyButton keyCode="NUM9" display="9" />
            <KeyButton keyCode="NUMPLUS" display="+" className="h-28" />
          </div>

          {/* Row 4 - ASDF Row */}
          <div className="flex gap-1 mb-2">
            <KeyButton keyCode="CAPS" display="Caps Lock" width="w-20" />
            <KeyButton keyCode="A" />
            <KeyButton keyCode="S" />
            <KeyButton keyCode="D" />
            <KeyButton keyCode="F" />
            <KeyButton keyCode="G" />
            <KeyButton keyCode="H" />
            <KeyButton keyCode="J" />
            <KeyButton keyCode="K" />
            <KeyButton keyCode="L" />
            <KeyButton keyCode="SEMICOLON" display=":\n;" />
            <KeyButton keyCode="QUOTE" display={`"\n'`} />
            <KeyButton keyCode="ENTER" display="Enter" width="w-28" />
            <KeyButton keyCode="PGDN" display="PgDn" />
            <KeyButton keyCode="NUM4" display="4" />
            <KeyButton keyCode="NUM5" display="5" />
            <KeyButton keyCode="NUM6" display="6" />
          </div>

          {/* Row 5 - ZXCV Row */}
          <div className="flex gap-1 mb-2">
            <KeyButton keyCode="LSHIFT" display="Shift" width="w-28" />
            <KeyButton keyCode="Z" />
            <KeyButton keyCode="X" />
            <KeyButton keyCode="C" />
            <KeyButton keyCode="V" />
            <KeyButton keyCode="B" />
            <KeyButton keyCode="N" />
            <KeyButton keyCode="M" />
            <KeyButton keyCode="COMMA" display="<\n," />
            <KeyButton keyCode="PERIOD" display=">\n." />
            <KeyButton keyCode="SLASH" display="?\n/" />
            <KeyButton keyCode="RSHIFT" display="Shift" width="w-20" />
            <KeyButton keyCode="UP" display="↑" highlight={true} />
            <KeyButton keyCode="END" display="End" highlight={true} />
            <KeyButton keyCode="NUM1" display="1" />
            <KeyButton keyCode="NUM2" display="2" />
            <KeyButton keyCode="NUM3" display="3" />
            <KeyButton keyCode="NUMENTER" display="Enter" highlight={true} className="h-28" />
          </div>

          {/* Row 6 - Bottom Row */}
          <div className="flex gap-1">
            <KeyButton keyCode="LCTRL" display="Ctrl" width="w-16" />
            <KeyButton keyCode="WIN" display="Win" width="w-16" />
            <KeyButton keyCode="LALT" display="Alt" width="w-16" />
            <KeyButton keyCode="SPACE" display="" width="w-80" highlight={true} />
            <KeyButton keyCode="RALT" display="Alt" width="w-16" />
            <KeyButton keyCode="FN" display="Fn" width="w-12" highlight={true} />
            <KeyButton keyCode="RCTRL" display="Ctrl" width="w-16" />
            <KeyButton keyCode="LEFT" display="←" highlight={true} />
            <KeyButton keyCode="DOWN" display="↓" highlight={true} />
            <KeyButton keyCode="RIGHT" display="→" highlight={true} />
            <KeyButton keyCode="NUM0" display="0" width="w-24" />
            <KeyButton keyCode="NUMDOT" display="." />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">📖 Instructions</h3>
          <ul className="text-gray-300 space-y-2">
            <li>• Click any key to simulate a keypress on your Aula keyboard</li>
            <li>• Use the Control Center buttons to access Fn key combinations</li>
            <li>• <span className="text-yellow-400">Yellow keys</span> indicate special function keys</li>
            <li>• Color Change: Fn + End - Cycles through RGB colors</li>
            <li>• Breathing Effects: Fn + Left/Right Arrow - Adjusts LED breathing speed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};