import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';

const InstructorDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State untuk modal review proposal
    const [reviewProject, setReviewProject] = useState(null); // project yang sedang direview
    const [rejectionComment, setRejectionComment] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch projects to populate the monitoring table
                const projectsRes = await api.get('/projects');
                setProjects(projectsRes.data);
            } catch (error) {
                console.error('Error fetching instructor dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Buka modal review proposal
    const handleOpenReview = (project) => {
        setReviewProject(project);
        setRejectionComment('');
        setReviewError('');
    };

    // Kirim keputusan review (approve / reject)
    const handleReviewDecision = async (status) => {
        if (!reviewProject) return;
        if (status === 'rejected' && !rejectionComment.trim()) {
            setReviewError('Harap isi alasan penolakan proposal.');
            return;
        }
        setIsReviewing(true);
        setReviewError('');
        try {
            await api.post(`/projects/${reviewProject.id}/review`, {
                status,
                rejection_comment: status === 'rejected' ? rejectionComment : null,
            });
            // Refresh data
            const projectsRes = await api.get('/projects');
            setProjects(projectsRes.data);
            setReviewProject(null);
        } catch (err) {
            setReviewError('Gagal menyimpan keputusan review.');
        } finally {
            setIsReviewing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                <p className="text-label-sm text-on-surface-variant">Memuat dashboard instruktur...</p>
            </div>
        );
    }

    // Proposal yang menunggu persetujuan
    const pendingProjects = projects.filter(p => p.status === 'pending');
    const needsReviewCount = pendingProjects.length;

    // Helper: badge status proyek
    const statusBadge = (status) => {
        const map = {
            pending:   { label: 'Menunggu Review', cls: 'bg-amber-100 text-amber-800' },
            approved:  { label: 'Disetujui',       cls: 'bg-green-100 text-green-800' },
            rejected:  { label: 'Ditolak',         cls: 'bg-red-100 text-red-800'    },
            executing: { label: 'Berjalan',         cls: 'bg-blue-100 text-blue-800'  },
            completed: { label: 'Selesai',          cls: 'bg-primary/10 text-primary' },
        };
        const cfg = map[status] ?? { label: status, cls: 'bg-surface-container text-on-surface-variant' };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${cfg.cls}`}>{cfg.label}</span>;
    };

    return (
        <>
            <div className="space-y-12">
                {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <p className="text-primary font-label-md text-label-md mb-2">Welcome back, {user?.name || 'Instructor'}</p>
                    <h2 className="font-headline-xl text-headline-xl text-primary">Instructor Monitoring</h2>
                </div>
                <div className="bg-primary-container text-on-primary-container px-6 py-4 rounded-lg flex items-center gap-4 border border-primary/20 shadow-sm">
                    <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                    <div>
                        <p className="font-label-sm text-label-sm uppercase tracking-wider opacity-80">Academy Impact Score</p>
                        <p className="font-headline-md text-headline-md font-bold">92.4</p>
                    </div>
                </div>
            </div>

            {/* Bento Grid: Stats & Map */}
            <div className="grid grid-cols-12 gap-4 mb-6">
                {/* Stat Cards */}
                <div className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant p-4 rounded-lg flex flex-col justify-between h-36 shadow-sm">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-primary bg-primary-fixed/20 p-1.5 rounded-lg text-[20px]">rocket_launch</span>
                        <span className="text-on-surface-variant font-label-sm">+2 this week</span>
                    </div>
                    <div>
                        <p className="text-on-surface-variant font-label-sm">Active Projects</p>
                        <p className="text-primary font-headline-lg text-headline-lg font-bold">{projects.length || 12}</p>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant p-4 rounded-lg flex flex-col justify-between h-36 shadow-sm border-l-4 border-l-secondary">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-secondary bg-secondary-container/20 p-1.5 rounded-lg text-[20px]">pending_actions</span>
                        <span className="text-error font-label-md font-bold">Priority</span>
                    </div>
                    <div>
                        <p className="text-on-surface-variant font-label-sm leading-tight">Proposal Menunggu Review</p>
                        <p className="text-primary font-headline-lg text-headline-lg font-bold">{needsReviewCount}</p>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant p-4 rounded-lg flex flex-col justify-between h-36 shadow-sm">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-tertiary bg-tertiary-fixed/40 p-1.5 rounded-lg text-[20px]">handshake</span>
                        <span className="text-on-surface-variant font-label-sm">Partnered</span>
                    </div>
                    <div>
                        <p className="text-on-surface-variant font-label-sm">Partner UMKM</p>
                        <p className="text-primary font-headline-lg text-headline-lg font-bold">08</p>
                    </div>
                </div>

                {/* Map Summary */}
                <div className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant overflow-hidden rounded-lg h-36 relative group cursor-pointer shadow-sm">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCFqZe-hTRGRXmjr9XZ0_EVyyJ3QgA6PTBK9eRxVR8hjxG-YpAldWMVP5Du3df3J8Y9H8xcyrMphvxUai6HZt5Oz5WO8mKM7JRv8KehmfwUnBo0SZGU28nuCVN7c5Zz0l7h-JLjtDarmFboQU57svuybSkW0JFPHO0qDCV4V3Vvcnrub_7miNAUmQZ7rA0Z2WSpJutYssTESX8su9d3suCKRBdfVXmDKX6lj0g5aFWorj8AfryaDHyCbz7aJHsWT6e_EaSAu_xas2oY')" }}
                    ></div>
                    <div className="absolute inset-0 bg-primary/40 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="text-center text-white">
                            <span className="material-symbols-outlined text-3xl">map</span>
                            <p className="font-label-md text-label-md">Partner Map View</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Monitoring Table */}
            <div className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg overflow-hidden mb-6 shadow-sm">
                <div className="px-5 py-4 flex justify-between items-center border-b border-outline-variant bg-surface-container-low">
                    <h3 className="font-headline-md text-headline-md text-primary">Project Monitoring</h3>
                    <div className="flex gap-2">
                        <button className="bg-surface-container border border-outline-variant px-4 py-2 rounded-lg font-label-sm text-label-sm flex items-center gap-2 hover:bg-outline-variant/10 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
                        </button>
                        <button className="bg-surface-container border border-outline-variant px-4 py-2 rounded-lg font-label-sm text-label-sm flex items-center gap-2 hover:bg-outline-variant/10 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">download</span> Export
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-surface-container-high/50 text-on-surface-variant font-label-md text-label-md border-b border-outline-variant">
                                <th className="px-5 py-3">Student Name</th>
                                <th className="px-5 py-3">Project Title</th>
                                <th className="px-5 py-3">Current Milestone</th>
                                <th className="px-5 py-3">MSME Partner</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {projects.length > 0 ? projects.map((project, index) => {
                                const initials = (project.user?.name || project.student?.name || '?')
                                    .split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
                                const studentName = project.user?.name || project.student?.name || 'Mahasiswa';

                                return (
                                    <tr key={project.id || index} className="hover:bg-primary-fixed/5 transition-colors group">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full ${index % 2 === 0 ? 'bg-secondary-fixed text-on-secondary-fixed-variant' : 'bg-primary-fixed text-on-primary-fixed-variant'} flex items-center justify-center font-bold text-xs`}>
                                                    {initials}
                                                </div>
                                                <span className="font-body-md">{studentName}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-primary font-medium">{project.title}</td>
                                        <td className="px-5 py-3">
                                            <div className="w-full bg-surface-container-highest rounded-full h-1.5 max-w-[120px]">
                                                <div className="h-1.5 rounded-full bg-primary" style={{ width: `${project.status === 'completed' ? 100 : project.status === 'executing' ? 60 : project.status === 'approved' ? 30 : 10}%` }}></div>
                                            </div>
                                            <span className="text-[10px] text-on-surface-variant uppercase mt-1 block capitalize">{project.status}</span>
                                        </td>
                                        <td className="px-5 py-3 text-on-surface-variant">{project.umkm_name || '—'}</td>
                                        <td className="px-5 py-3">{statusBadge(project.status)}</td>
                                        <td className="px-5 py-3">
                                            {project.status === 'pending' ? (
                                                <button
                                                    onClick={() => handleOpenReview(project)}
                                                    className="text-white bg-secondary text-label-sm px-3 py-1.5 rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">rate_review</span>
                                                    Review
                                                </button>
                                            ) : (
                                                <button className="text-primary font-label-md text-label-md hover:underline">Detail</button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" className="px-5 py-6 text-center text-on-surface-variant">Belum ada proyek aktif.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Directory & Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-headline-md text-headline-md text-primary">UMKM Partner Directory</h3>
                        <a className="text-primary font-label-md text-label-md flex items-center gap-1 hover:gap-2 transition-all" href="#">
                            View All <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 border border-outline-variant rounded-lg bg-surface-container-lowest hover:shadow-md transition-shadow">
                            <img className="w-14 h-14 rounded-lg object-cover mr-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNWFoIUGsT0AgReNPIN48B9pNQEwFYjxStKvVWQgihtP5rhH6Q8V_oOW4Ig55DxBE5G-MlciTNy6cuibk2-2XtY3Nnukvh83vSV-fqDO2hyeo_K6D1WrdyUXGuZXZBM0fXt-MwUU3SmkDpAkGRkW6_hfuPwRzvkIj-cr_D1GAdFiZUm2uF3B33pPcl0wbHbMXFPf7EbeZkSpuDD1XQLl7jtANqEtR4ftAf6tU-0Fe6vB5Y_aLw9dAFYl6Uq-_u9-ey2GNBUORuQUkb" alt="Handicrafts" />
                            <div>
                                <p className="font-label-md text-label-md text-primary">Kriya Kreasi</p>
                                <p className="text-xs text-on-surface-variant">Handicrafts • Bali</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 border border-outline-variant rounded-lg bg-surface-container-lowest hover:shadow-md transition-shadow">
                            <img className="w-14 h-14 rounded-lg object-cover mr-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU9z9KistK31fJecjJKRAAR-6RUcvKtJ24weKhbaWKGnEDrCJWKsyYgzNCyoThVazAoykd5oV1HHxBSHn0-mpG8yAjujOkxzF_gf1M5fwUNdpgChbAr0wOfEALec9W6taY2zRGnuZRTUs6DBRroihanaZe4QgObCI19VhyUxEFqntGMED2zg9FlNUVuGrgY5wVsLQfh5wpa5-0BZ8YCLSwnPltFZkFmk1vl6N88VQwUWMYTDISCTAZF4Q3-M_hbzfKDkJ-yfG_9MiQ" alt="Organic Harvest" />
                            <div>
                                <p className="font-label-md text-label-md text-primary">Organic Harvest</p>
                                <p className="text-xs text-on-surface-variant">Agriculture • Malang</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-primary text-on-primary rounded-lg p-5 flex flex-col justify-between overflow-hidden relative group shadow-sm">
                    <div className="relative z-10">
                        <h3 className="font-headline-md text-headline-md mb-2">Green Metrics Rubric</h3>
                        <p className="font-body-md opacity-80 mb-4">Review the 2024 sustainability standards for student assessment.</p>
                        <button className="bg-white text-primary px-6 py-3 rounded-lg font-label-md text-label-md w-full flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors">
                            <span className="material-symbols-outlined">menu_book</span>
                            Open Rubric
                        </button>
                    </div>
                    {/* Abstract visual element */}
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container rounded-full opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>
            </div>
        </div>

        {/* ============================================================
            MODAL REVIEW PROPOSAL
            ============================================================ */}
            {reviewProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-surface w-full max-w-3xl rounded-lg shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-5 py-3 border-b border-outline-variant bg-primary/5 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="font-headline-sm text-primary">Review Proposal Proyek</h3>
                                <p className="font-label-sm text-on-surface-variant mt-0.5">{reviewProject.title}</p>
                            </div>
                            <button onClick={() => setReviewProject(null)} className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-error/10 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4 overflow-y-auto flex-1">
                            {/* Acuan RPM (Inti Sari) */}
                            <div className="border-l-4 border-secondary bg-secondary/5 p-3 rounded-lg space-y-1 text-sm text-on-surface">
                                <h4 className="font-label-md text-secondary flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-[18px]">menu_book</span> Acuan Penilaian (Inti Sari RPM)
                                </h4>
                                <p><strong>Tema:</strong> Greenpreneurship Berbasis Potensi Lokal Jawa Timur</p>
                                <p><strong>Deskripsi Tugas:</strong> Mahasiswa mengidentifikasi permasalahan lingkungan/sosial di Jatim, mengembangkan ide bisnis hijau (profit, lingkungan, sosial) dengan memanfaatkan potensi lokal.</p>
                                <p><strong>Output Akhir:</strong> Green Business Plan, Sustainable BMC, Prototipe, Video Pitching, Presentasi, Laporan Refleksi.</p>
                            </div>

                            {/* Info proposal tabel bersambung */}
                            <div className="border border-outline-variant rounded-lg overflow-hidden text-body-md text-on-surface">
                                <table className="w-full text-left border-collapse text-sm">
                                    <tbody>
                                        <tr className="border-b border-outline-variant/50">
                                            <th className="py-2 px-3 bg-surface-container-low w-1/3 font-medium text-on-surface-variant">Judul Proyek</th>
                                            <td className="py-2 px-3 font-bold text-primary">{reviewProject.title}</td>
                                        </tr>
                                        {reviewProject.umkm_name && (
                                            <tr className="border-b border-outline-variant/50">
                                                <th className="py-2 px-3 bg-surface-container-low font-medium text-on-surface-variant">Mitra UMKM / Potensi Lokal</th>
                                                <td className="py-2 px-3">{reviewProject.umkm_name} ({reviewProject.umkm_sector})</td>
                                            </tr>
                                        )}
                                        {reviewProject.budget && (
                                            <tr className="border-b border-outline-variant/50">
                                                <th className="py-2 px-3 bg-surface-container-low font-medium text-on-surface-variant">Estimasi Anggaran</th>
                                                <td className="py-2 px-3 font-semibold">Rp {Number(reviewProject.budget).toLocaleString('id-ID')}</td>
                                            </tr>
                                        )}
                                        {reviewProject.proposal_description && (
                                            <tr>
                                                <th className="py-2 px-3 bg-surface-container-low font-medium text-on-surface-variant align-top">Inti Sari Proposal<br/><span className="text-xs font-normal">(Permasalahan & Solusi)</span></th>
                                                <td className="py-2 px-3 italic leading-relaxed whitespace-pre-wrap">{reviewProject.proposal_description}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Kolom catatan penolakan */}
                            <div className="space-y-1">
                                <label className="block font-label-md text-error flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[18px]">edit_note</span> Catatan Revisi / Penolakan <span className="text-on-surface-variant font-normal text-xs ml-1">(wajib diisi jika menolak)</span>
                                </label>
                                <textarea
                                    value={rejectionComment}
                                    onChange={e => setRejectionComment(e.target.value)}
                                    rows="2"
                                    placeholder="Berikan alasan yang jelas agar mahasiswa dapat merevisi proposalnya sebelum diajukan ulang..."
                                    className="w-full px-3 py-2 bg-surface-container-lowest border border-error/50 rounded-lg focus:outline-none focus:border-error focus:ring-1 focus:ring-error/50 transition-all resize-none text-body-sm"
                                />
                            </div>

                            {reviewError && (
                                <div className="p-3 bg-error-container text-on-error-container rounded-lg text-body-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">error</span>
                                    {reviewError}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-lowest flex gap-3 justify-end shrink-0">
                            <button onClick={() => setReviewProject(null)}
                                className="px-4 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-outline-variant/20 transition-colors border border-transparent">
                                Batal
                            </button>
                            <button
                                onClick={() => handleReviewDecision('rejected')}
                                disabled={isReviewing}
                                className="px-4 py-2 rounded-lg font-label-md bg-error text-white hover:bg-error/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                                {isReviewing ? 'Memproses...' : 'Tolak'}
                            </button>
                            <button
                                onClick={() => handleReviewDecision('approved')}
                                disabled={isReviewing}
                                className="px-4 py-2 rounded-lg font-label-md bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                {isReviewing ? 'Memproses...' : 'Setujui'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstructorDashboard;
