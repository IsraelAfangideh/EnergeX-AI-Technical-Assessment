<?php

namespace Tests\feature\user;

use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use DatabaseMigrations;

    /**
     * Test successful login right after registration.
     */
    public function test_register_then_login_success()
    {
        // Register
        $this->post('/api/register', [
            'name' => 'John Mark',
            'email' => 'johnmark@gmail.com',
            'password' => 'password'
        ]);
        $this->seeStatusCode(201);

        // Login
        $this->post('/api/login', [
            'email' => 'johnmark@gmail.com',
            'password' => 'password'
        ]);
        $this->seeStatusCode(200);

        $data = json_decode($this->response->getContent(), true);
        $this->assertArrayHasKey('user', $data);
        $this->assertArrayHasKey('token', $data);
        $this->assertArrayNotHasKey('password', $data['user']);
        $this->assertEquals('John Mark', $data['user']['name']);
    }

    /**
     * Test login with incorrect password.
     */
    public function test_login_wrong_password()
    {
        // Register
        $this->post('/api/register', [
            'name' => 'John Mark',
            'email' => 'johnmark@gmail.com',
            'password' => 'password'
        ]);
        $this->seeStatusCode(201);

        // Attempt login with wrong password
        $this->post('/api/login', [
            'email' => 'johnmark@gmail.com',
            'password' => 'wrongpassword'
        ]);
        $this->seeStatusCode(401);

        $data = json_decode($this->response->getContent(), true);
        $this->assertEquals(['error' => 'Unauthorized'], $data);
    }

    /**
     * Test login with non-existent email.
     */
    public function test_login_nonexistent_email()
    {
        $this->post('/api/login', [
            'email' => 'nouser@example.com',
            'password' => 'password'
        ]);
        $this->seeStatusCode(401);

        $data = json_decode($this->response->getContent(), true);
        $this->assertEquals(['error' => 'Unauthorized'], $data);
    }

    /**
     * Test login with missing fields.
     */
    public function test_login_missing_fields()
    {
        $this->post('/api/login', [
            'email' => ''
        ]);
        $this->seeStatusCode(422);

        $data = json_decode($this->response->getContent(), true);
        $this->assertArrayHasKey('email', $data);
        $this->assertArrayHasKey('password', $data);
        $this->assertEquals('The email field is required.', $data['email'][0]);
        $this->assertEquals('The password field is required.', $data['password'][0]);
    }

    /**
     * Test login with empty password field.
     */
    public function test_login_empty_password()
    {
        $this->post('/api/register', [
            'name' => 'John Mark',
            'email' => 'johnmark@gmail.com',
            'password' => 'password'
        ]);
        $this->seeStatusCode(201);

        // Login attempt with empty password
        $this->post('/api/login', [
            'email' => 'johnmark@gmail.com',
            'password' => ''
        ]);
        $this->seeStatusCode(422);

        $data = json_decode($this->response->getContent(), true);

        // Check that the password field has an error
        $this->assertArrayHasKey('password', $data);
        $this->assertEquals('The password field is required.', $data['password'][0]);
    }

}
