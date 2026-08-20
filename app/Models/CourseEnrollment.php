<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseEnrollment extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'course_id',
        'enrolled_at',
        'completed_at',
    ];

    protected $casts = [
        'enrolled_at'  => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user (student) that enrolled.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the course of the enrollment.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Apakah kursus sudah selesai?
     */
    public function isCompleted(): bool
    {
        return $this->completed_at !== null;
    }
}
