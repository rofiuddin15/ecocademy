import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';

const CourseDetail = () => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await api.get(`/courses/${id}`);
                setCourse(response.data);
                
                // Enrollment check
                const enrolledStorage = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
                const isDefaultEnrolled = ['desain', 'design', 'ekonomi', 'circular', 'pemasaran', 'marketing'].some(k => response.data.title.toLowerCase().includes(k));
                
                if (user?.role === 'instructor' || enrolledStorage.includes(String(id)) || isDefaultEnrolled) {
                    setIsEnrolled(true);
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id]);

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
            <div className="py-20 text-center bg-white rounded-lg border border-outline-variant/30">
                <span className="material-symbols-outlined text-[48px] text-error mb-3">error</span>
                <p className="text-body-md text-on-surface-variant font-bold">Kursus tidak ditemukan atau akses ditolak.</p>
                <Link to="/dashboard" className="mt-4 inline-block text-primary font-semibold hover:underline">Kembali ke Dashboard</Link>
            </div>
        );
    }

    return (
        <>
            {/* Back Button */}
            <Link 
                to="/dashboard" 
                onClick={(e) => {
                    e.preventDefault();
                    if (window.history.length > 1) {
                        navigate(-1);
                    } else {
                        navigate('/dashboard');
                    }
                }}
                className="flex items-center gap-2 mb-6 text-primary hover:opacity-85 font-semibold"
            >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                <span>Kembali ke Katalog</span>
            </Link>

            {/* Course Header Banner */}
            <div className="bg-white rounded-lg border border-outline-variant/30 overflow-hidden shadow-sm mb-8 grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-label-sm font-bold">
                                {course.category?.name || 'Umum'}
                            </span>
                            <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-full text-label-sm font-bold">
                                {course.sustainability_score || 95} Poin Hijau
                            </span>
                        </div>
                        <h1 className="text-[32px] leading-[40px] font-bold text-primary mb-4">{course.title}</h1>
                        <p className="text-body-lg text-on-surface-variant leading-relaxed mb-6">{course.description}</p>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-outline-variant/10 text-on-surface-variant text-label-sm">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-primary">
                            {course.instructor?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <span className="font-bold text-primary">{course.instructor?.name}</span>
                            <span className="mx-2">&bull;</span>
                            <span>Instruktur Utama</span>
                        </div>
                    </div>
                </div>
                <div className="bg-primary-container/20 p-8 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-outline-variant/30">
                    {isEnrolled ? (
                        <>
                            <h3 className="text-headline-md font-headline-md text-primary mb-4">Aksi Pembelajaran</h3>
                            <p className="text-body-md text-on-surface-variant mb-6">Tuntaskan seluruh modul kelas dan selesaikan proyek akhir berbasis PJBL untuk kelulusan.</p>
                            <Link
                                to={`/dashboard/courses/${course.id}/project`}
                                className="w-full bg-secondary text-on-secondary hover:bg-secondary/90 h-[48px] rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:scale-98 active:scale-95 transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[20px]">assignment</span>
                                <span>Ruang Kerja Proyek PjBL</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <h3 className="text-headline-md font-headline-md text-primary mb-4">Gabung Kelas Ini</h3>
                            <p className="text-body-md text-on-surface-variant mb-6">Daftarkan diri Anda sekarang untuk mengakses seluruh materi dan memulai proyek nyata bersama UMKM.</p>
                            <button
                                onClick={() => setShowEnrollModal(true)}
                                className="w-full bg-primary text-on-primary hover:bg-primary/90 h-[48px] rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:scale-98 active:scale-95 transition-all shadow-sm cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">school</span>
                                <span>Daftar Kursus Gratis</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Course Syllabus / Modules List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-headline-md font-headline-md text-primary mb-4">Modul Pembelajaran</h2>
                    
                    {course.modules?.length === 0 ? (
                        <p className="text-body-md text-on-surface-variant">Belum ada modul yang ditambahkan ke kelas ini.</p>
                    ) : (
                        course.modules
                            .sort((a, b) => a.sequence - b.sequence)
                            .map((module, idx) => (
                                <div key={module.id} className="bg-white rounded-lg border border-outline-variant/30 overflow-hidden shadow-sm">
                                    {/* Module Top Bar */}
                                    <div className="p-6 border-b border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest">
                                        <div>
                                            <div className="text-label-sm text-secondary font-bold mb-1">MODUL {idx + 1}</div>
                                            <h3 className="text-headline-md font-headline-md text-primary">{module.title}</h3>
                                            <p className="text-body-md text-on-surface-variant mt-1">{module.description}</p>
                                        </div>

                                        {module.is_project_based ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold rounded-full uppercase tracking-wider whitespace-nowrap self-start md:self-center">
                                                <span className="material-symbols-outlined text-[14px]">star</span>
                                                Tugas Akhir PjBL
                                            </span>
                                        ) : null}
                                    </div>

                                    {/* Module Inner Body */}
                                    <div className="p-6 space-y-6">
                                        {module.is_project_based ? (
                                            <div className="p-4 bg-secondary-container/20 border border-secondary-container/50 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
                                                <div>
                                                    <h4 className="text-label-md font-bold text-secondary mb-1">Modul Pembelajaran Berbasis Proyek</h4>
                                                    <p className="text-body-md text-on-surface-variant">Modul ini berfokus pada eksekusi solusi nyata di lapangan bersama UMKM mitra pilihan Anda.</p>
                                                </div>
                                                {isEnrolled ? (
                                                    <Link
                                                        to={`/dashboard/courses/${course.id}/project`}
                                                        className="bg-secondary text-on-secondary hover:bg-secondary/90 px-6 py-2.5 rounded-lg text-label-sm font-bold whitespace-nowrap hover:scale-95 transition-all shadow-sm"
                                                    >
                                                        Mulai Proyek
                                                    </Link>
                                                ) : (
                                                    <button disabled className="bg-outline-variant/30 text-on-surface-variant px-6 py-2.5 rounded-lg text-label-sm font-bold whitespace-nowrap opacity-75 cursor-not-allowed flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[16px]">lock</span>
                                                        Terkunci
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                {/* Materials Section */}
                                                <div>
                                                    <h4 className="text-label-sm font-bold text-primary mb-3">Materi Bacaan & Video</h4>
                                                    {module.materials?.length === 0 ? (
                                                        <p className="text-body-md text-on-surface-variant/70 italic">Materi belum diunggah.</p>
                                                    ) : (
                                                        <div className="divide-y divide-outline-variant/10 border border-outline-variant/20 rounded-lg overflow-hidden">
                                                            {module.materials
                                                                .sort((a, b) => a.sequence - b.sequence)
                                                                .map((material) => (
                                                                    <button
                                                                        key={material.id}
                                                                        onClick={() => isEnrolled && setSelectedMaterial(material)}
                                                                        className={`w-full flex items-center justify-between p-4 ${isEnrolled ? 'hover:bg-surface-container-low/50 cursor-pointer text-on-surface' : 'opacity-60 cursor-not-allowed text-on-surface-variant'} text-left transition-colors bg-white`}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="material-symbols-outlined text-primary">
                                                                                {material.content_type === 'video' ? 'play_circle' : 'description'}
                                                                            </span>
                                                                            <span className="text-body-md font-medium text-on-surface hover:text-primary transition-colors">{material.title}</span>
                                                                        </div>
                                                                        <span className="text-label-sm text-on-surface-variant capitalize">{material.content_type}</span>
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Quiz Section */}
                                                {module.quiz ? (
                                                    <div className="border-t border-outline-variant/10 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <h4 className="text-label-md font-bold text-primary mb-1">Kuis Evaluasi: {module.quiz.title}</h4>
                                                            <p className="text-body-md text-on-surface-variant">Selesaikan kuis evaluasi untuk menguji pengetahuan modul Anda.</p>
                                                        </div>
                                                        {isEnrolled ? (
                                                            <Link
                                                                to={`/dashboard/courses/${course.id}/modules/${module.id}/quiz`}
                                                                className="bg-primary text-on-primary hover:bg-primary-container px-6 py-2.5 rounded-lg text-label-sm font-bold whitespace-nowrap hover:scale-95 transition-all shadow-sm"
                                                            >
                                                                Kerjakan Kuis
                                                            </Link>
                                                        ) : (
                                                            <button disabled className="bg-outline-variant/30 text-on-surface-variant px-6 py-2.5 rounded-lg text-label-sm font-bold whitespace-nowrap opacity-75 cursor-not-allowed flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-[16px]">lock</span>
                                                                Terkunci
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="border-t border-outline-variant/10 pt-4">
                                                        <p className="text-label-sm text-on-surface-variant/70 italic">Kuis evaluasi belum ditambahkan untuk modul ini.</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                    )}
                </div>

                {/* Sidebar Milestones Tracker */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-outline-variant/30 shadow-sm">
                        <h3 className="text-headline-md font-headline-md text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[24px]">list_alt</span>
                            Tahapan Milestone PjBL
                        </h3>
                        {course.milestones?.length === 0 ? (
                            <p className="text-body-md text-on-surface-variant/80">Belum ada target milestone proyek akhir untuk kelas ini.</p>
                        ) : (
                            <div className="relative pl-6 border-l-2 border-outline-variant/50 space-y-6">
                                {course.milestones
                                    .sort((a, b) => a.sequence - b.sequence)
                                    .map((milestone, idx) => (
                                        <div key={milestone.id} className="relative">
                                            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-secondary border-4 border-white"></div>
                                            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Tahap {idx + 1}</span>
                                            <h4 className="text-label-sm font-bold text-primary mt-0.5">{milestone.title}</h4>
                                            <p className="text-body-md text-on-surface-variant mt-1">{milestone.description}</p>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Material Modal Reader */}
            {selectedMaterial && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
                            <div>
                                <span className="text-label-sm text-secondary font-bold capitalize mb-1">Materi {selectedMaterial.content_type}</span>
                                <h3 className="text-headline-md font-headline-md text-primary font-bold">{selectedMaterial.title}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedMaterial(null)}
                                className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto space-y-6">
                            {selectedMaterial.content_type === 'video' && (
                                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                                    {selectedMaterial.content_url?.includes('youtube.com') || selectedMaterial.content_url?.includes('youtu.be') ? (
                                        <iframe
                                            className="w-full h-full"
                                            src={selectedMaterial.content_url.replace('watch?v=', 'embed/')}
                                            title={selectedMaterial.title}
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="text-white text-center p-8">
                                            <span className="material-symbols-outlined text-[48px] mb-2">play_circle</span>
                                            <p className="text-body-md font-semibold">Tautan Video Eksternal</p>
                                            <a 
                                                href={selectedMaterial.content_url} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="text-secondary hover:underline font-bold mt-2 inline-block"
                                            >
                                                Tonton Video di Tab Baru &rarr;
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedMaterial.content_type === 'pdf' && (
                                <div className="p-4 bg-surface-container-low rounded-lg flex items-center justify-between border border-outline-variant/20">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary text-[32px]">picture_as_pdf</span>
                                        <div>
                                            <h4 className="text-label-sm font-bold text-primary">Dokumen Lampiran PDF</h4>
                                            <p className="text-body-md text-on-surface-variant">Unduh berkas PDF untuk dibaca secara luring.</p>
                                        </div>
                                    </div>
                                    <a
                                        href={selectedMaterial.content_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-primary text-on-primary hover:bg-primary-container px-6 py-2.5 rounded-lg text-label-sm font-bold hover:scale-95 transition-all shadow-sm"
                                    >
                                        Unduh Berkas
                                    </a>
                                </div>
                            )}

                            {/* Body Text */}
                            {selectedMaterial.body_text && (
                                <div className="prose prose-slate max-w-none text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line border-t border-outline-variant/10 pt-6">
                                    {selectedMaterial.body_text}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest text-right">
                            <button
                                onClick={() => setSelectedMaterial(null)}
                                className="bg-outline text-white hover:bg-primary px-6 py-2 rounded-lg text-label-sm font-semibold transition-colors cursor-pointer"
                            >
                                Selesai Membaca
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enroll Confirmation Modal */}
            {showEnrollModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-[32px] text-primary">school</span>
                            <h3 className="text-headline-sm font-bold text-primary">Konfirmasi Pendaftaran</h3>
                        </div>
                        <p className="text-body-md text-on-surface-variant mb-8">Apakah Anda yakin ingin mendaftar ke kursus <strong>{course.title}</strong>? Anda akan diwajibkan menyelesaikan seluruh tahapan modul dan proyek akhir untuk mendapatkan sertifikat.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowEnrollModal(false)} className="px-5 py-2.5 font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors cursor-pointer">Batal</button>
                            <button onClick={() => {
                                const enrolledStorage = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
                                if (!enrolledStorage.includes(String(id))) {
                                    enrolledStorage.push(String(id));
                                    localStorage.setItem('enrolled_courses', JSON.stringify(enrolledStorage));
                                }
                                setIsEnrolled(true);
                                setShowEnrollModal(false);
                            }} className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                Ya, Daftar Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseDetail;
