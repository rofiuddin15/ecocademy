<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Material extends Model
{
    use HasUuids;

    protected $fillable = ['module_id', 'title', 'content_type', 'content_url', 'body_text', 'sequence', 'duration_minutes'];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}
