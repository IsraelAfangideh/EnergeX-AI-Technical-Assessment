<?php

namespace Tests;

use Laravel\Lumen\Testing\DatabaseMigrations;

class UserControllerTest extends TestCase
{

    use DatabaseMigrations;

    /**
     * Test that registration endpoint returns success when sent a valid request.
     *
     * @return void
     */
    public function test_register_success()
    {
        $this->post('/api/register', [
                'name' => 'John Mark',
                'email' => 'johnmark@gmail.com',
                'password' => 'password'
            ]
        );

        print_r($this->response->getContent());
        $this->assertNotNull($this->response->getContent());
        $this->seeStatusCode(201);

    }

    /**
     * Test that registration endpoint returns accurate user data when sent a valid request.
     *
     * @return void
     */
    public function test_register_return_data()
    {
        $this->post('/api/register', [
                'name' => 'John Mark',
                'email' => 'johnmark@gmail.com',
                'password' => 'password'
            ]
        );

        print_r($this->response->getContent());
        $data = json_decode($this->response->getContent(), true);

        $this->assertEquals('John Mark', $data['user']['name']);
        $this->assertArrayHasKey('email', $data['user']);
        $this->assertArrayHasKey('token', $data['user']);
        $this->assertArrayNotHasKey('password', $data['user']);
    }

    /**
     * Test that login endpoint returns success right after registration.
     *
     * @return void
     */
    public function test_register_then_login()
    {
        $this->post('/api/register', [
                'name' => 'John Mark',
                'email' => 'johnmark@gmail.com',
                'password' => 'password'
            ]
        );

        print_r($this->response->getContent());

        $this->post('/api/login', [
            'email' => 'johnmark@gmail.com',
            'password' => 'password'
        ]);
        $this->assertNotNull($this->response->getContent());
        $this->seeStatusCode(200);

        print_r($this->response->getContent());
    }
}
