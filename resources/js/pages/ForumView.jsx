import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ForumView = () => {
    const [threads, setThreads] = useState([]);
    const [activeThread, setActiveThread] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Create Thread Form State
    const [isCreatingThread, setIsCreatingThread] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newBody, setNewBody] = useState('');
    const [isSubmittingThread, setIsSubmittingThread] = useState(false);

    // Create Comment State
    const [commentBody, setCommentBody] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');

    const fetchThreads = async () => {
        try {
            const response = await api.get('/forum');
            setThreads(response.data);
            if (response.data.length > 0 && !activeThread) {
                // Load details of the first thread by default
                fetchThreadDetails(response.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching forum threads:', error);
            setErrorMsg('Gagal memuat diskusi forum.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchThreadDetails = async (id) => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            const response = await api.get(`/forum/${id}`);
            setActiveThread(response.data);
            setIsCreatingThread(false);
        } catch (error) {
            console.error('Error loading thread details:', error);
            setErrorMsg('Gagal memuat rincian diskusi.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchThreads();
    }, []);

    const handleCreateThread = async (e) => {
        e.preventDefault();
        setIsSubmittingThread(true);
        setErrorMsg('');

        try {
            const response = await api.post('/forum', {
                title: newTitle,
                body: newBody,
            });
            setNewTitle('');
            setNewBody('');
            setIsCreatingThread(false);
            // Refresh and set active
            await fetchThreads();
            await fetchThreadDetails(response.data.id);
        } catch (error) {
            console.error('Error creating thread:', error);
            setErrorMsg('Gagal membuat utas diskusi baru.');
        } finally {
            setIsSubmittingThread(false);
        }
    };

    const handleCreateComment = async (e) => {
        e.preventDefault();
        if (!commentBody.trim()) return;

        setIsSubmittingComment(true);
        setErrorMsg('');

        try {
            await api.post(`/forum/${activeThread.id}/comments`, {
                body: commentBody,
            });
            setCommentBody('');
            // Reload thread details
            await fetchThreadDetails(activeThread.id);
        } catch (error) {
            console.error('Error adding comment:', error);
            setErrorMsg('Gagal mengirimkan komentar.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-outline-variant/20 pb-6">
                <div>
                    <h1 className="text-headline-md font-headline-md text-primary">Forum Komunitas Greenpreneur</h1>
                    <p className="text-label-sm text-on-surface-variant">Tanyakan, diskusikan, dan bagi dampak aksi keberlanjutan Anda bersama mahasiswa lainnya.</p>
                </div>
                <button
                    onClick={() => {
                        setIsCreatingThread(true);
                        setActiveThread(null);
                    }}
                    className="bg-secondary text-on-secondary hover:bg-secondary/90 px-6 py-2.5 rounded-lg text-label-sm font-bold flex items-center gap-2 hover:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[18px]">add_comment</span>
                    <span>Diskusi Baru</span>
                </button>
            </div>

            {errorMsg && (
                <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 text-label-sm font-medium">
                    {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Panel: Threads List */}
                <div className="space-y-4">
                    <h3 className="text-label-sm font-bold text-primary px-1">Daftar Diskusi</h3>
                    
                    {isLoading && threads.length === 0 ? (
                        <div className="py-8 flex justify-center">
                            <span className="material-symbols-outlined animate-spin text-primary text-[28px]">sync</span>
                        </div>
                    ) : threads.length === 0 ? (
                        <div className="p-6 text-center bg-white rounded-lg border border-outline-variant/30">
                            <p className="text-label-sm text-on-surface-variant">Belum ada diskusi.</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                            {threads.map((thread) => (
                                <button
                                    key={thread.id}
                                    onClick={() => fetchThreadDetails(thread.id)}
                                    className={`w-full p-4 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                                        activeThread?.id === thread.id 
                                            ? 'border-primary bg-primary-container/10 font-bold' 
                                            : 'border-outline-variant/30 bg-white hover:bg-surface-container-low/50'
                                    }`}
                                >
                                    <div>
                                        <h4 className="text-label-sm font-bold text-primary line-clamp-1">{thread.title}</h4>
                                        <p className="text-body-md text-on-surface-variant line-clamp-2 mt-1">{thread.body}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-medium mt-2 pt-2 border-t border-outline-variant/10">
                                        <span>Oleh: {thread.user?.name || 'Anonim'}</span>
                                        <span>{new Date(thread.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Panel: Detail Thread or Creation Form */}
                <div className="lg:col-span-2">
                    {isCreatingThread ? (
                        /* Create New Thread Form */
                        <div className="bg-white p-6 rounded-lg border border-outline-variant/30 shadow-sm space-y-6">
                            <h3 className="text-headline-md font-headline-md text-primary">Mulai Topik Diskusi Baru</h3>
                            <form onSubmit={handleCreateThread} className="space-y-4">
                                <div>
                                    <label className="block text-label-sm font-medium text-primary mb-2">Judul Topik</label>
                                    <input 
                                        type="text"
                                        required
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="Judul singkat topik diskusi..."
                                        className="w-full h-[44px] px-4 rounded-lg border border-outline/30 text-body-md focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-label-sm font-medium text-primary mb-2">Detail Pertanyaan / Isi</label>
                                    <textarea 
                                        required
                                        value={newBody}
                                        onChange={(e) => setNewBody(e.target.value)}
                                        placeholder="Jelaskan pertanyaan atau ide Anda di sini secara detail..."
                                        className="w-full px-4 py-2 rounded-lg border border-outline/30 text-body-md focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white h-40 resize-none"
                                    />
                                </div>

                                <div className="flex gap-2 justify-end">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsCreatingThread(false);
                                            if (threads.length > 0) {
                                                fetchThreadDetails(threads[0].id);
                                            }
                                        }}
                                        className="bg-outline text-white px-6 py-2 rounded-lg text-label-sm font-bold"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isSubmittingThread}
                                        className="bg-secondary text-on-secondary px-6 py-2 rounded-lg text-label-sm font-bold hover:scale-95 transition-all shadow-sm"
                                    >
                                        {isSubmittingThread ? 'Memproses...' : 'Kirim Topik'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : activeThread ? (
                        /* Display Thread Details & Comments */
                        <div className="space-y-6">
                            {/* Thread Main Card */}
                            <div className="bg-white p-6 rounded-lg border border-outline-variant/30 shadow-sm">
                                <div className="flex items-center gap-3 mb-4 text-on-surface-variant text-[12px] font-semibold">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-primary">
                                        {activeThread.user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-primary font-bold">{activeThread.user?.name}</p>
                                        <p className="text-[11px] opacity-75">{new Date(activeThread.created_at).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                                <h2 className="text-headline-md font-headline-md text-primary mb-4">{activeThread.title}</h2>
                                <p className="text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line">{activeThread.body}</p>
                            </div>

                            {/* Comment Section */}
                            <div className="bg-white p-6 rounded-lg border border-outline-variant/30 shadow-sm space-y-6">
                                <h3 className="text-label-sm font-bold text-primary border-b border-outline-variant/10 pb-4">
                                    Komentar ({activeThread.comments?.length || 0})
                                </h3>

                                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                                    {activeThread.comments?.length === 0 ? (
                                        <p className="text-body-md text-on-surface-variant/80 italic text-center py-4">Belum ada tanggapan. Jadilah yang pertama memberikan tanggapan!</p>
                                    ) : (
                                        activeThread.comments?.map((comment) => (
                                            <div key={comment.id} className="p-4 bg-surface-container-low/20 rounded-lg border border-outline-variant/15 space-y-2">
                                                <div className="flex justify-between items-center text-[11px] text-on-surface-variant font-bold">
                                                    <span>{comment.user?.name || 'Anonim'}</span>
                                                    <span>{new Date(comment.created_at).toLocaleDateString('id-ID')}</span>
                                                </div>
                                                <p className="text-body-md text-on-surface-variant whitespace-pre-line">{comment.body}</p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Write Comment Form */}
                                <form onSubmit={handleCreateComment} className="border-t border-outline-variant/10 pt-4 space-y-3">
                                    <textarea
                                        required
                                        value={commentBody}
                                        onChange={(e) => setCommentBody(e.target.value)}
                                        placeholder="Tulis tanggapan diskusi Anda..."
                                        className="w-full px-4 py-2 rounded-lg border border-outline/30 text-body-md focus:border-primary focus:outline-none bg-white h-20 resize-none"
                                    />
                                    <div className="text-right">
                                        <button
                                            type="submit"
                                            disabled={isSubmittingComment}
                                            className="bg-primary text-on-primary hover:bg-primary-container px-6 py-2 rounded-lg text-label-sm font-bold hover:scale-95 transition-all shadow-sm cursor-pointer"
                                        >
                                            {isSubmittingComment ? 'Mengirim...' : 'Kirim Tanggapan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        /* Initial state (no active thread loaded/available) */
                        <div className="bg-white p-12 rounded-lg border border-outline-variant/30 text-center shadow-sm">
                            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-3">forum</span>
                            <p className="text-body-md text-on-surface-variant">Pilih topik diskusi di panel kiri atau buat diskusi baru.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ForumView;
