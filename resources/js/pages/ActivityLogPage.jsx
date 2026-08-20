import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api';

// ── Warna & icon per kategori aksi ───────────────────────────────────────────
const ACTION_STYLES = {
    login:            { color: 'bg-blue-100 text-blue-700 border-blue-200',    dot: 'bg-blue-500',   ring: 'ring-blue-200' },
    logout:           { color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400',  ring: 'ring-slate-200' },
    view_course:      { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', ring: 'ring-emerald-200' },
    enroll_course:    { color: 'bg-teal-100 text-teal-700 border-teal-200',    dot: 'bg-teal-500',   ring: 'ring-teal-200' },
    complete_course:  { color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500',  ring: 'ring-green-200' },
    view_material:    { color: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-500', ring: 'ring-violet-200' },
    submit_quiz:      { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500',  ring: 'ring-amber-200' },
    view_forum:       { color: 'bg-sky-100 text-sky-700 border-sky-200',       dot: 'bg-sky-500',    ring: 'ring-sky-200' },
    post_forum:       { color: 'bg-cyan-100 text-cyan-700 border-cyan-200',    dot: 'bg-cyan-500',   ring: 'ring-cyan-200' },
    submit_project:   { color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500', ring: 'ring-orange-200' },
    submit_milestone: { color: 'bg-lime-100 text-lime-700 border-lime-200',    dot: 'bg-lime-500',   ring: 'ring-lime-200' },
    view_showcase:    { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400', ring: 'ring-emerald-200' },
};
const DEFAULT_STYLE = { color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400', ring: 'ring-gray-200' };

const getStyle = (action) => ACTION_STYLES[action] || DEFAULT_STYLE;

// ── Filter options ────────────────────────────────────────────────────────────
const FILTER_OPTIONS = [
    { value: 'all',            label: 'Semua Aktivitas' },
    { value: 'login',          label: 'Login' },
    { value: 'enroll_course',  label: 'Mendaftar Kursus' },
    { value: 'view_course',    label: 'Membuka Kursus' },
    { value: 'view_material',  label: 'Materi' },
    { value: 'submit_quiz',    label: 'Kuis' },
    { value: 'submit_project', label: 'Proyek' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};
const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};
const formatRelative = (iso) => {
    const now = new Date();
    const then = new Date(iso);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60)   return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return formatDate(iso);
};

// ── Group logs by date ────────────────────────────────────────────────────────
const groupByDate = (logs) => {
    const groups = {};
    logs.forEach(log => {
        const date = new Date(log.created_at).toLocaleDateString('id-ID', {
            weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(log);
    });
    return groups;
};

// ── Main Component ────────────────────────────────────────────────────────────
const ActivityLogPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [logs, setLogs]             = useState([]);
    const [meta, setMeta]             = useState(null);
    const [isLoading, setIsLoading]   = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter]         = useState('all');
    const [stats, setStats]           = useState({ total: 0, today: 0, thisWeek: 0 });

    const fetchLogs = useCallback(async (page = 1, action = 'all', append = false) => {
        if (page === 1) setIsLoading(true); else setIsLoadingMore(true);
        try {
            const params = { page, action };
            const res = await api.get('/activity-logs', { params });
            const data = res.data;

            setMeta(data);
            setLogs(prev => append ? [...prev, ...data.data] : data.data);

            if (page === 1) {
                // Hitung stats dari data halaman pertama (semua filter)
                const allRes = await api.get('/activity-logs', { params: { action: 'all', page: 1 } });
                const allData = allRes.data.data || [];
                const todayStr = new Date().toDateString();
                const weekAgo = Date.now() - 7 * 86400000;
                setStats({
                    total:    allRes.data.total || 0,
                    today:    allData.filter(l => new Date(l.created_at).toDateString() === todayStr).length,
                    thisWeek: allData.filter(l => new Date(l.created_at) >= weekAgo).length,
                });
            }
        } catch (err) {
            console.error('Error fetching activity logs:', err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        fetchLogs(1, filter, false);
    }, [filter, fetchLogs]);

    const handleLoadMore = () => {
        const next = currentPage + 1;
        setCurrentPage(next);
        fetchLogs(next, filter, true);
    };

    const groupedLogs = groupByDate(logs);

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-headline-lg font-bold text-on-surface flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[22px]">history</span>
                        </span>
                        Riwayat Aktivitas
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-1 ml-13">
                        Rekam jejak semua aktivitas Anda di platform Ecocademy
                    </p>
                </div>

                {/* Stats mini cards */}
                <div className="flex gap-3 flex-wrap">
                    {[
                        { label: 'Total',      value: meta?.total || 0,  icon: 'history',       color: 'text-primary' },
                        { label: 'Hari ini',   value: stats.today,        icon: 'today',         color: 'text-emerald-600' },
                        { label: 'Minggu ini', value: stats.thisWeek,     icon: 'date_range',    color: 'text-violet-600' },
                    ].map(s => (
                        <div key={s.label} className="bg-white border border-outline-variant/30 rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-sm">
                            <span className={`material-symbols-outlined text-[18px] ${s.color}`}>{s.icon}</span>
                            <div>
                                <p className="text-title-md font-bold text-on-surface leading-none">{s.value}</p>
                                <p className="text-label-sm text-on-surface-variant">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Filter Bar ─────────────────────────────────────────────────── */}
            <div className="bg-white border border-outline-variant/30 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-label-sm text-on-surface-variant font-medium mr-1">Filter:</span>
                    {FILTER_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            className={`px-3 py-1.5 rounded-full text-label-sm font-medium transition-all duration-200 border ${
                                filter === opt.value
                                    ? 'bg-primary text-white border-primary shadow-sm'
                                    : 'bg-surface-container text-on-surface-variant border-transparent hover:border-outline-variant hover:bg-surface-container-high'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Timeline ───────────────────────────────────────────────────── */}
            {isLoading ? (
                <div className="py-16 flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                    <p className="text-body-md text-on-surface-variant">Memuat riwayat aktivitas...</p>
                </div>
            ) : logs.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3 bg-white rounded-2xl border border-outline-variant/30">
                    <span className="material-symbols-outlined text-[56px] text-on-surface-variant/40">history_toggle_off</span>
                    <p className="text-title-md text-on-surface-variant font-medium">Belum ada aktivitas</p>
                    <p className="text-body-sm text-on-surface-variant/70">Aktivitas Anda akan muncul di sini saat Anda mulai menggunakan platform.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedLogs).map(([date, dayLogs]) => (
                        <div key={date}>
                            {/* Date separator */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-px flex-1 bg-outline-variant/30" />
                                <span className="text-label-sm font-semibold text-on-surface-variant bg-background px-3 py-1 rounded-full border border-outline-variant/30">
                                    {date}
                                </span>
                                <div className="h-px flex-1 bg-outline-variant/30" />
                            </div>

                            {/* Logs for this date */}
                            <div className="relative">
                                {/* Vertical timeline line */}
                                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-outline-variant/40 to-transparent" />

                                <div className="space-y-3">
                                    {dayLogs.map((log, idx) => {
                                        const style = getStyle(log.action);
                                        return (
                                            <div
                                                key={log.id}
                                                className="relative flex gap-4 items-start group"
                                                style={{ animationDelay: `${idx * 50}ms` }}
                                            >
                                                {/* Timeline dot */}
                                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ${style.ring} ${style.dot} bg-opacity-90 shadow-sm transition-transform duration-200 group-hover:scale-110`}>
                                                    <span className="material-symbols-outlined text-white text-[16px]">
                                                        {log.action_icon}
                                                    </span>
                                                </div>

                                                {/* Log card */}
                                                <div className="flex-1 bg-white border border-outline-variant/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-outline-variant/60">
                                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                <span className={`text-label-xs font-bold px-2 py-0.5 rounded-full border ${style.color}`}>
                                                                    {log.action_label}
                                                                </span>
                                                                {log.subject_type && (
                                                                    <span className="text-label-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                                                                        {log.subject_type}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {log.subject_name && (
                                                                <p className="text-body-sm font-semibold text-on-surface mt-1">
                                                                    {log.subject_name}
                                                                </p>
                                                            )}
                                                            {log.metadata && log.metadata.score !== undefined && (
                                                                <p className="text-body-sm text-on-surface-variant mt-0.5">
                                                                    Skor: <span className="font-bold text-on-surface">{log.metadata.score}</span>
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Time */}
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-label-sm font-medium text-on-surface-variant">{formatTime(log.created_at)}</p>
                                                            <p className="text-label-xs text-on-surface-variant/60">{formatRelative(log.created_at)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Load more */}
                    {meta && currentPage < meta.last_page && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-outline-variant/50 bg-white text-on-surface-variant font-medium hover:bg-surface-container hover:border-outline-variant transition-all duration-200 disabled:opacity-50"
                            >
                                {isLoadingMore ? (
                                    <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Memuat...</>
                                ) : (
                                    <><span className="material-symbols-outlined text-[18px]">expand_more</span> Muat lebih banyak</>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ActivityLogPage;
