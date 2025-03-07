import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

function generatePassword(options: PasswordOptions): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let validChars = '';
  if (options.uppercase) validChars += uppercaseChars;
  if (options.lowercase) validChars += lowercaseChars;
  if (options.numbers) validChars += numberChars;
  if (options.symbols) validChars += symbolChars;

  if (validChars === '') return '';

  let password = '';
  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * validChars.length);
    password += validChars[randomIndex];
  }

  return password;
}

function getPasswordStrength(password: string, options: PasswordOptions): string {
  if (!password) return 'None';
  
  const length = password.length;
  const varietyCount = [
    options.uppercase,
    options.lowercase,
    options.numbers,
    options.symbols
  ].filter(Boolean).length;

  if (length >= 16 && varietyCount >= 3) return 'Strong';
  if (length >= 12 && varietyCount >= 2) return 'Medium';
  return 'Weak';
}

function App() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false
  });

  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateNewPassword();
  }, [options]);

  const generateNewPassword = () => {
    setPassword(generatePassword(options));
  };

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptionChange = (key: keyof PasswordOptions, value: boolean | number) => {
    const newOptions = { ...options, [key]: value };
    const selectedCount = Object.entries(newOptions)
      .filter(([key]) => key !== 'length')
      .filter(([, value]) => value).length;
    
    if (selectedCount === 0) return;
    setOptions(newOptions);
  };

  const strength = getPasswordStrength(password, options);
  const strengthColors = {
    None: 'bg-gray-200',
    Weak: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Strong: 'bg-green-500'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
          <p className="text-gray-400">Create strong, secure passwords instantly</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-xl space-y-6">
          <div className="relative">
            <div className="flex bg-gray-700 rounded-lg overflow-hidden">
              <input
                type="text"
                readOnly
                value={password}
                className="w-full bg-transparent px-4 py-3 font-mono text-lg focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-4 hover:bg-gray-600 transition-colors flex items-center"
                title="Copy to clipboard"
              >
                {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
              </button>
              <button
                onClick={generateNewPassword}
                className="px-4 hover:bg-gray-600 transition-colors border-l border-gray-600"
                title="Generate new password"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            
            <div className="mt-2 flex items-center gap-2">
              <div className="text-sm">Strength:</div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${strengthColors[strength]}`}>
                {strength}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between">
                <span>Length: {options.length}</span>
                <input
                  type="number"
                  min="8"
                  max="32"
                  value={options.length}
                  onChange={(e) => handleOptionChange('length', Math.min(32, Math.max(8, parseInt(e.target.value) || 8)))}
                  className="w-16 bg-gray-700 rounded px-2 py-1 text-center"
                />
              </label>
              <input
                type="range"
                min="8"
                max="32"
                value={options.length}
                onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={(e) => handleOptionChange('uppercase', e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                <span>Uppercase Letters (A-Z)</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={(e) => handleOptionChange('lowercase', e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                <span>Lowercase Letters (a-z)</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={(e) => handleOptionChange('numbers', e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                <span>Numbers (0-9)</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={(e) => handleOptionChange('symbols', e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                <span>Symbols (!@#$%^&*)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;