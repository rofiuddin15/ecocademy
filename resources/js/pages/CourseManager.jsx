import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CourseManager = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            // Note: In a real app, you might want to fetch only the instructor's courses
            // For now, we fetch all courses or an endpoint specifically for the instructor
            const res = await api.get('/courses');
            setCourses(res.data);
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
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Gagal menghapus kursus');
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

            <div className="grid grid-cols-1 gap-6">
                {courses.map(course => (
                    <div 
                        key={course.id} 
                        onClick={() => navigate(`/dashboard/manager/view/${course.id}`)}
                        className="bg-white/80 backdrop-blur-md border border-outline-variant p-6 rounded-lg shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-primary cursor-pointer transition-colors group"
                    >
                        <img 
                            src={course.image || 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&q=80'} 
                            alt={course.title} 
                            className="w-full md:w-48 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${course.is_published ? 'bg-primary-fixed/30 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                    {course.is_published ? 'Diterbitkan' : 'Draf'}
                                </span>
                                <span className="text-on-surface-variant font-label-sm">{course.level}</span>
                            </div>
                            <h3 className="font-headline-md text-primary mb-1 group-hover:text-primary transition-colors font-bold">{course.title}</h3>
                            <p className="text-on-surface-variant font-body-sm line-clamp-2">{course.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="font-label-md font-bold">Lihat Detail</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </div>
                    </div>
                ))}
                
                {courses.length === 0 && (
                    <div className="text-center py-16 bg-white/50 backdrop-blur-md border border-dashed border-outline-variant rounded-lg">
                        <span className="material-symbols-outlined text-[48px] text-outline mb-4">menu_book</span>
                        <h3 className="font-headline-sm text-on-surface font-bold">Kursus Tidak Ditemukan</h3>
                        <p className="text-on-surface-variant mb-6 mt-2">Anda belum membuat kursus apa pun.</p>
                        <Link 
                            to="/dashboard/manager/create"
                            className="text-primary font-label-md hover:underline font-bold"
                        >
                            Mulai dengan membuat kursus baru
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseManager;
