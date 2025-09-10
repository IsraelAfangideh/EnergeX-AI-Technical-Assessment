<?php

namespace Tests\feature\post;

use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    use DatabaseMigrations;

    protected string $token;

    /**
     * Test successful post creation.
     */
    public function test_create_post_success()
    {
        $payload = [
            'title' => 'My First Post',
            'content' => 'This is the content of my first post.'
        ];

        $this->post('/api/posts', $payload, ['Authorization' => "Bearer {$this->token}"]);
        $this->seeStatusCode(201);

        $data = json_decode($this->response->getContent(), true);

        $this->assertArrayHasKey('id', $data);
        $this->assertEquals($payload['title'], $data['title']);
        $this->assertEquals($payload['content'], $data['content']);
    }

    /**
     * Test post creation fails without title.
     */
    public function test_create_post_missing_title()
    {
        $payload = [
            'content' => 'Content without a title'
        ];

        $this->post('/api/posts', $payload, ['Authorization' => "Bearer {$this->token}"]);
        $this->seeStatusCode(422);

        $data = json_decode($this->response->getContent(), true);
        $this->assertArrayHasKey('title', $data);
        $this->assertEquals('The title field is required.', $data['title'][0]);
    }

    /**
     * Test post creation fails without content.
     */
    public function test_create_post_missing_content()
    {
        $payload = [
            'title' => 'Title without content'
        ];

        $this->post('/api/posts', $payload, ['Authorization' => "Bearer {$this->token}"]);
        $this->seeStatusCode(422);

        $data = json_decode($this->response->getContent(), true);
        $this->assertArrayHasKey('content', $data);
        $this->assertEquals('The content field is required.', $data['content'][0]);
    }

    /**
     * Test post creation fails with unauthenticated request.
     */
    public function test_create_post_unauthenticated()
    {
        $payload = [
            'title' => 'Should Fail',
            'content' => 'No token provided.'
        ];

        $this->post('/api/posts', $payload); // no Authorization header
        $this->seeStatusCode(401);

        $data = json_decode($this->response->getContent(), true);
    }

    /**
     * Test post creation fails with too long title.
     */
    public function test_create_post_title_too_long()
    {
        $payload = [
            'title' => str_repeat('A', 300), // >255 chars
            'content' => 'Content is fine.'
        ];

        $this->post('/api/posts', $payload, ['Authorization' => "Bearer {$this->token}"]);
        $this->seeStatusCode(422);

        $data = json_decode($this->response->getContent(), true);
        $this->assertArrayHasKey('title', $data);
        $this->assertEquals('The title must not be greater than 255 characters.', $data['title'][0]);
    }

    protected function setUp(): void
    {
        parent::setUp();

        // Register a user and get JWT token
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
