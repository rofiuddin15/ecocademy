<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Course extends Model
{
    use HasUuids;

    protected $fillable = [
        'title', 
        'description', 
        'category_id', 
        'instructor_id', 
        'is_published',
        'duration',
        'score',
        'rating',
        'image',
        'level',
        'full_description'
    ];

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

    public function submissions()
    {
        return $this->hasManyThrough(Submission::class, Project::class);
    }

    /**
     * Calculate and update the total duration of the course
     * Formula: (Sum of all material duration_minutes / 60) + (Sum of all milestone duration_hours)
     */
    public function recalculateDuration()
    {
        $materialsMinutes = \App\Models\Material::whereHas('module', function($query) {
            $query->where('course_id', $this->id);
        })->sum('duration_minutes');

        $milestonesHours = $this->milestones()->sum('duration_hours');

        // Total in hours (rounding up to nearest integer)
        $totalHours = (int) ceil($materialsMinutes / 60) + $milestonesHours;

        $this->update(['duration' => $totalHours]);

        // Also update pbl_detail duration
        if ($this->pblDetail) {
            $this->pblDetail->update(['duration' => $milestonesHours]);
        }
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function pblDetail(): HasOne
    {
        return $this->hasOne(PblDetail::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(CourseSkill::class);
    }

    public function partners(): BelongsToMany
    {
        return $this->belongsToMany(Partner::class);
    }

    public function pretest(): HasOne
    {
        return $this->hasOne(Quiz::class)->where('type', 'pretest');
    }

    public function posttest(): HasOne
    {
        return $this->hasOne(Quiz::class)->where('type', 'posttest');
    }
}
