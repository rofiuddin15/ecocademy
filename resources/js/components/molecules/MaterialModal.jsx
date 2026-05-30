import React, { useState, useEffect } from 'react';

const MaterialModal = ({ isOpen, onClose, onSave, moduleTitle, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        content_type: 'article',
        content_url: '',
        body_text: '',
        duration_minutes: 0
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content_type: initialData.content_type || 'article',
                content_url: initialData.content_url || '',
                body_text: initialData.body_text || '',
                duration_minutes: initialData.duration_minutes || 0
            });
        } else {
            setFormData({ title: '', content_type: 'article', content_url: '', body_text: '', duration_minutes: 0 });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'duration_minutes' ? Number(value) : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        // Reset
        setFormData({ title: '', content_type: 'article', content_url: '', body_text: '', duration_minutes: 0 });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                    <div>
                        <h3 className="font-headline-sm text-primary">{initialData ? 'Edit Material' : 'Add Material'}</h3>
                        <p className="text-on-surface-variant font-label-sm">To: {moduleTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors p-1">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="materialForm" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block font-label-md text-on-surface">Material Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={formData.title} 
                                onChange={handleChange} 
                                required
                                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all"
                                placeholder="e.g., Introduction to Circular Economy"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block font-label-md text-on-surface">Content Type</label>
                            <select 
                                name="content_type" 
                                value={formData.content_type} 
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all"
                            >
                                <option value="article">Article / Text</option>
                                <option value="video">Video (YouTube/URL)</option>
                                <option value="pdf">PDF Document (URL)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block font-label-md text-on-surface">Estimated Duration (Minutes)</label>
                            <input 
                                type="number" 
                                name="duration_minutes" 
                                value={formData.duration_minutes} 
                                onChange={handleChange} 
                                required
                                min="0"
                                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all"
                                placeholder="e.g., 30"
                            />
                        </div>

                        {formData.content_type !== 'article' && (
                            <div className="space-y-2">
                                <label className="block font-label-md text-on-surface">Content URL</label>
                                <input 
                                    type="url" 
                                    name="content_url" 
                                    value={formData.content_url} 
                                    onChange={handleChange} 
                                    required
                                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        )}

                        {formData.content_type === 'article' && (
                            <div className="space-y-2">
                                <label className="block font-label-md text-on-surface">Content Body (Markdown/Text)</label>
                                <textarea 
                                    name="body_text" 
                                    value={formData.body_text} 
                                    onChange={handleChange} 
                                    required
                                    rows="8"
                                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all resize-none font-mono text-sm"
                                    placeholder="Write your lesson content here..."
                                />
                            </div>
                        )}
                    </form>
                </div>
                
                <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-label-md text-on-surface-variant hover:bg-outline-variant/20 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="materialForm" className="bg-primary text-white px-6 py-2.5 rounded-lg font-label-md hover:bg-primary/90 transition-colors shadow-sm">
                        Save Material
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MaterialModal;
