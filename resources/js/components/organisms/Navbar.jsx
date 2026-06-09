import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="w-full sticky top-0 z-40 bg-surface dark:bg-primary-container border-b border-surface-variant dark:border-outline-variant">
            <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                    </div>
                    <span className="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed">Eco Academy</span>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <a className="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-md text-label-md" href="#courses">Kursus</a>
                    <a className="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-md text-label-md" href="#ecosystem">Ekosistem</a>
                    <a className="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-md text-label-md" href="#impact">Dampak</a>
                    <a className="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-md text-label-md" href="#cta">Daftar</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="hidden lg:block text-primary font-label-md text-label-md hover:opacity-80 transition-opacity font-bold">Masuk</Link>
                    <Link to="/register" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:scale-95 active:scale-90 transition-transform shadow-sm flex items-center justify-center font-bold">Mulai Sekarang</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
