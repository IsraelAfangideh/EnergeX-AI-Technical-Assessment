<?php

namespace Tests\feature\post;

use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;

class ShowPostTest extends TestCase
{
    use DatabaseMigrations;

    protected string $token;
    protected int $postId;

    /**
     * Test show existing post
     */
    public function test_show_post_success()
    {
        $this->get("/api/posts/{$this->postId}", ['Authorization' => "Bearer {$this->token}"]);
        $this->seeStatusCode(200);

        $data = json_decode($this->response->getContent(), true);
        $this->assertEquals('Test Post', $data['title']);
        $this->assertEquals('Content', $data['content']);
        $this->assertArrayHasKey('author', $data);
        $this->assertEquals('John Mark', $data['author']['name']);
    }

    /**
     * Test show non-existent post
     */
    public function test_show_post_not_found()
    {
        $this->get("/api/posts/999", ['Authorization' => "Bearer {$this->token}"]);
        $this->seeStatusCode(404);
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

        // Create a post
        $payload = ['title' => 'Test Post', 'content' => 'Content'];
        $this->post('/api/posts', $payload, ['Authorization' => "Bearer {$this->token}"]);
        $this->seeStatusCode(201);
        $postData = json_decode($this->response->getContent(), true);
        $this->postId = $postData['id'];
    }
}
