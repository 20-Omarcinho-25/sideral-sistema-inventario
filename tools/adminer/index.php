<?php
// Envoltorio de Adminer que permite abrir la BD SQLite SIN contraseña.
// Adminer 4.8.1 bloquea por defecto los inicios de sesión sin contraseña
// ("Adminer does not support accessing a database without a password"),
// lo cual impide conectarse a un archivo SQLite local. Al sobrescribir
// login() para que devuelva true, se habilita ese acceso local.
function adminer_object()
{
    class AdminerSinPassword extends Adminer
    {
        public function login($login, $password)
        {
            return true;
        }
    }

    return new AdminerSinPassword();
}

include __DIR__ . '/adminer.php';
