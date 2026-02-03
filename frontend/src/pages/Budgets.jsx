import React, { useState, useEffect } from 'react';
import { Plus, Target, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ category_id: '', amount: 0, month: new Date().getMonth() + 1, year: new Date().getFullYear() });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [budgetsRes, categoriesRes] = await Promise.all([
                api.get('/budgets'),
                api.get('/categories')
            ]);
            setBudgets(budgetsRes.data);
            setCategories(categoriesRes.data.filter(c => c.type === 'expense'));
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/budgets', formData);
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            alert('Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Xóa ngân sách này?')) return;
        try {
            await api.delete(`/budgets/${id}`);
            fetchData();
        } catch (error) {
            alert('Failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Ngân Sách Chi Tiêu</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Ngân Sách
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((budget) => (
                    <div key={budget.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{budget.category?.name}</h3>
                                    <p className="text-xs text-gray-500">Tháng {budget.month}/{budget.year}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(budget.id)} className="text-gray-400 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mb-2 flex justify-between text-sm">
                            <span className="text-gray-600">Đã chi: 0đ (Mock)</span>
                            <span className="font-medium">{Number(budget.amount).toLocaleString()}đ</span>
                        </div>
                        {/* Progress Bar Mock */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-right">Tính năng theo dõi thực chi sẽ cập nhật sau</p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Thiết Lập Ngân Sách</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                >
                                    <option value="">Chọn danh mục chi tiêu</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hạn mức (VND)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
