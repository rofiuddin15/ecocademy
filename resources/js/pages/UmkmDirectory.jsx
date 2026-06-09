import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const UmkmDirectory = () => {
    const [partners, setPartners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('Semua');

    // Detail Modal State
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fetchPartners = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/partners');
            setPartners(res.data);
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleOpenDetail = async (partnerId) => {
        setIsDetailLoading(true);
        setShowModal(true);
        try {
            const res = await api.get(`/partners/${partnerId}`);
            setSelectedPartner(res.data);
        } catch (error) {
            console.error('Error fetching partner detail:', error);
            alert('Gagal mengambil data detail mitra UMKM.');
            setShowModal(false);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPartner(null);
    };

    const categories = ['Semua', 'F&B', 'Agrikultur', 'Kriya', 'Lainnya'];

    const filteredPartners = partners.filter(partner => {
        const matchSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (partner.location && partner.location.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Map backend sectors to filter categories if needed
        const partnerSector = partner.sector || 'Lainnya';
        const matchFilter = filter === 'Semua' || partnerSector.toUpperCase() === filter.toUpperCase() || 
                           (filter === 'Lainnya' && !['F&B', 'Agrikultur', 'Kriya'].includes(partnerSector));
        
        return matchSearch && matchFilter;
    });

    // Helper to get status badge classes in Indonesian
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'executing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'planning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'pending':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'Selesai';
            case 'executing':
                return 'Berjalan';
            case 'planning':
                return 'Perencanaan';
            case 'approved':
                return 'Disetujui';
            case 'pending':
                return 'Menunggu Review';
            case 'rejected':
                return 'Ditolak';
            default:
                return status || 'Aktif';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-tertiary text-on-tertiary p-8 rounded-lg relative overflow-hidden shadow-sm">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="font-display-sm text-display-sm font-bold mb-2">Direktori UMKM</h1>
                    <p className="font-body-lg text-body-lg opacity-90">Temukan dan kelola mitra UMKM lokal yang siap berkolaborasi dalam kurikulum PjBL Ecocademy.</p>
                </div>
                <span className="material-symbols-outlined absolute right-0 top-0 text-[180px] opacity-10 -translate-y-8 translate-x-8">storefront</span>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-5 py-2 rounded-lg font-label-md transition-colors border ${filter === cat ? 'bg-primary text-white border-primary shadow-sm' : 'bg-surface-container-low border-outline-variant text-on-surface hover:border-primary cursor-pointer'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-72">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                    <input 
                        type="text" 
                        placeholder="Cari UMKM atau Kota..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary transition-all"
                    />
                </div>
            </div>

            {/* Content List */}
            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                    <p className="text-label-sm text-on-surface-variant">Memuat Direktori UMKM...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredPartners.map(umkm => (
                        <div 
                            key={umkm.id} 
                            onClick={() => handleOpenDetail(umkm.id)}
                            className="bg-white p-6 rounded-lg border border-outline-variant hover:border-primary transition-colors flex flex-col md:flex-row gap-6 cursor-pointer group shadow-sm"
                        >
                            <div className="w-full md:w-40 h-40 rounded-lg overflow-hidden shrink-0 bg-surface-container flex items-center justify-center border border-outline-variant/30">
                                {umkm.logo_url ? (
                                    <img src={umkm.logo_url} alt={umkm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <span className="material-symbols-outlined text-outline text-[48px]">storefront</span>
                                )}
                            </div>
                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="inline-block px-3 py-1 bg-surface-container text-on-surface-variant rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                            {umkm.sector || 'Lainnya'}
                                        </span>
                                        <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                                            Mitra Aktif
                                        </span>
                                    </div>
                                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold">{umkm.name}</h3>
                                    <div className="flex items-center gap-1.5 text-on-surface-variant mt-1 mb-3">
                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                        <span className="font-label-sm">{umkm.location || 'Indonesia'}</span>
                                    </div>
                                    <p className="text-body-sm text-on-surface line-clamp-2">{umkm.description || 'Tidak ada deskripsi profil.'}</p>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/30">
                                    <div className="flex gap-4">
                                        <span className="font-label-sm text-on-surface-variant">
                                            <span className="font-bold text-primary">{umkm.projects_count ?? 0}</span> Proyek
                                        </span>
                                        <span className="font-label-sm text-on-surface-variant">
                                            <span className="font-bold text-secondary">{umkm.courses_count ?? 0}</span> Kursus
                                        </span>
                                    </div>
                                    <button className="text-primary font-label-md hover:underline flex items-center gap-1">
                                        Lihat Detail <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && filteredPartners.length === 0 && (
                <div className="py-20 text-center bg-white rounded-lg border border-outline-variant/50">
                    <span className="material-symbols-outlined text-[64px] text-outline mb-4">search_off</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">UMKM Tidak Ditemukan</h3>
                    <p className="text-on-surface-variant">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
                </div>
            )}

            {/* DETAIL MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white w-full max-w-4xl rounded-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in border border-outline-variant">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-[#f8fcfd]">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-primary text-[32px]">storefront</span>
                                <div>
                                    <h2 className="font-headline-md text-headline-md font-bold text-primary">Detail Profil Mitra UMKM</h2>
                                    <p className="font-label-sm text-label-sm text-on-surface-variant">Informasi lengkap kemitraan & proyek berjalan</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleCloseModal}
                                className="w-10 h-10 rounded-full hover:bg-outline-variant/20 flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto space-y-8 flex-grow">
                            {isDetailLoading ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                                    <p className="text-label-sm text-on-surface-variant text-center">Memuat detail hubungan mitra...</p>
                                </div>
                            ) : selectedPartner && (
                                <div className="space-y-8">
                                    {/* Partner Bio Card */}
                                    <div className="flex flex-col md:flex-row gap-6 bg-surface-container/20 p-6 rounded-xl border border-outline-variant/30">
                                        <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-surface-container flex items-center justify-center border border-outline-variant/30">
                                            {selectedPartner.logo_url ? (
                                                <img src={selectedPartner.logo_url} alt={selectedPartner.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-outline text-[48px]">storefront</span>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-label-sm font-bold">
                                                    Sektor: {selectedPartner.sector || 'Lainnya'}
                                                </span>
                                                <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg text-label-sm font-bold">
                                                    Lokasi: {selectedPartner.location || 'Indonesia'}
                                                </span>
                                            </div>
                                            <h3 className="font-headline-lg text-headline-lg font-bold text-primary">{selectedPartner.name}</h3>
                                            <p className="font-body-md text-body-md text-on-surface">{selectedPartner.description || 'Tidak ada deskripsi profil untuk mitra ini.'}</p>
                                        </div>
                                    </div>

                                    {/* Relasi 1: Kursus PjBL yang Bermitra */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/50">
                                            <span className="material-symbols-outlined text-secondary text-[24px]">school</span>
                                            <h4 className="font-title-lg text-title-lg font-bold text-on-surface">Kursus Kolaborasi PjBL</h4>
                                        </div>
                                        {selectedPartner.courses && selectedPartner.courses.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedPartner.courses.map(course => (
                                                    <div key={course.id} className="p-4 rounded-xl border border-outline-variant bg-surface-container/10 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                                                                    {course.level || 'Umum'}
                                                                </span>
                                                            </div>
                                                            <h5 className="font-title-md text-title-md font-bold text-primary line-clamp-1">{course.title}</h5>
                                                            <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-1">{course.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6 text-center border border-dashed border-outline-variant rounded-xl bg-surface-container-low/20">
                                                <p className="text-body-sm text-on-surface-variant">Belum ada kursus kurikulum spesifik yang terhubung dengan mitra ini.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Relasi 2: Proyek Mahasiswa Berjalan */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/50">
                                            <span className="material-symbols-outlined text-primary text-[24px]">assignment</span>
                                            <h4 className="font-title-lg text-title-lg font-bold text-on-surface">Proyek Mahasiswa Aktif</h4>
                                        </div>
                                        {selectedPartner.projects && selectedPartner.projects.length > 0 ? (
                                            <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-surface-container-low border-b border-outline-variant font-label-md text-label-md text-on-surface-variant">
                                                            <th className="p-4 font-bold">Judul Proyek</th>
                                                            <th className="p-4 font-bold">Mahasiswa</th>
                                                            <th className="p-4 font-bold">Kursus</th>
                                                            <th className="p-4 font-bold text-center">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-outline-variant/50 bg-white font-body-sm text-body-sm text-on-surface">
                                                        {selectedPartner.projects.map(project => (
                                                            <tr key={project.id} className="hover:bg-primary/5 transition-colors">
                                                                <td className="p-4 font-bold text-primary">{project.title}</td>
                                                                <td className="p-4">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold">{project.student?.name || 'Mahasiswa'}</span>
                                                                        <span className="text-[10px] text-on-surface-variant">{project.student?.email}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-on-surface-variant">{project.course?.title || '-'}</td>
                                                                <td className="p-4 text-center">
                                                                    <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(project.status)}`}>
                                                                        {getStatusText(project.status)}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="p-6 text-center border border-dashed border-outline-variant rounded-xl bg-surface-container-low/20">
                                                <p className="text-body-sm text-on-surface-variant">Belum ada proyek mahasiswa aktif yang berjalan dengan mitra ini.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-outline-variant flex justify-end bg-[#f8fcfd]">
                            <button 
                                onClick={handleCloseModal}
                                className="px-6 py-2.5 rounded-lg border border-outline-variant hover:bg-outline-variant/10 font-label-md text-label-md transition-colors cursor-pointer"
                            >
                                Tutup Detail
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UmkmDirectory;
