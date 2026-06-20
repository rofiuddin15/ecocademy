import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const ProjectEvaluationDetail = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Proposal Review state (Approve/Reject)
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviewStatus, setReviewStatus] = useState('approved'); // approved or rejected
    const [rejectionComment, setRejectionComment] = useState('');

    // Grading Modal State
    const [gradingSubmission, setGradingSubmission] = useState(null);
    const [gradeInput, setGradeInput] = useState('');
    const [greenScoreInput, setGreenScoreInput] = useState('3');
    const [feedbackComments, setFeedbackComments] = useState('');
    const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);
    const [gradeError, setGradeError] = useState('');

    const fetchProjectData = async () => {
        try {
            const response = await api.get(`/projects/${projectId}`);
            setProject(response.data);
        } catch (err) {
            console.error('Error fetching project details:', err);
            setError('Gagal memuat data detail proyek.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [projectId]);

    const handleOpenGrade = (sub, milestoneTitle) => {
        setGradingSubmission({
            ...sub,
            milestoneTitle
        });
        setGradeInput(sub.feedback?.grade || '');
        setGreenScoreInput(sub.feedback?.green_impact_score || '3');
        setFeedbackComments(sub.feedback?.comments || '');
        setGradeError('');
    };

    const handleSubmitGrade = async () => {
        if (!gradeInput || isNaN(gradeInput) || gradeInput < 0 || gradeInput > 100) {
            setGradeError('Nilai harus berupa angka antara 0 - 100.');
            return;
        }
        setIsSubmittingGrade(true);
        setGradeError('');
        try {
            await api.post('/feedbacks', {
                submission_id: gradingSubmission.id,
                grade: gradeInput,
                green_impact_score: greenScoreInput,
                comments: feedbackComments
            });
            await fetchProjectData();
            setGradingSubmission(null);
        } catch (err) {
            console.error('Error submitting grade:', err);
            setGradeError('Gagal menyimpan nilai.');
        } finally {
            setIsSubmittingGrade(false);
        }
    };

    const handleReviewProposal = async (e) => {
        e.preventDefault();
        setIsReviewing(true);
        try {
            await api.post(`/projects/${projectId}/review`, {
                status: reviewStatus,
                rejection_comment: reviewStatus === 'rejected' ? rejectionComment : null
            });
            await fetchProjectData();
            setRejectionComment('');
        } catch (err) {
            console.error('Error reviewing project proposal:', err);
            alert('Gagal memperbarui status proposal.');
        } finally {
            setIsReviewing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[36px] animate-spin">sync</span>
                <p className="text-label-sm text-on-surface-variant font-medium">Memuat data evaluasi proyek...</p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="bg-white p-8 rounded-lg border border-outline-variant/30 text-center shadow-sm max-w-md mx-auto mt-10">
                <span className="material-symbols-outlined text-[48px] text-error mb-2">error</span>
                <p className="text-label-sm text-on-surface-variant font-medium">{error || 'Data proyek tidak ditemukan.'}</p>
                <Link to="/dashboard/evaluation" className="mt-4 inline-block bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-bold">
                    Kembali ke Pusat Evaluasi
                </Link>
            </div>
        );
    }

    // Sort milestones by sequence
    const milestones = [...(project.course?.milestones || [])].sort((a, b) => a.sequence - b.sequence);

    // Group submissions by milestone_id for easy lookup
    const submissionsMap = {};
    if (project.submissions) {
        project.submissions.forEach(sub => {
            submissionsMap[sub.milestone_id] = sub;
        });
    }

    const studentName = project.student?.name || 'Mahasiswa';
    const initials = studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <div className="space-y-4">
            {/* Navigation & Header */}
            <div className="flex flex-col gap-2 border-b border-outline-variant/20 pb-3">
                <Link to="/dashboard/evaluation" className="inline-flex items-center gap-1 text-xs text-secondary hover:text-secondary/80 font-bold self-start transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Kembali ke Pusat Evaluasi
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-headline-md font-headline-md text-primary font-bold">{project.title}</h1>
                        <p className="text-label-sm text-on-surface-variant mt-0.5">
                            Kursus: <span className="font-semibold">{project.course?.title}</span>
                        </p>
                    </div>

                    {/* Student Info Card */}
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-outline-variant/20 shadow-sm shrink-0">
                        <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                            {initials}
                        </div>
                        <div>
                            <p className="font-bold text-on-surface text-xs leading-none">{studentName}</p>
                            <p className="text-[10px] text-on-surface-variant font-medium mt-1">{project.student?.email || ''}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* LEFT COLUMN: Project & Proposal Details */}
                <div className="lg:col-span-4 space-y-4">
                    
                    {/* Proposal Status Badge & Info */}
                    <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-3">
                        <h3 className="font-bold text-primary text-sm flex items-center gap-1.5 border-b border-outline-variant/20 pb-2">
                            <span className="material-symbols-outlined text-[18px]">info</span>
                            Profil Proyek & UMKM
                        </h3>
                        <div className="space-y-2 text-xs">
                            <p className="flex justify-between border-b border-slate-50 pb-1.5">
                                <strong className="text-on-surface-variant">Status Proyek:</strong> 
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    project.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    project.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                    project.status === 'completed' ? 'bg-primary-fixed/20 text-primary-fixed-variant' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                    {project.status?.toUpperCase()}
                                </span>
                            </p>
                            <p className="flex justify-between border-b border-slate-50 pb-1.5">
                                <strong className="text-on-surface-variant">Mitra UMKM:</strong> 
                                <span className="font-medium text-right">{project.umkm_name || '—'}</span>
                            </p>
                            <p className="flex justify-between border-b border-slate-50 pb-1.5">
                                <strong className="text-on-surface-variant">Sektor Bidang:</strong> 
                                <span className="font-medium text-right">{project.umkm_sector || '—'}</span>
                            </p>
                            <p className="flex justify-between pb-1.5">
                                <strong className="text-on-surface-variant">Estimasi Anggaran:</strong> 
                                <span className="font-bold text-emerald-700">Rp {Number(project.budget || 0).toLocaleString('id-ID')}</span>
                            </p>

                            {/* Target Partner info if available */}
                            {project.target_partner && (
                                <div className="mt-3 pt-3 border-t border-outline-variant/35 space-y-1 bg-slate-50 p-2.5 rounded-lg">
                                    <p className="font-bold text-on-surface flex items-center gap-1 text-[11px] mb-1">
                                        <span className="material-symbols-outlined text-[15px] text-primary">handshake</span>
                                        Mitra Usaha Target (Hubungan):
                                    </p>
                                    <p><strong>Nama:</strong> {project.target_partner.name}</p>
                                    <p><strong>Sektor:</strong> {project.target_partner.sector}</p>
                                    <p><strong>Lokasi:</strong> {project.target_partner.location}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Proposal Action / Approval Form (Visible to Instructor for pending projects) */}
                    {project.status === 'pending' && (
                        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/50 shadow-sm space-y-3">
                            <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]">gavel</span>
                                Tinjau Proposal Proyek
                            </h3>
                            <form onSubmit={handleReviewProposal} className="space-y-3 text-xs">
                                <div>
                                    <label className="block font-bold text-amber-950 mb-1">Keputusan Review:</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-amber-900">
                                            <input 
                                                type="radio" 
                                                name="reviewStatus" 
                                                value="approved" 
                                                checked={reviewStatus === 'approved'}
                                                onChange={() => setReviewStatus('approved')}
                                            />
                                            Setujui Proposal
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-amber-900">
                                            <input 
                                                type="radio" 
                                                name="reviewStatus" 
                                                value="rejected"
                                                checked={reviewStatus === 'rejected'}
                                                onChange={() => setReviewStatus('rejected')}
                                            />
                                            Tolak / Butuh Revisi
                                        </label>
                                    </div>
                                </div>

                                {reviewStatus === 'rejected' && (
                                    <div>
                                        <label className="block font-bold text-amber-950 mb-1">Catatan Penolakan / Masukan Revisi:</label>
                                        <textarea
                                            value={rejectionComment}
                                            onChange={(e) => setRejectionComment(e.target.value)}
                                            rows="3"
                                            required
                                            placeholder="Tulis alasan penolakan dan instruksi perbaikan..."
                                            className="w-full p-2 border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isReviewing}
                                    className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isReviewing ? 'Memproses...' : 'Simpan Keputusan'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Proposal Description */}
                    <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-2">
                        <h3 className="font-bold text-on-surface text-sm">Deskripsi Rencana Proposal</h3>
                        <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-line bg-slate-50/50 p-3 rounded-lg border border-outline-variant/10 shadow-inner">
                            {project.proposal_description || 'Tidak ada deskripsi proposal proyek.'}
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Milestones & Student Submissions List */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                            <h3 className="font-bold text-primary text-sm flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                                Daftar Laporan & Tahapan Milestone
                            </h3>
                            <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                Total: {milestones.length} Tahapan
                            </span>
                        </div>

                        {milestones.length === 0 ? (
                            <p className="text-xs text-on-surface-variant/80 text-center py-6">Tidak ada tahapan milestone pada kursus ini.</p>
                        ) : (
                            <div className="space-y-4">
                                {milestones.map((milestone) => {
                                    const submission = submissionsMap[milestone.id];
                                    const isSubmitted = !!submission;

                                    return (
                                        <div 
                                            key={milestone.id} 
                                            className={`p-4 rounded-xl border ${
                                                isSubmitted 
                                                    ? 'border-outline-variant/40 bg-white shadow-sm' 
                                                    : 'border-slate-100 bg-slate-50/50 opacity-80'
                                            } space-y-3 transition-all`}
                                        >
                                            {/* Milestone Title Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                                <div className="space-y-0.5">
                                                    <span className="text-[10px] font-bold text-primary-fixed-variant bg-primary-fixed/20 px-1.5 py-0.25 rounded uppercase">
                                                        Tahap {milestone.sequence}
                                                    </span>
                                                    <h4 className="font-bold text-on-surface text-sm mt-1">{milestone.title}</h4>
                                                </div>

                                                {/* Submission Status Badge */}
                                                <div>
                                                    {isSubmitted ? (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-800 border border-green-200 flex items-center gap-0.5 w-fit">
                                                            <span className="material-symbols-outlined text-[12px] text-green-700">check_circle</span>
                                                            Sudah Dikumpulkan
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-0.5 w-fit">
                                                            <span className="material-symbols-outlined text-[12px] text-slate-400">hourglass_empty</span>
                                                            Belum Dikumpulkan
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Instructions Box */}
                                            {milestone.instructions && (
                                                <div className="text-[11px] text-on-surface-variant/80 bg-slate-100/50 p-2.5 rounded border border-slate-100">
                                                    <strong>Instruksi:</strong> {milestone.instructions}
                                                </div>
                                            )}

                                            {/* Submission Details Container (If Submitted) */}
                                            {isSubmitted ? (
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-start">
                                                    
                                                    {/* Student Notes & File Details */}
                                                    <div className="md:col-span-7 space-y-2 text-xs">
                                                        <div>
                                                            <strong className="text-on-surface">Tautan Berkas Laporan: </strong>
                                                            <a 
                                                                href={submission.file_url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-secondary font-bold hover:underline inline-flex items-center gap-0.5"
                                                            >
                                                                <span className="material-symbols-outlined text-[14px]">link</span> Buka Tautan Laporan
                                                            </a>
                                                        </div>
                                                        <div className="text-[11px] text-on-surface-variant">
                                                            <strong>Tanggal Kumpul: </strong>
                                                            {new Date(submission.submitted_at).toLocaleString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                        {submission.student_notes && (
                                                            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                                                                <p className="font-bold text-[10px] text-on-surface-variant flex items-center gap-0.5 mb-1">
                                                                    <span className="material-symbols-outlined text-[13px] text-secondary">chat_bubble</span>
                                                                    Catatan Pengiriman Mahasiswa:
                                                                </p>
                                                                <p className="italic text-on-surface-variant leading-relaxed whitespace-pre-line text-[11px]">
                                                                    {submission.student_notes}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Grading Feedback Panel */}
                                                    <div className="md:col-span-5 bg-white p-3 rounded-lg border border-outline-variant/20 shadow-inner space-y-2 text-xs">
                                                        <h5 className="font-bold text-primary border-b border-slate-50 pb-1">Evaluasi Dosen</h5>
                                                        {submission.feedback ? (
                                                            <div className="space-y-1.5">
                                                                <div className="flex gap-1.5">
                                                                    <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shadow-sm">
                                                                        Nilai: {submission.feedback.grade}
                                                                    </span>
                                                                    <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shadow-sm flex items-center gap-0.5">
                                                                        Dampak: {submission.feedback.green_impact_score} <span className="material-symbols-outlined text-[10px] text-emerald-600">eco</span>
                                                                    </span>
                                                                </div>
                                                                {submission.feedback.comments && (
                                                                    <p className="text-[11px] text-on-surface-variant font-medium italic bg-slate-50/50 p-2 rounded leading-relaxed border border-slate-50">
                                                                        "{submission.feedback.comments}"
                                                                    </p>
                                                                )}
                                                                <button
                                                                    onClick={() => handleOpenGrade(submission, milestone.title)}
                                                                    className="text-primary font-bold hover:underline text-[10px] flex items-center gap-0.5 mt-1 cursor-pointer bg-transparent border-0"
                                                                >
                                                                    <span className="material-symbols-outlined text-[12px]">edit</span>
                                                                    Ubah Nilai
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <p className="text-[11px] text-amber-800 font-semibold bg-amber-50 p-2 rounded border border-amber-100 flex items-center gap-1 w-fit">
                                                                    <span className="material-symbols-outlined text-[14px]">pending_actions</span>
                                                                    Menunggu Evaluasi Nilai
                                                                </p>
                                                                <button
                                                                    onClick={() => handleOpenGrade(submission, milestone.title)}
                                                                    className="w-full text-center text-white bg-secondary hover:bg-secondary/95 text-[10px] py-1.5 rounded-lg transition-colors font-bold cursor-pointer border-0 flex items-center justify-center gap-1"
                                                                >
                                                                    <span className="material-symbols-outlined text-[12px]">rate_review</span>
                                                                    Beri Nilai Laporan
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-on-surface-variant/60 italic pl-1">Laporan pengerjaan belum diunggah oleh mahasiswa.</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* ============================================================
                GRADING MODAL (Beri Nilai per Milestone)
                ============================================================ */}
            {gradingSubmission && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-outline-variant bg-primary-fixed/10 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="font-headline-sm text-primary font-bold">Penilaian Milestone</h3>
                                <p className="font-label-sm text-on-surface-variant font-medium mt-0.5">
                                    {project.student?.name} • {gradingSubmission.milestoneTitle}
                                </p>
                            </div>
                            <button onClick={() => setGradingSubmission(null)} className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-error/10 transition-colors cursor-pointer bg-transparent border-0">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-on-surface mb-1">Nilai Tugas (0 - 100)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={gradeInput}
                                    onChange={(e) => setGradeInput(e.target.value)}
                                    className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-body-md"
                                    placeholder="Contoh: 85"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-on-surface mb-1 flex items-center gap-1">Skor Dampak Hijau (1 - 5) <span className="material-symbols-outlined text-[14px] text-emerald-600">eco</span></label>
                                <p className="text-xs text-on-surface-variant mb-2">Nilai 5 jika proyek memiliki potensi keberlanjutan yang sangat tinggi.</p>
                                <select
                                    value={greenScoreInput}
                                    onChange={(e) => setGreenScoreInput(e.target.value)}
                                    className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-body-md bg-white text-on-surface"
                                >
                                    <option value="1">1 - Sangat Rendah</option>
                                    <option value="2">2 - Rendah</option>
                                    <option value="3">3 - Sedang / Standar</option>
                                    <option value="4">4 - Tinggi</option>
                                    <option value="5">5 - Sangat Tinggi (Excellent)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-on-surface mb-1">Komentar / Feedback Umpan Balik</label>
                                <textarea
                                    value={feedbackComments}
                                    onChange={(e) => setFeedbackComments(e.target.value)}
                                    rows="3"
                                    placeholder="Berikan masukan konstruktif dan rekomendasi hijau untuk proyek mahasiswa ini..."
                                    className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-body-md resize-none"
                                />
                            </div>

                            {gradeError && (
                                <div className="p-3 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-2 border border-error/25">
                                    <span className="material-symbols-outlined text-[16px]">error</span>
                                    <span className="font-semibold">{gradeError}</span>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex justify-end gap-3 shrink-0">
                            <button onClick={() => setGradingSubmission(null)}
                                className="px-5 py-2.5 rounded-lg font-label-md text-on-surface-variant hover:bg-outline-variant/20 transition-colors border border-transparent cursor-pointer bg-transparent">
                                Batal
                            </button>
                            <button
                                onClick={handleSubmitGrade}
                                disabled={isSubmittingGrade}
                                className="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary/95 rounded-lg font-label-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer font-bold hover:scale-98 border-0"
                            >
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                {isSubmittingGrade ? 'Menyimpan...' : 'Simpan Penilaian'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectEvaluationDetail;
