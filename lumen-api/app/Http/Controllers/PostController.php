<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;


class PostController extends Controller
{

    /**
     * @throws ValidationException
     */
    protected array $rules = [
        'title' => 'required|string|max:255',
        'content' => 'required|string',
    ];

    private Client $http;

    public function __construct()
    {
        $this->http = new Client([
            'base_uri' => env('NODE_CACHE_URL', 'http://127.0.0.1:3000/'),
            'timeout' => 5.0,
        ]);
    }

    public function index()
    {
        $response = $this->http->get('cache/posts');
        $posts = json_decode($response->getBody(), true);
        return response()->json($posts);
    }

    /**
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        $this->validate($request, $this->rules);

        $post = new Post();
        $post->title = $request->input('title');
        $post->content = $request->input('content');
        $post->user_id = auth()->id();
        $post->save();

        try {
            $this->http->post('cache/posts', [
                'json' => $post->toArray()
            ]);
        } catch (Exception $e) {
            // silently ignore cache update failure
        }

        return response()->json($post, 201);
    }


    public function show(int $id)
    {
        try {
            $response = $this->http->get("cache/posts/{$id}");
            $post = json_decode($response->getBody(), true);
        } catch (ClientException $e) {
            // fallback to DB if Node service fails
            $post = Post::findOrFail($id);
        }

        return response()->json($post);
    }
}
