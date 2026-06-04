import { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import logoImage from '../../imports/Logo_AIReady.png';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de login exitoso
    if (username && password) {
      localStorage.setItem('username', username);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#e8ecef] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Green header with logo */}
        <div className="bg-[#1e6b3e] rounded-t-2xl pt-12 pb-8 px-8 flex justify-center">
          <img src={logoImage} alt="AIReady" className="h-12" />
        </div>

        {/* White login card */}
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          <h2 className="text-center text-2xl mb-6">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="block text-sm text-gray-600 mb-1">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e6b3e] focus:border-transparent"
                  placeholder=""
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e6b3e] focus:border-transparent"
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-gray-400 focus:ring-2 focus:ring-[#1e6b3e] focus:ring-offset-0 accent-white"
                  style={{ backgroundColor: 'white', accentColor: rememberMe ? '#1e6b3e' : 'white' }}
                />
                <span className="text-gray-600">Recordarme</span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-[#1e6b3e] hover:bg-[#165530] text-white py-2.5 rounded-md transition-colors"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
