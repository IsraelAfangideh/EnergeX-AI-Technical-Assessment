<?php

namespace Tests\feature\user;

use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;

class LoginTest extends TestCase
{

    use DatabaseMigrations;
    
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
