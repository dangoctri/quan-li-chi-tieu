<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->query('month', now()->month);
        $year = $request->query('year', now()->year);

        return $request->user()->budgets()
            ->where('month', $month)
            ->where('year', $year)
            ->with('category')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
        ]);

        $budget = $request->user()->budgets()->create($validated);

        return response()->json($budget, 201);
    }

    public function show($id)
    {
        return Auth::user()->budgets()->with('category')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $budget = Auth::user()->budgets()->findOrFail($id);

        $validated = $request->validate([
            'amount' => 'sometimes|required|numeric',
            'month' => 'sometimes|integer|min:1|max:12',
            'year' => 'sometimes|integer',
        ]);

        $budget->update($validated);

        return response()->json($budget);
    }

    public function destroy($id)
    {
        $budget = Auth::user()->budgets()->findOrFail($id);
        $budget->delete();

        return response()->json(['message' => 'Budget deleted successfully']);
    }
}
