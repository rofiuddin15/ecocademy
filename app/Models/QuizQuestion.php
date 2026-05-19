<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizQuestion extends Model
{
    use HasUuids;

    protected $fillable = ['quiz_id', 'question_text', 'options', 'correct_answer', 'sequence'];

    protected $casts = [
        'options' => 'array',
    ];

    protected $hidden = [
        'correct_answer',
    ];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }
}
