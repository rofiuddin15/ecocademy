<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PblDetail extends Model
{
    use HasUuids;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'target_audience',
        'duration',
        'report_requirements',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
