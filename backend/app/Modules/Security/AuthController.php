<?php

namespace App\Modules\Security;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Recibe username + password, valida, emite token Sanctum.
     */
    public function login(Request $request): \Illuminate\Http\JsonResponse
    {
        // 1. Añadimos validación de longitud máxima por seguridad operacional
        $request->validate([
            'username' => 'required|string|max:50',
            'password' => 'required|string|max:255',
        ]);

        $usuario = Usuario::where('username', $request->username)
            ->orWhere('correo', $request->username)
            ->first();

        // 2. Lógica de validación con Hash (Se mantiene igual, ya está bien construida)
        if (!$usuario || !Hash::check($request->password, $usuario->password_hash)) {
            throw ValidationException::withMessages([
                'username' => ['Credenciales incorrectas.'],
            ]);
        }

        if (!$usuario->estado) {
            return response()->json(['message' => 'Usuario inactivo.'], 403);
        }

        // 3. Elimina tokens anteriores y emite uno nuevo
        $usuario->tokens()->delete();
        $token = $usuario->createToken('aiready-token')->plainTextToken;

        return response()->json([
            'token'    => $token,
            'usuario'  => $usuario->only(['id_usuario','nombre','apellido','id_rol']),
        ]);
    }

    /**
     * POST /api/logout
     * Revoca el token actual del usuario autenticado.
     */
    public function logout(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesion cerrada.']);
    }
}
