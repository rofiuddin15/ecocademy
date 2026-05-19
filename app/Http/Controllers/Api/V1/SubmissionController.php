<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Submission;
use App\Models\Milestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SubmissionController extends Controller
{
    /**
     * Store a newly created submission.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required|exists:projects,id',
            'milestone_id' => 'required|exists:milestones,id',
            'file' => 'nullable|file|mimes:pdf,zip,doc,docx,ppt,pptx,xls,xlsx|max:10240', // Max 10MB
            'file_url' => 'nullable|string|max:255',
            'student_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $project = Project::findOrFail($request->project_id);
        $user = auth('api')->user();

        // Ensure user is the student who owns the project
        if ($project->student_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized. You do not own this project.'], 403);
        }

        // Verify milestone belongs to course
        $milestone = Milestone::findOrFail($request->milestone_id);
        if ($milestone->course_id !== $project->course_id) {
            return response()->json(['error' => 'Invalid milestone. This milestone does not belong to the course.'], 400);
        }

        $fileUrl = $request->file_url;

        // Handle file upload if present
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('submissions', 'public');
            $fileUrl = Storage::url($path);
        }

        if (empty($fileUrl)) {
            return response()->json(['error' => 'You must upload a file or provide a submission link.'], 400);
        }

        // Create or update submission for this project/milestone
        $submission = Submission::updateOrCreate(
            [
                'project_id' => $request->project_id,
                'milestone_id' => $request->milestone_id,
            ],
            [
                'submitted_by' => $user->id,
                'file_url' => $fileUrl,
                'student_notes' => $request->student_notes,
                'submitted_at' => now(),
            ]
        );

        return response()->json($submission->load(['project', 'milestone', 'student']), 201);
    }

    /**
     * Display the specified submission.
     */
    public function show(Submission $submission)
    {
        $user = auth('api')->user();
        $project = $submission->project;

        // Verify permission: student owner, instructor of course, or admin
        if (!$user->hasRole('admin') &&
            $project->student_id !== $user->id &&
            $project->course->instructor_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized access to this submission.'], 403);
        }

        return response()->json($submission->load(['project', 'milestone', 'student', 'feedback.evaluator']));
    }
}
