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

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
    const currentPartners = filteredPartners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-tertiary text-on-tertiary p-8 rounded-lg relative overflow-hidden shadow-sm">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="font-display-sm text-display-sm font-bold mb-2">Daftar UMKM</h1>
                    <p className="font-body-lg text-body-lg opacity-90">Temukan dan kelola mitra UMKM lokal yang siap berkolaborasi dalam kurikulum PjBL Ecocademy.</p>
                </div>
                <span className="material-symbols-outlined absolute right-0 top-0 text-[180px] opacity-10 -translate-y-8 translate-x-8">storefront</span>
            </div>

            <div className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container-lowest">
                    <div className="relative w-full md:w-64">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input 
                            type="text" 
                            placeholder="Cari UMKM atau Kota..." 
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
                                <th className="p-4 font-bold">Mitra UMKM</th>
                                <th className="p-4 font-bold">Sektor & Lokasi</th>
                                <th className="p-4 font-bold">Aktivitas</th>
                                <th className="p-4 font-bold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                                            <p className="text-label-sm text-on-surface-variant">Memuat Daftar UMKM...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentPartners.length > 0 ? (
                                currentPartners.map(umkm => (
                                    <tr 
                                        key={umkm.id} 
                                        onClick={() => handleOpenDetail(umkm.id)}
                                        className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors cursor-pointer"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded overflow-hidden shrink-0 bg-surface-container flex items-center justify-center border border-outline-variant/30">
                                                    {umkm.logo_url ? (
                                                        <img src={umkm.logo_url} alt={umkm.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-outline text-[24px]">storefront</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-label-lg font-bold text-primary line-clamp-1">{umkm.name}</h3>
                                                    <p className="text-xs text-on-surface-variant line-clamp-1">{umkm.description || 'Tidak ada deskripsi profil.'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-[10px] font-bold uppercase tracking-wider">
                                                    {umkm.sector || 'Lainnya'}
                                                </span>
                                                <div className="flex items-center gap-1 text-on-surface-variant mt-1">
                                                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                    <span className="text-xs">{umkm.location || 'Indonesia'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-on-surface-variant">
                                                    <span className="font-bold text-primary">{umkm.projects_count ?? 0}</span> Proyek
                                                </span>
                                                <span className="text-xs text-on-surface-variant">
                                                    <span className="font-bold text-secondary">{umkm.courses_count ?? 0}</span> Kursus
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleOpenDetail(umkm.id); }}
                                                    className="text-primary hover:bg-primary/10 p-2 rounded transition-colors"
                                                    title="Lihat Detail UMKM"
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
                                            <h3 className="font-headline-sm text-on-surface font-bold">UMKM Tidak Ditemukan</h3>
                                            <p className="text-sm mt-1">Coba sesuaikan pencarian atau filter Anda.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && totalPages > 1 && (
                    <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
                        <span className="text-sm text-on-surface-variant">
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredPartners.length)} dari {filteredPartners.length} UMKM
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
