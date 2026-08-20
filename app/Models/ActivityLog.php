<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'action',
        'subject_type',
        'subject_id',
        'subject_name',
        'metadata',
        'ip_address',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the user that owns the activity log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope untuk filter berdasarkan aksi
     */
    public function scopeOfAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope untuk filter aktivitas hari ini
     */
    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    /**
     * Scope untuk filter berdasarkan subject (kursus tertentu, modul tertentu, dll.)
     */
    public function scopeForSubject($query, string $type, string $id)
    {
        return $query->where('subject_type', $type)->where('subject_id', $id);
    }

    /**
     * Helper statis untuk mencatat aktivitas dengan mudah
     */
    public static function record(
        string $userId,
        string $action,
        ?string $subjectType = null,
        ?string $subjectId = null,
        ?string $subjectName = null,
        ?array $metadata = null,
        ?string $ipAddress = null
    ): self {
        return self::create([
            'user_id'      => $userId,
            'action'       => $action,
            'subject_type' => $subjectType,
            'subject_id'   => $subjectId,
            'subject_name' => $subjectName,
            'metadata'     => $metadata,
            'ip_address'   => $ipAddress,
        ]);
    }

    /**
     * Daftar label aksi yang human-readable (untuk tampilan frontend)
     */
    public static function actionLabel(string $action): string
    {
        return match ($action) {
            'login'            => 'Login ke sistem',
            'logout'           => 'Logout dari sistem',
            'view_course'      => 'Membuka kursus',
            'enroll_course'    => 'Mendaftar kursus',
            'complete_course'  => 'Menyelesaikan kursus',
            'view_material'    => 'Membaca/menonton materi',
            'submit_quiz'      => 'Mengerjakan kuis',
            'view_forum'       => 'Membuka forum diskusi',
            'post_forum'       => 'Membuat postingan forum',
            'submit_project'   => 'Mengirim tugas proyek',
            'view_project'     => 'Membuka halaman proyek',
            'submit_milestone' => 'Mengirim milestone proyek',
            'view_showcase'    => 'Membuka Green Showcase',
            default            => ucfirst(str_replace('_', ' ', $action)),
        };
    }

    /**
     * Icon Material Symbol untuk tiap aksi
     */
    public static function actionIcon(string $action): string
    {
        return match ($action) {
            'login'            => 'login',
            'logout'           => 'logout',
            'view_course'      => 'school',
            'enroll_course'    => 'how_to_reg',
            'complete_course'  => 'task_alt',
            'view_material'    => 'play_circle',
            'submit_quiz'      => 'quiz',
            'view_forum'       => 'forum',
            'post_forum'       => 'edit_note',
            'submit_project'   => 'upload_file',
            'view_project'     => 'folder_open',
            'submit_milestone' => 'check_circle',
            'view_showcase'    => 'eco',
            default            => 'history',
        };
    }
}
