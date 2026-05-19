<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CourseController;
use App\Http\Controllers\Api\V1\ModuleController;
use App\Http\Controllers\Api\V1\MilestoneController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\SubmissionController;
use App\Http\Controllers\Api\V1\FeedbackController;
use App\Http\Controllers\Api\V1\ShowcaseController;
use App\Http\Controllers\Api\V1\ForumController;
use App\Http\Controllers\Api\V1\QuizController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // 1. Public Endpoints
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);

    Route::get('showcase', [ShowcaseController::class, 'index']);
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{category}', [CategoryController::class, 'show']);
    Route::get('courses', [CourseController::class, 'index']);
    Route::get('courses/{course}', [CourseController::class, 'show']);

    Route::get('forum', [ForumController::class, 'index']);
    Route::get('forum/{forumThread}', [ForumController::class, 'show']);

    // 2. Protected Endpoints (JWT Authenticated)
    Route::middleware('auth:api')->group(function () {
        
        // Auth actions
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::post('auth/refresh', [AuthController::class, 'refresh']);

        // Forum actions
        Route::post('forum', [ForumController::class, 'store']);
        Route::post('forum/{forumThread}/comments', [ForumController::class, 'storeComment']);

        // Projects & Progress
        Route::get('projects', [ProjectController::class, 'index']);
        Route::post('projects', [ProjectController::class, 'store']);
        Route::get('projects/{project}', [ProjectController::class, 'show']);
        Route::put('projects/{project}', [ProjectController::class, 'update']);

        // Submissions
        Route::post('submissions', [SubmissionController::class, 'store']);
        Route::get('submissions/{submission}', [SubmissionController::class, 'show']);

        // Quizzes
        Route::post('quizzes/{quiz}/submit', [QuizController::class, 'submit']);
        Route::get('quizzes/{quiz}/attempts', [QuizController::class, 'attempts']);

        // Feedbacks (Instructors/Admins)
        Route::post('feedbacks', [FeedbackController::class, 'store']);
        Route::get('feedbacks/{feedback}', [FeedbackController::class, 'show']);

        // Course management (Instructors/Admins)
        Route::post('courses', [CourseController::class, 'store']);
        Route::put('courses/{course}', [CourseController::class, 'update']);
        Route::delete('courses/{course}', [CourseController::class, 'destroy']);
        Route::post('courses/{course}/publish', [CourseController::class, 'publish']);

        // Modules (Instructors/Admins)
        Route::post('modules', [ModuleController::class, 'store']);
        Route::put('modules/{module}', [ModuleController::class, 'update']);
        Route::delete('modules/{module}', [ModuleController::class, 'destroy']);

        // Milestones (Instructors/Admins)
        Route::post('milestones', [MilestoneController::class, 'store']);
        Route::put('milestones/{milestone}', [MilestoneController::class, 'update']);
        Route::delete('milestones/{milestone}', [MilestoneController::class, 'destroy']);

        // Categories Write (Admin Only)
        Route::post('categories', [CategoryController::class, 'store']);
        Route::put('categories/{category}', [CategoryController::class, 'update']);
        Route::delete('categories/{category}', [CategoryController::class, 'destroy']);
    });
});
