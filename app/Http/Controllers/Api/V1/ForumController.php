<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ForumThread;
use App\Models\ForumComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ForumController extends Controller
{
    /**
     * Display a listing of forum threads.
     */
    public function index()
    {
        $threads = ForumThread::with(['user'])
            ->withCount('comments')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($threads);
    }

    /**
     * Store a newly created thread in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:150',
            'body' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $thread = ForumThread::create([
            'title' => $request->title,
            'body' => $request->body,
            'user_id' => auth('api')->id(),
        ]);

        return response()->json($thread->load('user'), 201);
    }

    /**
     * Display the specified thread with all its comments.
     */
    public function show(ForumThread $forumThread)
    {
        return response()->json($forumThread->load([
            'user',
            'comments.user' => function($query) {
                $query->orderBy('created_at', 'asc');
            }
        ]));
    }

    /**
     * Store a comment on a thread.
     */
    public function storeComment(Request $request, ForumThread $forumThread)
    {
        $validator = Validator::make($request->all(), [
            'body' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $comment = ForumComment::create([
            'thread_id' => $forumThread->id,
            'user_id' => auth('api')->id(),
            'body' => $request->body,
        ]);

        return response()->json($comment->load('user'), 201);
    }
}
