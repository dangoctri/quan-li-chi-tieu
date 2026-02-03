import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import api from '../services/api';
import ExpenseChart from '../components/ExpenseChart';
import TransactionModal from '../components/TransactionModal';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('this_month');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState({
        kpi: { income: 0, expense: 0, balance: 0, income_growth: 0, expense_growth: 0 },
        trend: [],
        wallets: [],
        recent_transactions: []
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/dashboard?range=${range}`);
            setData(res.data);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [range]);

    // Trend Chart Config
    const trendData = {
        labels: data.trend.map(t => t.date.split('-').slice(1).join('/')), // MM/DD
        datasets: [
            {
                label: 'Thu nhập',
                data: data.trend.map(t => t.income),
                borderColor: '#10B981', // green-500
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Chi tiêu',
                data: data.trend.map(t => t.expense),
                borderColor: '#EF4444', // red-500
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const trendOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Tổng Quan Tài Chính</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm Nhanh
                    </button>
                </div>
                <div className="flex bg-white rounded-lg shadow-sm p-1 border">
                    <button
                        onClick={() => setRange('this_month')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${range === 'this_month' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Tháng này
                    </button>
                    <button
                        onClick={() => setRange('last_month')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${range === 'last_month' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Tháng trước
                    </button>
                    <button
                        onClick={() => setRange('this_year')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${range === 'this_year' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Năm nay
                    </button>
                </div>
            </div>

            {/* Smart Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Income */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <ArrowUpCircle className="w-6 h-6" />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${data.kpi.income_growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {data.kpi.income_growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(data.kpi.income_growth)}%
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tổng Thu Nhập</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">
                            {Number(data.kpi.income).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Expense */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-xl text-red-600">
                            <ArrowDownCircle className="w-6 h-6" />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${data.kpi.expense_growth <= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {/* Logic reversed for expense: growth is bad (red), decline is good (green) */}
                            {data.kpi.expense_growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(data.kpi.expense_growth)}%
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tổng Chi Tiêu</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">
                            {Number(data.kpi.expense).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Balance */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Wallet className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tổng Tài Sản</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">
                            {Number(data.kpi.balance).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Trend Chart & Wallets */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Trend Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-gray-500" />
                            Xu Hướng Dòng Tiền
                        </h3>
                        <div className="h-64">
                            <Line data={trendData} options={trendOptions} />
                        </div>
                    </div>

                    {/* Wallets Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data.wallets.map(w => (
                            <div key={w.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Wallet className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{w.name}</p>
                                        <p className="text-xs text-gray-500">Tiền mặt</p>
                                    </div>
                                </div>
                                <span className="font-bold text-gray-800">{Number(w.balance).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Expense Structure & Recent */}
                <div className="space-y-6">
                    {/* Expense Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Cơ Cấu Chi Tiêu</h3>
                        <ExpenseChart />
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Giao Dịch Mới</h3>
                        <div className="space-y-4">
                            {data.recent_transactions.map(t => (
                                <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-0 border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.category?.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {t.category?.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{t.category?.name || 'Khác'}</p>
                                            <p className="text-xs text-gray-500">{t.date}</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-bold ${t.category?.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {t.category?.type === 'income' ? '+' : '-'}{Number(t.amount).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            {data.recent_transactions.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-4">Chưa có dữ liệu</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    );
};

export default Dashboard;
