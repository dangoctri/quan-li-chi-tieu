import React, { useState, useEffect } from 'react';
import { Plus, Folder, Trash2, Edit2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import api from '../services/api';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: 'expense', icon: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            fetchCategories();
            resetForm();
        } catch (error) {
            alert('Lỗi khi lưu danh mục');
        }
    };

    const handleEdit = (category) => {
        setFormData({ name: category.name, type: category.type, icon: category.icon || '' });
        setEditingId(category.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Xóa danh mục này? Lưu ý: Các giao dịch liên quan có thể bị ảnh hưởng.')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            alert('Lỗi khi xóa');
        }
    };

    const resetForm = () => {
        setIsModalOpen(false);
        setFormData({ name: '', type: 'expense', icon: '' });
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Danh mục
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expense Categories */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-red-600">
                        <ArrowDownCircle className="w-5 h-5" />
                        Danh mục Chi tiêu
                    </h3>
                    <div className="space-y-3">
                        {categories.filter(c => c.type === 'expense').map((category) => (
                            <div key={category.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg group">
                                <span className="font-medium text-gray-700">{category.name}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(category)} className="text-blue-500 hover:text-blue-700">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(category.id)} className="text-gray-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Income Categories */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-green-600">
                        <ArrowUpCircle className="w-5 h-5" />
                        Danh mục Thu nhập
                    </h3>
                    <div className="space-y-3">
                        {categories.filter(c => c.type === 'income').map((category) => (
                            <div key={category.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg group">
                                <span className="font-medium text-gray-700">{category.name}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(category)} className="text-blue-500 hover:text-blue-700">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(category.id)} className="text-gray-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">
                            {editingId ? 'Sửa Danh mục' : 'Thêm Danh mục Mới'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
                                <button
                                    type="button"
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${formData.type === 'expense' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                                >
                                    Chi tiêu
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${formData.type === 'income' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => setFormData({ ...formData, type: 'income' })}
                                >
                                    Thu nhập
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ví dụ: Ăn uống, Lương..."
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={resetForm}
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
