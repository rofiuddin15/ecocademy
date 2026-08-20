import React, { useState, useEffect } from 'react';
import api, { logActivity } from '../utils/api';

const GreenShowcase = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('Semua');
    const [selectedProject, setSelectedProject] = useState(null);

    // Data Table States
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // MOCK DATA for Showcase (if DB doesn't have many public projects yet)
    const mockShowcase = [
        {
            id: 'm1',
            title: 'Biokomposter Anaerob Skala Rumah Tangga',
            student: 'Budi Santoso',
            umkm: 'Warung Nasi Bu Tedjo',
            sector: 'F&B',
            impact: 'Mengurangi limbah organik 50kg/bulan',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
            likes: 124
        },
        {
            id: 'm2',
            title: 'Kemasan Ramah Lingkungan dari Serat Pisang',
            student: 'Siti Aminah',
            umkm: 'Kripik Pisang Maju Jaya',
            sector: 'F&B',
            impact: 'Substitusi 100% plastik kemasan sekali pakai',
            image: 'https://images.unsplash.com/photo-1605600659873-d808a1d85715?auto=format&fit=crop&q=80&w=800',
            likes: 89
        },
        {
            id: 'm3',
            title: 'Sistem Irigasi Tetes Berbasis IoT Tenaga Surya',
            student: 'Ahmad Faisal',
            umkm: 'Kelompok Tani Harapan',
            sector: 'Agrikultur',
            impact: 'Penghematan air 40% & listrik 100%',
            image: 'https://images.unsplash.com/photo-1592982537447-6f23f5b721e4?auto=format&fit=crop&q=80&w=800',
            likes: 215
        },
        {
            id: 'm4',
            title: 'Upcycling Limbah Tekstil Menjadi Tas Laptop',
            student: 'Dina Karmila',
            umkm: 'Penjahit Bu Nani',
            sector: 'Kriya',
            impact: 'Mendaur ulang 200kg kain perca',
            image: 'https://images.unsplash.com/photo-1622345094901-85b4f6521bc3?auto=format&fit=crop&q=80&w=800',
            likes: 156
        }
    ];

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // In a real app, this might fetch public/approved projects
                // For now, we will merge mock data with real data to ensure the showcase is always populated
                const res = await api.get('/projects');
                const realProjects = res.data.map(p => ({
                    id: p.id,
                    title: p.title,
                    student: p.student?.name || 'Mahasiswa Ecocademy',
                    umkm: p.umkm_name || 'UMKM Lokal',
                    sector: 'Lainnya',
                    impact: 'Dampak lingkungan sedang diukur',
                    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800',
                    likes: Math.floor(Math.random() * 50) + 10
                }));
                setProjects([...mockShowcase, ...realProjects]);
            } catch (error) {
                console.error('Error fetching showcase projects:', error);
                setProjects(mockShowcase);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
        // Catat log: membuka Etalase Hijau
        logActivity('view_showcase', null, null, 'Etalase Hijau Ecocademy');
    }, []);

    const categories = ['Semua', 'F&B', 'Agrikultur', 'Kriya', 'Lainnya'];

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.student.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSector = filter === 'Semua' || p.sector === filter;
        return matchesSearch && matchesSector;
    });

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const currentProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                <p className="text-label-sm text-on-surface-variant">Memuat Etalase Hijau...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-primary text-on-primary p-8 rounded-lg relative overflow-hidden shadow-sm">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="font-display-sm text-display-sm font-bold mb-2">Etalase Hijau</h1>
                    <p className="font-body-lg text-body-lg opacity-90">Jelajahi inovasi dan solusi keberlanjutan karya mahasiswa Ecocademy. Terinspirasi untuk aksi hijau Anda berikutnya!</p>
                </div>
                <span className="material-symbols-outlined absolute right-0 top-0 text-[180px] opacity-10 -translate-y-8 translate-x-8">workspace_premium</span>
            </div>

            <div className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container-lowest">
                    <div className="relative w-full md:w-64">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input 
                            type="text" 
                            placeholder="Cari proyek atau mahasiswa..." 
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-colors bg-white text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <span className="text-sm font-label-md text-on-surface-variant whitespace-nowrap">Sektor:</span>
                        <select 
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full md:w-auto px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-colors bg-white text-sm"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-label-md text-sm">
                                <th className="p-4 font-bold">Proyek</th>
                                <th className="p-4 font-bold">UMKM & Sektor</th>
                                <th className="p-4 font-bold">Dampak Hijau</th>
                                <th className="p-4 font-bold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProjects.length > 0 ? (
                                currentProjects.map(project => (
                                    <tr 
                                        key={project.id} 
                                        onClick={() => setSelectedProject(project)}
                                        className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors cursor-pointer"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={project.image} 
                                                    alt={project.title} 
                                                    className="w-16 h-12 object-cover rounded"
                                                />
                                                <div>
                                                    <h3 className="font-label-lg font-bold text-primary line-clamp-1">{project.title}</h3>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <span className="material-symbols-outlined text-[14px] text-outline">person</span>
                                                        <p className="text-xs text-on-surface-variant">{project.student}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-sm font-body-md text-on-surface line-clamp-1">{project.umkm}</span>
                                                <span className="px-2 py-0.5 bg-secondary-container/30 text-secondary border border-secondary/20 rounded text-[10px] font-bold uppercase tracking-wider">
                                                    {project.sector}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-start gap-2 bg-primary/5 p-2 rounded border border-primary/10 max-w-xs">
                                                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">psychiatry</span>
                                                <p className="text-xs font-medium text-on-surface line-clamp-2">{project.impact}</p>
                                            </div>
                                        </td>
                                        <td className="p-4" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded text-primary text-xs font-bold mr-2">
                                                    <span className="material-symbols-outlined text-[14px]">favorite</span>
                                                    {project.likes}
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                                                    className="text-primary hover:bg-primary/10 p-2 rounded transition-colors"
                                                    title="Lihat Detail Proyek"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-on-surface-variant">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="material-symbols-outlined text-[48px] text-outline mb-4">search_off</span>
                                            <h3 className="font-headline-sm text-on-surface font-bold">Proyek Tidak Ditemukan</h3>
                                            <p className="text-sm mt-1">Coba sesuaikan pencarian atau kategori Anda.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
                        <span className="text-sm text-on-surface-variant">
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProjects.length)} dari {filteredProjects.length} proyek
                        </span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-1 rounded hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-on-surface"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button 
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-8 h-8 rounded text-sm font-bold transition-colors ${currentPage === page ? 'bg-primary text-white' : 'hover:bg-surface-container text-on-surface'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-1 rounded hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-on-surface"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Project Detail Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="relative h-64 md:h-80">
                            <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <button 
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                                <span className="inline-block px-3 py-1 bg-secondary text-on-secondary rounded-lg text-xs font-bold uppercase tracking-wider mb-3">
                                    {selectedProject.sector}
                                </span>
                                <h2 className="font-headline-lg text-white font-bold leading-tight">{selectedProject.title}</h2>
                            </div>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-surface-container rounded-lg text-primary">
                                        <span className="material-symbols-outlined text-[24px]">person</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Kreator Mahasiswa</p>
                                        <p className="font-label-lg text-on-surface font-bold">{selectedProject.student}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-surface-container rounded-lg text-primary">
                                        <span className="material-symbols-outlined text-[24px]">storefront</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Mitra UMKM</p>
                                        <p className="font-label-lg text-on-surface font-bold">{selectedProject.umkm}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary/5 p-6 md:p-8 rounded-xl border border-primary/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="material-symbols-outlined text-primary text-[28px]">psychiatry</span>
                                    <h3 className="font-headline-sm font-bold text-primary">Dampak Hijau & Inovasi</h3>
                                </div>
                                <p className="font-body-lg text-on-surface leading-relaxed">{selectedProject.impact}</p>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-lg text-primary font-bold">
                                    <span className="material-symbols-outlined">favorite</span>
                                    {selectedProject.likes} Apresiasi
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GreenShowcase;
