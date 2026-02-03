<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->events()
            ->withSum('transactions', 'amount')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'spending_goal' => 'nullable|numeric',
        ]);

        $event = $request->user()->events()->create($validated);
        return response()->json($event, 201);
    }

    public function show($id, Request $request)
    {
        return $request->user()->events()
            ->with(['transactions.category', 'transactions.wallet'])
            ->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $event = $request->user()->events()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'spending_goal' => 'nullable|numeric',
        ]);

        $event->update($validated);
        return response()->json($event);
    }

    public function destroy($id, Request $request)
    {
        $event = $request->user()->events()->findOrFail($id);
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }
}
