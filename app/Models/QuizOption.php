<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizOption extends Model
{
    use HasUuids;

    protected $fillable = ['question_id', 'option_text', 'is_correct'];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    protected $hidden = [
        'is_correct',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(QuizQuestion::class, 'question_id');
    }
}
