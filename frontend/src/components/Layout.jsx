import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, LogOut, Wallet, CreditCard, Target, CalendarDays, PiggyBank, BookOpen, Layers } from 'lucide-react';
import api from '../services/api';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
            // Force logout anyway
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const navItems = [
        { path: '/', label: 'Tổng quan', icon: LayoutDashboard },
        { path: '/transactions', label: 'Sổ thu chi', icon: Receipt },
        { path: '/wallets', label: 'Tài khoản', icon: CreditCard },
        { path: '/categories', label: 'Danh mục', icon: Layers },
        { path: '/budgets', label: 'Ngân sách', icon: Target },
        { path: '/events', label: 'Sự kiện', icon: CalendarDays },
        { path: '/savings', label: 'Tiết kiệm', icon: PiggyBank },
        { path: '/debts', label: 'Sổ nợ', icon: BookOpen },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
                <div className="p-6 border-b flex items-center gap-2">
                    <Wallet className="w-8 h-8 text-blue-600" />
                    <h1 className="text-xl font-bold text-gray-800">Sổ Thu Chi</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm p-4 md:hidden flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-blue-600" />
                        <h1 className="font-bold text-gray-800">Sổ Thu Chi</h1>
                    </div>
                    <button onClick={handleLogout} className="text-gray-600">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>
                <div className="p-6 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
