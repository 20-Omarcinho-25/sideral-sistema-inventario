import { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import logo_AIReady from '../../imports/Logo_AIReady.png';
import { apiFetch } from '../lib/api';
import { loginSchema, type LoginFormData } from '../lib/validations';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación con Zod
    const validationResult = loginSchema.safeParse({ username, password });

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      const firstError = errors[0];
      toast.error(firstError.message);
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        toast.error(errorData?.message ?? 'Credenciales incorrectas');
        return;
      }

      const data = await response.json();
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      if (data?.usuario) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      }

      localStorage.setItem('username', username);
      if (!rememberMe) {
        localStorage.removeItem('rememberMe');
      } else {
        localStorage.setItem('rememberMe', 'true');
      }

      toast.success('Sesión iniciada correctamente');
      navigate('/dashboard');
    } catch {
      toast.error('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8ecef] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1e6b3e] rounded-t-2xl pt-12 pb-8 px-8 flex justify-center">
          <img src={logo_AIReady} alt="AIReady" className="h-12" />
        </div>

        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          <h2 className="text-center text-2xl mb-6">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  maxLength={50}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e6b3e] focus:border-transparent"
                />
              </div>
            </div>

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
                  maxLength={255}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e6b3e] focus:border-transparent"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e6b3e] hover:bg-[#165530] disabled:bg-gray-400 text-white py-2.5 rounded-md transition-colors"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
