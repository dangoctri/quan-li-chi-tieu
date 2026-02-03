<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TransactionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('transactions', TransactionController::class);
    Route::apiResource('wallets', App\Http\Controllers\Api\WalletController::class);
    Route::apiResource('budgets', App\Http\Controllers\Api\BudgetController::class);
    Route::post('/transfers', [App\Http\Controllers\Api\TransferController::class, 'store']);

    Route::apiResource('events', App\Http\Controllers\Api\EventController::class);
    Route::apiResource('savings', App\Http\Controllers\Api\SavingController::class);
    Route::apiResource('debts', App\Http\Controllers\Api\DebtController::class);

    Route::get('/dashboard', [App\Http\Controllers\Api\ReportController::class, 'dashboard']);
    Route::get('/reports/expenses', [App\Http\Controllers\Api\ReportController::class, 'expensesByCategory']);
});
