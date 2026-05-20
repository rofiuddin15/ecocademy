<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseSkill extends Model
{
    protected $table = 'course_skills';

    protected $fillable = ['course_id', 'name'];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
