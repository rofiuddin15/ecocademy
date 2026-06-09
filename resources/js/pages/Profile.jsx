import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { updateUser, logout } from '../store/slices/authSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Avatar states
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const fileInputRef = useRef(null);

    // UI Feedback states
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    
    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmCheckbox, setConfirmCheckbox] = useState(false);

    // Load initial values from user state
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setBio(user.bio || '');
            setAvatarPreview(user.avatar || '');
        }
    }, [user]);

    // Handle avatar change and generate local preview
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrorMessage('Ukuran file foto profil maksimal 2MB.');
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
            setErrorMessage('');
        }
    };

    const handleTriggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');
        setErrorMessage('');
        setFieldErrors({});

        if (password && password !== confirmPassword) {
            setErrorMessage('Kata sandi baru dan konfirmasi kata sandi tidak cocok.');
            setIsSaving(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('bio', bio || '');
        
        if (password) {
            formData.append('password', password);
        }
        
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            const response = await api.post('/auth/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            // Update user in store and storage
            dispatch(updateUser(response.data.user));
            setSuccessMessage('Profil Anda berhasil diperbarui!');
            setPassword('');
            setConfirmPassword('');
            setAvatarFile(null);
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data) {
                // validation errors
                setFieldErrors(error.response.data);
                setErrorMessage('Silakan periksa kembali isian formulir Anda.');
            } else {
                setErrorMessage(error.response?.data?.message || 'Gagal memperbarui profil.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirmCheckbox) return;
        
        setIsDeleting(true);
        setErrorMessage('');
        try {
            await api.delete('/auth/profile');
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Gagal menghapus akun.');
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="w-10 h-10 rounded-full border border-outline-variant hover:border-primary hover:text-primary transition-colors flex items-center justify-center bg-white shrink-0">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </Link>
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
                        {user?.role === 'instructor' ? 'Pengaturan Profil Instruktur' : 'Pengaturan Profil Saya'}
                    </h1>
                    <p className="text-on-surface-variant font-body-md mt-1">Perbarui data diri, unggah foto profil, atau kelola akun Anda.</p>
                </div>
            </div>

            {/* Alert Messages */}
            {successMessage && (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg flex items-center gap-3 border border-emerald-200">
                    <span className="material-symbols-outlined text-[22px] text-emerald-600">check_circle</span>
                    <span className="text-label-md font-medium">{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3 border border-error/20">
                    <span className="material-symbols-outlined text-[22px]">warning</span>
                    <span className="text-label-md font-medium">{errorMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card & Avatar Upload */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col items-center text-center h-fit">
                    <div className="relative group cursor-pointer mb-4" onClick={handleTriggerFileInput}>
                        {avatarPreview ? (
                            <img 
                                src={avatarPreview} 
                                alt="Avatar Preview" 
                                className="w-32 h-32 rounded-full object-cover border-4 border-primary-fixed shadow-md transition-all group-hover:opacity-85"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full border-4 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center text-outline transition-all group-hover:border-primary group-hover:text-primary">
                                <span className="material-symbols-outlined text-[36px]">add_a_photo</span>
                                <span className="text-label-sm font-semibold mt-1">Pilih Foto</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white text-[28px]">photo_camera</span>
                        </div>
                    </div>

                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <button 
                        type="button" 
                        onClick={handleTriggerFileInput}
                        className="bg-primary-fixed/15 hover:bg-primary-fixed/25 text-primary font-label-md text-label-md px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">upload</span>
                        Ganti Foto
                    </button>
                    
                    <p className="text-label-sm text-on-surface-variant/70 mt-3">
                        Format: JPG, PNG, WebP. Maks. 2MB.
                    </p>

                    <hr className="w-full my-6 border-outline-variant" />

                    <div className="w-full text-left space-y-3">
                        <div>
                            <span className="text-label-sm text-on-surface-variant">Peran Pengguna</span>
                            <p className="font-bold text-primary capitalize flex items-center gap-1.5 mt-0.5">
                                <span className="material-symbols-outlined text-[18px]">
                                    {user?.role === 'instructor' ? 'school' : 'local_library'}
                                </span>
                                {user?.role === 'instructor' ? 'Instruktur / Dosen' : 'Mahasiswa'}
                            </p>
                        </div>
                        <div>
                            <span className="text-label-sm text-on-surface-variant">Terdaftar Pada</span>
                            <p className="font-bold text-on-surface mt-0.5">
                                {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant shadow-sm space-y-6">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold border-b border-outline-variant/50 pb-4">
                            Informasi Pribadi
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-label-sm font-medium text-primary mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Masukkan nama lengkap Anda"
                                    className="w-full h-[48px] px-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                                />
                                {fieldErrors.name && (
                                    <p className="text-error text-label-sm mt-1">{fieldErrors.name[0]}</p>
                                )}
                            </div>

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
                                {fieldErrors.email && (
                                    <p className="text-error text-label-sm mt-1">{fieldErrors.email[0]}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-label-sm font-medium text-primary mb-2">Biografi Singkat / Deskripsi Diri</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Ceritakan latar belakang, fokus kewirausahaan, atau keahlian Anda..."
                                rows={4}
                                className="w-full p-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md resize-y"
                            />
                            {fieldErrors.bio && (
                                <p className="text-error text-label-sm mt-1">{fieldErrors.bio[0]}</p>
                            )}
                        </div>

                        <hr className="border-outline-variant/50" />

                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold pt-2">
                            Ubah Kata Sandi <span className="text-label-sm text-on-surface-variant font-normal">(Opsional)</span>
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-label-sm font-medium text-primary mb-2">Kata Sandi Baru</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Kosongkan jika tidak ingin diubah"
                                    className="w-full h-[48px] px-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                                />
                                {fieldErrors.password && (
                                    <p className="text-error text-label-sm mt-1">{fieldErrors.password[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-label-sm font-medium text-primary mb-2">Konfirmasi Kata Sandi Baru</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Ulangi kata sandi baru"
                                    className="w-full h-[48px] px-4 rounded-lg border border-outline/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-primary hover:bg-primary/90 text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg flex items-center gap-2 hover:scale-98 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isSaving ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">save</span>
                                        <span>Simpan Perubahan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Danger Zone */}
                    <div className="bg-red-50/50 p-6 md:p-8 rounded-2xl border border-red-200 shadow-sm space-y-4">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-[32px] text-red-600 shrink-0 mt-0.5">report_problem</span>
                            <div>
                                <h2 className="font-headline-sm text-headline-sm text-red-800 font-bold">Zona Bahaya</h2>
                                <p className="text-red-700 font-body-md mt-1">
                                    Tindakan penghapusan akun bersifat permanen dan tidak dapat dibatalkan.
                                </p>
                            </div>
                        </div>

                        <p className="text-red-600/80 font-body-sm pl-12">
                            Jika Anda menghapus akun, seluruh data aktivitas belajar, sertifikat, portofolio Etalase Hijau, dan riwayat bimbingan Anda akan dihapus selamanya dari sistem Ecocademy.
                        </p>

                        <div className="flex justify-end pl-12 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-red-600 hover:bg-red-700 text-white font-label-md text-label-md px-6 py-3 rounded-lg flex items-center gap-2 hover:scale-98 active:scale-95 transition-all cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                                <span>Hapus Akun Permanen</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Deletion Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl max-w-md w-full p-6 md:p-8 border border-outline-variant shadow-2xl animate-fade-in-up space-y-6">
                        <div className="flex items-center gap-3 text-red-600">
                            <span className="material-symbols-outlined text-[32px]">warning</span>
                            <h3 className="font-headline-sm text-headline-sm font-bold">Konfirmasi Penghapusan</h3>
                        </div>

                        <p className="text-on-surface-variant font-body-md">
                            Apakah Anda benar-benar yakin ingin menghapus akun Anda? Semua progress belajar, proyek, dan data Anda di Ecocademy akan hilang secara permanen.
                        </p>

                        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                            <label className="flex items-start gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={confirmCheckbox}
                                    onChange={(e) => setConfirmCheckbox(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-outline cursor-pointer"
                                />
                                <span className="text-label-md text-red-800 font-medium leading-tight">
                                    Saya paham bahwa tindakan ini permanen dan tidak dapat dibatalkan.
                                </span>
                            </label>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setConfirmCheckbox(false);
                                }}
                                className="bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md px-5 py-2.5 rounded-lg cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={!confirmCheckbox || isDeleting}
                                onClick={handleDeleteAccount}
                                className="bg-red-600 hover:bg-red-700 text-white font-label-md text-label-md px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                                        <span>Menghapus...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                        <span>Ya, Hapus Akun</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
