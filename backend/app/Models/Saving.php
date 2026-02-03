<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Saving extends Model
{
    protected $fillable = ['name', 'target_amount', 'current_amount', 'interest_rate', 'due_date', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
