import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import MaterialModal from '../components/molecules/MaterialModal';
import QuizModal from '../components/molecules/QuizModal';
import MilestoneModal from '../components/molecules/MilestoneModal';
import ModuleModal from '../components/molecules/ModuleModal';
import { GREENPRENEURSHIP_TEMPLATES } from '../constants/pjblTemplates';

const CourseForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'curriculum', 'milestones'
    const [isLoading, setIsLoading] = useState(isEditing);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    
    // Course Basic Data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        level: '',
        duration: '',
        is_published: false,
        image: '',
        imagePreview: ''
    });
    const [imageFile, setImageFile] = useState(null);

    // Curriculum Data
    const [modules, setModules] = useState([]);
    
    // PBL Data
    const [pblData, setPblData] = useState({
        title: '',
        description: '',
        target_audience: '',
        report_requirements: ''
    });
    const [isSavingPbl, setIsSavingPbl] = useState(false);
    
    // Milestones Data
    const [milestones, setMilestones] = useState([]);

    // Modal States
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [activeModuleForModal, setActiveModuleForModal] = useState(null);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState(null);

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchCourseData();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
            if (!isEditing && res.data.length > 0) {
                setFormData(prev => ({ ...prev, category_id: res.data[0].id }));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCourseData = async () => {
        try {
            const res = await api.get(`/courses/${id}`);
            const c = res.data;
            setFormData({
                title: c.title || '',
                description: c.description || '',
                category_id: c.category_id || '',
                level: c.level || '',
                duration: c.duration || '',
                is_published: !!c.is_published,
                image: c.image || '',
                imagePreview: c.image || ''
            });
            setModules(c.modules || []);
            setMilestones(c.milestones || []);
            if (c.pbl_detail) {
                setPblData({
                    title: c.pbl_detail.title || '',
                    description: c.pbl_detail.description || '',
                    target_audience: c.pbl_detail.target_audience || '',
                    report_requirements: c.pbl_detail.report_requirements || ''
                });
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            alert('Gagal memuat detail kursus');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Basic Info Handlers ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB
                alert('Ukuran file maksimal adalah 10MB.');
                e.target.value = null; // reset input
                return;
            }
            setImageFile(file);
            setFormData(prev => ({ ...prev, imagePreview: URL.createObjectURL(file) }));
        }
    };

    const handleSaveBasic = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description || '');
            submitData.append('category_id', formData.category_id);
            submitData.append('level', formData.level || '');
            submitData.append('is_published', formData.is_published ? '1' : '0');
            
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            if (isEditing) {
                submitData.append('_method', 'PUT');
                await api.post(`/courses/${id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Informasi kursus berhasil diperbarui.');
            } else {
                const res = await api.post('/courses', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                navigate(`/dashboard/manager/edit/${res.data.id}`);
            }
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Gagal menyimpan kursus. Periksa konsol untuk detailnya.');
        } finally {
            setIsSaving(false);
        }
    };

    // --- Curriculum Handlers ---
    const handleAddModule = () => {
        setIsModuleModalOpen(true);
    };

    const handleSaveModule = async (moduleData) => {
        try {
            const res = await api.post('/modules', {
                course_id: id,
                title: moduleData.title,
                sequence: modules.length + 1
            });
            setModules([...modules, res.data]);
            setIsModuleModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('Gagal menambahkan modul');
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (!window.confirm('Hapus modul ini?')) return;
        try {
            await api.delete(`/modules/${moduleId}`);
            setModules(modules.filter(m => m.id !== moduleId));
        } catch (error) {
            console.error(error);
            alert('Gagal menghapus modul');
        }
    };

    const openMaterialModal = (module) => {
        setEditingMaterial(null);
        setActiveModuleForModal(module);
        setIsMaterialModalOpen(true);
    };

    const openEditMaterialModal = (module, material) => {
        setEditingMaterial(material);
        setActiveModuleForModal(module);
        setIsMaterialModalOpen(true);
    };

    const handleSaveMaterial = async (materialData) => {
        try {
            const moduleId = activeModuleForModal.id;
            let res;
            if (editingMaterial) {
                res = await api.put(`/materials/${editingMaterial.id}`, materialData);
                setModules(modules.map(mod => {
                    if (mod.id === moduleId) {
                        return { 
                            ...mod, 
                            materials: mod.materials.map(m => m.id === editingMaterial.id ? res.data : m)
                        };
                    }
                    return mod;
                }));
            } else {
                const sequence = activeModuleForModal.materials ? activeModuleForModal.materials.length + 1 : 1;
                res = await api.post('/materials', {
                    module_id: moduleId,
                    ...materialData,
                    sequence: sequence
                });
                setModules(modules.map(mod => {
                    if (mod.id === moduleId) {
                        return { ...mod, materials: [...(mod.materials || []), res.data] };
                    }
                    return mod;
                }));
            }
            setIsMaterialModalOpen(false);
            setEditingMaterial(null);
        } catch (error) {
            console.error(error);
            alert('Gagal menyimpan materi');
        }
    };
            
    const openQuizModal = (module) => {
        setEditingQuiz(null);
        setActiveModuleForModal(module);
        setIsQuizModalOpen(true);
    };

    const openEditQuizModal = (module, quiz) => {
        setEditingQuiz(quiz);
        setActiveModuleForModal(module);
        setIsQuizModalOpen(true);
    };

    const handleSaveQuiz = async (quizData) => {
        try {
            const moduleId = activeModuleForModal.id;
            let res;
            if (editingQuiz) {
                res = await api.put(`/quizzes/${editingQuiz.id}`, quizData);
            } else {
                res = await api.post(`/modules/${moduleId}/quizzes`, quizData);
            }
            
            setModules(modules.map(mod => {
                if (mod.id === moduleId) {
                    return { ...mod, quiz: res.data.quiz || res.data };
                }
                return mod;
            }));
            setIsQuizModalOpen(false);
            setEditingQuiz(null);
        } catch (error) {
            console.error(error);
            alert('Gagal menyimpan kuis');
        }
    };

    // --- PBL Master Handlers ---
    const handlePblChange = (e) => {
        const { name, value } = e.target;
        setPblData(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePbl = async (e) => {
        e.preventDefault();
        setIsSavingPbl(true);
        try {
            await api.post(`/courses/${id}/pbl`, pblData);
            alert('Konfigurasi PjBL berhasil disimpan.');
        } catch (error) {
            console.error('Error saving PBL:', error);
            alert('Gagal menyimpan Konfigurasi PjBL.');
        } finally {
            setIsSavingPbl(false);
        }
    };

    // --- Milestones Handlers ---
    const openAddMilestoneModal = () => {
        setEditingMilestone(null);
        setIsMilestoneModalOpen(true);
    };

    const openEditMilestoneModal = (milestone) => {
        setEditingMilestone(milestone);
        setIsMilestoneModalOpen(true);
    };

    const handleSaveMilestone = async (milestoneData) => {
        try {
            if (editingMilestone) {
                await api.put(`/milestones/${editingMilestone.id}`, milestoneData);
            } else {
                await api.post('/milestones', {
                    ...milestoneData,
                    course_id: id,
                    sequence: milestones.length + 1
                });
            }
            setIsMilestoneModalOpen(false);
            fetchCourseData();
        } catch (error) {
            console.error(error);
            alert('Gagal menyimpan milestone');
        }
    };

    const handleGenerateGreenpreneurship = async () => {
        if (!window.confirm('Apakah Anda yakin ingin men-generate 6 Tahap PjBL Greenpreneurship? Ini akan menambahkan 6 tahapan secara berurutan.')) return;
        
        try {
            setIsLoading(true);
            // Add all templates sequentially
            for (let i = 0; i < GREENPRENEURSHIP_TEMPLATES.length; i++) {
                const template = GREENPRENEURSHIP_TEMPLATES[i];
                await api.post('/milestones', {
                    ...template,
                    course_id: id,
                    sequence: milestones.length + 1 + i
                });
            }
            await fetchCourseData();
            alert('6 Tahap PjBL berhasil di-generate!');
        } catch (error) {
            console.error('Error generating templates:', error);
            alert('Gagal men-generate template PjBL.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMilestone = async (milestoneId) => {
        if (!window.confirm('Hapus tahapan ini?')) return;
        try {
            await api.delete(`/milestones/${milestoneId}`);
            setMilestones(milestones.filter(m => m.id !== milestoneId));
        } catch (error) {
            console.error(error);
            alert('Gagal menghapus milestone');
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                <p className="text-label-sm text-on-surface-variant">Memuat data kurikulum...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/manager" className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="font-headline-xl text-headline-xl text-primary">{isEditing ? 'Pengembang Kursus' : 'Buat Kursus Baru'}</h2>
                        <p className="font-body-md text-on-surface-variant mt-1">
                            {isEditing ? `Kelola kurikulum untuk: ${formData.title}` : 'Atur info dasar untuk modul kursus baru Anda.'}
                        </p>
                    </div>
                </div>
                {isEditing && (
                    <div className="flex bg-surface-container rounded-lg p-1">
                        <button 
                            onClick={() => setActiveTab('basic')}
                            className={`px-4 py-2 rounded-lg font-label-md transition-colors ${activeTab === 'basic' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                        >
                            Info Dasar
                        </button>
                        <button 
                            onClick={() => setActiveTab('curriculum')}
                            className={`px-4 py-2 rounded-lg font-label-md transition-colors ${activeTab === 'curriculum' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                        >
                            Kurikulum
                        </button>
                        <button 
                            onClick={() => setActiveTab('milestones')}
                            className={`px-4 py-2 rounded-lg font-label-md transition-colors ${activeTab === 'milestones' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                        >
                            Tahapan PjBL
                        </button>
                    </div>
                )}
            </div>

            {/* TAB: BASIC INFO */}
            {activeTab === 'basic' && (
                <form onSubmit={handleSaveBasic} className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg p-8 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="block font-label-md text-on-surface">Judul Kursus</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="block font-label-md text-on-surface">Deskripsi</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-on-surface">Kategori</label>
                            <select name="category_id" value={formData.category_id} onChange={handleChange} required className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-on-surface">Tingkat / Area Fokus</label>
                            <input type="text" name="level" value={formData.level} onChange={handleChange} required className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-on-surface">Total Durasi (Dihitung Otomatis)</label>
                            <input 
                                type="text" 
                                value={formData.duration ? `${formData.duration} Jam` : 'Belum dihitung'} 
                                disabled 
                                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-lg text-on-surface-variant cursor-not-allowed" 
                            />
                            <p className="text-xs text-on-surface-variant">Berdasarkan durasi materi dan tahapan PBL.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-on-surface">Gambar Miniatur Kursus (Maks 10MB)</label>
                            <input 
                                type="file" 
                                name="image" 
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                onChange={handleImageChange} 
                                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                            />
                            {formData.imagePreview && (
                                <div className="mt-4 p-2 border border-outline-variant rounded-lg inline-block">
                                    <p className="text-xs text-on-surface-variant mb-2">Pratinjau (Dipotong otomatis 16:9 saat unggah):</p>
                                    <img src={formData.imagePreview} alt="Pratinjau Gambar Kursus" className="h-32 rounded object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-outline-variant">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative flex items-center">
                                <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="w-5 h-5 border-2 border-outline-variant rounded text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer" />
                            </div>
                            <div>
                                <p className="font-label-md text-on-surface">Terbitkan Kursus</p>
                                <p className="text-xs text-on-surface-variant">Buat kursus ini dapat dilihat oleh mahasiswa di katalog.</p>
                            </div>
                        </label>
                    </div>

                    <div className="pt-6 flex justify-end gap-4">
                        <button type="submit" disabled={isSaving} className="bg-primary text-white px-8 py-3 rounded-lg font-label-md hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm">
                            {isSaving ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : <span className="material-symbols-outlined text-[18px]">save</span>}
                            {isEditing ? 'Simpan Perubahan' : 'Buat & Lanjutkan ke Kurikulum'}
                        </button>
                    </div>
                </form>
            )}

            {/* TAB: CURRICULUM */}
            {activeTab === 'curriculum' && (
                <div className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg p-8 shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b border-outline-variant pb-4">
                        <div>
                            <h3 className="font-headline-md text-primary">Modul & Materi</h3>
                            <p className="text-on-surface-variant font-body-sm mt-1">Bangun struktur kursus Anda dengan menambahkan modul, materi bacaan, dan kuis.</p>
                        </div>
                        <button onClick={handleAddModule} className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg font-label-sm hover:bg-primary/20 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">add</span> Tambah Modul
                        </button>
                    </div>

                    <div className="space-y-4">
                        {modules.length === 0 ? (
                            <div className="text-center py-10 bg-surface-container-lowest border border-dashed border-outline-variant rounded-lg text-on-surface-variant">
                                Belum ada modul yang dibuat. Klik "Tambah Modul" untuk memulai.
                            </div>
                        ) : modules.map((mod, index) => (
                            <div key={mod.id} className="border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest">
                                <div className="bg-surface-container-low px-6 py-4 flex justify-between items-center border-b border-outline-variant">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">{index + 1}</div>
                                        <h4 className="font-label-lg text-on-surface font-bold">{mod.title}</h4>
                                    </div>
                                    <button onClick={() => handleDeleteModule(mod.id)} className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Materials List */}
                                    <div className="space-y-2">
                                        {mod.materials && mod.materials.length > 0 ? mod.materials.map((mat, mIndex) => (
                                            <div key={mat.id} className="flex justify-between items-center p-3 border border-outline-variant rounded-lg bg-white group">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-secondary">article</span>
                                                    <span className="font-body-md text-on-surface">{mat.title}</span>
                                                </div>
                                                <button onClick={() => openEditMaterialModal(mod, mat)} className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100">
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                            </div>
                                        )) : (
                                            <p className="text-sm text-on-surface-variant italic">Belum ada materi yang ditambahkan.</p>
                                        )}
                                    </div>
                                    
                                    {/* Quiz List */}
                                    {mod.quiz && (
                                        <div className="flex justify-between items-center p-3 border border-tertiary/30 bg-tertiary-container/10 rounded-lg group">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-tertiary">quiz</span>
                                                <span className="font-body-md text-on-surface font-bold">{mod.quiz.title}</span>
                                            </div>
                                            <button onClick={() => openEditQuizModal(mod, mod.quiz)} className="text-on-surface-variant hover:text-tertiary transition-colors p-1 opacity-0 group-hover:opacity-100">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Module Actions */}
                                    <div className="flex gap-3 pt-4 border-t border-outline-variant/50">
                                        <button onClick={() => openMaterialModal(mod)} className="text-primary font-label-sm hover:underline flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">add_box</span> Tambah Materi
                                        </button>
                                        {!mod.quiz && (
                                            <button onClick={() => openQuizModal(mod)} className="text-tertiary font-label-sm hover:underline flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">add_box</span> Tambah Kuis
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB: MILESTONES */}
            {activeTab === 'milestones' && (
                <div className="space-y-6">
                    {/* Master PBL Configuration Form */}
                    <form onSubmit={handleSavePbl} className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg p-8 shadow-sm space-y-6">
                        <div className="border-b border-outline-variant pb-4">
                            <h3 className="font-headline-md text-primary">Konfigurasi Proyek Utama</h3>
                            <p className="text-on-surface-variant font-body-sm mt-1">Tentukan detail proyek utama, target, dan persyaratan pelaporan untuk kursus ini.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="block font-label-md text-on-surface">Judul Proyek</label>
                                <input type="text" name="title" value={pblData.title} onChange={handlePblChange} required className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all" placeholder="Contoh: Pengolahan Limbah Kulit Apel Menjadi Vegan Leather" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="block font-label-md text-on-surface">Deskripsi & Tujuan</label>
                                <textarea name="description" value={pblData.description} onChange={handlePblChange} required rows="3" className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all resize-none" placeholder="Jelaskan tujuan utama proyek ini..." />
                            </div>
                            <div className="space-y-2">
                                <label className="block font-label-md text-on-surface">Sasaran / Target Audiens</label>
                                <input type="text" name="target_audience" value={pblData.target_audience} onChange={handlePblChange} required className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all" placeholder="Contoh: UMKM lokal di sektor fesyen" />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="block font-label-md text-on-surface">Persyaratan Laporan (Hasil Akhir)</label>
                                <textarea name="report_requirements" value={pblData.report_requirements} onChange={handlePblChange} required rows="3" className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all resize-none" placeholder="Contoh: Laporan akhir harus dalam format PDF, berisi..." />
                            </div>
                        </div>
                        
                        <div className="pt-2 flex justify-end">
                            <button type="submit" disabled={isSavingPbl} className="bg-primary text-white px-6 py-2.5 rounded-lg font-label-md hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm">
                                {isSavingPbl ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : <span className="material-symbols-outlined text-[18px]">save</span>}
                                Simpan Konfigurasi Proyek
                            </button>
                        </div>
                    </form>

                    {/* Milestones List */}
                    <div className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-lg p-8 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b border-outline-variant pb-4">
                            <div>
                                <h3 className="font-headline-md text-primary">Tahapan Proyek (Milestone)</h3>
                                <p className="text-on-surface-variant font-body-sm mt-1">Tentukan tahapan demi tahapan untuk proyek di atas.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleGenerateGreenpreneurship} type="button" className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg font-label-sm hover:bg-primary/20 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span> Generate 6 Tahap
                                </button>
                                <button onClick={openAddMilestoneModal} type="button" className="bg-secondary/10 text-secondary border border-secondary/20 px-4 py-2 rounded-lg font-label-sm hover:bg-secondary/20 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">add</span> Tambah Tahapan
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {milestones.length === 0 ? (
                                <div className="text-center py-10 bg-surface-container-lowest border border-dashed border-outline-variant rounded-lg text-on-surface-variant">
                                    Belum ada tahapan yang dibuat. Klik "Tambah Tahapan" untuk memulai.
                                </div>
                            ) : milestones.map((mile, index) => (
                                <div key={mile.id} className="border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-10 h-10 rounded bg-secondary-container text-on-secondary-container flex flex-col items-center justify-center font-bold flex-shrink-0">
                                            <span className="text-[10px] uppercase">Tahap</span>
                                            <span>{index + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-label-lg text-on-surface font-bold">{mile.title}</h4>
                                                <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] uppercase font-bold text-on-surface-variant">
                                                    {mile.duration_hours} Jam
                                                </span>
                                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                                                    Laporan: {mile.report_type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-on-surface-variant line-clamp-2 mt-1">{mile.instructions}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button onClick={() => openEditMilestoneModal(mile)} className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button onClick={() => handleDeleteMilestone(mile.id)} className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ModuleModal 
                isOpen={isModuleModalOpen}
                onClose={() => setIsModuleModalOpen(false)}
                onSave={handleSaveModule}
            />

            <MaterialModal 
                isOpen={isMaterialModalOpen} 
                onClose={() => { setIsMaterialModalOpen(false); setEditingMaterial(null); }} 
                onSave={handleSaveMaterial} 
                moduleTitle={activeModuleForModal?.title} 
                initialData={editingMaterial}
            />
            
            <QuizModal 
                isOpen={isQuizModalOpen} 
                onClose={() => { setIsQuizModalOpen(false); setEditingQuiz(null); }} 
                onSave={handleSaveQuiz} 
                moduleTitle={activeModuleForModal?.title} 
                initialData={editingQuiz}
            />
            
            <MilestoneModal 
                isOpen={isMilestoneModalOpen}
                onClose={() => { setIsMilestoneModalOpen(false); setEditingMilestone(null); }}
                onSave={handleSaveMilestone}
                initialData={editingMilestone}
            />
        </div>
    );
};

export default CourseForm;
