<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ModuleController extends Controller
{
    /**
     * Store a newly created module in database.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:150',
            'description' => 'nullable|string',
            'sequence' => 'required|integer',
            'is_project_based' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $course = Course::findOrFail($request->course_id);
        $user = auth('api')->user();

        if ($course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized. You do not own this course.'], 403);
        }

        $module = Module::create([
            'course_id' => $request->course_id,
            'title' => $request->title,
            'description' => $request->description,
            'sequence' => $request->sequence,
            'is_project_based' => $request->is_project_based ?? false,
        ]);

        return response()->json($module, 201);
    }

    /**
     * Update the specified module.
     */
    public function update(Request $request, Module $module)
    {
        $course = $module->course;
        $user = auth('api')->user();

        if ($course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized. You do not own this course.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:150',
            'description' => 'nullable|string',
            'sequence' => 'sometimes|required|integer',
            'is_project_based' => 'sometimes|required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $module->update($request->only(['title', 'description', 'sequence', 'is_project_based']));

        return response()->json($module);
    }

    /**
     * Delete the specified module.
     */
    public function destroy(Module $module)
    {
        $course = $module->course;
        $user = auth('api')->user();

        if ($course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized. You do not own this course.'], 403);
        }

        $module->delete();

        return response()->json(['message' => 'Module deleted successfully']);
    }
}
