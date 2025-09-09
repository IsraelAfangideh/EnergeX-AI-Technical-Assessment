<?php

/** @var Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

use Laravel\Lumen\Routing\Router;

$router->get('/api', function () use ($router) {
    return $router->app->version();
});

$router->post('/api/register', 'UserController@register');
$router->post('/api/login', 'UserController@login');


$router->get('/api/posts', function () use ($router) {
    return $router->app->version();
});

$router->post('/api/posts', function () use ($router) {
    return $router->app->version();
});

$router->get('/api/posts/{id}', function () use ($router) {
    return $router->app->version();
});
