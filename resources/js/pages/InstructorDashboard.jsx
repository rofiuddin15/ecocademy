import React, { useState, useEffect, useRef } from 'react';
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

    // State untuk detail kartu bento box
    const [showActiveProjectsModal, setShowActiveProjectsModal] = useState(false);
    const [showPendingProposalsModal, setShowPendingProposalsModal] = useState(false);
    const [showPartnersModal, setShowPartnersModal] = useState(false);

    // State untuk form penilaian tugas (feedback)
    const [gradingSubmission, setGradingSubmission] = useState(null);
    const [gradeInput, setGradeInput] = useState('');
    const [greenScoreInput, setGreenScoreInput] = useState('3');
    const [feedbackComments, setFeedbackComments] = useState('');
    const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);
    const [gradeError, setGradeError] = useState('');

    // Refs untuk Mapbox
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        if (showMapModal && window.mapboxgl && mapContainerRef.current) {
            // Membaca token dari .env (di-expose oleh Vite menggunakan import.meta.env)
            const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M2dwbTAwY2szN250cXdxMDN2NDgifQ.rIdFFEGCn2FlSLrJgCwTRg';
            window.mapboxgl.accessToken = mapboxToken;
            
            const map = new window.mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/emerald-v8', // Style hijau emerald yang estetik
                center: [113.9, -8.0], // Tengah Jawa Timur & Bali
                zoom: 7.2
            });

            // Mapbox styles sometimes fail on fallback. Let's use standard streets style if emerald is deprecated
            map.on('error', () => {
                map.setStyle('mapbox://styles/mapbox/streets-v11');
            });

            map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');

            const markers = [
                {
                    lng: 112.52,
                    lat: -7.87,
                    title: 'Batu: Kelompok Tani Apel (Vegan Leather)',
                    description: 'Mengembangkan material kulit ramah lingkungan dari limbah buah apel lokal.'
                },
                {
                    lng: 112.63,
                    lat: -7.98,
                    title: 'Malang: Organic Harvest (Pertanian)',
                    description: 'Pertanian buah dan sayur organik bersertifikasi ramah lingkungan.'
                },
                {
                    lng: 113.99,
                    lat: -7.70,
                    title: 'Situbondo: Koperasi Nelayan (Paving Block)',
                    description: 'Daur ulang limbah plastik pesisir menjadi paving block komersial.'
                },
                {
                    lng: 115.18,
                    lat: -8.40,
                    title: 'Bali: Kriya Kreasi (Kerajinan)',
                    description: 'Pusat anyaman bambu & rotan dengan pewarnaan alami non-kimia.'
                }
            ];

            markers.forEach((marker) => {
                const el = document.createElement('div');
                el.className = 'w-7 h-7 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform relative';
                el.innerHTML = '<span class="w-3 h-3 rounded-full bg-emerald-400 opacity-75 animate-ping absolute"></span><span class="material-symbols-outlined text-[14px] text-white font-bold select-none">eco</span>';

                new window.mapboxgl.Marker(el)
                    .setLngLat([marker.lng, marker.lat])
                    .setPopup(
                        new window.mapboxgl.Popup({ offset: 25 })
                            .setHTML(
                                `<div class="p-1">` +
                                `<h4 class="font-bold text-emerald-800 text-sm mb-1">${marker.title}</h4>` +
                                `<p class="text-xs text-slate-600 leading-relaxed font-medium">${marker.description}</p>` +
                                `</div>`
                            )
                    )
                    .addTo(map);
            });

            mapRef.current = map;

            // Trigger resize to fix canvas size issues inside hidden/animated modals
            setTimeout(() => {
                map.resize();
            }, 300);

            return () => {
                map.remove();
            };
        }
    }, [showMapModal]);

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

    // Buka modal beri nilai
    const handleOpenGrade = (sub) => {
        setGradingSubmission(sub);
        setGradeInput(sub.feedback?.grade || '');
        setGreenScoreInput(sub.feedback?.green_impact_score || '3');
        setFeedbackComments(sub.feedback?.comments || '');
        setGradeError('');
    };

    // Kirim nilai
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
            
            // Refresh data
            const projectsRes = await api.get('/projects');
            setProjects(projectsRes.data);
            
            // Perbarui state modal aktif
            if (reviewProject) {
                const updatedReviewProject = projectsRes.data.find(p => p.id === reviewProject.id);
                if (updatedReviewProject) setReviewProject(updatedReviewProject);
            }
            
            setGradingSubmission(null);
        } catch (err) {
            setGradeError('Gagal menyimpan nilai.');
        } finally {
            setIsSubmittingGrade(false);
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
                    <div 
                        onClick={() => setShowActiveProjectsModal(true)}
                        className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant p-4 rounded-lg flex flex-col justify-between h-36 shadow-sm cursor-pointer hover:shadow-md hover:border-primary transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <span className="material-symbols-outlined text-primary bg-primary-fixed/20 p-1.5 rounded-lg text-[20px]">rocket_launch</span>
                            <span className="text-on-surface-variant font-label-sm">+2 minggu ini</span>
                        </div>
                        <div>
                            <p className="text-on-surface-variant font-label-sm">Proyek Aktif</p>
                            <p className="text-primary font-headline-lg text-headline-lg font-bold">{activeProjectsCount}</p>
                        </div>
                    </div>

                    <div 
                        onClick={() => setShowPendingProposalsModal(true)}
                        className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant p-4 rounded-lg flex flex-col justify-between h-36 shadow-sm border-l-4 border-l-secondary cursor-pointer hover:shadow-md hover:border-secondary transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <span className="material-symbols-outlined text-secondary bg-secondary-container/20 p-1.5 rounded-lg text-[20px]">pending_actions</span>
                            <span className="text-error font-label-md font-bold">Prioritas</span>
                        </div>
                        <div>
                            <p className="text-on-surface-variant font-label-sm leading-tight">Proposal Menunggu Review</p>
                            <p className="text-primary font-headline-lg text-headline-lg font-bold">{needsReviewCount}</p>
                        </div>
                    </div>

                    <div 
                        onClick={() => setShowPartnersModal(true)}
                        className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant p-4 rounded-lg flex flex-col justify-between h-36 shadow-sm cursor-pointer hover:shadow-md hover:border-tertiary transition-all"
                    >
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
                                                        Lihat Detail
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
                                                    <th className="py-2.5 px-4">Tahapan (Milestone)</th>
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
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded">
                                                                        Nilai: {sub.feedback.grade} | Dampak: {sub.feedback.green_impact_score}
                                                                    </span>
                                                                    <button onClick={() => handleOpenGrade(sub)} className="text-primary hover:underline text-xs font-bold cursor-pointer">Edit</button>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => handleOpenGrade(sub)} className="text-white bg-primary text-[11px] px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-bold cursor-pointer flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-[14px]">edit_document</span> Beri Nilai
                                                                </button>
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
                            
                            <div 
                                ref={mapContainerRef} 
                                className="w-full h-96 rounded-xl border border-outline-variant/35 overflow-hidden shadow-sm"
                            ></div>
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

            {/* ============================================================
                MODAL DAFTAR PROYEK AKTIF
                ============================================================ */}
            {showActiveProjectsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-outline-variant bg-primary-fixed/10 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[28px]">rocket_launch</span>
                                <h3 className="font-headline-sm text-primary font-bold">Daftar Proyek Aktif</h3>
                            </div>
                            <button onClick={() => setShowActiveProjectsModal(false)} className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-error/10 transition-colors cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="overflow-x-auto border border-outline-variant rounded-xl shadow-sm">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-outline-variant text-on-surface-variant font-bold">
                                            <th className="py-3 px-4">Nama Mahasiswa</th>
                                            <th className="py-3 px-4">Judul Proyek</th>
                                            <th className="py-3 px-4">Mitra UMKM</th>
                                            <th className="py-3 px-4">Progres Proyek</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/50">
                                        {projects.filter(p => ['approved', 'executing', 'completed'].includes(p.status)).map((project, idx) => {
                                            const studentName = project.student?.name || project.user?.name || 'Mahasiswa';
                                            const progress = getProjectProgress(project);
                                            return (
                                                <tr key={project.id || idx} className="hover:bg-slate-50">
                                                    <td className="py-3 px-4 font-bold">{studentName}</td>
                                                    <td className="py-3 px-4 font-medium text-primary">{project.title}</td>
                                                    <td className="py-3 px-4 text-on-surface-variant">{project.umkm_name || '—'}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-20 bg-slate-100 rounded-full h-1.5 shrink-0">
                                                                <div className="h-1.5 rounded-full bg-primary" style={{ width: `${progress.percent}%` }}></div>
                                                            </div>
                                                            <span className="text-[10px] text-on-surface-variant font-medium">{progress.percent}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">{statusBadge(project.status)}</td>
                                                    <td className="py-3 px-4">
                                                        <button 
                                                            onClick={() => {
                                                                setShowActiveProjectsModal(false);
                                                                handleOpenReview(project);
                                                            }}
                                                            className="text-primary hover:underline font-bold cursor-pointer"
                                                        >
                                                            Lihat Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {projects.filter(p => ['approved', 'executing', 'completed'].includes(p.status)).length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center text-slate-400 italic">
                                                    Tidak ada proyek aktif saat ini.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex justify-end shrink-0">
                            <button onClick={() => setShowActiveProjectsModal(false)}
                                className="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary/95 rounded-lg font-label-md text-label-md transition-colors cursor-pointer font-bold">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
                MODAL DAFTAR PROPOSAL MENUNGGU REVIEW
                ============================================================ */}
            {showPendingProposalsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-outline-variant bg-secondary-container/20 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary-fixed-variant text-[28px]">pending_actions</span>
                                <h3 className="font-headline-sm text-secondary-fixed-variant font-bold">Proposal Menunggu Review</h3>
                            </div>
                            <button onClick={() => setShowPendingProposalsModal(false)} className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-error/10 transition-colors cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="overflow-x-auto border border-outline-variant rounded-xl shadow-sm">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-outline-variant text-on-surface-variant font-bold">
                                            <th className="py-3 px-4">Nama Mahasiswa</th>
                                            <th className="py-3 px-4">Judul Proyek</th>
                                            <th className="py-3 px-4">Mitra UMKM</th>
                                            <th className="py-3 px-4">Estimasi Anggaran</th>
                                            <th className="py-3 px-4">Tanggal Pengajuan</th>
                                            <th className="py-3 px-4">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/50">
                                        {projects.filter(p => p.status === 'pending').map((project, idx) => {
                                            const studentName = project.student?.name || project.user?.name || 'Mahasiswa';
                                            return (
                                                <tr key={project.id || idx} className="hover:bg-slate-50">
                                                    <td className="py-3 px-4 font-bold">{studentName}</td>
                                                    <td className="py-3 px-4 font-medium text-primary">{project.title}</td>
                                                    <td className="py-3 px-4 text-on-surface-variant">{project.umkm_name || '—'}</td>
                                                    <td className="py-3 px-4 font-semibold text-emerald-700 font-mono">Rp {Number(project.budget || 0).toLocaleString('id-ID')}</td>
                                                    <td className="py-3 px-4 text-on-surface-variant">
                                                        {project.created_at ? new Date(project.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <button 
                                                            onClick={() => {
                                                                setShowPendingProposalsModal(false);
                                                                handleOpenReview(project);
                                                            }}
                                                            className="text-white bg-secondary text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-1 cursor-pointer font-bold animate-pulse"
                                                        >
                                                            <span className="material-symbols-outlined text-[12px]">rate_review</span>
                                                            Tinjau
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {projects.filter(p => p.status === 'pending').length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center text-slate-400 italic">
                                                    Tidak ada proposal menunggu review saat ini.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex justify-end shrink-0">
                            <button onClick={() => setShowPendingProposalsModal(false)}
                                className="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary/95 rounded-lg font-label-md text-label-md transition-colors cursor-pointer font-bold">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
                MODAL DAFTAR MITRA UMKM
                ============================================================ */}
            {showPartnersModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-outline-variant bg-primary-fixed/10 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[28px]">handshake</span>
                                <h3 className="font-headline-sm text-primary font-bold">Kemitraan UMKM Terdaftar</h3>
                            </div>
                            <button onClick={() => setShowPartnersModal(false)} className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-error/10 transition-colors cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {partners.map((partner) => (
                                    <div key={partner.id} className="flex items-start p-4 border border-outline-variant rounded-xl bg-slate-50 shadow-sm hover:shadow-md transition-shadow">
                                        <img className="w-16 h-16 rounded-lg object-cover mr-4 shrink-0 shadow border border-outline-variant/50" src={getPartnerLogo(partner.name)} alt={partner.name} />
                                        <div className="space-y-1">
                                            <p className="font-bold text-primary text-label-lg leading-tight">{partner.name}</p>
                                            <p className="text-[10px] font-bold text-secondary-fixed-variant bg-secondary-container/30 px-2 py-0.5 rounded-full w-fit">
                                                {getPartnerMeta(partner)}
                                            </p>
                                            <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2" title={partner.description}>
                                                {partner.description || 'Tidak ada deskripsi tersedia.'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {partners.length === 0 && (
                                    <div className="col-span-2 text-center text-slate-400 italic py-8">
                                        Tidak ada data kemitraan UMKM terdaftar saat ini.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex justify-end shrink-0">
                            <button onClick={() => setShowPartnersModal(false)}
                                className="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary/95 rounded-lg font-label-md text-label-md transition-colors cursor-pointer font-bold">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
                MODAL BERI NILAI / FEEDBACK TUGAS
                ============================================================ */}
            {gradingSubmission && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-outline-variant bg-primary-fixed/10 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="font-headline-sm text-primary font-bold">Penilaian Tugas</h3>
                                <p className="font-label-sm text-on-surface-variant font-medium mt-0.5">{gradingSubmission.milestone?.title || 'Milestone'}</p>
                            </div>
                            <button onClick={() => setGradingSubmission(null)} className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-error/10 transition-colors cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-on-surface mb-1">Nilai (0 - 100)</label>
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
                                <p className="text-xs text-on-surface-variant mb-2">Nilai 5 jika proyek sangat berkelanjutan dan ramah lingkungan.</p>
                                <select
                                    value={greenScoreInput}
                                    onChange={(e) => setGreenScoreInput(e.target.value)}
                                    className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-body-md bg-white"
                                >
                                    <option value="1">1 - Sangat Rendah</option>
                                    <option value="2">2 - Rendah</option>
                                    <option value="3">3 - Sedang / Standar</option>
                                    <option value="4">4 - Tinggi</option>
                                    <option value="5">5 - Sangat Tinggi (Excellent)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-on-surface mb-1">Komentar / Feedback</label>
                                <textarea
                                    value={feedbackComments}
                                    onChange={(e) => setFeedbackComments(e.target.value)}
                                    rows="3"
                                    placeholder="Berikan masukan konstruktif untuk tugas mahasiswa ini..."
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
                                className="px-5 py-2.5 rounded-lg font-label-md text-on-surface-variant hover:bg-outline-variant/20 transition-colors border border-transparent cursor-pointer font-bold">
                                Batal
                            </button>
                            <button
                                onClick={handleSubmitGrade}
                                disabled={isSubmittingGrade}
                                className="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary/95 rounded-lg font-label-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer font-bold hover:scale-98"
                            >
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                {isSubmittingGrade ? 'Menyimpan...' : 'Simpan Nilai'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstructorDashboard;
