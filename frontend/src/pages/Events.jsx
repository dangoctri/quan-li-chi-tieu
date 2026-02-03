import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', start_date: '', end_date: '', spending_goal: '' });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            setEvents(data);
        } catch (error) {
            console.error('Failed to fetch events');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            fetchEvents();
            setIsModalOpen(false);
            setFormData({ name: '', start_date: '', end_date: '', spending_goal: '' });
        } catch (error) {
            alert('Lỗi');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Xóa sự kiện này?')) return;
        try {
            await api.delete(`/events/${id}`);
            fetchEvents();
        } catch (error) {
            alert('Lỗi');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Sự Kiện & Chuyến Đi</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Sự Kiện
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <button onClick={() => handleDelete(event.id)} className="text-gray-400 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg mb-2">{event.name}</h3>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>Ngày: {event.start_date || '...'} - {event.end_date || '...'}</p>
                                <p>Mục tiêu: {event.spending_goal ? Number(event.spending_goal).toLocaleString() : 'Không giới hạn'}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-gray-500">Đã chi tiêu</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {Number(event.transactions_sum_amount || 0).toLocaleString()}đ
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Thêm Sự Kiện Mới</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sự kiện</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dự kiến chi (VNĐ)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.spending_goal}
                                    onChange={(e) => setFormData({ ...formData, spending_goal: e.target.value })}
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
