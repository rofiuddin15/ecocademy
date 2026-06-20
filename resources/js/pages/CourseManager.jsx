import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CourseManager = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Data Table States
    const [searchQuery, setSearchQuery] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            const sortedCourses = res.data.sort((a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at));
            setCourses(sortedCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus kursus ini?')) return;
        try {
            await api.delete(`/courses/${id}`);
            setCourses(courses.filter(c => c.id !== id));
            // Adjust pagination if needed
            if (currentCourses.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Gagal menghapus kursus');
        }
    };

    // Filter and Pagination Logic
    const uniqueLevels = [...new Set(courses.map(c => c.level).filter(Boolean))];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = levelFilter ? course.level === levelFilter : true;
        return matchesSearch && matchesLevel;
    });

    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const currentCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                <p className="text-label-sm text-on-surface-variant">Memuat daftar kursus...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="font-headline-xl text-headline-xl text-primary font-bold">Manajemen Kursus</h2>
                    <p className="font-body-md text-on-surface-variant mt-2">Kelola kursus wirausaha hijau, modul, dan kuis Anda.</p>
                </div>
                <Link 
                    to="/dashboard/manager/create"
                    className="bg-primary text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm font-bold"
                >
                    <span className="material-symbols-outlined">add</span>
                    Buat Kursus Baru
                </Link>
            </div>

            <div className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container-lowest">
                    <div className="relative w-full md:w-64">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input 
                            type="text" 
                            placeholder="Cari kursus..." 
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-colors bg-white text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <span className="text-sm font-label-md text-on-surface-variant whitespace-nowrap">Filter Level:</span>
                        <select 
                            value={levelFilter}
                            onChange={(e) => {
                                setLevelFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full md:w-auto px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-colors bg-white text-sm"
                        >
                            <option value="">Semua Level</option>
                            {uniqueLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-label-md text-sm">
                                <th className="p-4 font-bold">Kursus</th>
                                <th className="p-4 font-bold">Level</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCourses.length > 0 ? (
                                currentCourses.map(course => (
                                    <tr 
                                        key={course.id} 
                                        onClick={() => navigate(`/dashboard/manager/view/${course.id}`)}
                                        className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors cursor-pointer"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={course.image || 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&q=80'} 
                                                    alt={course.title} 
                                                    className="w-16 h-12 object-cover rounded"
                                                />
                                                <div>
                                                    <h3 className="font-label-lg font-bold text-primary line-clamp-1">{course.title}</h3>
                                                    <p className="text-xs text-on-surface-variant line-clamp-1">{course.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-body-md text-on-surface">{course.level}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${course.is_published ? 'bg-primary-fixed/30 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                                {course.is_published ? 'Diterbitkan' : 'Draf'}
                                            </span>
                                        </td>
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/manager/view/${course.id}`); }}
                                                    className="text-primary hover:bg-primary/10 p-2 rounded transition-colors"
                                                    title="Lihat Detail"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                                <Link 
                                                    to={`/dashboard/manager/edit/${course.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-secondary hover:bg-secondary/10 p-2 rounded transition-colors"
                                                    title="Edit Kursus"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </Link>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(course.id); }}
                                                    className="text-error hover:bg-error/10 p-2 rounded transition-colors"
                                                    title="Hapus Kursus"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-on-surface-variant">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="material-symbols-outlined text-[48px] text-outline mb-4">search_off</span>
                                            <h3 className="font-headline-sm text-on-surface font-bold">Kursus Tidak Ditemukan</h3>
                                            <p className="text-sm mt-1">Coba sesuaikan pencarian atau filter Anda.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
                        <span className="text-sm text-on-surface-variant">
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredCourses.length)} dari {filteredCourses.length} kursus
                        </span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-1 rounded hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-on-surface"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button 
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-8 h-8 rounded text-sm font-bold transition-colors ${currentPage === page ? 'bg-primary text-white' : 'hover:bg-surface-container text-on-surface'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-1 rounded hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-on-surface"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseManager;
