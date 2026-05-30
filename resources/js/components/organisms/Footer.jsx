import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full py-12 bg-primary dark:bg-primary-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded bg-white text-primary flex items-center justify-center shrink-0 shadow-sm">
                            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                        </div>
                        <span className="text-headline-md font-headline-md font-bold text-white">Eco Academy</span>
                    </div>
                    <p className="text-body-md font-body-md text-slate-300 max-w-sm">
                        Membina generasi wirausaha hijau (Greenpreneurs) berikutnya melalui pendidikan berbasis proyek dan kemitraan dengan UMKM lokal.
                    </p>
                </div>
                <div className="flex flex-col md:items-end justify-between text-slate-300 gap-4 mt-6 md:mt-0">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 justify-start md:justify-end">
                        <a className="hover:text-white transition-colors font-label-md text-label-sm hover:underline" href="#">Kebijakan Privasi</a>
                        <a className="hover:text-white transition-colors font-label-md text-label-sm hover:underline" href="#">Syarat & Ketentuan</a>
                        <a className="hover:text-white transition-colors font-label-md text-label-sm hover:underline" href="#">Hubungi Kami</a>
                        <a className="hover:text-white transition-colors font-label-md text-label-sm hover:underline" href="#">Tentang Mitra UMKM Kami</a>
                    </div>
                    <p className="text-label-sm font-label-sm opacity-60 text-slate-400 text-left md:text-right">
                        &copy; 2026 Eco Academy. Membina generasi wirausaha hijau masa depan.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
