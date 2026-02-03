<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Date handling
        $range = $request->input('range', 'this_month'); // this_month, last_month, this_year
        $startDate = now()->startOfMonth();
        $endDate = now()->endOfMonth();
        $prevStartDate = now()->subMonth()->startOfMonth();
        $prevEndDate = now()->subMonth()->endOfMonth();

        if ($range === 'last_month') {
            $startDate = now()->subMonth()->startOfMonth();
            $endDate = now()->subMonth()->endOfMonth();
            $prevStartDate = now()->subMonth(2)->startOfMonth();
            $prevEndDate = now()->subMonth(2)->endOfMonth();
        } elseif ($range === 'this_year') {
            $startDate = now()->startOfYear();
            $endDate = now()->endOfYear();
            $prevStartDate = now()->subYear()->startOfYear();
            $prevEndDate = now()->subYear()->endOfYear();
        }

        // Helper to sum transactions
        $getSum = function ($start, $end, $type) use ($user) {
            return $user->transactions()
                ->whereBetween('date', [$start, $end])
                ->whereHas('category', function ($q) use ($type) {
                    $q->where('type', $type)
                        ->whereNotIn('name', ['Chuyển tiền đi', 'Nhận tiền đến']);
                })
                ->sum('amount');
        };

        // Current KPIs
        $income = $getSum($startDate, $endDate, 'income');
        $expense = $getSum($startDate, $endDate, 'expense');
        $balance = $user->wallets()->sum('balance'); // Total current balance

        // Previous KPIs (for comparison)
        $prevIncome = $getSum($prevStartDate, $prevEndDate, 'income');
        $prevExpense = $getSum($prevStartDate, $prevEndDate, 'expense');

        // Calculate Growth
        $incomeGrowth = $prevIncome > 0 ? (($income - $prevIncome) / $prevIncome) * 100 : 0;
        $expenseGrowth = $prevExpense > 0 ? (($expense - $prevExpense) / $prevExpense) * 100 : 0;

        // Daily Trend (Line Chart Data)
        $dailyTrend = $user->transactions()
            ->whereBetween('date', [$startDate, $endDate])
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->whereNotIn('categories.name', ['Chuyển tiền đi', 'Nhận tiền đến'])
            ->select(
                'date',
                DB::raw("SUM(CASE WHEN categories.type = 'income' THEN amount ELSE 0 END) as income"),
                DB::raw("SUM(CASE WHEN categories.type = 'expense' THEN amount ELSE 0 END) as expense")
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Wallets Overview
        $wallets = $user->wallets()
            ->select('id', 'name', 'balance', 'currency')
            ->get();

        // Recent transactions
        $recentTransactions = $user->transactions()
            ->with(['category', 'wallet'])
            ->latest('date')
            ->take(5)
            ->get();

        return response()->json([
            'kpi' => [
                'income' => $income,
                'expense' => $expense,
                'balance' => $balance,
                'income_growth' => round($incomeGrowth, 1),
                'expense_growth' => round($expenseGrowth, 1),
            ],
            'trend' => $dailyTrend,
            'wallets' => $wallets,
            'recent_transactions' => $recentTransactions,
        ]);
    }

    public function expensesByCategory(Request $request)
    {
        $user = $request->user();
        $start = $request->input('start_date', now()->startOfMonth());
        $end = $request->input('end_date', now()->endOfMonth());

        $data = $user->transactions()
            ->whereBetween('date', [$start, $end])
            ->whereHas('category', function ($q) {
                $q->where('type', 'expense');
            })
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('sum(transactions.amount) as total'))
            ->groupBy('categories.name')
            ->get();

        return response()->json($data);
    }
}
