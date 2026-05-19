<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request)
    {
        $user = auth('api')->user();
        $query = Project::query()->with(['course', 'student']);

        if ($user->hasRole('admin')) {
            // Admin sees all
        } elseif ($user->hasRole('instructor')) {
            // Instructor sees projects in their courses
            $courseIds = Course::where('instructor_id', $user->id)->pluck('id');
            $query->whereIn('course_id', $courseIds);
        } else {
            // Students see their own projects
            $query->where('student_id', $user->id);
        }

        return response()->json($query->get());
    }

    /**
     * Store a newly created project (Initialize project).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:150',
            'umkm_name' => 'required|string|max:100',
            'umkm_sector' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = auth('api')->user();

        // Check if student already has a project in this course
        $existing = Project::where('course_id', $request->course_id)
            ->where('student_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json(['error' => 'You already have a project registered for this course.'], 400);
        }

        $project = Project::create([
            'course_id' => $request->course_id,
            'student_id' => $user->id,
            'title' => $request->title,
            'umkm_name' => $request->umkm_name,
            'umkm_sector' => $request->umkm_sector,
            'status' => 'planning',
        ]);

        return response()->json($project->load(['course', 'student']), 201);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project)
    {
        $user = auth('api')->user();

        // Check permission
        if (!$user->hasRole('admin') &&
            $project->student_id !== $user->id &&
            $project->course->instructor_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized access to this project.'], 403);
        }

        // Load project with course, student, and submission history + feedback
        return response()->json($project->load([
            'course.milestones',
            'student',
            'submissions.milestone',
            'submissions.feedback.evaluator'
        ]));
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project)
    {
        $user = auth('api')->user();

        // Check permission: Student owns it, or instructor/admin of course
        if (!$user->hasRole('admin') &&
            $project->student_id !== $user->id &&
            $project->course->instructor_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized to update this project.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:150',
            'umkm_name' => 'sometimes|required|string|max:100',
            'umkm_sector' => 'sometimes|required|string|max:50',
            'status' => 'sometimes|required|in:planning,executing,completed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $fields = $request->only(['title', 'umkm_name', 'umkm_sector', 'status']);
        
        // Only instructor or admin can change status
        if ($request->has('status') && !$user->hasRole('admin') && $project->course->instructor_id !== $user->id) {
            unset($fields['status']);
        }

        $project->update($fields);

        return response()->json($project);
    }
}
