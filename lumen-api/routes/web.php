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

$router->post('/api/register', 'UserController@register');

$router->post('/api/login', 'UserController@login');

$router->group(['prefix' => 'api', 'middleware' => 'jwt.auth'], function () use ($router) {
    $router->post('/posts', 'PostController@store');
    $router->get('/posts', 'PostController@index');
    $router->get('/posts/{id}', 'PostController@show');
});
