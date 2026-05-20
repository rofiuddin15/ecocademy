import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../store/slices/authSlice';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [bio, setBio] = useState('');
    
    const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({
            name,
            email,
            role,
            password,
            password_confirmation: passwordConfirmation,
            bio
        }));
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Panel: Brand & Mission */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary text-on-primary flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(165,208,185,0.15),transparent_50%)]"></div>
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-white text-primary flex items-center justify-center shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                    </div>
                    <span className="text-headline-md font-headline-md font-bold text-white">EcoVenture Academy</span>
                </div>

                <div className="relative z-10 my-auto max-w-md">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary-container text-on-primary-container text-label-sm font-label-sm mb-6">Kohort Baru Dibuka</span>
                    <h2 className="text-[36px] leading-[44px] font-bold text-white mb-6">Mulai langkah nyata Anda sebagai Greenpreneur.</h2>
                    <p className="text-body-lg opacity-80 text-slate-300">Belajar dari modul interaktif dan jalankan program aksi nyata untuk memecahkan problem limbah & emisi UMKM.</p>
                </div>

                <div className="relative z-10 border-t border-white/10 pt-6 text-label-sm text-slate-400">
                    &copy; 2026 EcoVenture Academy. Membina generasi wirausaha hijau masa depan.
                </div>
            </div>

            {/* Right Panel: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-outline-variant/30 relative">
                    <div className="mb-6">
                        <Link to="/" className="lg:hidden flex items-center gap-2 mb-4 text-primary">
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span className="text-label-sm font-semibold">Kembali ke Beranda</span>
                        </Link>
                        <h1 className="text-headline-md font-headline-md text-primary mb-1">Registrasi Akun</h1>
                        <p className="text-body-md text-on-surface-variant">Buat akun untuk memulai pembelajaran hijau.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg flex flex-col gap-1 border border-error/20">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">warning</span>
                                <span className="text-label-sm font-bold">Terjadi Kesalahan:</span>
                            </div>
                            <ul className="list-disc list-inside text-label-sm pl-2">
                                {typeof error === 'object' ? (
                                    Object.keys(error).map((key) => (
                                        <li key={key}>{error[key][0] || error[key]}</li>
                                    ))
                                ) : (
                                    <li>{error}</li>
                                )}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-label-sm font-medium text-primary mb-1">Nama Lengkap</label>
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full h-[44px] px-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                            />
                        </div>

                        <div>
                            <label className="block text-label-sm font-medium text-primary mb-1">Alamat Email</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@email.com"
                                className="w-full h-[44px] px-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                            />
                        </div>

                        <div>
                            <label className="block text-label-sm font-medium text-primary mb-1">Peran Pengguna (Role)</label>
                            <select 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full h-[44px] px-4 rounded-lg border border-outline/30 bg-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                            >
                                <option value="student">Mahasiswa (Student)</option>
                                <option value="instructor">Instruktur / Dosen (Instructor)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-label-sm font-medium text-primary mb-1">Biografi Singkat (Opsional)</label>
                            <textarea 
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Ceritakan ketertarikan Anda pada keberlanjutan..."
                                className="w-full px-4 py-2 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md h-20 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-label-sm font-medium text-primary mb-1">Kata Sandi</label>
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-[44px] px-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                                />
                            </div>
                            <div>
                                <label className="block text-label-sm font-medium text-primary mb-1">Konfirmasi Sandi</label>
                                <input 
                                    type="password" 
                                    required
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-[44px] px-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-[48px] bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:scale-98 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2"
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                            ) : (
                                <>
                                    <span>Buat Akun Baru</span>
                                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-body-md text-on-surface-variant border-t border-outline-variant/20 pt-4">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-secondary font-semibold hover:underline">
                            Masuk di Sini
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
