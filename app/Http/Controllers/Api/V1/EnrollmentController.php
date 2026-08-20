<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\CourseEnrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Daftarkan mahasiswa ke kursus (Enroll).
     * Jika sudah terdaftar, kembalikan data enrollment yang ada.
     */
    public function enroll(Course $course)
    {
        $user = auth('api')->user();

        // Cek apakah sudah terdaftar
        $existing = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message'    => 'Sudah terdaftar di kursus ini.',
                'enrollment' => $existing,
                'already_enrolled' => true,
            ]);
        }

        // Buat enrollment baru
        $enrollment = CourseEnrollment::create([
            'user_id'     => $user->id,
            'course_id'   => $course->id,
            'enrolled_at' => now(),
        ]);

        // Catat activity log
        ActivityLog::record(
            userId:      $user->id,
            action:      'enroll_course',
            subjectType: 'Course',
            subjectId:   $course->id,
            subjectName: $course->title,
            metadata:    ['course_title' => $course->title],
        );

        return response()->json([
            'message'    => 'Berhasil mendaftar kursus.',
            'enrollment' => $enrollment,
            'already_enrolled' => false,
        ], 201);
    }

    /**
     * Tandai kursus sebagai selesai untuk user yang sedang login.
     */
    public function complete(Course $course)
    {
        $user = auth('api')->user();

        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) {
            return response()->json(['error' => 'Tidak terdaftar di kursus ini.'], 404);
        }

        if ($enrollment->completed_at) {
            return response()->json([
                'message'    => 'Kursus sudah ditandai selesai sebelumnya.',
                'enrollment' => $enrollment,
            ]);
        }

        $enrollment->update(['completed_at' => now()]);

        // Catat activity log
        ActivityLog::record(
            userId:      $user->id,
            action:      'complete_course',
            subjectType: 'Course',
            subjectId:   $course->id,
            subjectName: $course->title,
            metadata:    ['course_title' => $course->title],
        );

        return response()->json([
            'message'    => 'Kursus berhasil ditandai selesai.',
            'enrollment' => $enrollment,
        ]);
    }

    /**
     * Cek status enrollment user untuk kursus tertentu.
     */
    public function status(Course $course)
    {
        $user = auth('api')->user();

        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        return response()->json([
            'is_enrolled'  => (bool) $enrollment,
            'is_completed' => $enrollment ? (bool) $enrollment->completed_at : false,
            'enrollment'   => $enrollment,
        ]);
    }

    /**
     * Daftar semua kursus yang diikuti user.
     */
    public function myEnrollments()
    {
        $user = auth('api')->user();

        $enrollments = CourseEnrollment::where('user_id', $user->id)
            ->with('course:id,title,description,image,level,duration,is_published')
            ->latest('enrolled_at')
            ->get();

        return response()->json($enrollments);
    }
}
