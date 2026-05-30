<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\PblDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PblDetailController extends Controller
{
    /**
     * Store or Update PBL Detail for a course
     */
    public function storeOrUpdate(Request $request, Course $course)
    {
        $user = auth('api')->user();

        // Check ownership
        if ($course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized action. You do not own this course.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:150',
            'description' => 'nullable|string',
            'target_audience' => 'nullable|string',
            'duration' => 'nullable|string|max:100',
            'report_requirements' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $pblDetail = $course->pblDetail;

        if ($pblDetail) {
            $pblDetail->update($request->only([
                'title', 'description', 'target_audience', 'duration', 'report_requirements'
            ]));
        } else {
            $pblDetail = PblDetail::create([
                'course_id' => $course->id,
                'title' => $request->title,
                'description' => $request->description,
                'target_audience' => $request->target_audience,
                'duration' => $request->duration,
                'report_requirements' => $request->report_requirements,
            ]);
        }

        return response()->json($pblDetail);
    }
}
