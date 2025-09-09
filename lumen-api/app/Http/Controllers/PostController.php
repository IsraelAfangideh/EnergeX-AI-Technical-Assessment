<?php

namespace App\Http\Controllers;

use App\Models\Post;
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

    public function index()
    {
        $posts = Post::orderBy('created_at', 'desc')->paginate(20);
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


        return response()->json($post, 201);
    }

    public function show(int $id)
    {
        $post = Post::findOrFail($id);
        return response()->json($post);
    }
}
