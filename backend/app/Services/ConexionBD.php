<?php

namespace App\Services;

class ConexionBD
{
    private static ?ConexionBD $instancia = null;
    private PDO $conexion;

    private function __construct()
    {
        try {
            $this->conexion = new PDO(
                "mysql:host=127.0.0.1;dbname=gestioninventario;charset=utf8",
                "root",
                ""
            );

            $this->conexion->setAttribute(
                PDO::ATTR_ERRMODE,
                PDO::ERRMODE_EXCEPTION
            );

        } catch (PDOException $e) {
            die("Error de conexión: " . $e->getMessage());
        }
    }

    public static function getInstancia(): ConexionBD
    {
        if (self::$instancia === null) {
            self::$instancia = new ConexionBD();
        }

        return self::$instancia;
    }

    public function getConexion(): PDO
    {
        return $this->conexion;
    }
}

