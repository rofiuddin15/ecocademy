import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

// Helper untuk menampilkan teks multi-baris sebagai list
const MultilineText = ({ text, className = '' }) => {
    if (!text) return null;
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length <= 1) return <p className={className}>{text}</p>;
    return (
        <ul className={`list-none space-y-1 ${className}`}>
            {lines.map((line, i) => (
                <li key={i} className="flex gap-2">
                    <span className="text-secondary shrink-0">•</span>
                    <span>{line.replace(/^\d+\.\s*/, '')}</span>
                </li>
            ))}
        </ul>
    );
};

// Badge status proyek
const StatusBadge = ({ status }) => {
    const map = {
        pending:  { label: 'Menunggu Persetujuan', color: 'bg-amber-100 text-amber-800 border-amber-200' },
        approved: { label: 'Disetujui', color: 'bg-green-100 text-green-800 border-green-200' },
        rejected: { label: 'Ditolak — Perlu Revisi', color: 'bg-red-100 text-red-800 border-red-200' },
        completed:{ label: 'Selesai', color: 'bg-primary/10 text-primary border-primary/20' },
        planning: { label: 'Perencanaan', color: 'bg-blue-100 text-blue-800 border-blue-200' },
        executing:{ label: 'Eksekusi', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    };
    const cfg = map[status] ?? { label: status, color: 'bg-surface-container text-on-surface-variant border-outline-variant' };
    return (
        <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full border text-label-sm font-label-sm capitalize ${cfg.color}`}>
            {cfg.label}
        </span>
    );
};

const ProjectView = () => {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form state — pendaftaran proyek baru
    const [title, setTitle]           = useState('');
    const [umkmName, setUmkmName]     = useState('');
    const [umkmSector, setUmkmSector] = useState('');
    const [budget, setBudget]         = useState('');
    const [proposalDesc, setProposalDesc] = useState('');
    const [isInitializing, setIsInitializing] = useState(false);

    // Form state — edit proposal (setelah ditolak)
    const [isEditing, setIsEditing]   = useState(false);
    const [editTitle, setEditTitle]   = useState('');
    const [editDesc, setEditDesc]     = useState('');

    // Form state — pengiriman laporan milestone
    const [submittingMilestoneId, setSubmittingMilestoneId] = useState(null);
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [notes, setNotes]           = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Panel panduan RPM
    const [expandedRpm, setExpandedRpm] = useState(null);

    const [errorMsg, setErrorMsg] = useState('');

    const fetchProjectData = async () => {
        try {
            const courseResponse = await api.get(`/courses/${courseId}`);
            setCourse(courseResponse.data);

            const projectsResponse = await api.get('/projects');
            const activeProject = projectsResponse.data.find(p => p.course_id === courseId);

            if (activeProject) {
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

    // --- Pendaftaran proyek baru ---
    const handleInitializeProject = async (e) => {
        e.preventDefault();
        setIsInitializing(true);
        setErrorMsg('');
        try {
            const response = await api.post('/projects', {
                course_id:            courseId,
                title,
                umkm_name:            umkmName,
                umkm_sector:          umkmSector,
                budget:               budget ? Number(budget) : null,
                proposal_description: proposalDesc,
            });
            const detailResponse = await api.get(`/projects/${response.data.id}`);
            setProject(detailResponse.data);
        } catch (error) {
            console.error('Error initializing project:', error);
            setErrorMsg(error.response?.data?.error || 'Gagal mendaftarkan proyek baru.');
        } finally {
            setIsInitializing(false);
        }
    };

    // --- Edit proposal yang ditolak ---
    const handleStartEdit = () => {
        setEditTitle(project.title);
        setEditDesc(project.proposal_description || '');
        setIsEditing(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setIsInitializing(true);
        setErrorMsg('');
        try {
            await api.put(`/projects/${project.id}`, {
                title:                editTitle,
                proposal_description: editDesc,
            });
            const detailResponse = await api.get(`/projects/${project.id}`);
            setProject(detailResponse.data);
            setIsEditing(false);
        } catch (error) {
            setErrorMsg('Gagal menyimpan revisi proposal.');
        } finally {
            setIsInitializing(false);
        }
    };

    // --- Pengiriman laporan milestone ---
    const handleOpenSubmitForm  = (milestoneId) => { setSubmittingMilestoneId(milestoneId); setSubmissionUrl(''); setNotes(''); };
    const handleCancelSubmit    = () => setSubmittingMilestoneId(null);

    const handleSubmitDeliverable = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');
        try {
            await api.post('/submissions', {
                project_id:     project.id,
                milestone_id:   submittingMilestoneId,
                file_url:       submissionUrl,
                student_notes:  notes,
            });
            setSubmittingMilestoneId(null);
            const detailResponse = await api.get(`/projects/${project.id}`);
            setProject(detailResponse.data);
        } catch (error) {
            setErrorMsg('Gagal mengirimkan laporan dokumen.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleRpm = (id) => setExpandedRpm(prev => prev === id ? null : id);

    const inputClass = "w-full px-4 py-3 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-body-md bg-white";

    // ===========================
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
                <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 text-label-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    {errorMsg}
                </div>
            )}

            {!project ? (
                /* ==========================================
                   1. FORMULIR PENDAFTARAN PROYEK BARU
                   ========================================== */
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white p-8 rounded-lg border border-outline-variant/30 shadow-sm">
                        <div className="mb-6 text-center">
                            <span className="inline-flex p-4 bg-secondary/10 text-secondary rounded-full mb-3">
                                <span className="material-symbols-outlined text-[36px]">eco</span>
                            </span>
                            <h1 className="font-headline-md text-primary">Daftar Proyek Greenpreneurship</h1>
                            <p className="text-body-md text-on-surface-variant mt-2 max-w-md mx-auto">
                                Ajukan proposal ide bisnis hijau Anda untuk mendapatkan persetujuan dosen sebelum memulai proses PjBL.
                            </p>
                        </div>

                        {/* Ringkasan RPM */}
                        {course?.milestones?.length > 0 && (
                            <div className="mb-6 p-4 bg-primary/5 border border-primary/15 rounded-lg">
                                <p className="font-label-md text-primary mb-2 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px]">timeline</span>
                                    Proyek ini memiliki {course.milestones.length} tahap PjBL
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {course.milestones.sort((a,b) => a.sequence - b.sequence).map(m => (
                                        <span key={m.id} className="text-label-sm bg-white border border-primary/20 text-primary px-2 py-0.5 rounded-full">
                                            T{m.sequence}: {m.weight ?? 0}%
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleInitializeProject} className="space-y-5">
                            <div>
                                <label className="block font-label-md text-primary mb-2">Judul Proposal Bisnis Hijau <span className="text-error">*</span></label>
                                <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                                    placeholder="Contoh: Pengolahan Limbah Kulit Apel Menjadi Vegan Leather"
                                    className={inputClass} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-label-md text-primary mb-2">Potensi Lokal / Mitra UMKM</label>
                                    <input type="text" value={umkmName} onChange={e => setUmkmName(e.target.value)}
                                        placeholder="Contoh: Kelompok Tani Apel Kota Batu" className={inputClass} />
                                </div>
                                <div>
                                    <label className="block font-label-md text-primary mb-2">Sektor (Pertanian, Pariwisata, dll)</label>
                                    <input type="text" value={umkmSector} onChange={e => setUmkmSector(e.target.value)}
                                        placeholder="Contoh: Pertanian & Kriya" className={inputClass} />
                                </div>
                            </div>

                            <div>
                                <label className="block font-label-md text-primary mb-2">Estimasi Anggaran (Rp)</label>
                                <input type="number" value={budget} onChange={e => setBudget(e.target.value)}
                                    placeholder="Contoh: 2500000" min="0" className={inputClass} />
                            </div>

                            <div>
                                <label className="block font-label-md text-primary mb-2">Inti Sari Proposal (Permasalahan & Solusi)</label>
                                <textarea value={proposalDesc} onChange={e => setProposalDesc(e.target.value)}
                                    rows="5" className={inputClass + ' resize-none'}
                                    placeholder="Uraikan:&#10;1. Permasalahan lingkungan/sosial di Jawa Timur yang diangkat.&#10;2. Solusi bisnis hijau yang diusulkan.&#10;3. Bagaimana profit, lingkungan, dan sosial (People, Planet, Profit) diintegrasikan." />
                            </div>

                            <button type="submit" disabled={isInitializing}
                                className="w-full h-[52px] bg-secondary hover:bg-secondary/90 text-on-secondary rounded-lg font-label-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm">
                                {isInitializing ? (
                                    <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">send</span>
                                        <span>Ajukan Proposal</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                /* ==========================================
                   2. RUANG KERJA PROYEK AKTIF
                   ========================================== */
                <div className="space-y-8">
                    {/* Header Proyek */}
                    <div className="bg-white p-8 rounded-lg border border-outline-variant/30 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex-1">
                                <StatusBadge status={project.status} />
                                <h1 className="text-[26px] font-bold text-primary mt-3 mb-2">{project.title}</h1>
                                {project.umkm_name && (
                                    <p className="text-body-md text-on-surface-variant">
                                        Mitra: <strong className="text-primary">{project.umkm_name}</strong>
                                        {project.umkm_sector && <> &bull; Sektor <strong className="text-primary">{project.umkm_sector}</strong></>}
                                    </p>
                                )}
                                {project.proposal_description && (
                                    <p className="text-body-md text-on-surface-variant mt-2 italic">"{project.proposal_description}"</p>
                                )}
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-label-sm text-on-surface-variant">Didaftarkan</p>
                                <p className="font-bold text-primary">
                                    {new Date(project.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Banner: Menunggu Persetujuan */}
                        {project.status === 'pending' && (
                            <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                                <span className="material-symbols-outlined text-amber-500 mt-0.5">schedule</span>
                                <div>
                                    <p className="font-label-md text-amber-800">Proposal Menunggu Persetujuan Dosen</p>
                                    <p className="font-body-sm text-amber-700 mt-0.5">
                                        Dosen akan meninjau proposal Anda. Anda akan dapat memulai pengerjaan setelah proposal disetujui.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Banner: Ditolak — Perlu Revisi */}
                        {project.status === 'rejected' && (
                            <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="material-symbols-outlined text-red-500 mt-0.5">cancel</span>
                                    <div>
                                        <p className="font-label-md text-red-800">Proposal Ditolak — Revisi Diperlukan</p>
                                        {project.rejection_comment && (
                                            <p className="font-body-sm text-red-700 mt-1 italic">
                                                Komentar dosen: "{project.rejection_comment}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {!isEditing ? (
                                    <button onClick={handleStartEdit}
                                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-label-md hover:bg-red-700 transition-colors text-sm">
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                        Revisi & Ajukan Ulang Proposal
                                    </button>
                                ) : (
                                    <form onSubmit={handleSaveEdit} className="space-y-4 mt-3">
                                        <div>
                                            <label className="block font-label-md text-red-800 mb-1">Judul Proyek (Revisi)</label>
                                            <input type="text" required value={editTitle} onChange={e => setEditTitle(e.target.value)}
                                                className={inputClass} />
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-red-800 mb-1">Deskripsi Proposal (Revisi)</label>
                                            <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)}
                                                rows="3" className={inputClass + ' resize-none'} />
                                        </div>
                                        <div className="flex gap-3">
                                            <button type="submit" disabled={isInitializing}
                                                className="bg-secondary text-on-secondary px-5 py-2 rounded-lg font-label-md flex items-center gap-2 hover:bg-secondary/90 transition-colors">
                                                <span className="material-symbols-outlined text-[16px]">send</span>
                                                Ajukan Ulang
                                            </button>
                                            <button type="button" onClick={() => setIsEditing(false)}
                                                className="border border-outline-variant px-5 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container transition-colors">
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ==========================================
                        MILESTONE TRACKER — Hanya tampil jika disetujui
                        ========================================== */}
                    {(project.status === 'approved' || project.status === 'executing' || project.status === 'completed') && (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <h2 className="font-headline-md text-primary">Tahapan PjBL & Pengumpulan Dokumen</h2>
                                <span className="text-label-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                                    {course?.milestones?.length ?? 0} Tahap
                                </span>
                            </div>

                            {course?.milestones?.length === 0 ? (
                                <p className="text-body-md text-on-surface-variant">Belum ada tahap yang dikonfigurasi untuk kursus ini.</p>
                            ) : (
                                <div className="space-y-4">
                                    {course.milestones
                                        .sort((a, b) => a.sequence - b.sequence)
                                        .map((milestone) => {
                                            const submission = project.submissions?.find(s => s.milestone_id === milestone.id);
                                            const feedback   = submission?.feedback;
                                            const isRpmOpen  = expandedRpm === milestone.id;

                                            return (
                                                <div key={milestone.id} className="bg-white rounded-lg border border-outline-variant/30 overflow-hidden shadow-sm">
                                                    {/* Header Milestone */}
                                                    <div className="p-5 border-b border-outline-variant/20">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex items-center gap-3">
                                                                {/* Nomor tahap */}
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${submission ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                                                                    {submission
                                                                        ? <span className="material-symbols-outlined text-[20px]">check</span>
                                                                        : milestone.sequence
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-label-lg text-on-surface">{milestone.title}</h3>
                                                                    <div className="flex items-center gap-3 mt-1">
                                                                        {milestone.weight > 0 && (
                                                                            <span className="text-label-sm text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                                                                                Bobot: {milestone.weight}%
                                                                            </span>
                                                                        )}
                                                                        <span className="text-label-sm text-on-surface-variant">
                                                                            ~{milestone.duration_hours} jam
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* Tombol panduan RPM */}
                                                            {(milestone.student_activities || milestone.lms_deliverable || milestone.assessment_indicators) && (
                                                                <button
                                                                    onClick={() => toggleRpm(milestone.id)}
                                                                    className="flex items-center gap-1.5 text-label-sm text-secondary hover:bg-secondary/10 px-3 py-1.5 rounded-lg transition-colors border border-secondary/20 shrink-0"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px]">
                                                                        {isRpmOpen ? 'expand_less' : 'assignment'}
                                                                    </span>
                                                                    {isRpmOpen ? 'Sembunyikan' : 'Panduan RPM'}
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Instruksi singkat */}
                                                        <p className="text-body-md text-on-surface-variant mt-3 leading-relaxed">{milestone.instructions}</p>
                                                    </div>

                                                    {/* Panel Panduan RPM (collapsible) */}
                                                    {isRpmOpen && (
                                                        <div className="bg-gradient-to-b from-secondary/5 to-transparent border-b border-outline-variant/20">
                                                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">

                                                                {/* Aktivitas */}
                                                                {milestone.student_activities && (
                                                                    <div className="space-y-2">
                                                                        <p className="font-label-md text-secondary flex items-center gap-1.5">
                                                                            <span className="material-symbols-outlined text-[16px]">school</span>
                                                                            Aktivitas Mahasiswa
                                                                        </p>
                                                                        <div className="bg-white rounded-lg p-3 border border-secondary/15">
                                                                            <MultilineText text={milestone.student_activities} className="text-body-sm text-on-surface-variant" />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Tagihan LMS */}
                                                                {milestone.lms_deliverable && (
                                                                    <div className="space-y-2">
                                                                        <p className="font-label-md text-secondary flex items-center gap-1.5">
                                                                            <span className="material-symbols-outlined text-[16px]">upload_file</span>
                                                                            Tagihan Pengumpulan (LMS)
                                                                        </p>
                                                                        <div className="bg-white rounded-lg p-3 border border-secondary/15">
                                                                            <MultilineText text={milestone.lms_deliverable} className="text-body-sm text-on-surface-variant" />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Format Laporan */}
                                                                {milestone.content_format && (
                                                                    <div className="space-y-2">
                                                                        <p className="font-label-md text-secondary flex items-center gap-1.5">
                                                                            <span className="material-symbols-outlined text-[16px]">description</span>
                                                                            Format Isi Laporan
                                                                        </p>
                                                                        <div className="bg-white rounded-lg p-3 border border-secondary/15 max-h-40 overflow-y-auto">
                                                                            <pre className="text-body-sm text-on-surface-variant whitespace-pre-wrap font-inherit">{milestone.content_format}</pre>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Indikator Penilaian */}
                                                                {milestone.assessment_indicators && (
                                                                    <div className="space-y-2">
                                                                        <p className="font-label-md text-secondary flex items-center gap-1.5">
                                                                            <span className="material-symbols-outlined text-[16px]">grade</span>
                                                                            Indikator Penilaian
                                                                        </p>
                                                                        <div className="bg-white rounded-lg p-3 border border-secondary/15">
                                                                            <MultilineText text={milestone.assessment_indicators} className="text-body-sm text-on-surface-variant" />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Area Pengumpulan / Status */}
                                                    <div className="p-5 bg-surface-container-low/20">
                                                        {submittingMilestoneId === milestone.id ? (
                                                            /* Form Kirim Laporan */
                                                            <form onSubmit={handleSubmitDeliverable} className="space-y-3">
                                                                <h4 className="font-label-md text-primary">Kirim Laporan Tahap Ini</h4>
                                                                <input type="url" required value={submissionUrl} onChange={e => setSubmissionUrl(e.target.value)}
                                                                    placeholder="Tautan Dokumen (Google Drive / URL)" className={inputClass} />
                                                                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                                                                    placeholder="Catatan tambahan untuk dosen (opsional)..."
                                                                    rows="2" className={inputClass + ' resize-none'} />
                                                                <div className="flex gap-3">
                                                                    <button type="submit" disabled={isSubmitting}
                                                                        className="bg-secondary text-on-secondary px-5 py-2 rounded-lg font-label-md flex items-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-50">
                                                                        <span className="material-symbols-outlined text-[16px]">upload</span>
                                                                        {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                                                                    </button>
                                                                    <button type="button" onClick={handleCancelSubmit}
                                                                        className="border border-outline-variant px-5 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container transition-colors">
                                                                        Batal
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        ) : submission ? (
                                                            /* Status: Sudah Dikirim */
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2 text-green-700">
                                                                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                                        <span className="font-label-md">Laporan Telah Dikirim</span>
                                                                    </div>
                                                                    <a href={submission.file_url} target="_blank" rel="noreferrer"
                                                                        className="text-secondary hover:underline font-label-sm flex items-center gap-1">
                                                                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                                                        Buka Dokumen
                                                                    </a>
                                                                </div>
                                                                {feedback ? (
                                                                    <div className="p-4 bg-white rounded-lg border border-primary/15">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <p className="font-label-sm text-primary">Penilaian Dosen</p>
                                                                            <span className="text-[20px] font-bold text-secondary">{feedback.grade ?? feedback.score} <span className="text-label-sm text-on-surface-variant font-normal">/ 100</span></span>
                                                                        </div>
                                                                        {feedback.green_impact_score !== undefined && (
                                                                            <p className="text-label-sm text-secondary mb-2">
                                                                                🌿 Skor Dampak Hijau: {feedback.green_impact_score} / 5
                                                                            </p>
                                                                        )}
                                                                        {feedback.comments && (
                                                                            <p className="text-body-sm text-on-surface-variant italic">"{feedback.comments}"</p>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                                                        <p className="text-label-sm text-amber-700 text-center">
                                                                            ⏳ Menunggu evaluasi penilaian dosen
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            /* Status: Belum Dikirim */
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-body-sm text-on-surface-variant italic">Laporan belum dikirimkan.</p>
                                                                <button onClick={() => handleOpenSubmitForm(milestone.id)}
                                                                    className="bg-primary text-on-primary hover:bg-primary/90 px-5 py-2 rounded-lg font-label-md flex items-center gap-2 hover:scale-95 transition-all shadow-sm">
                                                                    <span className="material-symbols-outlined text-[18px]">upload</span>
                                                                    Kirim Laporan
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
                    )}

                    {/* Pesan jika pending/rejected — milestone belum bisa diakses */}
                    {(project.status === 'pending' || project.status === 'rejected') && (
                        <div className="bg-surface-container rounded-lg p-8 text-center border border-outline-variant/30">
                            <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-3 block">lock</span>
                            <p className="font-label-md text-on-surface-variant">Tahapan PjBL akan terbuka setelah proposal disetujui oleh dosen.</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ProjectView;
