import React, { useState, useEffect } from 'react';
import { BANK_TEMPLATES, GREENPRENEURSHIP_TEMPLATES } from '../../constants/pjblTemplates';

const MilestoneModal = ({ isOpen, onClose, onSave, initialData }) => {
    const emptyForm = {
        title: '',
        instructions: '',
        student_activities: '',
        lms_deliverable: '',
        content_format: '',
        assessment_indicators: '',
        weight: 0,
        duration_hours: 0,
        report_type: 'document',
    };

    const [formData, setFormData] = useState(emptyForm);
    const [activeSection, setActiveSection] = useState('basic'); // 'basic' | 'rpm'

    useEffect(() => {
        if (initialData) {
            setFormData({
                title:                  initialData.title || '',
                instructions:           initialData.instructions || '',
                student_activities:     initialData.student_activities || '',
                lms_deliverable:        initialData.lms_deliverable || '',
                content_format:         initialData.content_format || '',
                assessment_indicators:  initialData.assessment_indicators || '',
                weight:                 initialData.weight ?? 0,
                duration_hours:         initialData.duration_hours ?? 0,
                report_type:            initialData.report_type || 'document',
            });
        } else {
            setFormData(emptyForm);
        }
        setActiveSection('basic');
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'duration_hours' || name === 'weight') ? Number(value) : value,
        }));
    };

    const handleApplyTemplate = (e) => {
        const index = e.target.value;
        if (index === '') return;
        
        const template = GREENPRENEURSHIP_TEMPLATES[index];
        if (template) {
            setFormData(prev => ({
                ...prev,
                ...template
            }));
            // Optionally switch to RPM tab to show the changes
            // setActiveSection('rpm');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const totalWeight = formData.weight;
    const weightColor = totalWeight > 100 ? 'text-red-500' : totalWeight === 100 ? 'text-green-500' : 'text-amber-500';

    const inputClass = "w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-on-surface font-body-md";
    const textareaClass = `${inputClass} resize-none`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-outline-variant/30">
                {/* Header */}
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-primary/5">
                    <div>
                        <h3 className="font-headline-sm text-primary">
                            {initialData ? 'Edit Tahap Milestone' : 'Tambah Tahap Milestone'}
                        </h3>
                        <p className="text-on-surface-variant font-label-sm mt-0.5">
                            Project-Based Learning — Rencana Pelaksanaan Milestone (RPM)
                        </p>
                    </div>
                    <button onClick={onClose} type="button" className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-lg hover:bg-error/10">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-outline-variant bg-surface-container-low px-6">
                    <button
                        type="button"
                        onClick={() => setActiveSection('basic')}
                        className={`px-4 py-3 font-label-md text-sm border-b-2 transition-colors ${activeSection === 'basic' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}
                    >
                        <span className="material-symbols-outlined text-[16px] align-middle mr-1">info</span>
                        Informasi Dasar
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSection('rpm')}
                        className={`px-4 py-3 font-label-md text-sm border-b-2 transition-colors ${activeSection === 'rpm' ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant hover:text-secondary'}`}
                    >
                        <span className="material-symbols-outlined text-[16px] align-middle mr-1">assignment</span>
                        Detail RPM Tugas
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="milestoneForm" onSubmit={handleSubmit} className="space-y-5">

                        {/* Template Selector */}
                        {!initialData && (
                            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-2 mb-2">
                                <label className="block font-label-md text-primary flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">magic_button</span>
                                    Gunakan Template PjBL Standar
                                </label>
                                <select 
                                    className="w-full px-4 py-2.5 bg-white border border-primary/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-on-surface font-body-md"
                                    onChange={handleApplyTemplate}
                                    defaultValue=""
                                >
                                    <option value="" disabled>-- Pilih Tahapan (Opsional) --</option>
                                    <optgroup label="Greenpreneurship">
                                        {GREENPRENEURSHIP_TEMPLATES.map((t, i) => (
                                            <option key={`gp-${i}`} value={i}>{t.title}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Bank Template Lainnya">
                                        <option value="disabled" disabled>Impor dari Bank Template (Akan Datang)...</option>
                                    </optgroup>
                                </select>
                                <p className="text-body-sm text-on-surface-variant">Memilih template akan otomatis mengisi seluruh formulir sesuai standar Rencana Tugas Mahasiswa (RPM).</p>
                            </div>
                        )}

                        {/* === SECTION: BASIC === */}
                        {activeSection === 'basic' && (
                            <div className="space-y-5">
                                {/* Judul */}
                                <div className="space-y-2">
                                    <label className="block font-label-md text-on-surface">
                                        Judul Tahap <span className="text-error">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                        placeholder="Contoh: Tahap 1 – Identifikasi Masalah Lingkungan"
                                    />
                                </div>

                                {/* Instruksi Umum */}
                                <div className="space-y-2">
                                    <label className="block font-label-md text-on-surface">
                                        Instruksi / Deskripsi Tugas <span className="text-error">*</span>
                                    </label>
                                    <textarea
                                        name="instructions"
                                        value={formData.instructions}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className={textareaClass}
                                        placeholder="Tuliskan instruksi lengkap untuk mahasiswa dalam tahap ini..."
                                    />
                                </div>

                                {/* Durasi + Jenis Laporan */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="block font-label-md text-on-surface">
                                            Estimasi Durasi (Jam) <span className="text-error">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="duration_hours"
                                            value={formData.duration_hours}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            className={inputClass}
                                            placeholder="Contoh: 20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block font-label-md text-on-surface">
                                            Jenis Laporan yang Diharapkan
                                        </label>
                                        <select
                                            name="report_type"
                                            value={formData.report_type}
                                            onChange={handleChange}
                                            className={inputClass}
                                        >
                                            <option value="text">Teks / Formulir Langsung</option>
                                            <option value="document">Dokumen (PDF/Word)</option>
                                            <option value="image">Gambar / Foto</option>
                                            <option value="link">URL / Link Repository</option>
                                            <option value="identifikasi">Laporan Identifikasi</option>
                                            <option value="perencanaan">Laporan Perencanaan</option>
                                            <option value="proposal">Proposal Bisnis</option>
                                            <option value="prototipe">Laporan Prototipe</option>
                                            <option value="presentasi">Presentasi & Video</option>
                                            <option value="refleksi">Laporan Refleksi</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Bobot */}
                                <div className="space-y-2">
                                    <label className="block font-label-md text-on-surface flex items-center gap-2">
                                        Bobot Nilai (%)
                                        <span className={`font-bold text-lg ${weightColor}`}>{formData.weight}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        step="5"
                                        className="w-full h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between text-on-surface-variant font-label-sm">
                                        <span>0%</span>
                                        <span>50%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* === SECTION: RPM DETAIL === */}
                        {activeSection === 'rpm' && (
                            <div className="space-y-5">
                                {/* Info Box */}
                                <div className="bg-secondary/8 border border-secondary/20 rounded-lg p-4 flex gap-3">
                                    <span className="material-symbols-outlined text-secondary mt-0.5">eco</span>
                                    <div>
                                        <p className="font-label-md text-secondary">Panduan Rencana Pelaksanaan Milestone (RPM)</p>
                                        <p className="font-body-sm text-on-surface-variant mt-1">
                                            Isi detail ini agar mahasiswa mendapatkan panduan lengkap tentang aktivitas, tagihan, format laporan, dan indikator penilaian untuk setiap tahap PjBL.
                                        </p>
                                    </div>
                                </div>

                                {/* Aktivitas Mahasiswa */}
                                <div className="space-y-2">
                                    <label className="block font-label-md text-on-surface">
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">school</span>
                                            Aktivitas Mahasiswa
                                        </span>
                                    </label>
                                    <textarea
                                        name="student_activities"
                                        value={formData.student_activities}
                                        onChange={handleChange}
                                        rows="5"
                                        className={textareaClass}
                                        placeholder="1. Studi literatur tentang...&#10;2. Observasi lapangan atau wawancara...&#10;3. Mengidentifikasi minimal..."
                                    />
                                    <p className="font-label-sm text-on-surface-variant">Gunakan format penomoran (1. 2. 3.) untuk daftar aktivitas.</p>
                                </div>

                                {/* Tagihan LMS */}
                                <div className="space-y-2">
                                    <label className="block font-label-md text-on-surface">
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">upload_file</span>
                                            Tagihan pada LMS (Deliverables)
                                        </span>
                                    </label>
                                    <textarea
                                        name="lms_deliverable"
                                        value={formData.lms_deliverable}
                                        onChange={handleChange}
                                        rows="4"
                                        className={textareaClass}
                                        placeholder="1. Laporan Identifikasi Masalah (PDF, min. 10 halaman)&#10;2. Dokumentasi observasi/wawancara&#10;3. Peta masalah / diagram analisis"
                                    />
                                </div>

                                {/* Format Isi Laporan */}
                                <div className="space-y-2">
                                    <label className="block font-label-md text-on-surface">
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">description</span>
                                            Format Isi Laporan
                                        </span>
                                    </label>
                                    <textarea
                                        name="content_format"
                                        value={formData.content_format}
                                        onChange={handleChange}
                                        rows="6"
                                        className={textareaClass}
                                        placeholder="BAB I PENDAHULUAN&#10;- Latar Belakang&#10;- Tujuan&#10;BAB II ...&#10;BAB III ...&#10;PENUTUP"
                                    />
                                    <p className="font-label-sm text-on-surface-variant">Tuliskan struktur/outline laporan yang harus dibuat mahasiswa.</p>
                                </div>

                                {/* Indikator Penilaian */}
                                <div className="space-y-2">
                                    <label className="block font-label-md text-on-surface">
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">grade</span>
                                            Indikator Penilaian
                                        </span>
                                    </label>
                                    <textarea
                                        name="assessment_indicators"
                                        value={formData.assessment_indicators}
                                        onChange={handleChange}
                                        rows="4"
                                        className={textareaClass}
                                        placeholder="1. Ketepatan identifikasi masalah (30%)&#10;2. Kedalaman analisis (30%)&#10;3. Kualitas dokumentasi (20%)&#10;4. Kesesuaian potensi lokal (20%)"
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-between items-center">
                    <div className="flex items-center gap-2 text-on-surface-variant font-label-sm">
                        <span className="material-symbols-outlined text-[16px]">balance</span>
                        Bobot tahap ini: <span className={`font-semibold ml-1 ${weightColor}`}>{formData.weight}%</span>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-label-md text-on-surface-variant hover:bg-outline-variant/20 transition-colors">
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="milestoneForm"
                            className="bg-primary text-white px-6 py-2.5 rounded-lg font-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            Simpan Milestone
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MilestoneModal;
