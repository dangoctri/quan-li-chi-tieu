<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Debt extends Model
{
    protected $fillable = ['partner_name', 'amount', 'type', 'due_date', 'note', 'is_paid', 'user_id'];

    protected $casts = [
        'is_paid' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
