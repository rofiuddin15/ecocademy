import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';

const StudentDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [coursesRes, projectsRes] = await Promise.all([
                    api.get('/courses'),
                    api.get('/projects')
                ]);
                setCourses(coursesRes.data);
                setProjects(projectsRes.data);
            } catch (error) {
                console.error('Error fetching student dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Get active project
    const activeProject = projects.length > 0 ? projects[0] : null;

    // Helper to determine growth tracker nodes dynamically based on project submissions
    const getMilestoneStatus = (sequence) => {
        if (!activeProject) {
            // Default mock states if no project exists in the DB
            if (sequence === 1) return 'completed';
            if (sequence === 2) return 'active';
            return 'upcoming';
        }

        const submissions = activeProject.submissions || [];
        const hasSubmission = submissions.some(sub => sub.milestone && sub.milestone.sequence === sequence);
        
        if (hasSubmission) {
            return 'completed';
        }

        // Active node is the first incomplete node
        const completedSequences = submissions
            .map(sub => sub.milestone ? sub.milestone.sequence : null)
            .filter(Boolean);
        
        const nextActiveSequence = [1, 2, 3, 4].find(seq => !completedSequences.includes(seq)) || 1;
        
        if (sequence === nextActiveSequence) {
            return 'active';
        }

        return 'upcoming';
    };

    // Helper to map course to design mock data (progress, icon, custom title)
    const getCourseMetadata = (title) => {
        const t = title.toLowerCase();
        if (t.includes('desain') || t.includes('design')) {
            return { progress: 45, icon: 'architecture', label: 'Sustainable Product Design' };
        }
        if (t.includes('ekonomi') || t.includes('circular')) {
            return { progress: 12, icon: 'recycling', label: 'Circular Economy 101' };
        }
        if (t.includes('pemasaran') || t.includes('marketing')) {
            return { progress: 88, icon: 'campaign', label: 'Green Marketing Strategies' };
        }
        return { progress: 0, icon: 'school', label: title };
    };

    const checkIsEnrolled = (courseId, title) => {
        const enrolledStorage = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
        const isLocallyEnrolled = enrolledStorage.includes(String(courseId));
        
        const t = title.toLowerCase();
        const isDefaultEnrolled = ['desain', 'design', 'ekonomi', 'circular', 'pemasaran', 'marketing'].some(k => t.includes(k));
        
        return isLocallyEnrolled || isDefaultEnrolled;
    };

    const enrolledCourses = courses.filter(course => checkIsEnrolled(course.id, course.title));
    const availableCourses = courses.filter(course => !checkIsEnrolled(course.id, course.title));

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                <p className="text-label-sm text-on-surface-variant">Memuat dashboard mahasiswa...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Hero Greeting */}
            <section className="mb-12">
                <h2 className="font-headline-xl text-headline-xl text-primary mb-2 transition-all hover:translate-x-1 duration-300">
                    Welcome back, Eco-Warrior!
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Your journey to digital stewardship continues. {activeProject ? '1' : '2'} projects need your attention today.
                </p>
            </section>

            <div className="grid grid-cols-12 gap-8">
                {/* Active Project Section & Enrolled Courses (Left Column) */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* Active Project Card (Bento Style) */}
                    <div className="bg-white rounded-lg border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="relative h-48 overflow-hidden">
                            <img 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWegNJh0Yw4pFj94l7o6JKDKx2n21rnwNtYhOaNYoBUudIevgu6Chq0knKEBC_pXCFKRfNMFV_RPT4J-VWd3A5SAwfuT4G1CQy9nwdH0kQLoDMVrYPPEQhntldeJLdF5stzxMc3qXg44qd6ugO90GIEkjF0GQH4myu8tg25d26Tu-dibUCFq7myevyi65bClBnwGMoC5EnG2Ui0Es-sp0py0c-5SrnZNNZgjI-mqszLRu-DpkWm9KXVF6nKikcmVj6kAagjOvf6A7B" 
                                alt="Culinary packaging" 
                            />
                            <div className="absolute top-4 right-4 bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider">
                                Sustainability Score: {activeProject ? (activeProject.course?.score || 92) : 92}
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-headline-md text-headline-md text-primary mb-2">
                                        {activeProject ? activeProject.title : 'Eco-Waste Solution for Kuliner Sehat UMKM'}
                                    </h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant">
                                        {activeProject 
                                            ? `Mengembangkan sistem closed-loop bersama ${activeProject.umkm_name} (${activeProject.umkm_sector}).`
                                            : 'Building a circular economy pipeline for local organic eateries.'}
                                    </p>
                                </div>
                                <span className="bg-primary-fixed text-on-primary-fixed px-4 py-1.5 rounded-lg font-label-md text-label-md shrink-0">
                                    Project-Based Learning
                                </span>
                            </div>

                            {/* Growth Line Tracker */}
                            <div className="mt-8">
                                <div className="flex items-center justify-between relative mb-4">
                                    {/* Background Track Line */}
                                    <div className="absolute h-1 top-1/2 -translate-y-1/2 left-0 right-0 bg-secondary-container"></div>
                                    {/* Active Track Line progress */}
                                    <div 
                                        className="absolute h-1 top-1/2 -translate-y-1/2 left-0 bg-primary-container transition-all duration-1000"
                                        style={{ 
                                            width: activeProject 
                                                ? `${((activeProject.submissions?.length || 0) / 4) * 100}%` 
                                                : '33.33%' 
                                        }}
                                    ></div>

                                    {/* Nodes */}
                                    {/* Step 1: Formulation */}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                                            getMilestoneStatus(1) === 'completed'
                                                ? 'bg-primary-container text-white'
                                                : getMilestoneStatus(1) === 'active'
                                                ? 'bg-white border-4 border-primary text-primary'
                                                : 'bg-white border-2 border-outline-variant text-outline'
                                        }`}>
                                            {getMilestoneStatus(1) === 'completed' ? (
                                                <span className="material-symbols-outlined text-lg">check</span>
                                            ) : getMilestoneStatus(1) === 'active' ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                                            ) : (
                                                <span className="font-label-md text-label-md">01</span>
                                            )}
                                        </div>
                                        <span className={`font-label-sm text-label-sm mt-2 ${
                                            getMilestoneStatus(1) !== 'upcoming' ? 'text-primary font-bold' : 'text-on-surface-variant'
                                        }`}>Formulation</span>
                                    </div>

                                    {/* Step 2: Planning */}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                                            getMilestoneStatus(2) === 'completed'
                                                ? 'bg-primary-container text-white'
                                                : getMilestoneStatus(2) === 'active'
                                                ? 'bg-white border-4 border-primary text-primary'
                                                : 'bg-white border-2 border-outline-variant text-outline'
                                        }`}>
                                            {getMilestoneStatus(2) === 'completed' ? (
                                                <span className="material-symbols-outlined text-lg">check</span>
                                            ) : getMilestoneStatus(2) === 'active' ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                                            ) : (
                                                <span className="font-label-md text-label-md">02</span>
                                            )}
                                        </div>
                                        <span className={`font-label-sm text-label-sm mt-2 ${
                                            getMilestoneStatus(2) !== 'upcoming' ? 'text-primary font-bold' : 'text-on-surface-variant'
                                        }`}>Planning</span>
                                    </div>

                                    {/* Step 3: Execution */}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                                            getMilestoneStatus(3) === 'completed'
                                                ? 'bg-primary-container text-white'
                                                : getMilestoneStatus(3) === 'active'
                                                ? 'bg-white border-4 border-primary text-primary'
                                                : 'bg-white border-2 border-outline-variant text-outline'
                                        }`}>
                                            {getMilestoneStatus(3) === 'completed' ? (
                                                <span className="material-symbols-outlined text-lg">check</span>
                                            ) : getMilestoneStatus(3) === 'active' ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                                            ) : (
                                                <span className="font-label-md text-label-md">03</span>
                                            )}
                                        </div>
                                        <span className={`font-label-sm text-label-sm mt-2 ${
                                            getMilestoneStatus(3) !== 'upcoming' ? 'text-primary font-bold' : 'text-on-surface-variant'
                                        }`}>Execution</span>
                                    </div>

                                    {/* Step 4: Impact */}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                                            getMilestoneStatus(4) === 'completed'
                                                ? 'bg-primary-container text-white'
                                                : getMilestoneStatus(4) === 'active'
                                                ? 'bg-white border-4 border-primary text-primary'
                                                : 'bg-white border-2 border-outline-variant text-outline'
                                        }`}>
                                            {getMilestoneStatus(4) === 'completed' ? (
                                                <span className="material-symbols-outlined text-lg">check</span>
                                            ) : getMilestoneStatus(4) === 'active' ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                                            ) : (
                                                <span className="font-label-md text-label-md">04</span>
                                            )}
                                        </div>
                                        <span className={`font-label-sm text-label-sm mt-2 ${
                                            getMilestoneStatus(4) !== 'upcoming' ? 'text-primary font-bold' : 'text-on-surface-variant'
                                        }`}>Impact</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex gap-4">
                                <Link 
                                    to={activeProject ? `/dashboard/courses/${activeProject.course_id}/project` : '#'}
                                    className="bg-primary text-white px-8 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                                    Continue Planning
                                </Link>
                                <Link 
                                    to={activeProject ? `/dashboard/courses/${activeProject.course_id}` : '#'}
                                    className="border border-primary text-primary px-8 py-3 rounded-lg font-label-md text-label-md hover:bg-primary-fixed/5 transition-all"
                                >
                                    View Project Brief
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Enrolled Courses Grid */}
                    {enrolledCourses.length > 0 && (
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[24px]">school</span>
                                    Kursus yang Diikuti ({enrolledCourses.length})
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {enrolledCourses.map((course) => {
                                    const meta = getCourseMetadata(course.title);
                                    return (
                                        <Link 
                                            key={course.id}
                                            to={`/dashboard/courses/${course.id}`}
                                            className="bg-white rounded-lg border border-outline-variant overflow-hidden hover:shadow-md hover:border-primary transition-all flex flex-col justify-between cursor-pointer group"
                                        >
                                            <div>
                                                <div className="relative aspect-[16/9] w-full overflow-hidden">
                                                    <img 
                                                        src={course.image || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80'} 
                                                        alt={course.title} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-3 right-3 bg-secondary text-on-secondary px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                                        {course.score || 95} Poin Hijau
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">
                                                        {course.category?.name || 'Umum'}
                                                    </span>
                                                    <h4 className="font-label-md text-label-md text-on-surface mb-2 font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                        {meta.label}
                                                    </h4>
                                                    <p className="text-body-sm text-on-surface-variant line-clamp-2">
                                                        {course.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-5 pt-4 flex items-center justify-between border-t border-outline-variant/10 mt-auto bg-surface-container-lowest">
                                                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Progress: {meta.progress}%</span>
                                                <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${meta.progress}%` }}></div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Available Courses Grid */}
                    {availableCourses.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[24px]">explore</span>
                                    Kursus yang Tersedia ({availableCourses.length})
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {availableCourses.map((course) => {
                                    return (
                                        <Link 
                                            key={course.id}
                                            to={`/dashboard/courses/${course.id}`}
                                            className="bg-white rounded-lg border border-outline-variant overflow-hidden hover:shadow-md hover:border-primary transition-all flex flex-col justify-between cursor-pointer group"
                                        >
                                            <div>
                                                <div className="relative aspect-[16/9] w-full overflow-hidden">
                                                    <img 
                                                        src={course.image || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80'} 
                                                        alt={course.title} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-3 right-3 bg-primary text-on-primary px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                                        {course.level || 'Semua Tingkat'}
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">
                                                        {course.category?.name || 'Umum'}
                                                    </span>
                                                    <h4 className="font-label-md text-label-md text-on-surface mb-2 font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                        {course.title}
                                                    </h4>
                                                    <p className="text-body-sm text-on-surface-variant line-clamp-2">
                                                        {course.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-5 pt-4 flex items-center justify-between border-t border-outline-variant/10 mt-auto bg-surface-container-lowest">
                                                <div className="flex items-center gap-1.5 text-label-sm text-secondary font-bold">
                                                    <span className="material-symbols-outlined text-[16px] text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span>{course.rating || '4.8'}</span>
                                                </div>
                                                <span className="text-primary font-bold text-label-sm hover:underline flex items-center gap-1">
                                                    Gabung Kelas
                                                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Column (Right Column) */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    {/* Upcoming Deadlines */}
                    <div className="bg-white p-8 rounded-lg border border-outline-variant shadow-sm">
                        <h3 className="font-headline-md text-headline-md text-primary mb-6">Upcoming Deadlines</h3>
                        <div className="space-y-6">
                            {activeProject && activeProject.course && activeProject.course.milestones ? (
                                activeProject.course.milestones.map((milestone, idx) => {
                                    const isCompleted = getMilestoneStatus(milestone.sequence) === 'completed';
                                    if (isCompleted) return null;
                                    const date = new Date(milestone.due_date || Date.now() + 86400000);
                                    return (
                                        <div key={idx} className="flex gap-4 p-3 rounded-lg hover:bg-surface-container transition-colors group">
                                            <div className="flex-shrink-0 w-12 h-12 bg-surface-container text-on-surface-variant rounded-lg flex flex-col items-center justify-center">
                                                <span className="font-label-md text-label-md leading-none font-bold">{date.getDate()}</span>
                                                <span className="text-[10px] uppercase font-bold">{date.toLocaleString('default', { month: 'short' })}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-label-md text-label-md text-on-surface group-hover:text-secondary transition-colors font-bold">{milestone.title}</h4>
                                                <p className="font-label-sm text-label-sm text-on-surface-variant">{activeProject.title}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-on-surface-variant">Tidak ada tenggat waktu dalam waktu dekat.</p>
                            )}
                        </div>
                        <button className="w-full mt-8 py-3 font-label-md text-label-md text-primary bg-primary-fixed/20 rounded-lg hover:bg-primary-fixed/40 transition-colors font-bold">
                            Full Calendar View
                        </button>
                    </div>

                    {/* UMKM Spotlight */}
                    {activeProject && activeProject.umkm_name ? (
                        <div className="bg-primary-container rounded-lg p-8 text-primary-fixed relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-symbols-outlined text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md mb-2 relative z-10 text-white font-bold">Partner Spotlight</h3>
                            <p className="font-body-md text-body-md opacity-80 mb-6 relative z-10 text-slate-300">
                                Meet {activeProject.umkm_name}, our partner in {activeProject.umkm_sector}.
                            </p>
                            <button className="bg-white text-primary px-6 py-2.5 rounded-lg font-label-md text-label-md relative z-10 hover:shadow-lg transition-all font-bold">
                                View Project Details
                            </button>
                        </div>
                    ) : (
                        <div className="bg-surface-container rounded-lg p-8 text-on-surface relative overflow-hidden border border-outline-variant">
                            <h3 className="font-headline-md text-headline-md mb-2 relative z-10 font-bold">UMKM Network</h3>
                            <p className="font-body-md text-body-md text-on-surface-variant mb-6 relative z-10">
                                Daftar ke proyek PBL untuk berkolaborasi dengan mitra UMKM kami.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
