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
        $query = Project::query()->with(['course.milestones', 'student', 'submissions.milestone', 'submissions.feedback', 'targetPartner']);

        if ($user->hasRole('admin')) {
            // Admin sees all
        } elseif ($user->hasRole('instructor')) {
            // Instructor sees projects in their courses
            $courseIds = Course::query()->where('instructor_id', $user->id)->pluck('id');
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
            'course_id'          => 'required|exists:courses,id',
            'title'              => 'required|string|max:150',
            'umkm_name'          => 'nullable|string|max:100',
            'umkm_sector'        => 'nullable|string|max:50',
            'budget'             => 'nullable|numeric|min:0',
            'proposal_description' => 'nullable|string',
            'target_partner_id'  => 'nullable|exists:partners,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = auth('api')->user();

        // Cek apakah mahasiswa sudah mendaftar proyek di kursus ini
        $existing = Project::where('course_id', $request->course_id)
            ->where('student_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json(['error' => 'Anda sudah memiliki proyek yang terdaftar untuk kursus ini.'], 400);
        }

        $project = Project::create([
            'course_id'            => $request->course_id,
            'student_id'           => $user->id,
            'title'                => $request->title,
            'umkm_name'            => $request->umkm_name,
            'umkm_sector'          => $request->umkm_sector,
            'budget'               => $request->budget,
            'proposal_description' => $request->proposal_description,
            'target_partner_id'    => $request->target_partner_id,
            'status'               => 'pending', // Menunggu persetujuan dosen
        ]);

        return response()->json($project->load(['course', 'student', 'targetPartner']), 201);
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
            'submissions.feedback.evaluator',
            'targetPartner'
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
            'title'                => 'sometimes|required|string|max:150',
            'umkm_name'            => 'sometimes|nullable|string|max:100',
            'umkm_sector'          => 'sometimes|nullable|string|max:50',
            'budget'               => 'sometimes|nullable|numeric|min:0',
            'proposal_description' => 'sometimes|nullable|string',
            'target_partner_id'    => 'sometimes|nullable|exists:partners,id',
            'status'               => 'sometimes|required|in:pending,approved,rejected,planning,executing,completed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $fields = $request->only(['title', 'umkm_name', 'umkm_sector', 'budget', 'proposal_description', 'target_partner_id', 'status']);
        
        // Hanya instruktur/admin yang bisa mengubah status
        if ($request->has('status') && !$user->hasRole('admin') && $project->course->instructor_id !== $user->id) {
            unset($fields['status']);
        }

        // Jika mahasiswa mengedit proposal yang ditolak, reset status ke pending
        if ($project->status === 'rejected' && $project->student_id === $user->id) {
            $fields['status'] = 'pending';
            $fields['rejection_comment'] = null;
        }

        $project->update($fields);

        return response()->json($project);
    }

    /**
     * Review the specified project proposal (Approve/Reject).
     */
    public function review(Request $request, Project $project)
    {
        $user = auth('api')->user();

        // Check permission: Must be instructor of course or admin
        if (!$user->hasRole('admin') && $project->course->instructor_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized to review this proposal.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status'             => 'required|in:approved,rejected',
            'rejection_comment'  => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $updateData = ['status' => $request->status];

        if ($request->status === 'approved') {
            // Hapus catatan penolakan sebelumnya (jika ada)
            $updateData['rejection_comment'] = null;
        } elseif ($request->status === 'rejected') {
            $updateData['rejection_comment'] = $request->rejection_comment;
        }

        $project->update($updateData);

        $message = $request->status === 'approved'
            ? 'Proposal proyek berhasil disetujui.'
            : 'Proposal proyek ditolak. Mahasiswa dapat merevisi dan mengajukan kembali.';

        return response()->json(['message' => $message, 'project' => $project]);
    }
}
