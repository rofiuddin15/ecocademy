import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const InstructorCourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState({});
    const [expandedMaterials, setExpandedMaterials] = useState({});

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const toggleMaterial = (materialId) => {
        setExpandedMaterials(prev => ({ ...prev, [materialId]: !prev[materialId] }));
    };

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            const res = await api.get(`/courses/${id}`);
            setCourse(res.data);
        } catch (error) {
            console.error('Error fetching course detail:', error);
            alert('Gagal memuat detail kursus.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus kursus ini secara permanen?')) return;
        try {
            await api.delete(`/courses/${id}`);
            navigate('/dashboard/manager');
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Gagal menghapus kursus.');
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                <p className="text-label-sm text-on-surface-variant">Memuat detail kursus...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="py-20 text-center">
                <p className="text-on-surface-variant">Kursus tidak ditemukan.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Header section with actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-outline-variant">
                <div className="flex items-center gap-6">
                    <img 
                        src={course.image || 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&q=80'} 
                        alt={course.title} 
                        className="w-32 h-32 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${course.is_published ? 'bg-primary-fixed/30 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                {course.is_published ? 'Diterbitkan' : 'Draf'}
                            </span>
                            <span className="text-on-surface-variant font-label-sm">{course.category?.name}</span>
                            <span className="text-on-surface-variant font-label-sm px-2 py-0.5 bg-secondary-fixed/30 text-secondary rounded-lg">{course.level}</span>
                            <span className="text-on-surface-variant font-label-sm flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {course.duration} Jam</span>
                        </div>
                        <h1 className="font-headline-xl text-headline-xl text-primary mb-2 font-bold">{course.title}</h1>
                        <p className="text-on-surface-variant font-body-md line-clamp-2 max-w-2xl">{course.description}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link 
                        to={`/dashboard/manager/edit/${course.id}`}
                        className="flex-1 md:flex-none bg-primary text-white px-5 py-2.5 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm font-bold"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                        Edit Kursus
                    </Link>
                    <button 
                        onClick={handleDelete}
                        className="p-2.5 text-error border border-error/20 bg-error/5 rounded-lg hover:bg-error/10 transition-colors"
                        title="Hapus Kursus"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            </div>

            {/* Curriculum Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-headline-md text-headline-md text-primary font-bold">Modul Kurikulum</h2>
                        <span className="text-on-surface-variant font-label-sm bg-surface-container px-3 py-1 rounded-full font-bold">{course.modules?.length || 0} Modul</span>
                    </div>

                    {course.modules?.length === 0 ? (
                        <div className="text-center py-10 bg-white/50 backdrop-blur-md border border-dashed border-outline-variant rounded-lg">
                            <span className="material-symbols-outlined text-[40px] text-outline mb-2">inventory_2</span>
                            <p className="text-on-surface-variant font-body-sm">Belum ada modul kurikulum.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {course.modules?.map((mod, index) => (
                                <div key={mod.id} className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg p-5 shadow-sm">
                                    <div 
                                        className="flex items-start gap-4 mb-4 cursor-pointer group select-none"
                                        onClick={() => toggleModule(mod.id)}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary-fixed/20 flex items-center justify-center text-primary font-bold flex-shrink-0 mt-1">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-headline-sm text-on-surface mb-1 group-hover:text-primary transition-colors">{mod.title}</h3>
                                                <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${expandedModules[mod.id] ? 'rotate-180' : ''}`}>
                                                    expand_more
                                                </span>
                                            </div>
                                            <p className="text-on-surface-variant font-body-sm">{mod.description}</p>
                                        </div>
                                    </div>
                                    
                                    {expandedModules[mod.id] && (
                                        <div className="pl-12 space-y-2 animate-fade-in mt-4">
                                            {/* Materials */}
                                            {mod.materials?.map((mat, i) => (
                                                <div key={mat.id} className="bg-surface-container-low rounded-lg border border-outline-variant/50 group overflow-hidden">
                                                    <div 
                                                        className="flex items-center justify-between p-3 cursor-pointer"
                                                        onClick={() => toggleMaterial(mat.id)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="material-symbols-outlined text-primary text-[20px]">
                                                                {mat.content_type === 'video' ? 'play_circle' : mat.content_type === 'pdf' ? 'picture_as_pdf' : 'article'}
                                                            </span>
                                                            <span className="font-body-sm text-on-surface group-hover:text-primary transition-colors">{mat.title}</span>
                                                            {mat.duration_minutes && (
                                                                <span className="font-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full whitespace-nowrap">
                                                                    {mat.duration_minutes} Menit
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Link 
                                                                to={`/dashboard/manager/edit/${course.id}?tab=curriculum`} 
                                                                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-primary-fixed/20 rounded-lg"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                                            </Link>
                                                            <span className={`material-symbols-outlined text-outline transition-transform duration-300 ${expandedMaterials[mat.id] ? 'rotate-180' : ''}`}>
                                                                expand_more
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Material Expanded Content */}
                                                    {expandedMaterials[mat.id] && (
                                                        <div className="p-4 border-t border-outline-variant/30 bg-white animate-fade-in">
                                                            {mat.content_type === 'article' ? (
                                                                <div className="prose prose-sm max-w-none text-on-surface-variant line-clamp-4">
                                                                    {mat.body_text}
                                                                </div>
                                                            ) : (
                                                                <a href={mat.content_url} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-2 hover:underline font-label-sm w-fit bg-primary/5 px-4 py-2 rounded-lg">
                                                                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                                                    Buka Tautan {mat.content_type === 'video' ? 'Video' : 'Dokumen PDF'}
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            
                                            {/* Quiz */}
                                            {mod.quiz && (
                                                <div className="flex items-center justify-between bg-tertiary-fixed/10 p-3 rounded-lg border border-tertiary/20 group">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-tertiary text-[20px]">quiz</span>
                                                        <div>
                                                            <span className="font-body-sm text-on-surface block">{mod.quiz.title}</span>
                                                            <span className="font-label-sm text-tertiary">{mod.quiz.questions?.length || 0} Soal</span>
                                                        </div>
                                                    </div>
                                                    <Link to={`/dashboard/manager/edit/${course.id}?tab=curriculum`} className="text-tertiary opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-tertiary-fixed/20 rounded-lg">
                                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                                    </Link>
                                                </div>
                                            )}
                                            
                                            {!mod.materials?.length && !mod.quiz && (
                                                <p className="text-on-surface-variant text-label-sm italic">Modul ini kosong.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PBL Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 border-b border-outline-variant pb-4">
                            <div className="p-2 bg-secondary-fixed/20 rounded-lg text-secondary">
                                <span className="material-symbols-outlined">nature_people</span>
                            </div>
                            <h2 className="font-headline-sm text-primary">Proyek Akhir (PBL)</h2>
                        </div>
                        
                        {!course.pbl_detail ? (
                            <div className="text-center py-6">
                                <p className="text-on-surface-variant font-body-sm mb-3">Konfigurasi master proyek belum diatur.</p>
                                <Link to={`/dashboard/manager/edit/${course.id}?tab=milestones`} className="text-primary font-label-sm hover:underline">Atur PBL Sekarang</Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Judul Proyek</h4>
                                    <p className="font-body-md text-on-surface">{course.pbl_detail.title}</p>
                                </div>
                                <div>
                                    <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Sasaran (Target Audience)</h4>
                                    <p className="font-body-md text-on-surface">{course.pbl_detail.target_audience}</p>
                                </div>
                                <div>
                                    <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Durasi</h4>
                                    <p className="font-body-md text-on-surface">{course.pbl_detail.duration} Jam</p>
                                </div>
                                
                                <hr className="border-outline-variant/50" />
                                
                                <div>
                                    <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Milestones ({course.milestones?.length || 0})</h4>
                                    {course.milestones?.length === 0 ? (
                                        <p className="text-on-surface-variant text-label-sm">Belum ada tahapan milestone.</p>
                                    ) : (
                                        <ul className="space-y-3 relative before:absolute before:inset-y-2 before:left-[11px] before:w-[2px] before:bg-outline-variant/50">
                                            {course.milestones?.map((ms, index) => (
                                                <li key={ms.id} className="flex gap-3 relative z-10">
                                                    <div className="w-6 h-6 rounded-full bg-surface-container border-2 border-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-on-surface-variant">
                                                        {index + 1}
                                                    </div>
                                                    <div className="pt-0.5 w-full">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="font-label-md text-on-surface leading-tight">{ms.title}</p>
                                                            <span className="text-[10px] uppercase font-bold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">
                                                                {ms.duration_hours} Jam
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-on-surface-variant mt-1 italic">Tugas: {ms.report_type}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorCourseDetail;
