<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DebtController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->debts()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'partner_name' => 'required|string',
            'amount' => 'required|numeric',
            'type' => 'required|in:borrow,lend',
            'due_date' => 'nullable|date',
            'note' => 'nullable|string',
        ]);

        // Creating a debt creates a transaction?
        // Simpler for MVP: Just track debt record.
        // Or user can optionally create a linked transaction.
        // For now, standalone Debt record.

        $debt = $request->user()->debts()->create($validated);
        return response()->json($debt, 201);
    }

    public function update(Request $request, $id)
    {
        $debt = $request->user()->debts()->findOrFail($id);
        $debt->update($request->all());
        return response()->json($debt);
    }

    public function destroy($id, Request $request)
    {
        $request->user()->debts()->findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
