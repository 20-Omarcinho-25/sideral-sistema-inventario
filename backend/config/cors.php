<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],

    // Permite el acceso desde otros equipos de la red local (hotspot / LAN):
    // cualquier IP privada (192.168.x.x, 10.x.x.x, 172.16-31.x.x) en el puerto 5173.
    'allowed_origins_patterns' => [
        '#^http://(192\.168|10|172\.(1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}:5173$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
