<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Module extends Model
{
    use HasUuids;

    protected $fillable = ['course_id', 'title', 'description', 'sequence', 'is_project_based'];

    protected $casts = [
        'is_project_based' => 'boolean',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class)->orderBy('sequence');
    }

    public function quiz(): HasOne
    {
        return $this->hasOne(Quiz::class);
    }
}
