<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Partner extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'description', 'logo_url'];

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class);
    }
}
