<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\CourseEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseMonitoringController extends Controller
{
    /**
     * Ambil statistik monitoring untuk sebuah kursus.
     * Hanya bisa diakses oleh instruktur pemilik kursus atau admin.
     */
    public function show(Course $course)
    {
        $user = auth('api')->user();

        // Pastikan hanya instruktur pemilik kursus atau admin yang bisa akses
        if ($user->role !== 'admin' && $course->instructor_id !== $user->id) {
            return response()->json(['error' => 'Akses ditolak. Anda bukan instruktur kursus ini.'], 403);
        }

        // ── 1. Stats Utama ────────────────────────────────────────────────────
        $totalEnrolled = CourseEnrollment::where('course_id', $course->id)->count();
        $totalCompleted = CourseEnrollment::where('course_id', $course->id)
            ->whereNotNull('completed_at')
            ->count();
        $completionRate = $totalEnrolled > 0
            ? round(($totalCompleted / $totalEnrolled) * 100, 1)
            : 0;

        // Aktif hari ini: user yang melakukan aktivitas APAPUN terkait kursus ini hari ini
        $activeToday = ActivityLog::where('subject_type', 'Course')
            ->where('subject_id', $course->id)
            ->whereDate('created_at', today())
            ->distinct('user_id')
            ->count('user_id');

        // Aktif minggu ini
        $activeThisWeek = ActivityLog::where('subject_type', 'Course')
            ->where('subject_id', $course->id)
            ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->distinct('user_id')
            ->count('user_id');

        // ── 2. Aktivitas Terbaru (25 log terbaru terkait kursus ini) ─────────
        $recentActivity = ActivityLog::where(function ($q) use ($course) {
                // Aktivitas langsung di kursus
                $q->where(function ($q2) use ($course) {
                    $q2->where('subject_type', 'Course')
                       ->where('subject_id', $course->id);
                })
                // ATAU aktivitas di modul/material kursus (pakai metadata)
                ->orWhere(function ($q2) use ($course) {
                    $q2->whereIn('subject_type', ['Module', 'Material', 'Quiz'])
                       ->where('metadata->course_id', $course->id);
                });
            })
            ->with('user:id,name,avatar,role')
            ->latest()
            ->limit(30)
            ->get()
            ->map(function ($log) {
                $log->action_label = ActivityLog::actionLabel($log->action);
                $log->action_icon  = ActivityLog::actionIcon($log->action);
                return $log;
            });

        // ── 3. Daftar Mahasiswa Terdaftar dengan Status ───────────────────────
        $enrolledStudents = CourseEnrollment::where('course_id', $course->id)
            ->with('user:id,name,email,avatar,role')
            ->latest('enrolled_at')
            ->get()
            ->map(function ($enrollment) use ($course) {
                // Hitung jumlah aktivitas mahasiswa ini di kursus
                $activityCount = ActivityLog::where('user_id', $enrollment->user_id)
                    ->where(function ($q) use ($course) {
                        $q->where(function ($q2) use ($course) {
                            $q2->where('subject_type', 'Course')
                               ->where('subject_id', $course->id);
                        })->orWhere(function ($q2) use ($course) {
                            $q2->whereIn('subject_type', ['Module', 'Material', 'Quiz'])
                               ->where('metadata->course_id', $course->id);
                        });
                    })
                    ->count();

                // Aktivitas terakhir
                $lastActivity = ActivityLog::where('user_id', $enrollment->user_id)
                    ->where(function ($q) use ($course) {
                        $q->where(function ($q2) use ($course) {
                            $q2->where('subject_type', 'Course')
                               ->where('subject_id', $course->id);
                        })->orWhere(function ($q2) use ($course) {
                            $q2->whereIn('subject_type', ['Module', 'Material', 'Quiz'])
                               ->where('metadata->course_id', $course->id);
                        });
                    })
                    ->latest()
                    ->first();

                $isActiveToday = ActivityLog::where('user_id', $enrollment->user_id)
                    ->where('subject_type', 'Course')
                    ->where('subject_id', $course->id)
                    ->whereDate('created_at', today())
                    ->exists();

                return [
                    'user'           => $enrollment->user,
                    'enrolled_at'    => $enrollment->enrolled_at,
                    'completed_at'   => $enrollment->completed_at,
                    'is_completed'   => (bool) $enrollment->completed_at,
                    'is_active_today'=> $isActiveToday,
                    'activity_count' => $activityCount,
                    'last_activity'  => $lastActivity ? [
                        'action'       => $lastActivity->action,
                        'action_label' => ActivityLog::actionLabel($lastActivity->action),
                        'created_at'   => $lastActivity->created_at,
                    ] : null,
                ];
            });

        // ── 4. Grafik Aktivitas Harian (7 hari terakhir) ─────────────────────
        $dailyActivity = ActivityLog::where('subject_type', 'Course')
            ->where('subject_id', $course->id)
            ->where('created_at', '>=', now()->subDays(7))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total, COUNT(DISTINCT user_id) as unique_users')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'course' => [
                'id'    => $course->id,
                'title' => $course->title,
                'image' => $course->image,
                'level' => $course->level,
            ],
            'stats' => [
                'total_enrolled'   => $totalEnrolled,
                'total_completed'  => $totalCompleted,
                'completion_rate'  => $completionRate,
                'active_today'     => $activeToday,
                'active_this_week' => $activeThisWeek,
            ],
            'recent_activity'   => $recentActivity,
            'enrolled_students' => $enrolledStudents,
            'daily_activity'    => $dailyActivity,
        ]);
    }
}
