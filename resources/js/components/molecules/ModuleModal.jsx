import React, { useState, useEffect } from 'react';

const ModuleModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
        } else {
            setTitle('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('Judul wajib diisi');
            return;
        }
        onSave({ title });
        setTitle('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-md rounded-lg shadow-xl overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                    <h3 className="font-headline-sm text-primary">{initialData ? 'Edit Modul' : 'Tambah Modul'}</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors p-1">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto bg-surface-container-lowest">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block font-label-md text-on-surface">Judul Modul <span className="text-error">*</span></label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                                autoFocus
                                placeholder="Contoh: Pengantar Bisnis Hijau"
                                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                            />
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-outline-variant flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container transition-colors">
                            Batal
                        </button>
                        <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-lg font-label-md hover:bg-primary/90 transition-colors shadow-sm">
                            Simpan Modul
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModuleModal;
