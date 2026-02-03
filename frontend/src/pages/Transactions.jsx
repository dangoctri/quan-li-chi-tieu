import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../services/api';
import TransactionModal from '../components/TransactionModal';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data.data);
        } catch (error) {
            console.error('Error fetching transactions', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
        try {
            await api.delete(`/transactions/${id}`);
            fetchTransactions();
        } catch (error) {
            console.error('Error deleting transaction', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Sổ Thu Chi</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Giao Dịch
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-600">Ngày</th>
                                <th className="px-6 py-4 font-medium text-gray-600">Danh mục</th>
                                <th className="px-6 py-4 font-medium text-gray-600">Ghi chú</th>
                                <th className="px-6 py-4 font-medium text-gray-600">Số tiền</th>
                                <th className="px-6 py-4 font-medium text-gray-600 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-600">{t.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${t.category?.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {t.category?.type === 'income' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {t.category?.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-800">{t.note}</td>
                                    <td className={`px-6 py-4 font-bold ${t.category?.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {t.category?.type === 'income' ? '+' : '-'}{Number(t.amount).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="text-gray-400 hover:text-red-600 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTransactions}
            />
        </div>
    );
};

export default Transactions;
