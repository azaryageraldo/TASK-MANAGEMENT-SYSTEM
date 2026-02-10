import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useToast } from '../context/ToastContext';

export default function TaskForm({ isOpen, onClose, taskToEdit, onTaskSaved }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'To Do',
        deadline: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                title: taskToEdit.title,
                description: taskToEdit.description || '',
                status: taskToEdit.status,
                deadline: taskToEdit.deadline || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'To Do',
                deadline: ''
            });
        }
        setError(null);
    }, [taskToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (taskToEdit) {
                await api.put(`/tasks/${taskToEdit.task_id}`, formData);
                addToast("Tugas berhasil diperbarui", "success");
            } else {
                await api.post('/tasks', formData);
                addToast("Berhasil membuat tugas baru", "success");
            }
            onTaskSaved();
            onClose();
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || 'Gagal menyimpan tugas';
            setError(errorMessage);
            addToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-20 flex items-center justify-center">
            <div 
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-[6px] transition-opacity" 
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <div className="relative w-full max-w-lg transform rounded-2xl bg-white p-8 text-left shadow-2xl transition-all sm:my-8 border border-gray-100 ring-1 ring-black/5">
                <div className="absolute top-5 right-5">
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-8">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        {taskToEdit ? 'Perbarui Tugas' : 'Buat Tugas Baru'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {taskToEdit ? 'Ubah informasi tugas di bawah ini.' : 'Isi form di bawah untuk membuat tugas baru.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100 flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul Tugas <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4 bg-gray-50 focus:bg-white transition-colors"
                                placeholder="Contoh: Implementasi API Login"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4 bg-gray-50 focus:bg-white transition-colors"
                                rows="3"
                                placeholder="Jelaskan detail tugas ini..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4 bg-gray-50 focus:bg-white transition-colors cursor-pointer"
                                >
                                    <option value="To Do">Akan Dikerjakan</option>
                                    <option value="In Progress">Sedang Dikerjakan</option>
                                    <option value="Done">Selesai</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tenggat Waktu</label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4 bg-gray-50 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex w-full justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex w-full justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Menyimpan...
                                </span>
                            ) : (taskToEdit ? 'Simpan Perubahan' : 'Buat Tugas')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}
