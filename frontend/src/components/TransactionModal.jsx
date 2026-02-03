import React, { useState, useEffect } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import api from '../services/api';
import { parseTransaction } from '../utils/parseTransaction';

const TransactionModal = ({ isOpen, onClose, onSuccess }) => {
    const [categories, setCategories] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [events, setEvents] = useState([]);

    // UI State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [smartInput, setSmartInput] = useState('');

    const handleSmartParse = () => {
        if (!smartInput.trim()) return;

        const result = parseTransaction(smartInput, categories);
        if (result) {
            setFormData(prev => ({
                ...prev,
                amount: result.amount || prev.amount,
                note: result.note || prev.note,
                type: result.type || prev.type,
                category_id: result.category_id || prev.category_id
            }));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSmartParse();
        }
    };


    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category_id: '',
        wallet_id: '',
        to_wallet_id: '',
        event_id: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
            setSmartInput('');
        }
    }, [isOpen]);

    const fetchInitialData = async () => {
        try {
            const [cats, walls, evts] = await Promise.all([
                api.get('/categories'),
                api.get('/wallets'),
                api.get('/events')
            ]);
            setCategories(cats.data);
            setWallets(walls.data);
            setEvents(evts.data);

            // Set default wallet if not set
            if (!formData.wallet_id && walls.data.length > 0) {
                setFormData(prev => ({ ...prev, wallet_id: walls.data[0].id }));
            }
        } catch (error) {
            console.error('Error fetching form data', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/categories', {
                name: newCategoryName,
                type: formData.type,
                icon: ''
            });
            await fetchCategories();
            setFormData(prev => ({ ...prev, category_id: data.id }));
            setIsCategoryModalOpen(false);
            setNewCategoryName('');
        } catch (error) {
            alert('Lỗi tạo danh mục');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.type === 'transfer') {
                await api.post('/transfers', {
                    from_wallet_id: formData.wallet_id,
                    to_wallet_id: formData.to_wallet_id,
                    amount: formData.amount,
                    date: formData.date,
                    note: formData.note
                });
            } else {
                await api.post('/transactions', formData);
            }

            // Reset form partly but keep date/wallet
            setFormData(prev => ({ ...prev, amount: '', note: '' }));
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save', error);
            alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
        }
    };

    if (!isOpen) return null;

    const filteredCategories = categories.filter(c => c.type === formData.type);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Thêm Giao Dịch Mới</h3>

                {/* Smart Input Section */}
                <div className="mb-6 relative">
                    <label className="block text-xs font-bold text-blue-600 mb-1 uppercase tracking-wide">Nhập liệu thông minh</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 placeholder-blue-300"
                            placeholder="Ví dụ: Cafe 50k, Lương 15m..."
                            value={smartInput}
                            onChange={(e) => setSmartInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleSmartParse}
                        />
                        <Sparkles className="w-5 h-5 text-blue-500 absolute left-3 top-3.5" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 italic">Gõ số tiền (50k, 1m) và tên danh mục, sau đó nhấn Enter.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type Selection */}
                    <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${formData.type === 'expense' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setFormData({ ...formData, type: 'expense', category_id: '', to_wallet_id: '' })}
                        >
                            Chi Tiêu
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${formData.type === 'income' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setFormData({ ...formData, type: 'income', category_id: '', to_wallet_id: '' })}
                        >
                            Thu Nhập
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${formData.type === 'transfer' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setFormData({ ...formData, type: 'transfer', category_id: '', to_wallet_id: '' })}
                        >
                            Chuyển
                        </button>
                    </div>

                    {/* Transaction Form Fields */}
                    {formData.type === 'transfer' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Từ Ví</label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.wallet_id}
                                    onChange={(e) => setFormData({ ...formData, wallet_id: e.target.value })}
                                >
                                    {wallets.map(w => <option key={w.id} value={w.id}>{w.name} ({Number(w.balance).toLocaleString()})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Đến Ví</label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.to_wallet_id}
                                    onChange={(e) => setFormData({ ...formData, to_wallet_id: e.target.value })}
                                >
                                    <option value="">Chọn ví</option>
                                    {wallets.filter(w => w.id != formData.wallet_id).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ví / Tài khoản</label>
                            <select
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.wallet_id}
                                onChange={(e) => setFormData({ ...formData, wallet_id: e.target.value })}
                            >
                                {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                            </select>
                        </div>
                    )}

                    {formData.type !== 'transfer' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sự kiện (Tùy chọn)</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.event_id}
                                onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                            >
                                <option value="">Không có</option>
                                {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                    )}

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

                    {formData.type !== 'transfer' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                            <div className="flex gap-2">
                                <select
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {filteredCategories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(true)}
                                    className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                    title="Thêm danh mục mới"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                        <input
                            type="date"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (Tùy chọn)</label>
                        <textarea
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="3"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
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

            {/* Quick Add Category Modal (Nested) */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Thêm Danh mục ({formData.type === 'income' ? 'Thu nhập' : 'Chi tiêu'})
                        </h3>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nhập tên danh mục..."
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionModal;
