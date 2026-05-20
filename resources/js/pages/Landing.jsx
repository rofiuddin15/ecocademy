import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const featuredCourses = [
    {
        id: 1,
        title: "Desain Produk Berkelanjutan",
        category: "Desain",
        duration: "8 Minggu",
        score: 98,
        rating: 4.9,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAz7ZDR4JpkNHb99yiH6SKi5RP5cq5oNUoGyZylnI-0Rl-E1El3Jzx0r6hLwVRbckAxi1wJBWwCT_KVBpchn-LkVIGpBg2X6erZGNt-6qwoYP7JF6scVoIMcXmSqxaqrN2kKtDK0lts2nVx0JvdFmm-VJ_iabODw5xRsL-c_ySRAwDpUYQyrpenDFrmPOUnCvnDb6fHhap9XqY2ynhLXnZUrAUrYlD6K5rqsACx1NrcNszfJj5_H_KzYCvjrQDPOqHhes8yL5SyAeV",
        description: "Pelajari analisis siklus hidup dan ilmu material yang dibutuhkan untuk membangun produk bebas limbah.",
        fullDescription: "Pelajari metode merancang produk dengan jejak karbon minimal. Kursus ini membimbing Anda dari pemahaman teori siklus hidup bahan hingga penciptaan prototipe produk nyata siap pasar bersama UMKM kriya lokal.",
        level: "Kemitraan UMKM",
        skills: ["Analisis Siklus Hidup (LCA)", "Ilmu Material", "Desain Sirkular", "Eco-modeling 3D"],
        partners: ["Local Craft Co.", "Riau Eco-Bamboo"],
        syllabus: [
            { week: "Minggu 1-2", topic: "Pengantar Desain Hijau & Kerangka Kerja Eco-Design" },
            { week: "Minggu 3-4", topic: "Lifecycle Analysis (LCA) & Pemilihan Material Berkelanjutan" },
            { week: "Minggu 5-6", topic: "Prototyping Produk Ramah Lingkungan dengan Bambu & Plastik Daur Ulang" },
            { week: "Minggu 7-8", topic: "Kolaborasi Proyek PjBL bersama Mitra Pengrajin Lokal (UMKM Craft)" }
        ]
    },
    {
        id: 2,
        title: "Pengantar Ekonomi Sirkular",
        category: "Bisnis",
        duration: "6 Minggu",
        score: 92,
        rating: 4.8,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVGD11ABAueKi-5Z4ZSUaGGv3psLoXSaxc2NuMONFwKPWYHc9Jj9CIeMBTY1yq2Y9pCcqKQg7Vt2Hs7ZABlcts2EAtUY48ZDJy2eapctYlvxOq2Qm_6ZSq_c0hjMaXPIOY2f6gQfemGmnf6h0wSRZpesJHTFS8geGYTWtxlCj6lFRl-9fl5gmxNW6FHU2Qrgj-P7oFZI1a7Qxl_SxY6EmkjMI4xRzefFyOxiWbXHgafP8hONdgSAMB20mNmrz8SxBRyQPpNp13L4NA",
        description: "Kuasai kerangka kerja sistem closed-loop dan manajemen rantai pasok berkelanjutan.",
        fullDescription: "Pelajari bagaimana mendesain ulang rantai nilai bisnis untuk meminimalkan limbah, memaksimalkan efisiensi sumber daya secara berkelanjutan, dan mendesain rantai pasok ramah lingkungan.",
        level: "Dasar",
        skills: ["Sistem Closed-Loop", "Pemetaan Rantai Nilai", "Valuasi Limbah", "Logistik Hijau"],
        partners: ["EcoPack Solutions", "Green Logistics"],
        syllabus: [
            { week: "Minggu 1-2", topic: "Konsep Dasar Ekonomi Linier vs Ekonomi Sirkular" },
            { week: "Minggu 3-4", topic: "Rantai Pasok Closed-Loop & Strategi Pengelolaan Limbah" },
            { week: "Minggu 5-6", topic: "Desain Model Bisnis Berkelanjutan (Value Proposition Sirkular)" },
            { week: "Minggu 7-8", topic: "Analisis Studi Kasus & Integrasi Operasional UMKM Logistik Hijau" }
        ]
    },
    {
        id: 3,
        title: "Strategi Pemasaran Hijau",
        category: "Pemasaran",
        duration: "5 Minggu",
        score: 95,
        rating: 5.0,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtMOianU1NrmW9bC5uCpmXxxBAkBL6nFv0hcJcTevkd6d9MRZv3FNB6NXFwwMMxuZXvjj4garynx5k903MZoHk_HDKsQ2GCqb4DMW3SZQBwd78Cb03YKz03rq-84bsOTjXc9tCPc2KbxU67bKvij56c8n1mHN6L9u98JUmuedWe3YNSUtRBkAYKNzniUYlWAvMAOO3T-ep5RZ9gqERUS9NQK91j2_5qJHemlC7t7BlgeUNZXi1xz1trB3o7DvAxkNT3GcUGX9RT-NR",
        description: "Komunikasikan nilai produk tanpa greenwashing. Branding etis untuk konsumen modern.",
        fullDescription: "Kuasai taktik pemasaran etis untuk mengomunikasikan nilai keberlanjutan produk Anda tanpa terjebak dalam praktik greenwashing yang merusak reputasi brand.",
        level: "Lanjutan",
        skills: ["Branding Etis", "Strategi Anti-Greenwashing", "Kampanye Eco-Digital", "Komunikasi Dampak"],
        partners: ["Sustainable Craft Co.", "EarthCare Agency"],
        syllabus: [
            { week: "Minggu 1-2", topic: "Perilaku Konsumen Sadar Lingkungan (Conscious Consumer)" },
            { week: "Minggu 3-4", topic: "Branding Etis & Komunikasi Tanpa Greenwashing" },
            { week: "Minggu 5-6", topic: "Kampanye Digital Hijau & Pengukuran Dampak Pemasaran" },
            { week: "Minggu 7-8", topic: "Penyusunan Rencana Kampanye Pemasaran Hijau untuk UMKM Mitra" }
        ]
    }
];

const Landing = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch courses from API
        api.get('/courses')
            .then(res => {
                if (Array.isArray(res.data)) {
                    setCourses(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Gagal mengambil data kursus dari backend:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Smooth scrolling for hash links
        const handleHashClick = (e) => {
            const href = e.currentTarget.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        const hashLinks = document.querySelectorAll('a[href^="#"]');
        hashLinks.forEach(link => link.addEventListener('click', handleHashClick));

        // Parallax effect on scroll
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const heroImage = document.querySelector('.hero-gradient img');
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        };
        window.addEventListener('scroll', handleScroll);

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('section > div');
        sections.forEach(section => {
            section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
            observer.observe(section);
        });

        // Cleanup event listeners and observer
        return () => {
            hashLinks.forEach(link => link.removeEventListener('click', handleHashClick));
            window.removeEventListener('scroll', handleScroll);
            sections.forEach(section => observer.unobserve(section));
        };
    }, [selectedCourse, courses]); // Re-observe when selectedCourse or courses changes

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Render Course Details state view
    if (selectedCourse) {
        return (
            <div className="bg-surface min-h-screen py-16">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    {/* Back Button / Breadcrumb */}
                    <button 
                        onClick={() => {
                            setSelectedCourse(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="mb-8 flex items-center gap-2 text-primary font-bold text-label-md hover:text-primary/80 transition-colors group cursor-pointer"
                    >
                        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                        Kembali ke Halaman Utama
                    </button>

                    {/* Course Header Banner */}
                    <div className="bg-white rounded-lg border border-outline-variant/40 shadow-sm overflow-hidden mb-12">
                        <div className="relative aspect-[21/9] w-full overflow-hidden min-h-[300px]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10"></div>
                            <img 
                                src={selectedCourse.image} 
                                alt={selectedCourse.title} 
                                className="w-full h-full object-cover absolute inset-0"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 text-white">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-label-sm font-bold">
                                        {typeof selectedCourse.category === 'object' ? selectedCourse.category?.name : selectedCourse.category}
                                    </span>
                                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-label-sm font-bold border border-white/20">
                                        {selectedCourse.duration}
                                    </span>
                                </div>
                                <h1 className="text-[32px] md:text-[48px] font-headline-xl leading-tight mb-4 text-white">
                                    {selectedCourse.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-label-md font-medium text-white/90">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[20px] text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span>{selectedCourse.rating} / 5.0 Rating</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[20px] text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                                        <span>Skor Dampak: {selectedCourse.score}</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                    <span>Tingkat: {selectedCourse.level}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        {/* Left Columns (2/3 width): About & Partners */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* About */}
                            <div className="bg-white p-8 md:p-10 rounded-lg border border-outline-variant/40 shadow-sm space-y-6">
                                <h2 className="text-headline-md font-headline-md text-primary">Tentang Kursus</h2>
                                <p className="text-body-lg text-on-surface-variant leading-relaxed">
                                    {selectedCourse.full_description || selectedCourse.fullDescription || selectedCourse.description}
                                </p>
                                <p className="text-body-md text-on-surface-variant/80 leading-relaxed">
                                    Dalam kursus ini, Anda tidak hanya belajar teori di kelas, tetapi juga langsung berkolaborasi dengan mitra UMKM lokal untuk mengimplementasikan solusi bisnis hijau. Proyek akhir Anda akan berkontribusi langsung pada aksi mitigasi perubahan iklim dan pemberdayaan ekonomi sirkular lokal.
                                </p>
                            </div>

                            {/* Partners */}
                            <div className="bg-white p-8 md:p-10 rounded-lg border border-outline-variant/40 shadow-sm space-y-6">
                                <h2 className="text-headline-md font-headline-md text-primary">Mitra Kolaborasi UMKM</h2>
                                <p className="text-body-md text-on-surface-variant">
                                    Sebagai bagian dari pembelajaran berbasis proyek (PjBL), Anda akan bekerja sama erat dengan mitra industri dan usaha lokal berikut untuk memecahkan tantangan dunia nyata:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(selectedCourse.partners || []).map((partner, idx) => {
                                        const partnerName = typeof partner === 'object' ? partner.name : partner;
                                        return (
                                            <div key={idx} className="bg-surface-container-low/50 border border-outline-variant/30 rounded-md p-4 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-[24px]">handshake</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-label-md font-bold text-primary">{partnerName}</h4>
                                                    <p className="text-[11px] text-on-surface-variant font-medium">Mitra UMKM Terverifikasi</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* CTA Box */}
                            <div className="bg-primary p-8 md:p-10 rounded-lg text-on-primary space-y-6 shadow-md relative overflow-hidden">
                                <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                                <div className="relative z-10 max-w-xl">
                                    <h3 className="text-headline-md font-headline-md mb-2">Siap untuk Memulai Aksi Nyata Anda?</h3>
                                    <p className="text-body-md opacity-90 mb-6">
                                        Daftar sekarang dan bergabunglah dengan jaringan mahasiswa pelopor keberlanjutan lingkungan. Mulai rancang portofolio dampak sirkular Anda hari ini.
                                    </p>
                                    <Link 
                                        to="/register"
                                        className="inline-flex bg-secondary text-on-secondary hover:bg-secondary/90 px-8 py-3 rounded rounded-lg font-bold text-label-md transition-all shadow-lg hover:scale-95 cursor-pointer"
                                    >
                                        Daftar Kelas Ini
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (1/3 width): Syllabus Timeline & Skills */}
                        <div className="space-y-8">
                            {/* Syllabus Timeline */}
                            <div className="bg-white p-8 rounded-lg border border-outline-variant/40 shadow-sm space-y-6">
                                <h3 className="text-label-md font-bold text-primary flex items-center gap-2 border-b border-outline-variant/10 pb-4">
                                    <span className="material-symbols-outlined">menu_book</span>
                                    Rencana Silabus Pembelajaran
                                </h3>
                                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                                    {(selectedCourse.modules && selectedCourse.modules.length > 0
                                        ? selectedCourse.modules.map(mod => ({ week: `Modul ${mod.sequence}`, topic: mod.title }))
                                        : (selectedCourse.syllabus || [])
                                    ).map((step, idx) => (
                                        <div key={idx} className="flex gap-4 relative">
                                            <div className="w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center z-10 shrink-0 shadow-sm">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <span className="block text-[11px] font-bold text-secondary uppercase tracking-wider">{step.week}</span>
                                                <p className="text-body-md text-on-surface-variant font-semibold leading-relaxed mt-0.5">{step.topic}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Skills Acquired */}
                            <div className="bg-white p-8 rounded-lg border border-outline-variant/40 shadow-sm space-y-4">
                                <h3 className="text-label-md font-bold text-primary flex items-center gap-2">
                                    <span className="material-symbols-outlined">military_tech</span>
                                    Keterampilan Yang Diperoleh:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {(selectedCourse.skills || []).map((skill, idx) => {
                                        const skillName = typeof skill === 'object' ? skill.name : skill;
                                        return (
                                            <span key={idx} className="bg-primary-container/15 text-primary px-3 py-1 rounded-full text-label-sm font-semibold border border-primary/10">
                                                {skillName}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default Overview State View (Standard Landing Page)
    return (
        <>
            {/* Hero Section */}
            <section className="hero-gradient relative overflow-hidden pt-20 pb-32">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative z-10">
                        <span className="inline-block py-1 px-4 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-label-sm mb-6">Pelopor Pendidikan Berkelanjutan</span>
                        <h1 className="text-headline-xl md:text-[56px] lg:text-[64px] font-headline-xl text-primary mb-6 leading-none tracking-tight">
                            Memberdayakan Wirausaha <span className="text-secondary">Hijau Masa Depan</span>
                        </h1>
                        <p className="text-body-lg font-body-lg text-on-surface-variant mb-10 max-w-xl">
                            Mengubah ide keberlanjutan menjadi dampak nyata melalui Pembelajaran Berbasis Proyek (PjBL) bersama mitra UMKM lokal. Bergabunglah dengan komunitas inovator yang mendefinisikan ulang masa depan ekonomi.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/register" className="bg-primary text-on-primary h-[48px] px-8 rounded font-label-md text-label-md flex items-center justify-center gap-2 hover:shadow-lg transition-all group font-bold">
                                Bergabung Sekarang
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                            <a href="#courses" className="border-2 border-primary text-primary h-[48px] px-8 rounded font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center font-bold">
                                Lihat Kurikulum
                            </a>
                        </div>
                        <div className="mt-12 flex items-center gap-6">
                            <div className="flex -space-x-3">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" alt="Student 1" />
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" alt="Student 2" />
                                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" alt="Student 3" />
                            </div>
                            <p className="text-label-md font-label-md text-on-surface-variant font-medium">
                                Lebih dari <span className="text-primary font-bold text-[16px]">500+</span> Wirausaha Hijau terdaftar
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-fixed opacity-20 rounded-full blur-3xl"></div>
                        <div className="relative rounded-lg overflow-hidden shadow-2xl">
                            <img className="w-full aspect-[4/3] object-cover" alt="Collaborating space" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY5bSf7pvKCNsgcN2-peq_Ze1xt-b9Oy8xKQBTg2kWxLOUqJ0k4CSrxyokV9gq6wCtqBhjqGQl0VBreovI0FLUP_fM1uAgQ5DnkoKbL6_7g9xCt9xXyyfu4FX5dIDo3bNlqxLkjrIfn-cs3YBgbPQWY8GL341Z8af-O3b0c6tHDsQRECOYRQu-LQEJmxmut0qn5EMjKcqPdZ6zLQ-1rejm5iiWEvXTuEJe5WAZvfa6O1CMMFKLqQatdY4KqeBn_zaTnSMIo_u61QP4"/>
                        </div>
                        {/* Floating Stat Card */}
                        <div className="absolute -bottom-8 -left-8 glass-card p-6 rounded shadow-xl max-w-xs animate-bounce-slow">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-2 bg-primary text-on-primary rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                                </div>
                                <span className="text-label-md font-bold text-primary">Pemantau Proyek Langsung</span>
                            </div>
                            <p className="text-body-md font-body-md text-primary font-semibold mb-3">Mendukung 24 UMKM lokal dalam upaya pengurangan limbah.</p>
                            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                                <div className="h-full bg-secondary w-3/4 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Courses Section */}
            <section className="py-24 bg-surface" id="courses">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-headline-lg font-headline-lg text-primary mb-4">Jalur Pembelajaran Pilihan</h2>
                            <p className="text-body-md font-body-md text-on-surface-variant max-w-lg">Kuasai keterampilan yang dibutuhkan untuk berkembang di ekonomi hijau dengan kursus berbasis proyek yang dipandu pakar.</p>
                        </div>
                        <Link className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline font-bold" to="/login">
                            Jelajahi semua kursus <span className="material-symbols-outlined">chevron_right</span>
                        </Link>
                    </div>

                    {/* Course Selection Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                        {(courses.length > 0 ? courses : featuredCourses).map((course) => (
                            <div 
                                key={course.id}
                                onClick={() => handleCourseClick(course)}
                                className="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant hover:shadow-lg hover:scale-[1.01] transition-all duration-300 group cursor-pointer relative"
                            >
                                <div className="sustainability-score">Skor Dampak: {course.score}</div>
                                <img className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} src={course.image}/>
                                <div className="p-6">
                                    <div className="flex gap-2 mb-4">
                                        <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded text-label-sm font-label-sm">
                                            {typeof course.category === 'object' ? course.category?.name : course.category}
                                        </span>
                                        <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded text-label-sm font-label-sm">{course.duration}</span>
                                    </div>
                                    <h3 className="text-headline-md font-headline-md text-primary mb-3">{course.title}</h3>
                                    <p className="text-body-md font-body-md text-on-surface-variant mb-6">{course.description}</p>
                                    <div className="flex items-center justify-between border-t border-outline-variant pt-4">
                                        <span className="text-primary font-bold">{course.level}</span>
                                        <div className="flex items-center gap-1 text-secondary font-label-md">
                                            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            {course.rating}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platform Services Section (Asymmetric Bento Grid) */}
            <section className="py-24 bg-surface-container" id="ecosystem">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    <div className="text-center mb-16">
                        <h2 className="text-headline-lg font-headline-lg text-primary mb-4">Ekosistem Pertumbuhan Kami</h2>
                        <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto">Lebih dari sekadar tempat belajar. Kami menyediakan infrastruktur lengkap untuk kesuksesan karier berkelanjutan Anda.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-gutter h-auto lg:h-[600px]">
                        {/* PjBL Framework */}
                        <div className="md:col-span-2 md:row-span-1 bg-primary p-10 rounded-lg flex flex-col justify-between text-on-primary group shadow-md">
                            <div className="max-w-md">
                                <h3 className="text-headline-md font-headline-md mb-4 text-primary-fixed">Kerangka Kerja PjBL</h3>
                                <p className="text-body-md opacity-85 mb-6 leading-relaxed">Metodologi Pembelajaran Berbasis Proyek (PjBL) kami menjembatani kesenjangan antara teori dan eksekusi pasar nyata. Mahasiswa memecahkan tantangan riil dan menghasilkan solusi yang berdampak.</p>
                            </div>
                            <div className="flex items-center gap-4 text-primary-fixed">
                                <div className="w-12 h-12 rounded-full border border-primary-fixed/30 flex items-center justify-center bg-primary-container/20">
                                    <span className="material-symbols-outlined text-[24px]">psychology</span>
                                </div>
                                <span className="text-label-md font-bold">Desain berbasis kognitif</span>
                            </div>
                        </div>
                        {/* UMKM Network */}
                        <div className="md:col-span-1 md:row-span-2 bg-secondary-container p-10 rounded-lg flex flex-col group relative overflow-hidden shadow-md">
                            <h3 className="text-headline-md font-headline-md text-on-secondary-container mb-4">Jaringan UMKM</h3>
                            <p className="text-body-md text-on-secondary-container/90 mb-8 leading-relaxed">Akses langsung ke 150+ Usaha Mikro, Kecil, dan Menengah (UMKM) lokal terverifikasi yang mencari inovasi berkelanjutan.</p>
                            <div className="mt-auto space-y-4 relative z-10">
                                <div className="bg-white/50 backdrop-blur-sm p-4 rounded border border-white/20 shadow-sm flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[16px] text-white">brush</span>
                                    </div>
                                    <span className="text-label-sm font-bold text-on-secondary-container">Local Craft Co.</span>
                                </div>
                                <div className="bg-white/50 backdrop-blur-sm p-4 rounded border border-white/20 shadow-sm flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[16px] text-white">package_2</span>
                                    </div>
                                    <span className="text-label-sm font-bold text-on-secondary-container">EcoPack Solutions</span>
                                </div>
                                <div className="bg-white/50 backdrop-blur-sm p-4 rounded border border-white/20 shadow-sm translate-x-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[16px] text-white">local_shipping</span>
                                    </div>
                                    <span className="text-label-sm font-bold text-on-secondary-container">Green Logistics</span>
                                </div>
                            </div>
                        </div>
                        {/* Portfolio Showcase */}
                        <div className="md:col-span-2 md:row-span-1 bg-surface-container-lowest p-10 rounded-lg border border-outline-variant flex flex-col justify-between group shadow-sm">
                            <div className="flex flex-col md:flex-row gap-8 items-center w-full">
                                <div className="flex-1">
                                    <h3 className="text-headline-md font-headline-md text-primary mb-4">Galeri Portofolio Dampak</h3>
                                    <p className="text-body-md text-on-surface-variant mb-6 leading-relaxed">Bangun rekam jejak dampak Anda yang dapat diverifikasi. Sertifikat berbasis blockchain kami membuktikan kontribusi nyata Anda terhadap keberlanjutan.</p>
                                    <Link to="/login" className="text-secondary font-bold text-label-md flex items-center gap-2 hover:translate-x-1 transition-transform">
                                        Lihat Kesuksesan Mahasiswa <span className="material-symbols-outlined">arrow_right_alt</span>
                                    </Link>
                                </div>
                                <div className="w-full md:w-1/3 aspect-square bg-surface-container-low rounded flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined text-[64px] text-primary/20">badge</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-24 bg-primary text-on-primary" id="impact">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-headline-lg font-headline-lg text-primary-fixed mb-6 font-bold">Jejak Kolaboratif Kami</h2>
                            <p className="text-body-lg opacity-85 mb-12 leading-relaxed">Kami mengukur kesuksesan dari perubahan positif yang kami katalisasi di ekosistem lokal dan bumi secara luas.</p>
                            <div className="grid grid-cols-2 gap-12">
                                <div>
                                    <div className="text-[56px] font-bold text-secondary-fixed-dim leading-none mb-2 font-headline-xl">124+</div>
                                    <div className="text-label-md uppercase tracking-wider text-primary-fixed opacity-80 font-bold">Proyek Selesai</div>
                                </div>
                                <div>
                                    <div className="text-[56px] font-bold text-secondary-fixed-dim leading-none mb-2 font-headline-xl">18.5k</div>
                                    <div className="text-label-md uppercase tracking-wider text-primary-fixed opacity-80 font-bold">Pengurangan Emisi CO2 (Ton)</div>
                                </div>
                                <div>
                                    <div className="text-[56px] font-bold text-secondary-fixed-dim leading-none mb-2 font-headline-xl">150+</div>
                                    <div className="text-label-md uppercase tracking-wider text-primary-fixed opacity-80 font-bold">Mitra UMKM</div>
                                </div>
                                <div>
                                    <div className="text-[56px] font-bold text-secondary-fixed-dim leading-none mb-2 font-headline-xl">84%</div>
                                    <div className="text-label-md uppercase tracking-wider text-primary-fixed opacity-80 font-bold">Tingkat Keterserapan Kerja</div>
                                </div>
                            </div>
                        </div>
                        {/* High contrast dark glass card with minimized border-radius */}
                        <div className="relative bg-black/35 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-lg shadow-xl overflow-hidden text-white">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="material-symbols-outlined text-white/40">analytics</span>
                            </div>
                            <h3 className="text-headline-md font-headline-md text-white mb-8 font-bold">Visualisasi Dampak Real-time</h3>
                            <div className="space-y-8">
                                <div className="relative">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-label-md font-semibold text-white/95">Pengalihan Limbah</span>
                                        <span className="text-label-md font-bold text-secondary">75%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full">
                                        <div className="h-full bg-secondary w-3/4 rounded-full relative">
                                            <div className="absolute -right-1.5 -top-1 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_#f4ba9c]"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-label-md font-semibold text-white/95">Adopsi Energi Terbarukan</span>
                                        <span className="text-label-md font-bold text-secondary">42%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full">
                                        <div className="h-full bg-secondary w-[42%] rounded-full relative">
                                            <div className="absolute -right-1.5 -top-1 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_#f4ba9c]"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-label-md font-semibold text-white/95">Pertumbuhan Ekonomi (Mitra)</span>
                                        <span className="text-label-md font-bold text-secondary">28%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full">
                                        <div className="h-full bg-secondary w-[28%] rounded-full relative">
                                            <div className="absolute -right-1.5 -top-1 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_#f4ba9c]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 p-4 bg-white/5 rounded border border-white/10">
                                <p className="text-label-sm italic text-white/90 text-center leading-relaxed">
                                    "EcoVenture Academy mengubah cara kami memandang limbah usaha. Kami berhasil menghemat 15% biaya operasional dengan menerapkan hasil desain mahasiswa." — Mitra UMKM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-surface-bright relative overflow-hidden" id="cta">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
                    <h2 className="text-headline-xl md:text-[56px] font-headline-xl text-primary mb-6">Siap Memimpin Perubahan?</h2>
                    <p className="text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">Pendaftaran kini dibuka untuk angkatan tahun ini. Kuota terbatas untuk calon wirausaha berdampak tinggi.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="bg-primary text-on-primary h-[48px] px-12 rounded font-label-md text-label-md hover:scale-105 transition-transform flex items-center justify-center font-bold">Daftar Sekarang</Link>
                        <Link to="/login" className="border border-outline text-primary h-[48px] px-12 rounded font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center font-bold">Ajukan Konsultasi</Link>
                    </div>
                </div>
                {/* Background Decoration */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[200px] bg-primary-fixed opacity-10 rounded-[100%] blur-3xl"></div>
            </section>
        </>
    );
};

export default Landing;
