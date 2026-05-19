<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Feedback extends Model
{
    use HasUuids;

    protected $table = 'feedbacks'; // Spatie sometimes references plurals and we have custom naming

    protected $fillable = ['submission_id', 'evaluator_id', 'grade', 'green_impact_score', 'comments'];

    protected $casts = [
        'grade' => 'float',
        'green_impact_score' => 'integer',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function evaluator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }
}
