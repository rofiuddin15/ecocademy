<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Partner extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'description', 'logo_url', 'sector', 'location'];

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class);
    }

    public function projects(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Project::class, 'target_partner_id');
    }
}
