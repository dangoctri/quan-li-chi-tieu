import React, { useState, useEffect } from 'react';
import { Plus, Wallet, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function Wallets() {
    const [wallets, setWallets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({ name: '', balance: 0, currency: 'VND', id: null });

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const { data } = await api.get('/wallets');
            setWallets(data);
        } catch (error) {
            console.error('Failed to fetch wallets', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/wallets/${formData.id}`, formData);
            } else {
                await api.post('/wallets', formData);
            }
            fetchWallets();
            setIsModalOpen(false);
            setFormData({ name: '', balance: 0, currency: 'VND', id: null });
        } catch (error) {
            alert('Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa ví này? Giao dịch liên quan sẽ bị ảnh hưởng.')) return;
        try {
            await api.delete(`/wallets/${id}`);
            fetchWallets();
        } catch (error) {
            alert('Không thể xóa ví');
        }
    };

    const openEdit = (wallet) => {
        setIsEdit(true);
        setFormData({ ...wallet });
        setIsModalOpen(true);
    };

    const openNew = () => {
        setIsEdit(false);
        setFormData({ name: '', balance: 0, currency: 'VND', id: null });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Quản Lý Ví</h2>
                <button
                    onClick={openNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Ví
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallets.map((wallet) => (
                    <div key={wallet.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-48">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(wallet)} className="text-gray-400 hover:text-blue-600">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(wallet.id)} className="text-gray-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg">{wallet.name}</h3>
                            <p className="text-sm text-gray-500">Số dư hiện tại</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                            {Number(wallet.balance).toLocaleString()} {wallet.currency}
                        </p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">
                            {isEdit ? 'Chỉnh Sửa Ví' : 'Thêm Ví Mới'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên ví</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ví dụ: Tiền mặt, Vietcombank..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số dư ban đầu</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.balance}
                                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                    disabled={isEdit} // Prevent balance hack via edit? Normally seed balance is only set once.
                                />
                                {isEdit && <p className="text-xs text-gray-500 mt-1">Không thể sửa số dư trực tiếp. Hãy tạo giao dịch điều chỉnh.</p>}
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
