import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const EvaluationCenter = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters and search state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, completed, need_grading
    const [courseFilter, setCourseFilter] = useState('all');

    const fetchProjectsData = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects for evaluation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectsData();
    }, []);

    // Get unique courses for filter dropdown
    const uniqueCourses = [];
    const courseIds = new Set();
    projects.forEach(project => {
        if (project.course && !courseIds.has(project.course.id)) {
            courseIds.add(project.course.id);
            uniqueCourses.push(project.course);
        }
    });

    // Apply search and filter
    const filteredProjects = projects.filter((project) => {
        const studentName = project.student?.name?.toLowerCase() || '';
        const projectTitle = project.title?.toLowerCase() || '';
        const umkmName = project.umkm_name?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        const matchesSearch = studentName.includes(query) || 
                            projectTitle.includes(query) || 
                            umkmName.includes(query);

        let matchesStatus = true;
        if (statusFilter === 'pending') {
            matchesStatus = project.status === 'pending';
        } else if (statusFilter === 'approved') {
            matchesStatus = project.status === 'approved' || project.status === 'planning' || project.status === 'executing';
        } else if (statusFilter === 'completed') {
            matchesStatus = project.status === 'completed';
        } else if (statusFilter === 'need_grading') {
            matchesStatus = project.submissions && project.submissions.some(sub => !sub.feedback);
        }

        const matchesCourse = courseFilter === 'all' || 
            String(project.course?.id) === String(courseFilter);

        return matchesSearch && matchesStatus && matchesCourse;
    });

    return (
        <div className="space-y-3">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 border-b border-outline-variant/20 pb-2">
                <div>
                    <h1 className="text-headline-md font-headline-md text-primary font-bold">Pusat Evaluasi Tugas PJBL</h1>
                    <p className="text-label-sm text-on-surface-variant">
                        Kelola, periksa, dan berikan nilai terhadap seluruh rencana bisnis dan pengumpulan tugas proyek (PJBL) mahasiswa.
                    </p>
                </div>
                <Link to="/dashboard" className="bg-surface-container hover:bg-outline-variant/10 text-on-surface border border-outline-variant px-4 py-2 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 transition-colors cursor-pointer font-bold shrink-0">
                    <span className="material-symbols-outlined text-[16px]">dashboard</span>
                    Dashboard Instruktur
                </Link>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white py-2 px-3.5 rounded-lg border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-2.5 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nama mahasiswa, judul proyek, atau mitra..."
                        className="w-full pl-9 pr-4 py-1.5 border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-colors bg-white text-xs"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-xs text-on-surface-variant font-bold whitespace-nowrap">Status:</label>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-2.5 py-1.5 border border-outline-variant rounded-lg focus:outline-none bg-white text-xs font-bold text-on-surface w-full sm:w-44"
                        >
                            <option value="all">Semua Proyek</option>
                            <option value="need_grading">Perlu Penilaian Tugas</option>
                            <option value="pending">Menunggu Persetujuan</option>
                            <option value="approved">Disetujui / Berjalan</option>
                            <option value="completed">Selesai</option>
                        </select>
                    </div>

                    {/* Course Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-xs text-on-surface-variant font-bold whitespace-nowrap">Kursus:</label>
                        <select 
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            className="px-2.5 py-1.5 border border-outline-variant rounded-lg focus:outline-none bg-white text-xs font-bold text-on-surface w-full sm:w-48 truncate"
                        >
                            <option value="all">Semua Kursus</option>
                            {uniqueCourses.map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Projects List Container */}
            {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[28px] animate-spin">sync</span>
                    <p className="text-label-sm text-on-surface-variant">Memuat data proyek...</p>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="bg-white p-8 rounded-lg border border-outline-variant/30 text-center shadow-sm">
                    <span className="material-symbols-outlined text-[36px] text-on-surface-variant/20 mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>folder_shared</span>
                    <p className="text-label-sm text-on-surface-variant font-medium">Tidak ada proyek yang ditemukan.</p>
                    <p className="text-[11px] text-on-surface-variant/70 mt-0.5">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
                </div>
            ) : (
                <div className="bg-white border border-outline-variant/30 rounded-lg overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[950px]">
                            <thead>
                                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant/30">
                                    <th className="px-3 py-2.5">Mahasiswa</th>
                                    <th className="px-3 py-2.5">Detail Proyek</th>
                                    <th className="px-3 py-2.5">Kursus</th>
                                    <th className="px-3 py-2.5">Progres Milestone</th>
                                    <th className="px-3 py-2.5">Status Proyek</th>
                                    <th className="px-3 py-2.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {filteredProjects.map((project, index) => {
                                    const studentName = project.student?.name || 'Mahasiswa';
                                    const initials = studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                                    
                                    const submissionsCount = project.submissions?.length || 0;
                                    const milestonesCount = project.course?.milestones?.length || 0;

                                    return (
                                        <tr 
                                            key={project.id}
                                            onClick={() => navigate(`/dashboard/evaluation/projects/${project.id}`)}
                                            className="hover:bg-primary-fixed/5 transition-colors cursor-pointer"
                                        >
                                            {/* Student Column */}
                                            <td className="px-3 py-2.5 vertical-align-middle">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-8 h-8 rounded-full ${index % 2 === 0 ? 'bg-secondary-fixed text-on-secondary-fixed-variant' : 'bg-primary-fixed text-on-primary-fixed-variant'} flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <p className="font-body-md font-bold text-on-surface leading-tight text-sm">{studentName}</p>
                                                        <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{project.student?.email || ''}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Project Detail Column */}
                                            <td className="px-3 py-2.5">
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="font-semibold text-primary text-sm leading-snug">{project.title}</p>
                                                    
                                                    {/* Project metadata badges */}
                                                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] text-on-surface-variant/80 mt-1 font-semibold">
                                                        {project.umkm_name && (
                                                            <span className="flex items-center gap-0.5 bg-primary-fixed/20 text-on-primary-fixed-variant px-1.5 py-0.25 rounded">
                                                                Mitra: {project.umkm_name}
                                                            </span>
                                                        )}
                                                        {project.umkm_sector && (
                                                            <span className="bg-secondary-container/20 text-on-secondary-container px-1.5 py-0.25 rounded">
                                                                Sektor: {project.umkm_sector}
                                                            </span>
                                                        )}
                                                        {project.budget !== null && project.budget !== undefined && (
                                                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.25 rounded">
                                                                Anggaran: Rp {Number(project.budget).toLocaleString('id-ID')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Course Column */}
                                            <td className="px-3 py-2.5 text-[11px] font-medium text-on-surface-variant">
                                                {project.course?.title || 'Kursus Hijau'}
                                            </td>

                                            {/* Milestone Progress Column */}
                                            <td className="px-3 py-2.5">
                                                <div className="flex flex-col gap-1 w-32">
                                                    <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant">
                                                        <span>{submissionsCount} / {milestonesCount} Laporan</span>
                                                        <span>{milestonesCount > 0 ? Math.round((submissionsCount / milestonesCount) * 100) : 0}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                                        <div 
                                                            className="h-full bg-primary transition-all duration-300"
                                                            style={{ width: `${milestonesCount > 0 ? (submissionsCount / milestonesCount) * 100 : 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Project Status Column */}
                                            <td className="px-3 py-2.5">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                                    project.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                    project.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                                    project.status === 'completed' ? 'bg-primary-fixed/20 text-primary-fixed-variant border border-primary/20' :
                                                    'bg-blue-100 text-blue-800 border border-blue-200'
                                                }`}>
                                                    {project.status?.toUpperCase()}
                                                </span>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                                                <Link 
                                                    to={`/dashboard/evaluation/projects/${project.id}`}
                                                    className="text-primary font-bold text-[10px] bg-primary/10 hover:bg-primary/20 px-2.5 py-1.5 rounded-lg transition-colors border-0 inline-flex items-center gap-0.5 shadow-sm"
                                                >
                                                    <span className="material-symbols-outlined text-[12px]">rate_review</span>
                                                    Detail & Evaluasi
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvaluationCenter;
