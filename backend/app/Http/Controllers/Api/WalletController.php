<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WalletController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->wallets;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'balance' => 'numeric',
            'currency' => 'string|max:3'
        ]);

        $wallet = $request->user()->wallets()->create([
            'name' => $validated['name'],
            'balance' => $validated['balance'] ?? 0,
            'currency' => $validated['currency'] ?? 'VND',
        ]);

        return response()->json($wallet, 201);
    }

    public function show($id)
    {
        return Auth::user()->wallets()->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $wallet = Auth::user()->wallets()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'balance' => 'sometimes|numeric',
            'currency' => 'sometimes|string|max:3'
        ]);

        $wallet->update($validated);

        return response()->json($wallet);
    }

    public function destroy($id)
    {
        $wallet = Auth::user()->wallets()->findOrFail($id);
        $wallet->delete();

        return response()->json(['message' => 'Wallet deleted successfully']);
    }
}
