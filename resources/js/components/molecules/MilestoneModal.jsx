import React, { useState, useEffect } from 'react';

const MilestoneModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        instructions: '',
        duration_hours: 0,
        report_type: 'document'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                instructions: initialData.instructions || '',
                duration_hours: initialData.duration_hours || 0,
                report_type: initialData.report_type || 'document'
            });
        } else {
            setFormData({
                title: '',
                instructions: '',
                duration_hours: 0,
                report_type: 'document'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'duration_hours' ? Number(value) : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                    <div>
                        <h3 className="font-headline-sm text-primary">{initialData ? 'Edit Milestone' : 'Add Milestone'}</h3>
                        <p className="text-on-surface-variant font-label-sm">Project-Based Learning Stage</p>
                    </div>
                    <button onClick={onClose} type="button" className="text-on-surface-variant hover:text-error transition-colors p-1">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="milestoneForm" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block font-label-md text-on-surface">Milestone Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={formData.title} 
                                onChange={handleChange} 
                                required
                                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all"
                                placeholder="e.g., Problem Formulation"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block font-label-md text-on-surface">Instructions / Task Description</label>
                            <textarea 
                                name="instructions" 
                                value={formData.instructions} 
                                onChange={handleChange} 
                                required
                                rows="4"
                                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all resize-none"
                                placeholder="Describe what the student needs to do in this milestone..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block font-label-md text-on-surface">Duration (Hours)</label>
                                <input 
                                    type="number" 
                                    name="duration_hours" 
                                    value={formData.duration_hours} 
                                    onChange={handleChange} 
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all"
                                    placeholder="e.g., 10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block font-label-md text-on-surface">Expected Report Type</label>
                                <select 
                                    name="report_type" 
                                    value={formData.report_type} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all"
                                >
                                    <option value="text">Text Input (Direct Form)</option>
                                    <option value="document">Document (PDF/Word)</option>
                                    <option value="image">Image / Photo Proof</option>
                                    <option value="link">URL / Repository Link</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-label-md text-on-surface-variant hover:bg-outline-variant/20 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="milestoneForm" className="bg-primary text-white px-6 py-2.5 rounded-lg font-label-md hover:bg-primary/90 transition-colors shadow-sm">
                        Save Milestone
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MilestoneModal;
