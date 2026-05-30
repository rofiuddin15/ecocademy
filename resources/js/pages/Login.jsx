import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../store/slices/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        dispatch(loginUser({ email, password }));
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
                    <span className="text-headline-md font-headline-md font-bold text-white">Eco Academy</span>
                </div>

                <div className="relative z-10 my-auto max-w-md">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary-container text-on-primary-container text-label-sm font-label-sm mb-6">Mulai Perjalanan Anda</span>
                    <h2 className="text-[36px] leading-[44px] font-bold text-white mb-6">Transformasi ide hijau menjadi dampak nyata bersama UMKM lokal.</h2>
                    <p className="text-body-lg opacity-80 text-slate-300">Hubungkan teori greenpreneurship Anda dengan solusi keberlanjutan yang sesungguhnya.</p>
                </div>

                <div className="relative z-10 border-t border-white/10 pt-6 text-label-sm text-slate-400">
                    &copy; 2026 Eco Academy. Membina generasi wirausaha hijau masa depan.
                </div>
            </div>

            {/* Right Panel: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-outline-variant/30 relative">
                    <div className="mb-8">
                        <Link to="/" className="lg:hidden flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span className="text-label-sm font-semibold">Kembali ke Beranda</span>
                        </Link>
                        <h1 className="text-headline-md font-headline-md text-primary mb-2">Selamat Datang Kembali</h1>
                        <p className="text-body-md text-on-surface-variant">Silakan masuk menggunakan akun Ecocademy Anda.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3 border border-error/20">
                            <span className="material-symbols-outlined text-[20px]">warning</span>
                            <span className="text-label-sm font-medium">{typeof error === 'string' ? error : 'Email atau password salah.'}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-label-sm font-medium text-primary mb-2">Alamat Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@email.com"
                                className="w-full h-[48px] px-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-label-sm font-medium text-primary">Kata Sandi</label>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-[48px] px-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-[48px] bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:scale-98 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                            ) : (
                                <>
                                    <span>Masuk ke Akun</span>
                                    <span className="material-symbols-outlined text-[20px]">login</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-body-md text-on-surface-variant border-t border-outline-variant/20 pt-6">
                        Belum punya akun?{' '}
                        <Link to="/register" className="text-secondary font-semibold hover:underline">
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
