import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const DashboardLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const studentNavLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '/dashboard/modules', label: 'Modul', icon: 'menu_book' },
        { path: '/dashboard/showcase', label: 'Etalase Hijau', icon: 'workspace_premium' },
        { path: '/dashboard/directory', label: 'Direktori UMKM', icon: 'location_on' },
        { path: '/dashboard/forum', label: 'Pusat Umpan Balik', icon: 'forum' },
        { path: '/dashboard/profile', label: 'Profil Saya', icon: 'person' }
    ];

    const instructorNavLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '/dashboard/manager', label: 'Manajemen Kursus', icon: 'menu_book' },
        { path: '/dashboard/showcase', label: 'Etalase Hijau', icon: 'workspace_premium' },
        { path: '/dashboard/directory', label: 'Direktori UMKM', icon: 'location_on' },
        { path: '/dashboard/forum', label: 'Pusat Umpan Balik', icon: 'forum' },
        { path: '/dashboard/profile', label: 'Profil Instruktur', icon: 'person' }
    ];

    const navLinks = user?.role === 'instructor' ? instructorNavLinks : studentNavLinks;

    return (
        <div className="min-h-screen bg-[#f4fafd] text-on-surface">
            {/* Side Navigation */}
            <aside className="fixed h-full w-64 left-0 top-0 bg-surface dark:bg-surface-dim border-r border-outline-variant dark:border-tertiary-container flex flex-col py-8 px-4 z-50">
                <div className="mb-12 px-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                    </div>
                    <div>
                        <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed leading-tight">Ecocademy</h1>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Greenpreneur LMS</p>
                    </div>
                </div>

                <nav className="flex-grow space-y-2">
                    {navLinks.map((link, idx) => {
                        const isActive = !link.isPlaceholder && (location.pathname === link.path || 
                            (link.path !== '/dashboard' && location.pathname.startsWith(link.path)));
                        
                        const content = (
                            <>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{link.icon}</span>
                                <span className="font-label-md text-label-md">{link.label}</span>
                            </>
                        );

                        if (link.isPlaceholder) {
                            return (
                                <button 
                                    key={idx}
                                    disabled
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant/60 dark:text-on-tertiary-container/60 cursor-not-allowed opacity-80"
                                >
                                    {content}
                                </button>
                            );
                        }

                        return (
                            <Link 
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive 
                                        ? 'text-primary dark:text-primary-fixed font-bold border-r-4 border-primary dark:border-primary-fixed bg-primary-fixed/10' 
                                        : 'text-on-surface-variant dark:text-on-tertiary-container hover:bg-primary-fixed/5 hover:text-primary'
                                  }`}
                            >
                                {content}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto space-y-4">
                    {/* Current Goal Widget (Student Only) */}
                    {user?.role !== 'instructor' && (
                        <div className="p-4 bg-primary-container rounded-lg text-primary-fixed">
                            <p className="font-label-sm text-label-sm opacity-80 mb-2">Tujuan Saat Ini</p>
                            <p className="font-label-md text-label-md mb-3">Landasan Dampak</p>
                            <div className="h-1.5 w-full bg-on-primary-container/30 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-fixed w-[65%]"></div>
                            </div>
                        </div>
                    )}

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-label-sm font-medium hover:bg-red-500/10 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span className="font-bold">Keluar Layanan</span>
                    </button>
                </div>
            </aside>

            {/* Top Navigation */}
            <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-20 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant dark:border-tertiary-container z-40 flex justify-between items-center px-8">
                <div className="relative w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                    <input className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-full font-label-md text-label-md focus:outline-none focus:border-primary transition-all" placeholder="Cari Kursus Hijau" type="text"/>
                </div>
                <div className="flex items-center gap-6">
                    <button className="relative text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full"></span>
                    </button>
                    <Link to="/dashboard/profile" className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
                        <span className="material-symbols-outlined">settings</span>
                    </Link>
                    {user?.role === 'instructor' && (
                        <button className="hidden md:flex bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">assessment</span>
                            Pusat Evaluasi
                        </button>
                    )}
                    <div className="hidden md:block h-8 w-px bg-outline-variant"></div>
                    <Link to="/dashboard/profile" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
                        <div className="text-right">
                            <p className="font-label-md text-label-md text-on-surface leading-tight font-bold">{user?.name || 'Pengguna'}</p>
                            <p className="font-label-sm text-label-sm text-on-surface-variant">
                                {user?.role === 'instructor' ? 'Instruktur' : 'Pejuang Hijau'}
                            </p>
                        </div>
                        {user?.avatar ? (
                            <img 
                                className="w-10 h-10 rounded-full object-cover border-2 border-primary-fixed shadow-sm" 
                                src={user.avatar} 
                                alt="Foto Profil Pengguna"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full border-2 border-primary-fixed shadow-sm bg-primary-fixed/20 text-primary-fixed flex items-center justify-center font-bold text-lg">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                    </Link>
                </div>
            </header>

            {/* Main Area */}
            <main className="ml-64 pt-20 min-h-screen">
                <div className="max-w-container-max mx-auto p-8 lg:p-12">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
