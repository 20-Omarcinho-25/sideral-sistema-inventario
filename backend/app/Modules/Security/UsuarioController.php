<?php

namespace App\Modules\Security;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /** GET /api/usuarios - Lista de personal activo */
    public function index()
    {
        // No enviamos los passwords al frontend por seguridad
        $usuarios = Usuario::where('estado', true)
            ->select('id_usuario', 'nombre', 'apellido', 'username', 'correo', 'id_rol')
            ->get();
        return response()->json($usuarios);
    }

    /** POST /api/usuarios - Registrar nuevo empleado */
    public function store(Request $request)
    {
        $request->validate([
            'nombre'   => 'required|string|max:50',
            'apellido' => 'required|string|max:50',
            'username' => 'required|string|max:50|unique:usuario,username',
            'correo'   => 'required|email|unique:usuario,correo',
            'password' => 'required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/',
            'id_rol'   => 'required|exists:rol,id_rol'
        ], [
            'password.regex' => 'La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&).'
        ]);

        $usuario = Usuario::create([
            'nombre'        => $request->nombre,
            'apellido'      => $request->apellido,
            'username'      => $request->username,
            'correo'        => $request->correo,
            'password_hash' => Hash::make($request->password), // Encriptación obligatoria
            'id_rol'        => $request->id_rol,
            'estado'        => true
        ]);

        return response()->json(['message' => 'Usuario registrado con éxito', 'id' => $usuario->id_usuario], 201);
    }

    /** DELETE /api/usuarios/{id} - Despedir/Desactivar empleado (Eliminación Lógica) */
    public function destroy($id)
    {
        $usuario = Usuario::findOrFail($id);
        
        // Regla de negocio: Un administrador no puede eliminarse a sí mismo
        if (request()->user() && request()->user()->id_usuario == $id) {
            return response()->json(['message' => 'No puedes desactivar tu propia cuenta.'], 403);
        }

        $usuario->update(['estado' => false]);
        // Opcional: Revocar sus tokens para botarlo del sistema inmediatamente
        $usuario->tokens()->delete();

        return response()->json(['message' => 'Usuario desactivado del sistema.']);
    }
}