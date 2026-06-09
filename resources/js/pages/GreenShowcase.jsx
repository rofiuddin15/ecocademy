import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const GreenShowcase = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('Semua');

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
    }, []);

    const categories = ['Semua', 'F&B', 'Agrikultur', 'Kriya', 'Lainnya'];

    const filteredProjects = projects.filter(p => filter === 'Semua' || p.sector === filter);

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

            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-5 py-2 rounded-lg font-label-md transition-colors border ${filter === cat ? 'bg-primary text-white border-primary shadow-sm' : 'bg-surface-container-low border-outline-variant text-on-surface hover:border-primary'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProjects.map(project => (
                    <div key={project.id} className="bg-white rounded-lg border border-outline-variant overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-label-sm font-bold text-primary flex items-center gap-1 shadow-sm">
                                <span className="material-symbols-outlined text-[16px]">favorite</span>
                                {project.likes}
                            </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-secondary-container/30 text-secondary border border-secondary/20 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-3">
                                    {project.sector}
                                </span>
                                <h3 className="font-headline-sm text-headline-sm text-primary font-bold line-clamp-2">{project.title}</h3>
                            </div>
                            
                            <div className="space-y-3 mb-6 flex-grow">
                                <div className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-outline text-[18px]">person</span>
                                    <span className="text-body-sm text-on-surface-variant leading-tight">{project.student}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-outline text-[18px]">storefront</span>
                                    <span className="text-body-sm text-on-surface-variant leading-tight">{project.umkm}</span>
                                </div>
                                <div className="flex items-start gap-2 bg-primary/5 p-3 rounded-lg border border-primary/10 mt-4">
                                    <span className="material-symbols-outlined text-primary text-[18px]">psychiatry</span>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-primary/70 mb-0.5">Dampak Hijau</p>
                                        <p className="text-label-sm font-medium text-on-surface">{project.impact}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full border border-outline-variant hover:border-primary text-primary px-4 py-2.5 rounded-lg font-label-md transition-colors hover:bg-primary/5">
                                Lihat Detail Proyek
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredProjects.length === 0 && (
                <div className="py-20 text-center bg-white rounded-lg border border-outline-variant/50">
                    <span className="material-symbols-outlined text-[64px] text-outline mb-4">search_off</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Tidak ada proyek</h3>
                    <p className="text-on-surface-variant">Belum ada proyek yang sesuai dengan kategori ini.</p>
                </div>
            )}
        </div>
    );
};

export default GreenShowcase;
