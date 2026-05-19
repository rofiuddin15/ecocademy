<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
    /**
     * Store feedback for a submission.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'submission_id' => 'required|exists:submissions,id',
            'grade' => 'required|numeric|between:0,100',
            'green_impact_score' => 'required|integer|between:1,5',
            'comments' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $submission = Submission::findOrFail($request->submission_id);
        $course = $submission->project->course;
        $user = auth('api')->user();

        // Ensure user is the instructor of this course or an admin
        if ($course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized. You are not the instructor of this course.'], 403);
        }

        $feedback = Feedback::updateOrCreate(
            ['submission_id' => $request->submission_id],
            [
                'evaluator_id' => $user->id,
                'grade' => $request->grade,
                'green_impact_score' => $request->green_impact_score,
                'comments' => $request->comments,
            ]
        );

        // If this feedback is given, we can also load the updated project status
        // For example, if it's the final milestone, the instructor might mark it completed.
        // We'll let the instructor manually update status or update it automatically if it's the final milestone.
        // But for simplicity, we return the feedback object with relations.
        return response()->json($feedback->load(['submission.project', 'evaluator']), 201);
    }

    /**
     * Display feedback details.
     */
    public function show(Feedback $feedback)
    {
        $user = auth('api')->user();
        $project = $feedback->submission->project;

        // Ensure permission
        if (!$user->hasRole('admin') &&
            $project->student_id !== $user->id &&
            $project->course->instructor_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized access.'], 403);
        }

        return response()->json($feedback->load(['submission.project', 'evaluator']));
    }
}
