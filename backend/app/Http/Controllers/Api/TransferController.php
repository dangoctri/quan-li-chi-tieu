<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransferController extends Controller
{
    /**
     * Handle a transfer between two wallets.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'from_wallet_id' => 'required|exists:wallets,id',
            'to_wallet_id' => 'required|exists:wallets,id|different:from_wallet_id',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'note' => 'nullable|string',
        ]);

        $user = $request->user();

        // Ensure both wallets belong to the user
        $fromWallet = $user->wallets()->findOrFail($validated['from_wallet_id']);
        $toWallet = $user->wallets()->findOrFail($validated['to_wallet_id']);

        // Check sufficient balance
        if ($fromWallet->balance < $validated['amount']) {
            return response()->json(['message' => 'Insufficient balance in source wallet'], 400);
        }

        DB::transaction(function () use ($user, $fromWallet, $toWallet, $validated) {
            // 1. Create Expense Transaction on From Wallet
            // We need a special category for Transfer-Out or just generic Expense?
            // Ideally, the system should have default Transfer categories.
            // For MVP, we'll try to find or create them.

            $transferExpenseCat = $user->categories()->firstOrCreate(
                ['name' => 'Chuyển tiền đi', 'type' => 'expense'],
                ['icon' => 'arrow-right-circle']
            );

            $user->transactions()->create([
                'wallet_id' => $fromWallet->id,
                'category_id' => $transferExpenseCat->id,
                'amount' => $validated['amount'],
                'date' => $validated['date'],
                'note' => 'Chuyển đến: ' . $toWallet->name . '. ' . ($validated['note'] ?? ''),
            ]);

            // Deduct from wallet
            $fromWallet->decrement('balance', $validated['amount']);

            // 2. Create Income Transaction on To Wallet
            $transferIncomeCat = $user->categories()->firstOrCreate(
                ['name' => 'Nhận tiền đến', 'type' => 'income'],
                ['icon' => 'arrow-left-circle']
            );

            $user->transactions()->create([
                'wallet_id' => $toWallet->id,
                'category_id' => $transferIncomeCat->id,
                'amount' => $validated['amount'],
                'date' => $validated['date'],
                'note' => 'Nhận từ: ' . $fromWallet->name . '. ' . ($validated['note'] ?? ''),
            ]);

            // Add to wallet
            $toWallet->increment('balance', $validated['amount']);
        });

        return response()->json(['message' => 'Transfer successful'], 201);
    }
}
