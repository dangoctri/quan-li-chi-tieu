import React, { useState, useEffect } from 'react';
import { Plus, PiggyBank, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function Savings() {
    const [savings, setSavings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', target_amount: '', current_amount: 0, interest_rate: '' });

    useEffect(() => {
        fetchSavings();
    }, []);

    const fetchSavings = async () => {
        try {
            const { data } = await api.get('/savings');
            setSavings(data);
        } catch (error) {
            console.error('Failed to fetch savings');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/savings', formData);
            fetchSavings();
            setIsModalOpen(false);
            setFormData({ name: '', target_amount: '', current_amount: 0, interest_rate: '' });
        } catch (error) {
            alert('Lỗi');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Xóa sổ tiết kiệm này?')) return;
        try {
            await api.delete(`/savings/${id}`);
            fetchSavings();
        } catch (error) {
            alert('Lỗi');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Sổ Tiết Kiệm</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Sổ
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savings.map((saving) => (
                    <div key={saving.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                                    <PiggyBank className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{saving.name}</h3>
                                    <p className="text-xs text-gray-500">Lãi suất: {saving.interest_rate}%/năm</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(saving.id)} className="text-gray-400 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Hiện có:</span>
                                <span className="font-bold text-green-600">{Number(saving.current_amount).toLocaleString()}đ</span>
                            </div>
                            {saving.target_amount > 0 && (
                                <>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Mục tiêu:</span>
                                        <span className="font-medium text-gray-800">{Number(saving.target_amount).toLocaleString()}đ</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                        <div
                                            className="bg-green-500 h-2.5 rounded-full"
                                            style={{ width: `${Math.min((saving.current_amount / saving.target_amount) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Mở Sổ Tiết Kiệm</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sổ</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền gửi ban đầu</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.current_amount}
                                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu (Tùy chọn)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.target_amount}
                                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lãi suất (%/năm)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.interest_rate}
                                    onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
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
