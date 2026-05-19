<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasUuids;

    protected $fillable = ['title', 'description', 'category_id', 'instructor_id', 'is_published'];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('sequence');
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(Milestone::class)->orderBy('sequence');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
