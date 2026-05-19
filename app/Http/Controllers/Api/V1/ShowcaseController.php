<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ShowcaseController extends Controller
{
    /**
     * Display a listing of showcase projects.
     * Accessible publicly.
     */
    public function index(Request $request)
    {
        // Load completed projects or projects with submissions that have feedbacks
        // We filter by status = completed or those with feedback to represent the showcase
        $projects = Project::where('status', 'completed')
            ->with(['course', 'student', 'submissions.feedback.evaluator'])
            ->get();

        // Map data to present nice showcase metrics
        $showcase = $projects->map(function($project) {
            // Calculate average green impact score and average grade
            $feedbacks = $project->submissions->map(fn($s) => $s->feedback)->filter();
            
            $avgGreenScore = $feedbacks->avg('green_impact_score') ?? 0;
            $avgGrade = $feedbacks->avg('grade') ?? 0;

            return [
                'id' => $project->id,
                'title' => $project->title,
                'umkm_name' => $project->umkm_name,
                'umkm_sector' => $project->umkm_sector,
                'student_name' => $project->student->name,
                'course_title' => $project->course->title,
                'avg_green_impact_score' => round($avgGreenScore, 1),
                'avg_grade' => round($avgGrade, 2),
                'created_at' => $project->created_at,
                'submissions_count' => $project->submissions->count(),
            ];
        });

        return response()->json($showcase);
    }
}
