import { useState, useEffect } from 'react';
import api from '../lib/axios';
import TaskForm from '../components/TaskForm';
import ConfirmationModal from '../components/ConfirmationModal';
import { Plus, Calendar, Edit2, Trash2, CheckCircle2, Circle, Clock, Filter, ArrowUpDown } from 'lucide-react';
import clsx from 'clsx';
import { useToast } from '../context/ToastContext';

export default function DashboardPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [sortBy, setSortBy] = useState('created_at');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const { addToast } = useToast();
    
    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter !== 'All') params.status = filter;
            if (sortBy === 'deadline') {
                params.sort_by = 'deadline';
                params.order = 'asc';
            }
            
            const { data } = await api.get('/tasks', { params });
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
            addToast("Gagal memuat tugas", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filter, sortBy]);

    const confirmDelete = (task) => {
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!taskToDelete) return;
        try {
            await api.delete(`/tasks/${taskToDelete.task_id}`);
            fetchTasks();
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
            addToast("Tugas berhasil dihapus", "success");
        } catch (error) {
            console.error("Failed to delete task", error);
            addToast("Gagal menghapus tugas", "error");
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleTaskSaved = () => {
        fetchTasks();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'To Do': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Done': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
         switch (status) {
            case 'To Do': return <Circle className="w-3 h-3 mr-1" />;
            case 'In Progress': return <Clock className="w-3 h-3 mr-1" />;
            case 'Done': return <CheckCircle2 className="w-3 h-3 mr-1" />;
            default: return null;
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'To Do': return 'Akan Dikerjakan';
            case 'In Progress': return 'Sedang Dikerjakan';
            case 'Done': return 'Selesai';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center sm:justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Daftar Tugas</h1>
                        <p className="mt-2 text-lg text-gray-500">Kelola produktivitas harian Anda.</p>
                    </div>
                    <div className="mt-6 sm:mt-0">
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Buat Tugas Baru
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-10 ring-1 ring-gray-900/5 backdrop-blur-xl">
                    <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                        <div className="flex-1 p-4 flex items-center gap-4">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Filter className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm font-medium bg-transparent cursor-pointer"
                                >
                                    <option value="All">Semua Status</option>
                                    <option value="To Do">Akan Dikerjakan</option>
                                    <option value="In Progress">Sedang Dikerjakan</option>
                                    <option value="Done">Selesai</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-1 p-4 flex items-center gap-4">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <ArrowUpDown className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Urutkan</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm font-medium bg-transparent cursor-pointer"
                                >
                                    <option value="created_at">Terbaru Dibuat</option>
                                    <option value="deadline">Tenggat Waktu Terdekat</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
                            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-200 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                        </div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="relative mx-auto h-48 w-48 text-gray-200 mb-6">
                            <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Belum ada tugas</h3>
                        <p className="mt-2 text-base text-gray-500 max-w-sm mx-auto">Mulai tambahkan tugas baru untuk meningkatkan produktivitas Anda hari ini.</p>
                        <div className="mt-8">
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                            >
                                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Buat Tugas Pertama
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {tasks.map((task) => (
                            <div key={task.task_id} className="group relative bg-white flex flex-col rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-gray-200 hover:ring-indigo-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-5">
                                        <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border", getStatusColor(task.status))}>
                                            {getStatusIcon(task.status)}
                                            {getStatusLabel(task.status)}
                                        </span>
                                        {task.deadline && (
                                            <span className={clsx(
                                                "inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full",
                                                new Date(task.deadline) < new Date() ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-500"
                                            )}>
                                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                                {new Date(task.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2" title={task.title}>
                                        {task.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1 leading-relaxed">
                                        {task.description || "Tidak ada deskripsi tambahan untuk tugas ini."}
                                    </p>
                                    
                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                                        <div className="text-xs text-gray-400 font-medium">
                                            Dibuat {new Date(task.created_at).toLocaleDateString('id-ID')}
                                        </div>
                                        <div className="flex space-x-1">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleEdit(task); }} 
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                title="Ubah"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); confirmDelete(task); }} 
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <TaskForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    taskToEdit={editingTask}
                    onTaskSaved={handleTaskSaved}
                />
                
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    title="Hapus Tugas"
                    message={`Apakah Anda yakin ingin menghapus tugas "${taskToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.`}
                    confirmText="Ya, Hapus"
                    cancelText="Batal"
                    isDanger={true}
                />
            </div>
        </div>
    );
}
