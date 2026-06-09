import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const StudentModules = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('in_progress');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const getCourseMetadata = (courseId, title) => {
        const t = title.toLowerCase();
        const enrolledStorage = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
        const isLocallyEnrolled = enrolledStorage.includes(String(courseId));

        if (t.includes('desain') || t.includes('design')) {
            return { progress: 45, isEnrolled: true, image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600' };
        }
        if (t.includes('ekonomi') || t.includes('circular')) {
            return { progress: 12, isEnrolled: true, image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600' };
        }
        if (t.includes('pemasaran') || t.includes('marketing')) {
            return { progress: 88, isEnrolled: true, image: 'https://images.unsplash.com/photo-1497443352895-331da4cbf292?auto=format&fit=crop&q=80&w=600' };
        }
        return { progress: isLocallyEnrolled ? 5 : 0, isEnrolled: isLocallyEnrolled, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600' };
    };

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                <p className="text-label-sm text-on-surface-variant">Memuat daftar modul...</p>
            </div>
        );
    }

    const filteredCourses = courses.filter(course => {
        const meta = getCourseMetadata(course.id, course.title);
        if (activeTab === 'in_progress') return meta.progress < 100;
        return meta.progress === 100; // completed
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Modul Kursus Saya</h1>
                    <p className="text-on-surface-variant font-body-md mt-1">Lanjutkan pembelajaran dan selesaikan misi lingkungan Anda.</p>
                </div>
                
                {/* Tabs */}
                <div className="flex bg-surface-container rounded-lg p-1">
                    <button 
                        onClick={() => setActiveTab('in_progress')}
                        className={`px-4 py-2 rounded-lg font-label-md transition-colors ${activeTab === 'in_progress' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        Sedang Berjalan
                    </button>
                    <button 
                        onClick={() => setActiveTab('completed')}
                        className={`px-4 py-2 rounded-lg font-label-md transition-colors ${activeTab === 'completed' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        Selesai
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => {
                        const meta = getCourseMetadata(course.id, course.title);
                        return (
                            <div key={course.id} className="bg-white rounded-lg border border-outline-variant hover:border-primary transition-colors flex flex-col justify-between cursor-pointer group shadow-sm overflow-hidden">
                                <div className="h-32 w-full overflow-hidden shrink-0 border-b border-outline-variant/50 relative">
                                    <img src={meta.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-5 flex flex-col flex-grow justify-between">
                                    <h3 className="font-label-lg text-label-lg text-on-surface font-bold line-clamp-2 mb-6">{course.title}</h3>
                                    
                                    <div>
                                        {meta.isEnrolled ? (
                                            <>
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Progres: {meta.progress}%</span>
                                                    {meta.progress > 0 && <span className="w-6 h-1 rounded-full bg-primary-fixed"></span>}
                                                </div>
                                                <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                                                    <div className="h-1.5 rounded-full bg-primary" style={{ width: `${meta.progress}%` }}></div>
                                                </div>
                                                <Link to={`/dashboard/courses/${course.id}`} className="mt-4 w-full block text-center bg-primary/10 text-primary px-4 py-2 rounded-lg font-label-sm font-bold hover:bg-primary/20 transition-colors">
                                                    Lanjutkan Belajar
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Belum Terdaftar</span>
                                                </div>
                                                <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                                                    <div className="h-1.5 rounded-full bg-surface-container-highest" style={{ width: '100%' }}></div>
                                                </div>
                                                <Link to={`/dashboard/courses/${course.id}`} className="mt-4 w-full block text-center bg-surface-container-low border border-outline-variant text-on-surface-variant px-4 py-2 rounded-lg font-label-sm font-bold hover:bg-surface-container transition-colors">
                                                    Ikuti Kursus
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-16 text-center bg-surface-container-low rounded-lg border border-dashed border-outline-variant">
                        <span className="material-symbols-outlined text-[48px] text-outline mb-2">menu_book</span>
                        <p className="text-on-surface-variant font-label-md">Tidak ada modul di kategori ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentModules;
