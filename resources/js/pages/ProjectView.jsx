import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const ProjectView = () => {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Project Init Form State
    const [title, setTitle] = useState('');
    const [umkmName, setUmkmName] = useState('');
    const [umkmSector, setUmkmSector] = useState('');
    const [isInitializing, setIsInitializing] = useState(false);

    // Submission Form State
    const [submittingMilestoneId, setSubmittingMilestoneId] = useState(null);
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');

    const fetchProjectData = async () => {
        try {
            // Load course details
            const courseResponse = await api.get(`/courses/${courseId}`);
            setCourse(courseResponse.data);

            // Load student projects
            const projectsResponse = await api.get('/projects');
            const activeProject = projectsResponse.data.find(p => p.course_id === courseId);
            
            if (activeProject) {
                // Fetch full details with submissions & feedback
                const detailResponse = await api.get(`/projects/${activeProject.id}`);
                setProject(detailResponse.data);
            } else {
                setProject(null);
            }
        } catch (error) {
            console.error('Error loading project data:', error);
            setErrorMsg('Gagal memuat data ruang kerja proyek.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [courseId]);

    const handleInitializeProject = async (e) => {
        e.preventDefault();
        setIsInitializing(true);
        setErrorMsg('');

        try {
            const response = await api.post('/projects', {
                course_id: courseId,
                title,
                umkm_name: umkmName,
                umkm_sector: umkmSector
            });
            // Fetch detailed project details
            const detailResponse = await api.get(`/projects/${response.data.id}`);
            setProject(detailResponse.data);
        } catch (error) {
            console.error('Error initializing project:', error);
            setErrorMsg(error.response?.data?.error || 'Gagal mendaftarkan proyek baru.');
        } finally {
            setIsInitializing(false);
        }
    };

    const handleOpenSubmitForm = (milestoneId) => {
        setSubmittingMilestoneId(milestoneId);
        setSubmissionUrl('');
        setNotes('');
    };

    const handleCancelSubmit = () => {
        setSubmittingMilestoneId(null);
    };

    const handleSubmitDeliverable = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        try {
            await api.post('/submissions', {
                project_id: project.id,
                milestone_id: submittingMilestoneId,
                submission_url: submissionUrl,
                notes
            });
            setSubmittingMilestoneId(null);
            // Refresh project state
            const detailResponse = await api.get(`/projects/${project.id}`);
            setProject(detailResponse.data);
        } catch (error) {
            console.error('Error submitting milestone:', error);
            setErrorMsg('Gagal mengirimkan laporan dokumen.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                <p className="text-label-sm text-on-surface-variant">Memuat data proyek...</p>
            </div>
        );
    }

    return (
        <>
            {/* Back Button */}
            <Link to={`/dashboard/courses/${courseId}`} className="flex items-center gap-2 mb-6 text-primary hover:opacity-85 font-semibold">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                <span>Kembali ke Kelas</span>
            </Link>

            {errorMsg && (
                <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 text-label-sm font-medium">
                    {errorMsg}
                </div>
            )}

            {!project ? (
                /* 1. Project Initialization Form */
                <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
                    <div className="mb-6 text-center">
                        <span className="inline-flex p-3 bg-secondary-container/20 text-secondary rounded-full mb-3">
                            <span className="material-symbols-outlined text-[32px]">assignment_add</span>
                        </span>
                        <h1 className="text-headline-md font-headline-md text-primary">Inisialisasi Proyek PjBL Baru</h1>
                        <p className="text-body-md text-on-surface-variant mt-1">
                            Kelas ini mensyaratkan proyek akhir lapangan bersama mitra UMKM. Daftarkan proyek Anda untuk memulai.
                        </p>
                    </div>

                    <form onSubmit={handleInitializeProject} className="space-y-6">
                        <div>
                            <label className="block text-label-sm font-medium text-primary mb-2">Judul Proyek Inovasi</label>
                            <input 
                                type="text" 
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contoh: Digitalisasi Waste Management Resto Barito"
                                className="w-full h-[48px] px-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-label-sm font-medium text-primary mb-2">Nama Mitra UMKM</label>
                                <input 
                                    type="text" 
                                    required
                                    value={umkmName}
                                    onChange={(e) => setUmkmName(e.target.value)}
                                    placeholder="Contoh: Resto Barito"
                                    className="w-full h-[48px] px-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                                />
                            </div>
                            <div>
                                <label className="block text-label-sm font-medium text-primary mb-2">Sektor Usaha Mitra</label>
                                <input 
                                    type="text" 
                                    required
                                    value={umkmSector}
                                    onChange={(e) => setUmkmSector(e.target.value)}
                                    placeholder="Contoh: F&B Kuliner"
                                    className="w-full h-[48px] px-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isInitializing}
                            className="w-full h-[48px] bg-secondary hover:bg-secondary/90 text-on-secondary rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:scale-98 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isInitializing ? (
                                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                            ) : (
                                <>
                                    <span>Mulai Proyek Lapangan</span>
                                    <span className="material-symbols-outlined text-[20px]">start</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                /* 2. Active Project Workspace View */
                <div className="space-y-8">
                    {/* Project Title Card */}
                    <div className="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="inline-block py-1 px-3 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm mb-3 capitalize">
                                Status: {project.status === 'planning' ? 'Perencanaan' : project.status === 'executing' ? 'Eksekusi' : 'Selesai'}
                            </span>
                            <h1 className="text-[28px] font-bold text-primary mb-2">{project.title}</h1>
                            <p className="text-body-md text-on-surface-variant">
                                Kolaborasi Bersama: <strong className="text-primary">{project.umkm_name}</strong> &bull; Sektor <strong className="text-primary">{project.umkm_sector}</strong>
                            </p>
                        </div>
                        <div className="text-left md:text-right shrink-0">
                            <p className="text-label-sm text-on-surface-variant">Dibuat Pada</p>
                            <p className="text-body-lg font-bold text-primary">
                                {new Date(project.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Milestones Tracker */}
                    <div className="space-y-6">
                        <h2 className="text-headline-md font-headline-md text-primary">Target Milestone & Pengiriman Dokumen</h2>

                        {course.milestones?.length === 0 ? (
                            <p className="text-body-md text-on-surface-variant">Belum ada milestones yang dikonfigurasi untuk kursus ini.</p>
                        ) : (
                            <div className="space-y-6">
                                {course.milestones
                                    .sort((a, b) => a.sequence - b.sequence)
                                    .map((milestone) => {
                                        // Check if student has submitted for this milestone
                                        const submission = project.submissions?.find(s => s.milestone_id === milestone.id);
                                        const feedback = submission?.feedback;

                                        return (
                                            <div 
                                                key={milestone.id} 
                                                className="bg-white rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-3"
                                            >
                                                {/* Milestone Description */}
                                                <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r border-outline-variant/20 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="text-headline-md font-headline-md text-primary mb-2">{milestone.title}</h3>
                                                        <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">{milestone.description}</p>
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-4 text-[12px] text-on-surface-variant font-medium">
                                                        <span className="material-symbols-outlined text-[16px]">info</span>
                                                        <span>Nilai minimum kelulusan: 75 / 100</span>
                                                    </div>
                                                </div>

                                                {/* Milestone Submission status / Form */}
                                                <div className="p-6 bg-surface-container-low/30 flex flex-col justify-center">
                                                    {submittingMilestoneId === milestone.id ? (
                                                        /* Deliverable Submit Form */
                                                        <form onSubmit={handleSubmitDeliverable} className="space-y-4">
                                                            <h4 className="text-label-sm font-bold text-primary">Kirim Laporan</h4>
                                                            
                                                            <div>
                                                                <input
                                                                    type="url"
                                                                    required
                                                                    value={submissionUrl}
                                                                    onChange={(e) => setSubmissionUrl(e.target.value)}
                                                                    placeholder="Tautan Dokumen (Google Drive/PDF)"
                                                                    className="w-full px-3 py-2 rounded-lg border border-outline/30 text-body-md focus:border-primary focus:outline-none bg-white"
                                                                />
                                                            </div>
                                                            <div>
                                                                <textarea
                                                                    value={notes}
                                                                    onChange={(e) => setNotes(e.target.value)}
                                                                    placeholder="Catatan pengerjaan singkat..."
                                                                    className="w-full px-3 py-2 rounded-lg border border-outline/30 text-body-md focus:border-primary focus:outline-none bg-white h-16 resize-none"
                                                                />
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="submit"
                                                                    disabled={isSubmitting}
                                                                    className="flex-1 bg-secondary text-on-secondary px-3 py-2 rounded-lg text-label-sm font-bold hover:scale-95 transition-all shadow-sm"
                                                                >
                                                                    {isSubmitting ? 'Mengirim...' : 'Kirim'}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={handleCancelSubmit}
                                                                    className="bg-outline text-white px-3 py-2 rounded-lg text-label-sm font-bold"
                                                                >
                                                                    Batal
                                                                </button>
                                                            </div>
                                                        </form>
                                                    ) : submission ? (
                                                        /* Submitted State */
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-green-600 font-bold">check_circle</span>
                                                                <span className="text-label-sm font-bold text-green-700">Laporan Terkirim</span>
                                                            </div>
                                                            <div className="text-body-md text-on-surface-variant">
                                                                <a 
                                                                    href={submission.submission_url} 
                                                                    target="_blank" 
                                                                    rel="noreferrer" 
                                                                    className="text-secondary hover:underline font-bold flex items-center gap-1"
                                                                >
                                                                    <span>Buka Tautan Laporan</span>
                                                                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                                                </a>
                                                            </div>

                                                            {feedback ? (
                                                                /* Feedback Graded */
                                                                <div className="mt-4 pt-4 border-t border-outline-variant/30 space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-label-sm font-bold text-primary">Skor Penilaian</span>
                                                                        <span className="text-body-lg font-bold text-secondary">{feedback.score} / 100</span>
                                                                    </div>
                                                                    <div className="p-3 bg-white rounded-lg border border-outline-variant/20">
                                                                        <p className="text-[11px] font-bold text-primary mb-1">Komentar Instruktur ({feedback.evaluator?.name}):</p>
                                                                        <p className="text-body-md text-on-surface-variant italic">"{feedback.comments}"</p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                /* Waiting evaluation */
                                                                <div className="p-3 bg-white rounded-lg border border-outline-variant/20">
                                                                    <p className="text-label-sm text-on-surface-variant/80 italic text-center">Menunggu evaluasi penilaian dosen.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        /* Initial / Unsubmitted State */
                                                        <div className="text-center py-4">
                                                            <button
                                                                onClick={() => handleOpenSubmitForm(milestone.id)}
                                                                className="bg-primary text-on-primary hover:bg-primary-container px-6 py-2.5 rounded-lg text-label-sm font-bold hover:scale-95 transition-all shadow-sm cursor-pointer"
                                                            >
                                                                Kirim Laporan Proyek
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProjectView;
