<?php

namespace Tests\feature\post;

use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;

class GetPostTest extends TestCase
{
    use DatabaseMigrations;

    protected string $token;

    /**
     * Test retrieving empty post list
     */
    public function test_get_posts_empty()
    {
        $this->get('/api/posts', ['Authorization' => "Bearer {$this->token}"]);
        $this->seeStatusCode(200);

        $data = json_decode($this->response->getContent(), true);
        $this->assertIsArray($data);
        $this->assertCount(0, $data);
    }

    /**
     * Test retrieving post list with posts
     */
    public function test_get_posts_with_data()
    {
        // Create some posts
        $payloads = [
            ['title' => 'Post 1', 'content' => 'Content 1'],
            ['title' => 'Post 2', 'content' => 'Content 2'],
        ];

        foreach ($payloads as $payload) {
            $this->post('/api/posts', $payload, ['Authorization' => "Bearer {$this->token}"]);
            $this->seeStatusCode(201);
        }

        // Get posts
        $this->get('/api/posts', ['Authorization' => "Bearer {$this->token}"]);
        $this->seeStatusCode(200);

        $data = json_decode($this->response->getContent(), true);
        $this->assertCount(2, $data);

        foreach ($payloads as $i => $payload) {
            $this->assertEquals($payload['title'], $data[$i]['title']);
            $this->assertEquals($payload['content'], $data[$i]['content']);
        }
    }

    protected function setUp(): void
    {
        parent::setUp();

        // Register & login
        $this->post('/api/register', [
            'name' => 'John Mark',
            'email' => 'johnmark@gmail.com',
            'password' => 'password'
        ]);
        $this->seeStatusCode(201);

        $this->post('/api/login', [
            'email' => 'johnmark@gmail.com',
            'password' => 'password'
        ]);
        $data = json_decode($this->response->getContent(), true);
        $this->token = $data['token'];
    }
}
