<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Submission extends Model
{
    use HasUuids;

    protected $fillable = ['project_id', 'milestone_id', 'submitted_by', 'file_url', 'student_notes', 'submitted_at'];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(Milestone::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function feedback(): HasOne
    {
        return $this->hasOne(Feedback::class);
    }
}
