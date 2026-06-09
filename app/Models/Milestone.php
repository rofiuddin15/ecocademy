<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Milestone extends Model
{
    use HasUuids;

    protected $fillable = [
        'course_id', 'title', 'instructions',
        'student_activities', 'lms_deliverable', 'content_format',
        'assessment_indicators', 'weight',
        'duration_hours', 'report_type', 'sequence',
    ];




    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }
}
