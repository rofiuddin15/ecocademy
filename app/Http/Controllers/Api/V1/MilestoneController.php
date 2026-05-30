<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Milestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MilestoneController extends Controller
{
    /**
     * Store a newly created milestone.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:100',
            'instructions' => 'required|string',
            'duration_hours' => 'required|integer|min:0',
            'report_type' => 'required|string|max:50',
            'sequence' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $course = Course::findOrFail($request->course_id);
        $user = auth('api')->user();

        if ($course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized. You do not own this course.'], 403);
        }

        $milestone = Milestone::create($request->all());
        
        $course->recalculateDuration();

        return response()->json($milestone, 201);
    }

    /**
     * Update the specified milestone.
     */
    public function update(Request $request, Milestone $milestone)
    {
        $course = $milestone->course;
        $user = auth('api')->user();

        if ($course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized. You do not own this course.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:100',
            'instructions' => 'sometimes|required|string',
            'duration_hours' => 'sometimes|required|integer|min:0',
            'report_type' => 'sometimes|required|string|max:50',
            'sequence' => 'sometimes|required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $milestone->update($request->only(['title', 'instructions', 'duration_hours', 'report_type', 'sequence']));
        
        $course->recalculateDuration();

        return response()->json($milestone);
    }

    /**
     * Delete the specified milestone.
     */
    public function destroy(Milestone $milestone)
    {
        $course = $milestone->course;
        $user = auth('api')->user();

        if ($course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized. You do not own this course.'], 403);
        }

        $milestone->delete();
        
        $course->recalculateDuration();

        return response()->json(['message' => 'Milestone deleted successfully']);
    }
}
