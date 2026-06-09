import React, { useState } from 'react';

const UmkmDirectory = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('Semua');

    // MOCK DATA for UMKM Directory
    const umkms = [
        {
            id: 'u1',
            name: 'Warung Nasi Bu Tedjo',
            sector: 'F&B',
            location: 'Kota Batu, Jawa Timur',
            description: 'Warung makan legendaris dengan limbah sisa makanan yang cukup tinggi. Terbuka untuk inovasi biokomposter dan pengolahan limbah.',
            status: 'Partner Aktif',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
            projectsCount: 2
        },
        {
            id: 'u2',
            name: 'Kelompok Tani Harapan',
            sector: 'Agrikultur',
            location: 'Pujon, Malang',
            description: 'Kelompok tani sayur organik yang sedang menghadapi masalah efisiensi irigasi dan pupuk berkelanjutan.',
            status: 'Mencari Solusi',
            image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800',
            projectsCount: 1
        },
        {
            id: 'u3',
            name: 'Kriya Kreasi Bali',
            sector: 'Kriya',
            location: 'Gianyar, Bali',
            description: 'Pengrajin suvenir berbahan dasar alam. Membutuhkan ide pemanfaatan limbah kayu dan pewarna alami yang efisien.',
            status: 'Partner Aktif',
            image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&q=80&w=800',
            projectsCount: 3
        },
        {
            id: 'u4',
            name: 'Koperasi Nelayan Situbondo',
            sector: 'Lainnya',
            location: 'Situbondo, Jawa Timur',
            description: 'Koperasi dengan hasil limbah cangkang kerang yang melimpah. Membutuhkan riset pengolahan limbah menjadi produk bernilai jual.',
            status: 'Mencari Solusi',
            image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&q=80&w=800',
            projectsCount: 0
        },
        {
            id: 'u5',
            name: 'Sabun Lokal Eco-Beauty',
            sector: 'F&B',
            location: 'Surabaya, Jawa Timur',
            description: 'Produsen sabun *handmade* yang butuh solusi efisiensi *packaging* ramah lingkungan.',
            status: 'Partner Aktif',
            image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&q=80&w=800',
            projectsCount: 1
        }
    ];

    const categories = ['Semua', 'F&B', 'Agrikultur', 'Kriya', 'Lainnya'];

    const filteredUmkms = umkms.filter(umkm => {
        const matchSearch = umkm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            umkm.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = filter === 'Semua' || umkm.sector === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-tertiary text-on-tertiary p-8 rounded-lg relative overflow-hidden shadow-sm">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="font-display-sm text-display-sm font-bold mb-2">Direktori UMKM</h1>
                    <p className="font-body-lg text-body-lg opacity-90">Temukan mitra UMKM lokal yang siap berkolaborasi untuk proyek keberlanjutan PjBL Anda.</p>
                </div>
                <span className="material-symbols-outlined absolute right-0 top-0 text-[180px] opacity-10 -translate-y-8 translate-x-8">storefront</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
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
                <div className="relative w-full md:w-72">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                    <input 
                        type="text" 
                        placeholder="Cari UMKM atau Kota..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredUmkms.map(umkm => (
                    <div key={umkm.id} className="bg-white p-6 rounded-lg border border-outline-variant hover:border-primary transition-colors flex flex-col md:flex-row gap-6 cursor-pointer group shadow-sm">
                        <div className="w-full md:w-40 h-40 rounded-lg overflow-hidden shrink-0">
                            <img src={umkm.image} alt={umkm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="inline-block px-3 py-1 bg-surface-container text-on-surface-variant rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                        {umkm.sector}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${umkm.status === 'Partner Aktif' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary/10 text-secondary border border-secondary/20'}`}>
                                        {umkm.status}
                                    </span>
                                </div>
                                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">{umkm.name}</h3>
                                <div className="flex items-center gap-1.5 text-on-surface-variant mt-1 mb-3">
                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                    <span className="font-label-sm">{umkm.location}</span>
                                </div>
                                <p className="text-body-sm text-on-surface line-clamp-2">{umkm.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/30">
                                <span className="font-label-sm text-on-surface-variant"><span className="font-bold text-primary">{umkm.projectsCount}</span> Proyek Berjalan</span>
                                <button className="text-primary font-label-md hover:underline flex items-center gap-1">
                                    Lihat Profil <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredUmkms.length === 0 && (
                <div className="py-20 text-center bg-white rounded-lg border border-outline-variant/50">
                    <span className="material-symbols-outlined text-[64px] text-outline mb-4">search_off</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">UMKM Tidak Ditemukan</h3>
                    <p className="text-on-surface-variant">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
                </div>
            )}
        </div>
    );
};

export default UmkmDirectory;
