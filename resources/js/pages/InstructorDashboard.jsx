import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';

const InstructorDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [projects, setProjects] = useState([]);
    const [partners, setPartners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State untuk modal review proposal / detail proyek
    const [reviewProject, setReviewProject] = useState(null); 
    const [rejectionComment, setRejectionComment] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviewError, setReviewError] = useState('');

    // State tambahan untuk kontrol filter, rubrik, dan peta
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [showRubricModal, setShowRubricModal] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch projects to populate the monitoring table
                const projectsRes = await api.get('/projects');
                setProjects(projectsRes.data);

                // Fetch partners to populate directory
                const partnersRes = await api.get('/partners');
                setPartners(partnersRes.data);
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
        setRejectionComment(project.rejection_comment || '');
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

    // Ekspor ke file CSV
    const handleExportCSV = () => {
        if (projects.length === 0) return;
        
        const headers = ['Nama Mahasiswa', 'Judul Proyek', 'Mitra UMKM', 'Sektor UMKM', 'Anggaran', 'Status', 'Tanggal Mulai'];
        const rows = projects.map(p => [
            p.student?.name || p.user?.name || 'Mahasiswa',
            p.title,
            p.umkm_name || '—',
            p.umkm_sector || '—',
            p.budget || '0',
            p.status,
            p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : '—'
        ]);
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `pemantauan_proyek_ecocademy_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                <p className="text-label-sm text-on-surface-variant">Memuat dashboard instruktur...</p>
            </div>
        );
    }

    // Perhitungan Metrik Dinamis Berdasarkan Database
    const needsReviewCount = projects.filter(p => p.status === 'pending').length;
    const activeProjectsCount = projects.filter(p => ['approved', 'executing', 'completed'].includes(p.status)).length;
    const totalPartnersCount = partners.length > 0 ? partners.length : 8;

    // Kalkulasi Skor Dampak Akademi Dinamis (Rata-rata green_impact_score dari feedback)
    let totalScore = 0;
    let scoreCount = 0;
    projects.forEach(project => {
        project.submissions?.forEach(sub => {
            if (sub.feedback && sub.feedback.green_impact_score !== null) {
                totalScore += sub.feedback.green_impact_score;
                scoreCount += 1;
            }
        });
    });
    const academyImpactScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : "92.4";

    // Filtering proyek untuk tabel
    const filteredProjects = statusFilter === 'all'
        ? projects
        : projects.filter(p => p.status === statusFilter);

    // Helpers untuk Logo & Deskripsi Mitra
    const getPartnerLogo = (name) => {
        const n = name.toLowerCase();
        if (n.includes('craft') || n.includes('kriya')) {
            return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=120';
        }
        if (n.includes('bamboo') || n.includes('bambu')) {
            return 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=120';
        }
        if (n.includes('pack') || n.includes('kemasan')) {
            return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=120';
        }
        if (n.includes('logistics') || n.includes('pengiriman')) {
            return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=120';
        }
        if (n.includes('earth') || n.includes('care') || n.includes('audit')) {
            return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=120';
        }
        return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=120';
    };

    const getPartnerMeta = (partner) => {
        const name = partner.name.toLowerCase();
        const desc = partner.description ? partner.description.toLowerCase() : '';
        
        let sector = 'UMKM';
        let location = 'Lokal';
        
        if (name.includes('craft') || name.includes('kriya')) sector = 'Kerajinan';
        else if (name.includes('bamboo') || name.includes('bambu')) sector = 'Bahan Alam';
        else if (name.includes('pack') || name.includes('kemasan')) sector = 'Kemasan';
        else if (name.includes('logistics') || name.includes('pengiriman')) sector = 'Logistik';
        else if (name.includes('care') || name.includes('audit')) sector = 'Konsultan Hijau';
        
        if (desc.includes('riau') || name.includes('riau')) location = 'Riau';
        else if (desc.includes('bali')) location = 'Bali';
        else if (desc.includes('malang')) location = 'Malang';
        else if (desc.includes('surabaya') || desc.includes('jatim')) location = 'Jawa Timur';
        
        return `${sector} • ${location}`;
    };

    const getProjectProgress = (project) => {
        const totalMilestones = project.course?.milestones?.length || 0;
        const completedMilestones = project.submissions?.filter(sub => sub.feedback !== null).length || 0;
        
        let percent = 5;
        if (project.status === 'completed') {
            percent = 100;
        } else if (project.status === 'rejected') {
            percent = 0;
        } else if (project.status === 'pending') {
            percent = 5;
        } else if (project.status === 'approved') {
            percent = 20;
        } else if (project.status === 'executing') {
            if (totalMilestones > 0) {
                percent = Math.min(95, Math.round((completedMilestones / totalMilestones) * 100));
                if (percent < 20) percent = 40; 
            } else {
                percent = 50;
            }
        }
        
        let milestoneLabel = 'Inisiasi Proposal';
        if (project.status === 'completed') {
            milestoneLabel = 'Selesai';
        } else if (project.submissions && project.submissions.length > 0) {
            const sortedSubs = [...project.submissions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            const latestSub = sortedSubs[0];
            if (latestSub.milestone) {
                milestoneLabel = latestSub.milestone.title;
            }
        } else if (project.status === 'approved') {
            milestoneLabel = 'Persiapan Perencanaan';
        }
        
        return { percent, label: milestoneLabel };
    };

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
                        <p className="text-primary font-label-md text-label-md mb-2">Selamat datang kembali, {user?.name || 'Instruktur'}</p>
                        <h2 className="font-headline-xl text-headline-xl text-primary font-bold">Pemantauan Instruktur</h2>
                    </div>
                    <div className="bg-primary-container text-on-primary-container px-6 py-4 rounded-lg flex items-center gap-4 border border-primary/20 shadow-sm">
                        <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                        <div>
                            <p className="font-label-sm text-label-sm uppercase tracking-wider opacity-80">Skor Dampak Akademi</p>
                            <p className="font-headline-md text-headline-md font-bold">{academyImpactScore}</p>
                        </div>
                    </div>
                </div>

                {/* Bento Grid: Stats & Map */}
                <div className="grid grid-cols-12 gap-4 mb-6">
                    {/* Stat Cards */}
                    <div className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant p-4 rounded-lg flex flex-col justify-between h-36 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="material-symbols-outlined text-primary bg-primary-fixed/20 p-1.5 rounded-lg text-[20px]">rocket_launch</span>
                            <span className="text-on-surface-variant font-label-sm">+2 minggu ini</span>
                        </div>
                        <div>
                            <p className="text-on-surface-variant font-label-sm">Proyek Aktif</p>
                            <p className="text-primary font-headline-lg text-headline-lg font-bold">{activeProjectsCount}</p>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant p-4 rounded-lg flex flex-col justify-between h-36 shadow-sm border-l-4 border-l-secondary">
                        <div className="flex justify-between items-start">
                            <span className="material-symbols-outlined text-secondary bg-secondary-container/20 p-1.5 rounded-lg text-[20px]">pending_actions</span>
                            <span className="text-error font-label-md font-bold">Prioritas</span>
                        </div>
                        <div>
                            <p className="text-on-surface-variant font-label-sm leading-tight">Proposal Menunggu Review</p>
                            <p className="text-primary font-headline-lg text-headline-lg font-bold">{needsReviewCount}</p>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant p-4 rounded-lg flex flex-col justify-between h-36 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="material-symbols-outlined text-tertiary bg-tertiary-fixed/40 p-1.5 rounded-lg text-[20px]">handshake</span>
                            <span className="text-on-surface-variant font-label-sm">Kemitraan</span>
                        </div>
                        <div>
                            <p className="text-on-surface-variant font-label-sm">Mitra UMKM</p>
                            <p className="text-primary font-headline-lg text-headline-lg font-bold">{String(totalPartnersCount).padStart(2, '0')}</p>
                        </div>
                    </div>

                    {/* Map Summary */}
                    <div 
                        onClick={() => setShowMapModal(true)}
                        className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant overflow-hidden rounded-lg h-36 relative group cursor-pointer shadow-sm"
                    >
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=300')" }}
                        ></div>
                        <div className="absolute inset-0 bg-primary/40 flex items-center justify-center backdrop-blur-[2px]">
                            <div className="text-center text-white">
                                <span className="material-symbols-outlined text-3xl">map</span>
                                <p className="font-label-md text-label-md">Tampilan Peta Mitra</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Monitoring Table */}
                <div className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg overflow-hidden mb-6 shadow-sm">
                    <div className="px-5 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-outline-variant bg-surface-container-low gap-3">
                        <h3 className="font-headline-md text-headline-md text-primary font-bold">Pemantauan Proyek</h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setShowFilterBar(!showFilterBar)}
                                className={`px-4 py-2 rounded-lg font-label-sm text-label-sm flex items-center gap-2 transition-colors border cursor-pointer ${showFilterBar ? 'bg-primary text-white border-primary' : 'bg-surface-container border-outline-variant hover:bg-outline-variant/10 text-on-surface'}`}
                            >
                                <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
                            </button>
                            <button 
                                onClick={handleExportCSV}
                                className="bg-surface-container border border-outline-variant px-4 py-2 rounded-lg font-label-sm text-label-sm flex items-center gap-2 hover:bg-outline-variant/10 text-on-surface transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">download</span> Ekspor
                            </button>
                        </div>
                    </div>

                    {/* Filter Pills Bar */}
                    {showFilterBar && (
                        <div className="px-5 py-3 bg-slate-50 border-b border-outline-variant flex flex-wrap gap-2 animate-fade-in">
                            {[
                                { val: 'all', label: 'Semua Status' },
                                { val: 'pending', label: 'Menunggu Review' },
                                { val: 'approved', label: 'Disetujui' },
                                { val: 'executing', label: 'Berjalan' },
                                { val: 'rejected', label: 'Ditolak' },
                                { val: 'completed', label: 'Selesai' }
                            ].map(btn => (
                                <button
                                    key={btn.val}
                                    onClick={() => setStatusFilter(btn.val)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${statusFilter === btn.val ? 'bg-primary text-white shadow-sm' : 'bg-white text-on-surface-variant hover:text-primary border border-outline-variant'}`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-surface-container-high/50 text-on-surface-variant font-label-md text-label-md border-b border-outline-variant">
                                    <th className="px-5 py-3">Nama Mahasiswa</th>
                                    <th className="px-5 py-3">Judul Proyek</th>
                                    <th className="px-5 py-3">Milestone Saat Ini</th>
                                    <th className="px-5 py-3">Mitra UMKM</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {filteredProjects.length > 0 ? filteredProjects.map((project, index) => {
                                    const studentName = project.student?.name || project.user?.name || 'Mahasiswa';
                                    const initials = studentName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
                                    const progress = getProjectProgress(project);

                                    return (
                                        <tr key={project.id || index} className="hover:bg-primary-fixed/5 transition-colors group">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full ${index % 2 === 0 ? 'bg-secondary-fixed text-on-secondary-fixed-variant' : 'bg-primary-fixed text-on-primary-fixed-variant'} flex items-center justify-center font-bold text-xs shrink-0`}>
                                                        {initials}
                                                    </div>
                                                    <span className="font-body-md">{studentName}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-primary font-medium">{project.title}</td>
                                            <td className="px-5 py-3">
                                                <div className="w-full bg-surface-container-highest rounded-full h-1.5 max-w-[120px]">
                                                    <div className="h-1.5 rounded-full bg-primary transition-all duration-500" style={{ width: `${progress.percent}%` }}></div>
                                                </div>
                                                <span className="text-[10px] text-on-surface-variant uppercase mt-1 block font-medium truncate max-w-[120px]">{progress.label}</span>
                                            </td>
                                            <td className="px-5 py-3 text-on-surface-variant font-medium">{project.umkm_name || '—'}</td>
                                            <td className="px-5 py-3">{statusBadge(project.status)}</td>
                                            <td className="px-5 py-3">
                                                {project.status === 'pending' ? (
                                                    <button
                                                        onClick={() => handleOpenReview(project)}
                                                        className="text-white bg-secondary text-label-sm px-3 py-1.5 rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-1 cursor-pointer font-bold"
                                                    >
                                                        <span className="material-symbols-outlined text-[14px]">rate_review</span>
                                                        Tinjau
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleOpenReview(project)}
                                                        className="text-primary font-label-md text-label-md hover:underline font-bold cursor-pointer"
                                                    >
                                                        Detail
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6" className="px-5 py-12 text-center text-on-surface-variant font-label-md">
                                            Tidak ada proyek ditemukan dalam filter ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Directory & Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg p-5 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-headline-md text-headline-md text-primary font-bold">Direktori Mitra UMKM</h3>
                                <Link className="text-primary font-label-md text-label-md flex items-center gap-1 hover:gap-2 transition-all font-bold" to="/dashboard/directory">
                                    Lihat Semua <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {partners.slice(0, 2).map((partner) => (
                                    <div key={partner.id} className="flex items-center p-4 border border-outline-variant rounded-lg bg-surface-container-lowest hover:shadow-md transition-shadow">
                                        <img className="w-14 h-14 rounded-lg object-cover mr-4 shrink-0 shadow-sm" src={getPartnerLogo(partner.name)} alt={partner.name} />
                                        <div>
                                            <p className="font-label-md text-label-md text-primary font-bold leading-tight mb-0.5">{partner.name}</p>
                                            <p className="text-[11px] text-on-surface-variant font-medium">{getPartnerMeta(partner)}</p>
                                        </div>
                                    </div>
                                ))}
                                {partners.length === 0 && (
                                    <div className="col-span-2 text-center text-on-surface-variant py-6 text-xs italic border border-dashed border-outline-variant rounded-lg bg-surface-container-lowest">
                                        Belum ada data mitra terdaftar.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary text-on-primary rounded-lg p-5 flex flex-col justify-between overflow-hidden relative group shadow-sm">
                        <div className="relative z-10 space-y-4">
                            <div>
                                <h3 className="font-headline-md text-headline-md mb-2 font-bold">Rubrik Metrik Hijau</h3>
                                <p className="font-body-md opacity-80">Tinjau standar keberlanjutan 2024 untuk penilaian mahasiswa.</p>
                            </div>
                            <button 
                                onClick={() => setShowRubricModal(true)}
                                className="bg-white text-primary px-6 py-3 rounded-lg font-label-md text-label-md w-full flex items-center justify-center gap-2 hover:bg-primary-fixed transition-all cursor-pointer font-bold hover:scale-98"
                            >
                                <span className="material-symbols-outlined">menu_book</span>
                                Buka Rubrik
                            </button>
                        </div>
                        {/* Abstract visual element */}
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container rounded-full opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                </div>
            </div>

            {/* ============================================================
                MODAL REVIEW & DETAIL PROPOSAL
                ============================================================ */}
            {reviewProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-outline-variant bg-primary-fixed/10 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="font-headline-sm text-primary font-bold">
                                    {reviewProject.status === 'pending' ? 'Review Proposal Proyek' : 'Detail Proyek Mahasiswa'}
                                </h3>
                                <p className="font-label-sm text-on-surface-variant mt-0.5 font-medium">{reviewProject.title}</p>
                            </div>
                            <button onClick={() => setReviewProject(null)} className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-error/10 transition-colors cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6 overflow-y-auto flex-1">
                            {/* Acuan RPM (Inti Sari) */}
                            <div className="border-l-4 border-secondary bg-secondary-container/10 p-4 rounded-xl space-y-1.5 text-sm text-on-surface">
                                <h4 className="font-label-md text-secondary-fixed-variant flex items-center gap-2 mb-1 font-bold">
                                    <span className="material-symbols-outlined text-[18px]">menu_book</span> Acuan Penilaian (Inti Sari RPM)
                                </h4>
                                <p className="text-xs text-on-surface-variant"><strong>Tema:</strong> Greenpreneurship Berbasis Potensi Lokal Jawa Timur</p>
                                <p className="text-xs text-on-surface-variant"><strong>Deskripsi Tugas:</strong> Mahasiswa mengidentifikasi permasalahan lingkungan/sosial di Jatim, mengembangkan ide bisnis hijau (profit, lingkungan, sosial) dengan memanfaatkan potensi lokal.</p>
                                <p className="text-xs text-on-surface-variant"><strong>Output Akhir:</strong> Green Business Plan, Sustainable BMC, Prototipe, Video Pitching, Presentasi, Laporan Refleksi.</p>
                            </div>

                            {/* Info proposal tabel bersambung */}
                            <div className="border border-outline-variant rounded-xl overflow-hidden text-body-md text-on-surface">
                                <table className="w-full text-left border-collapse text-sm">
                                    <tbody>
                                        <tr className="border-b border-outline-variant/50">
                                            <th className="py-2.5 px-4 bg-slate-50 w-1/3 font-semibold text-on-surface-variant text-xs">Judul Proyek</th>
                                            <td className="py-2.5 px-4 font-bold text-primary">{reviewProject.title}</td>
                                        </tr>
                                        <tr className="border-b border-outline-variant/50">
                                            <th className="py-2.5 px-4 bg-slate-50 font-semibold text-on-surface-variant text-xs">Mahasiswa Pengusul</th>
                                            <td className="py-2.5 px-4 font-medium">{reviewProject.student?.name || 'Mahasiswa'} ({reviewProject.student?.email})</td>
                                        </tr>
                                        {reviewProject.umkm_name && (
                                            <tr className="border-b border-outline-variant/50">
                                                <th className="py-2.5 px-4 bg-slate-50 font-semibold text-on-surface-variant text-xs">Mitra UMKM / Potensi Lokal</th>
                                                <td className="py-2.5 px-4 font-medium">{reviewProject.umkm_name} ({reviewProject.umkm_sector || 'Sektor belum diisi'})</td>
                                            </tr>
                                        )}
                                        {reviewProject.budget && (
                                            <tr className="border-b border-outline-variant/50">
                                                <th className="py-2.5 px-4 bg-slate-50 font-semibold text-on-surface-variant text-xs">Estimasi Anggaran</th>
                                                <td className="py-2.5 px-4 font-semibold text-emerald-700">Rp {Number(reviewProject.budget).toLocaleString('id-ID')}</td>
                                            </tr>
                                        )}
                                        {reviewProject.proposal_description && (
                                            <tr>
                                                <th className="py-2.5 px-4 bg-slate-50 font-semibold text-on-surface-variant text-xs align-top">Inti Sari Proposal<br/><span className="text-[10px] font-normal">(Permasalahan & Solusi)</span></th>
                                                <td className="py-2.5 px-4 italic leading-relaxed whitespace-pre-wrap font-medium">{reviewProject.proposal_description}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Riwayat Pengiriman Tugas (Submissions) */}
                            {reviewProject.submissions && reviewProject.submissions.length > 0 ? (
                                <div className="space-y-3 pt-2">
                                    <h4 className="font-label-md text-primary flex items-center gap-2 font-bold">
                                        <span className="material-symbols-outlined text-[18px]">folder_shared</span> Riwayat Pengiriman Tugas (Submissions)
                                    </h4>
                                    <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full text-left border-collapse text-xs">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-outline-variant text-on-surface-variant font-bold">
                                                    <th className="py-2.5 px-4">Milestone</th>
                                                    <th className="py-2.5 px-4">Tautan Berkas</th>
                                                    <th className="py-2.5 px-4">Catatan Mahasiswa</th>
                                                    <th className="py-2.5 px-4">Evaluasi / Nilai</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-outline-variant/50">
                                                {reviewProject.submissions.map((sub) => (
                                                    <tr key={sub.id} className="hover:bg-slate-50/50">
                                                        <td className="py-2.5 px-4 font-bold text-on-surface">{sub.milestone?.title || 'Milestone'}</td>
                                                        <td className="py-2.5 px-4">
                                                            <a href={sub.file_url} target="_blank" rel="noopener noreferrer" className="text-secondary font-bold hover:underline inline-flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[14px]">link</span> Buka Tautan
                                                            </a>
                                                        </td>
                                                        <td className="py-2.5 px-4 text-on-surface-variant max-w-xs truncate" title={sub.student_notes}>
                                                            {sub.student_notes || '—'}
                                                        </td>
                                                        <td className="py-2.5 px-4 font-bold">
                                                            {sub.feedback ? (
                                                                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded">
                                                                    Nilai: {sub.feedback.grade} | Dampak: {sub.feedback.green_impact_score}
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-400 italic font-medium">Belum Dinilai</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : reviewProject.status !== 'pending' && (
                                <div className="p-5 bg-slate-50 text-slate-500 rounded-xl text-center text-xs border border-dashed border-outline-variant font-medium">
                                    Belum ada tugas/milestone proyek yang dikirimkan oleh mahasiswa.
                                </div>
                            )}

                            {/* Kolom catatan penolakan / revisi */}
                            {reviewProject.status === 'pending' ? (
                                <div className="space-y-2 pt-2">
                                    <label className="block font-label-md text-error flex items-center gap-1.5 font-bold">
                                        <span className="material-symbols-outlined text-[18px]">edit_note</span> Catatan Revisi / Penolakan <span className="text-on-surface-variant font-normal text-xs ml-1">(Wajib diisi jika Anda MENOLAK)</span>
                                    </label>
                                    <textarea
                                        value={rejectionComment}
                                        onChange={e => setRejectionComment(e.target.value)}
                                        rows="3"
                                        placeholder="Berikan arahan revisi yang jelas agar mahasiswa dapat menyempurnakan proposal mereka sebelum dikirim ulang..."
                                        className="w-full px-4 py-3 bg-surface-container-lowest border border-error/50 rounded-xl focus:outline-none focus:border-error focus:ring-1 focus:ring-error/50 transition-all resize-none text-body-md"
                                    />
                                </div>
                            ) : reviewProject.status === 'rejected' && reviewProject.rejection_comment ? (
                                <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm space-y-1.5">
                                    <p className="font-bold flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[18px]">report</span> Catatan Revisi Sebelumnya:
                                    </p>
                                    <p className="italic font-medium">{reviewProject.rejection_comment}</p>
                                </div>
                            ) : null}

                            {reviewError && (
                                <div className="p-4 bg-error-container text-on-error-container rounded-xl text-body-md flex items-center gap-2 border border-error/25">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    <span className="font-semibold">{reviewError}</span>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 border-t border-outline-variant bg-surface-container-lowest flex gap-3 justify-end shrink-0">
                            {reviewProject.status === 'pending' ? (
                                <>
                                    <button onClick={() => setReviewProject(null)}
                                        className="px-5 py-2.5 rounded-lg font-label-md text-on-surface-variant hover:bg-outline-variant/20 transition-colors border border-transparent cursor-pointer font-bold">
                                        Batal
                                    </button>
                                    <button
                                        onClick={() => handleReviewDecision('rejected')}
                                        disabled={isReviewing}
                                        className="px-5 py-2.5 rounded-lg font-label-md bg-error text-white hover:bg-error/95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer font-bold hover:scale-98"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">cancel</span>
                                        {isReviewing ? 'Memproses...' : 'Tolak Proposal'}
                                    </button>
                                    <button
                                        onClick={() => handleReviewDecision('approved')}
                                        disabled={isReviewing}
                                        className="px-5 py-2.5 rounded-lg font-label-md bg-secondary text-on-secondary hover:bg-secondary/95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer font-bold hover:scale-98"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                        {isReviewing ? 'Memproses...' : 'Setujui Proposal'}
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setReviewProject(null)}
                                    className="px-6 py-2.5 bg-primary text-on-primary hover:bg-primary/95 rounded-lg font-label-md text-label-md transition-colors cursor-pointer font-bold">
                                    Tutup Detail
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
                MODAL RUBRIK METRIK HIJAU
                ============================================================ */}
            {showRubricModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-outline-variant bg-primary-fixed/10 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[28px]">menu_book</span>
                                <h3 className="font-headline-sm text-primary font-bold">Rubrik Metrik Hijau 2024</h3>
                            </div>
                            <button onClick={() => setShowRubricModal(false)} className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-error/10 transition-colors cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        {/* Body */}
                        <div className="p-6 space-y-6 overflow-y-auto flex-1">
                            <p className="text-on-surface-variant text-body-md leading-relaxed font-medium">
                                Gunakan panduan penilaian di bawah ini untuk mengevaluasi dampak lingkungan dan keberlanjutan dari proyek mahasiswa.
                            </p>
                            
                            <div className="space-y-4">
                                <div className="border border-outline-variant p-4 rounded-xl space-y-2 bg-surface-container-lowest">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-primary text-label-lg">1. Pengurangan Limbah & Emisi</h4>
                                        <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-bold">Bobot: 30%</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant font-medium">Mengukur efektivitas dalam meniadakan atau mereduksi polusi dan limbah operasional UMKM.</p>
                                    <div className="grid grid-cols-3 gap-2 text-[10px] pt-1">
                                        <div className="p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-100 font-medium">
                                            <strong>90 - 100:</strong> Reduksi &gt;80% limbah primer atau nihil karbon.
                                        </div>
                                        <div className="p-2 bg-amber-50 text-amber-800 rounded border border-amber-100 font-medium">
                                            <strong>70 - 89:</strong> Upcycling/kompos terstruktur mengurangi 40-79%.
                                        </div>
                                        <div className="p-2 bg-red-50 text-red-800 rounded border border-red-100 font-medium">
                                            <strong>&lt; 70:</strong> Reduksi minimal (&lt;40%) atau tidak terukur.
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-outline-variant p-4 rounded-xl space-y-2 bg-surface-container-lowest">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-primary text-label-lg">2. Efisiensi Sumber Daya Lokal</h4>
                                        <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-bold">Bobot: 25%</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant font-medium">Mengukur tingkat ketergantungan pada bahan baku lestari lokal asal Jawa Timur.</p>
                                    <div className="grid grid-cols-3 gap-2 text-[10px] pt-1">
                                        <div className="p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-100 font-medium">
                                            <strong>90 - 100:</strong> 100% bahan baku lokal Jawa Timur (radius &lt;50km).
                                        </div>
                                        <div className="p-2 bg-amber-50 text-amber-800 rounded border border-amber-100 font-medium">
                                            <strong>70 - 89:</strong> &gt;50% bahan baku lokal dengan rantai pasok etis.
                                        </div>
                                        <div className="p-2 bg-red-50 text-red-800 rounded border border-red-100 font-medium">
                                            <strong>&lt; 70:</strong> Bergantung bahan baku luar daerah / non-biodegradable.
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-outline-variant p-4 rounded-xl space-y-2 bg-surface-container-lowest">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-primary text-label-lg">3. Siklus Hidup Sirkular</h4>
                                        <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-bold">Bobot: 25%</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant font-medium">Menilai kemampuan memperpanjang daur hidup produk (reuse, repair, compost).</p>
                                    <div className="grid grid-cols-3 gap-2 text-[10px] pt-1">
                                        <div className="p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-100 font-medium">
                                            <strong>90 - 100:</strong> Zero-waste loop, produk terkompos atau daur ulang total.
                                        </div>
                                        <div className="p-2 bg-amber-50 text-amber-800 rounded border border-amber-100 font-medium">
                                            <strong>70 - 89:</strong> Kemasan biodegradable atau program pengembalian produk.
                                        </div>
                                        <div className="p-2 bg-red-50 text-red-800 rounded border border-red-100 font-medium">
                                            <strong>&lt; 70:</strong> Bisnis model linier konvensional (take-make-waste).
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-outline-variant p-4 rounded-xl space-y-2 bg-surface-container-lowest">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-primary text-label-lg">4. Pemberdayaan Sosial & Ekonomi</h4>
                                        <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-bold">Bobot: 20%</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant font-medium">Menilai manfaat ekonomi nyata dan peningkatan awareness lingkungan pada mitra UMKM.</p>
                                    <div className="grid grid-cols-3 gap-2 text-[10px] pt-1">
                                        <div className="p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-100 font-medium">
                                            <strong>90 - 100:</strong> Melibatkan komunitas lokal aktif, profit mitra naik &gt;20%.
                                        </div>
                                        <div className="p-2 bg-amber-50 text-amber-800 rounded border border-amber-100 font-medium">
                                            <strong>70 - 89:</strong> Edukasi lingkungan aktif bagi staf mitra/pemilik.
                                        </div>
                                        <div className="p-2 bg-red-50 text-red-800 rounded border border-red-100 font-medium">
                                            <strong>&lt; 70:</strong> Hubungan transaksional tanpa dampak sosial-keberlanjutan.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex justify-end shrink-0">
                            <button onClick={() => setShowRubricModal(false)}
                                className="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary/95 rounded-lg font-label-md text-label-md transition-colors cursor-pointer font-bold">
                                Tutup Rubrik
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
                MODAL PETA SEBARAN MITRA
                ============================================================ */}
            {showMapModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-outline-variant bg-primary-fixed/10 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[28px]">map</span>
                                <h3 className="font-headline-sm text-primary font-bold">Peta Sebaran Mitra UMKM Hijau</h3>
                            </div>
                            <button onClick={() => setShowMapModal(false)} className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-error/10 transition-colors cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            <p className="text-on-surface-variant text-body-md font-medium">
                                Berikut sebaran geografis dari proyek greenpreneurship mahasiswa dan mitra UMKM aktif. Arahkan kursor Anda ke titik hijau untuk melihat detailnya.
                            </p>
                            
                            <div className="relative bg-slate-900 rounded-xl p-6 h-96 overflow-hidden flex items-center justify-center border border-slate-800">
                                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                                
                                <svg className="w-full h-full max-w-lg text-emerald-800/25 fill-current opacity-70" viewBox="0 0 500 300">
                                    <path d="M 50,150 Q 80,130 120,140 T 200,160 T 300,150 T 400,170 T 480,180 Q 450,220 380,210 T 250,220 T 120,200 Z" />
                                </svg>
                                
                                {/* Pulse Markers */}
                                {/* Batu */}
                                <div className="absolute top-[130px] left-[220px] group cursor-pointer">
                                    <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    <div className="absolute left-4 -top-2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 font-bold">
                                        Batu: Kelompok Tani Apel (Vegan Leather)
                                    </div>
                                </div>
                                {/* Malang */}
                                <div className="absolute top-[160px] left-[235px] group cursor-pointer">
                                    <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    <div className="absolute left-4 -top-2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 font-bold">
                                        Malang: Organic Harvest (Pertanian)
                                    </div>
                                </div>
                                {/* Situbondo */}
                                <div className="absolute top-[150px] left-[320px] group cursor-pointer">
                                    <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    <div className="absolute left-4 -top-2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 font-bold">
                                        Situbondo: Koperasi Nelayan (Paving Block)
                                    </div>
                                </div>
                                {/* Bali */}
                                <div className="absolute top-[175px] left-[400px] group cursor-pointer">
                                    <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    <div className="absolute left-4 -top-2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 font-bold">
                                        Bali: Kriya Kreasi (Kerajinan)
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex justify-end shrink-0">
                            <button onClick={() => setShowMapModal(false)}
                                className="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary/95 rounded-lg font-label-md text-label-md transition-colors cursor-pointer font-bold">
                                Tutup Peta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstructorDashboard;
