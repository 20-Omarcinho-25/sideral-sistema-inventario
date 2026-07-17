<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  string  ...$roles
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $usuario = $request->user();

        if (!$usuario) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        // Si no tiene rol relacionado, denegar acceso
        if (!$usuario->id_rol) {
            return response()->json(['message' => 'Acceso denegado. Usuario sin rol asignado.'], 403);
        }

        // Cargar la relación 'rol' si no está cargada
        $rol = $usuario->rol;
        if (!$rol) {
            return response()->json(['message' => 'Acceso denegado. Rol no encontrado.'], 403);
        }

        $nombreRol = strtolower($rol->nombre_rol);
        $idRol = strtolower($rol->id_rol);

        foreach ($roles as $role) {
            $roleClean = strtolower(trim($role));
            // Validar tanto por el nombre del rol (admin/vendedor) como por su ID (R001/R002)
            if ($nombreRol === $roleClean || $idRol === $roleClean) {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Acceso denegado. Permisos insuficientes.'], 403);
    }
}
