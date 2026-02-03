<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Saving;
use Illuminate\Http\Request;

class SavingController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->savings()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'target_amount' => 'nullable|numeric',
            'current_amount' => 'numeric',
            'interest_rate' => 'nullable|numeric',
            'due_date' => 'nullable|date',
        ]);

        $saving = $request->user()->savings()->create($validated);
        return response()->json($saving, 201);
    }

    public function show($id, Request $request)
    {
        return $request->user()->savings()->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $saving = $request->user()->savings()->findOrFail($id);
        $saving->update($request->all());
        return response()->json($saving);
    }

    public function destroy($id, Request $request)
    {
        $request->user()->savings()->findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
