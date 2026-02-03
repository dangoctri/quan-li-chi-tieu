<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $request->user()->transactions()->with('category');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        if ($request->has('type')) {
            $type = $request->type;
            $query->whereHas('category', function ($q) use ($type) {
                $q->where('type', $type);
            });
        }

        return $query->latest('date')->paginate(20);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'note' => 'nullable|string',
            'date' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'wallet_id' => 'required|exists:wallets,id',
            'event_id' => 'nullable|exists:events,id',
        ]);

        // Ensure category and wallet belong to user
        $request->user()->categories()->findOrFail($validated['category_id']);
        $wallet = $request->user()->wallets()->findOrFail($validated['wallet_id']);

        if (isset($validated['event_id'])) {
            $request->user()->events()->findOrFail($validated['event_id']);
        }

        $transaction = $request->user()->transactions()->create($validated);

        // Update Wallet Balance
        // If income -> add, if expense -> subtract
        $category = $transaction->category;
        if ($category->type === 'income') {
            $wallet->increment('balance', $transaction->amount);
        } else {
            $wallet->decrement('balance', $transaction->amount);
        }

        return response()->json($transaction, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $transaction = Auth::user()->transactions()->with('category')->findOrFail($id);
        return response()->json($transaction);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $transaction = Auth::user()->transactions()->findOrFail($id);

        $validated = $request->validate([
            'amount' => 'sometimes|required|numeric',
            'note' => 'nullable|string',
            'date' => 'sometimes|required|date',
            'category_id' => 'sometimes|required|exists:categories,id',
        ]);

        if (isset($validated['category_id'])) {
            $request->user()->categories()->findOrFail($validated['category_id']);
        }

        $transaction->update($validated);

        return response()->json($transaction);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $transaction = Auth::user()->transactions()->with(['category', 'wallet'])->findOrFail($id);

        // Revert wallet balance
        $wallet = $transaction->wallet;
        if ($wallet) {
            if ($transaction->category->type === 'income') {
                $wallet->decrement('balance', $transaction->amount);
            } else {
                $wallet->increment('balance', $transaction->amount);
            }
        }

        $transaction->delete();

        return response()->json(['message' => 'Transaction deleted successfully']);
    }
}
