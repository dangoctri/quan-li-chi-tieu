import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import api from '../services/api';

export default function Debts() {
    const [debts, setDebts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ partner_name: '', amount: '', type: 'borrow', due_date: '', note: '' });

    useEffect(() => {
        fetchDebts();
    }, []);

    const fetchDebts = async () => {
        try {
            const { data } = await api.get('/debts');
            setDebts(data);
        } catch (error) {
            console.error('Failed to fetch debts');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/debts', formData);
            fetchDebts();
            setIsModalOpen(false);
            setFormData({ partner_name: '', amount: '', type: 'borrow', due_date: '', note: '' });
        } catch (error) {
            alert('Lỗi');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Xóa khoản nợ này?')) return;
        try {
            await api.delete(`/debts/${id}`);
            fetchDebts();
        } catch (error) {
            alert('Lỗi');
        }
    };

    const togglePaid = async (debt) => {
        try {
            await api.put(`/debts/${debt.id}`, { is_paid: !debt.is_paid });
            fetchDebts();
        } catch (error) {
            alert('Lỗi cập nhật trạng thái');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Sổ Nợ</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Ghi Nợ
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-600">Đối tác</th>
                            <th className="px-6 py-4 font-medium text-gray-600">Loại</th>
                            <th className="px-6 py-4 font-medium text-gray-600">Số tiền</th>
                            <th className="px-6 py-4 font-medium text-gray-600">Hạn trả</th>
                            <th className="px-6 py-4 font-medium text-gray-600">Trạng thái</th>
                            <th className="px-6 py-4 font-medium text-gray-600 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {debts.map((debt) => (
                            <tr key={debt.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{debt.partner_name}</td>
                                <td className="px-6 py-4">
                                    {debt.type === 'borrow' ? (
                                        <span className="flex items-center gap-1 text-red-600 text-sm">
                                            <ArrowDownLeft className="w-4 h-4" /> Đi vay
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-green-600 text-sm">
                                            <ArrowUpRight className="w-4 h-4" /> Cho vay
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-800">{Number(debt.amount).toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-500">{debt.due_date || '-'}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => togglePaid(debt)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border ${debt.is_paid
                                            ? 'bg-green-100 text-green-700 border-green-200'
                                            : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                            }`}
                                    >
                                        {debt.is_paid ? 'Đã xong' : 'Chưa xong'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(debt.id)} className="text-gray-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Ghi Chép Nợ</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
                                <button
                                    type="button"
                                    className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${formData.type === 'borrow' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => setFormData({ ...formData, type: 'borrow' })}
                                >
                                    Tôi đi vay
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${formData.type === 'lend' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => setFormData({ ...formData, type: 'lend' })}
                                >
                                    Tôi cho vay
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên người/đối tác</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.partner_name}
                                    onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hẹn trả</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
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
