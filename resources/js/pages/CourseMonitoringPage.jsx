import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};
const formatTime = (iso) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};
const formatRelative = (iso) => {
    if (!iso) return '-';
    const now = new Date();
    const then = new Date(iso);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60)   return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
};

// ── Mini Bar Chart ─────────────────────────────────────────────────────────────
const MiniBarChart = ({ data }) => {
    if (!data || data.length === 0) return (
        <div className="flex items-end justify-center h-24 text-on-surface-variant/40 text-label-sm">
            Belum ada data
        </div>
    );
    const max = Math.max(...data.map(d => d.total), 1);
    return (
        <div className="flex items-end gap-1.5 h-24">
            {data.map((d, i) => {
                const height = Math.max((d.total / max) * 100, 4);
                const dateLabel = new Date(d.date).toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit' });
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative" title={`${dateLabel}: ${d.total} aktivitas`}>
                        <div
                            className="w-full rounded-t-sm bg-primary/80 hover:bg-primary transition-all duration-300 cursor-default"
                            style={{ height: `${height}%` }}
                        />
                        <span className="text-[9px] text-on-surface-variant/60 group-hover:text-on-surface-variant transition-colors">{dateLabel}</span>
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {d.total} aktivitas<br/>{d.unique_users} pengguna unik
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color, bgColor }) => (
    <div className={`rounded-2xl border p-5 flex items-center gap-4 ${bgColor} shadow-sm`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color.replace('text-', 'bg-').replace('600', '100').replace('700', '100')}`}>
            <span className={`material-symbols-outlined text-[24px] ${color}`}>{icon}</span>
        </div>
        <div>
            <p className="text-display-sm font-bold text-on-surface leading-none">{value}</p>
            <p className="text-label-md font-semibold text-on-surface mt-0.5">{label}</p>
            {sub && <p className="text-label-xs text-on-surface-variant mt-0.5">{sub}</p>}
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const CourseMonitoringPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData]           = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview | students | activity
    const [searchStudent, setSearchStudent] = useState('');
    const [studentFilter, setStudentFilter] = useState('all'); // all | active | completed | inactive
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) setRefreshing(true);
        else setIsLoading(true);
        try {
            const res = await api.get(`/courses/${id}/monitoring`);
            setData(res.data);
        } catch (err) {
            console.error('Error fetching monitoring data:', err);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                <p className="text-body-md text-on-surface-variant">Memuat data monitoring...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="py-20 text-center bg-white rounded-2xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-[56px] text-error mb-3">error</span>
                <p className="text-title-md text-on-surface-variant">Data monitoring tidak tersedia.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-primary font-semibold hover:underline">Kembali</button>
            </div>
        );
    }

    const { course, stats, recent_activity, enrolled_students, daily_activity } = data;

    // Filter mahasiswa
    const filteredStudents = enrolled_students
        .filter(s => {
            const nameMatch = s.user?.name?.toLowerCase().includes(searchStudent.toLowerCase());
            if (!nameMatch) return false;
            if (studentFilter === 'active')    return s.is_active_today;
            if (studentFilter === 'completed') return s.is_completed;
            if (studentFilter === 'inactive')  return !s.is_active_today && !s.is_completed;
            return true;
        });

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-6">
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        to={`/dashboard/manager/view/${id}`}
                        className="w-9 h-9 rounded-xl bg-white border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">arrow_back</span>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-label-sm font-medium text-on-surface-variant bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Course Monitoring
                            </span>
                        </div>
                        <h1 className="text-headline-md font-bold text-on-surface line-clamp-1">{course.title}</h1>
                    </div>
                </div>

                <button
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant/40 bg-white text-on-surface-variant font-medium hover:bg-surface-container transition-all text-label-sm shadow-sm disabled:opacity-60"
                >
                    <span className={`material-symbols-outlined text-[18px] ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
                    {refreshing ? 'Memperbarui...' : 'Refresh Data'}
                </button>
            </div>

            {/* ── Stats Cards ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon="group"
                    label="Total Terdaftar"
                    value={stats.total_enrolled}
                    sub="mahasiswa"
                    color="text-blue-600"
                    bgColor="bg-white border-blue-100"
                />
                <StatCard
                    icon="bolt"
                    label="Aktif Hari Ini"
                    value={stats.active_today}
                    sub={`${stats.active_this_week} minggu ini`}
                    color="text-amber-600"
                    bgColor="bg-white border-amber-100"
                />
                <StatCard
                    icon="task_alt"
                    label="Telah Selesai"
                    value={stats.total_completed}
                    sub="mahasiswa"
                    color="text-emerald-600"
                    bgColor="bg-white border-emerald-100"
                />
                <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[20px] text-violet-600">donut_large</span>
                        <span className="text-label-md font-semibold text-on-surface">Tingkat Selesai</span>
                    </div>
                    {/* Progress bar */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-display-sm font-bold text-on-surface">{stats.completion_rate}%</span>
                        </div>
                        <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-violet-500 rounded-full transition-all duration-700"
                                style={{ width: `${stats.completion_rate}%` }}
                            />
                        </div>
                        <p className="text-label-xs text-on-surface-variant mt-1.5">
                            {stats.total_completed} dari {stats.total_enrolled} mahasiswa
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Tabs ─────────────────────────────────────────────────────────── */}
            <div className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex border-b border-outline-variant/30">
                    {[
                        { key: 'overview',  label: 'Ringkasan',      icon: 'dashboard' },
                        { key: 'students',  label: 'Mahasiswa',       icon: 'group' },
                        { key: 'activity',  label: 'Aktivitas Terbaru', icon: 'history' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-5 py-3.5 text-label-md font-medium border-b-2 transition-colors flex-1 justify-center ${
                                activeTab === tab.key
                                    ? 'border-primary text-primary bg-primary/5'
                                    : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* ── Tab: Overview ─────────────────────────────────────────── */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Chart aktivitas 7 hari */}
                            <div>
                                <h3 className="text-title-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary">bar_chart</span>
                                    Aktivitas 7 Hari Terakhir
                                </h3>
                                <div className="bg-surface-container/30 rounded-xl p-4">
                                    <MiniBarChart data={daily_activity} />
                                </div>
                            </div>

                            {/* Quick stats grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                    <p className="text-label-sm text-blue-600 font-medium mb-1">Belum aktif hari ini</p>
                                    <p className="text-title-lg font-bold text-on-surface">
                                        {stats.total_enrolled - stats.active_today}
                                    </p>
                                    <p className="text-label-xs text-on-surface-variant">mahasiswa</p>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                    <p className="text-label-sm text-emerald-600 font-medium mb-1">Belum selesai</p>
                                    <p className="text-title-lg font-bold text-on-surface">
                                        {stats.total_enrolled - stats.total_completed}
                                    </p>
                                    <p className="text-label-xs text-on-surface-variant">mahasiswa</p>
                                </div>
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                    <p className="text-label-sm text-amber-600 font-medium mb-1">Aktif minggu ini</p>
                                    <p className="text-title-lg font-bold text-on-surface">{stats.active_this_week}</p>
                                    <p className="text-label-xs text-on-surface-variant">mahasiswa</p>
                                </div>
                            </div>

                            {/* 5 aktivitas terbaru preview */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-title-sm font-bold text-on-surface flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                                        Aktivitas Terbaru
                                    </h3>
                                    <button
                                        onClick={() => setActiveTab('activity')}
                                        className="text-label-sm text-primary font-medium hover:underline"
                                    >
                                        Lihat semua →
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {recent_activity.slice(0, 5).map(log => (
                                        <div key={log.id} className="flex items-center gap-3 bg-surface-container/50 rounded-xl px-4 py-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-[14px] text-primary">{log.action_icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-label-sm font-semibold text-on-surface truncate">
                                                    {log.user?.name}
                                                    <span className="font-normal text-on-surface-variant"> — {log.action_label}</span>
                                                </p>
                                                {log.subject_name && (
                                                    <p className="text-label-xs text-on-surface-variant truncate">{log.subject_name}</p>
                                                )}
                                            </div>
                                            <span className="text-label-xs text-on-surface-variant flex-shrink-0">{formatRelative(log.created_at)}</span>
                                        </div>
                                    ))}
                                    {recent_activity.length === 0 && (
                                        <p className="text-body-sm text-on-surface-variant text-center py-6">Belum ada aktivitas tercatat.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Tab: Students ─────────────────────────────────────────── */}
                    {activeTab === 'students' && (
                        <div className="space-y-4">
                            {/* Search & Filter */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2">search</span>
                                    <input
                                        type="text"
                                        value={searchStudent}
                                        onChange={e => setSearchStudent(e.target.value)}
                                        placeholder="Cari nama mahasiswa..."
                                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-outline-variant/40 bg-surface-container/30 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {[
                                        { key: 'all', label: 'Semua' },
                                        { key: 'active', label: 'Aktif Hari Ini' },
                                        { key: 'completed', label: 'Selesai' },
                                        { key: 'inactive', label: 'Tidak Aktif' },
                                    ].map(f => (
                                        <button
                                            key={f.key}
                                            onClick={() => setStudentFilter(f.key)}
                                            className={`px-3 py-2 rounded-xl text-label-sm font-medium transition-all border ${
                                                studentFilter === f.key
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                                            }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <p className="text-label-sm text-on-surface-variant">
                                Menampilkan {filteredStudents.length} dari {enrolled_students.length} mahasiswa
                            </p>

                            {/* Students Table */}
                            <div className="rounded-xl border border-outline-variant/30 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-surface-container/50 border-b border-outline-variant/30">
                                        <tr>
                                            <th className="px-4 py-3 text-label-sm font-semibold text-on-surface-variant">Mahasiswa</th>
                                            <th className="px-4 py-3 text-label-sm font-semibold text-on-surface-variant hidden md:table-cell">Terdaftar</th>
                                            <th className="px-4 py-3 text-label-sm font-semibold text-on-surface-variant text-center">Status</th>
                                            <th className="px-4 py-3 text-label-sm font-semibold text-on-surface-variant hidden lg:table-cell">Aktivitas Terakhir</th>
                                            <th className="px-4 py-3 text-label-sm font-semibold text-on-surface-variant text-center hidden md:table-cell">Total Log</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/20">
                                        {filteredStudents.map((s, idx) => (
                                            <tr
                                                key={s.user?.id || idx}
                                                className="bg-white hover:bg-surface-container/30 transition-colors"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                            {s.user?.avatar ? (
                                                                <img src={s.user.avatar} alt={s.user.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-label-md font-semibold text-on-surface">{s.user?.name}</p>
                                                            <p className="text-label-xs text-on-surface-variant">{s.user?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-label-sm text-on-surface-variant hidden md:table-cell">
                                                    {formatDate(s.enrolled_at)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {s.is_completed ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-label-xs font-bold">
                                                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                                            Selesai
                                                        </span>
                                                    ) : s.is_active_today ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-label-xs font-bold">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-label-xs font-bold">
                                                            <span className="material-symbols-outlined text-[12px]">remove_circle</span>
                                                            Tidak aktif
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 hidden lg:table-cell">
                                                    {s.last_activity ? (
                                                        <div>
                                                            <p className="text-label-sm text-on-surface">{s.last_activity.action_label}</p>
                                                            <p className="text-label-xs text-on-surface-variant">{formatRelative(s.last_activity.created_at)}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-label-sm text-on-surface-variant/50">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center hidden md:table-cell">
                                                    <span className="text-label-sm font-bold text-on-surface">{s.activity_count}</span>
                                                    <span className="text-label-xs text-on-surface-variant"> aktivitas</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredStudents.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-12 text-center text-on-surface-variant text-body-sm">
                                                    Tidak ada mahasiswa yang cocok dengan filter.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── Tab: Activity ─────────────────────────────────────────── */}
                    {activeTab === 'activity' && (
                        <div className="space-y-3">
                            <p className="text-label-sm text-on-surface-variant">{recent_activity.length} aktivitas terbaru terkait kursus ini</p>
                            {recent_activity.length === 0 ? (
                                <div className="py-12 text-center text-on-surface-variant">
                                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">history_toggle_off</span>
                                    <p className="text-body-md mt-2">Belum ada aktivitas tercatat.</p>
                                </div>
                            ) : (
                                recent_activity.map((log, idx) => (
                                    <div key={log.id} className="flex items-start gap-3 bg-surface-container/30 rounded-xl px-4 py-3 hover:bg-surface-container/60 transition-colors">
                                        {/* Avatar */}
                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {log.user?.avatar ? (
                                                <img src={log.user.avatar} alt={log.user?.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-label-sm text-on-surface">
                                                <span className="font-bold">{log.user?.name}</span>
                                                <span className="text-on-surface-variant"> melakukan </span>
                                                <span className="font-semibold text-primary">{log.action_label}</span>
                                            </p>
                                            {log.subject_name && (
                                                <p className="text-label-xs text-on-surface-variant truncate mt-0.5">
                                                    <span className="material-symbols-outlined text-[12px] align-middle mr-0.5">{log.action_icon}</span>
                                                    {log.subject_name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-label-xs font-medium text-on-surface-variant">{formatRelative(log.created_at)}</p>
                                            <p className="text-label-xs text-on-surface-variant/50">{formatTime(log.created_at)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseMonitoringPage;
