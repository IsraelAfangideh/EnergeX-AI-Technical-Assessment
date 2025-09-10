<?php

namespace Tests\feature\user;

use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;

class RegisterTest extends TestCase
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
}
