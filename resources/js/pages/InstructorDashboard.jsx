import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';

const InstructorDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch projects to populate the monitoring table
                const projectsRes = await api.get('/projects');
                setProjects(projectsRes.data);
            } catch (error) {
                console.error('Error fetching instructor dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                <p className="text-label-sm text-on-surface-variant">Memuat dashboard instruktur...</p>
            </div>
        );
    }

    // Filter projects that need review (just mock logic for now)
    const needsReviewCount = projects.filter(p => Math.random() > 0.5).length;

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <p className="text-primary font-label-md text-label-md mb-2">Welcome back, {user?.name || 'Instructor'}</p>
                    <h2 className="font-headline-xl text-headline-xl text-primary">Instructor Monitoring</h2>
                </div>
                <div className="bg-primary-container text-on-primary-container px-6 py-4 rounded-xl flex items-center gap-4 border border-primary/20 shadow-sm">
                    <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                    <div>
                        <p className="font-label-sm text-label-sm uppercase tracking-wider opacity-80">Academy Impact Score</p>
                        <p className="font-headline-md text-headline-md font-bold">92.4</p>
                    </div>
                </div>
            </div>

            {/* Bento Grid: Stats & Map */}
            <div className="grid grid-cols-12 gap-6 mb-10">
                {/* Stat Cards */}
                <div className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant p-6 rounded-xl flex flex-col justify-between h-40 shadow-sm">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-primary bg-primary-fixed/20 p-2 rounded-lg">rocket_launch</span>
                        <span className="text-on-surface-variant font-label-sm">+2 this week</span>
                    </div>
                    <div>
                        <p className="text-on-surface-variant font-label-sm">Active Projects</p>
                        <p className="text-primary font-headline-lg text-headline-lg font-bold">{projects.length || 12}</p>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant p-6 rounded-xl flex flex-col justify-between h-40 shadow-sm border-l-4 border-l-secondary">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-secondary bg-secondary-container/20 p-2 rounded-lg">pending_actions</span>
                        <span className="text-error font-label-md font-bold">Priority</span>
                    </div>
                    <div>
                        <p className="text-on-surface-variant font-label-sm">Needs Review</p>
                        <p className="text-primary font-headline-lg text-headline-lg font-bold">{needsReviewCount || '05'}</p>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant p-6 rounded-xl flex flex-col justify-between h-40 shadow-sm">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-tertiary bg-tertiary-fixed/40 p-2 rounded-lg">handshake</span>
                        <span className="text-on-surface-variant font-label-sm">Partnered</span>
                    </div>
                    <div>
                        <p className="text-on-surface-variant font-label-sm">Partner UMKM</p>
                        <p className="text-primary font-headline-lg text-headline-lg font-bold">08</p>
                    </div>
                </div>

                {/* Map Summary */}
                <div className="col-span-12 md:col-span-3 bg-white/80 backdrop-blur-md border border-outline-variant overflow-hidden rounded-xl h-40 relative group cursor-pointer shadow-sm">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCFqZe-hTRGRXmjr9XZ0_EVyyJ3QgA6PTBK9eRxVR8hjxG-YpAldWMVP5Du3df3J8Y9H8xcyrMphvxUai6HZt5Oz5WO8mKM7JRv8KehmfwUnBo0SZGU28nuCVN7c5Zz0l7h-JLjtDarmFboQU57svuybSkW0JFPHO0qDCV4V3Vvcnrub_7miNAUmQZ7rA0Z2WSpJutYssTESX8su9d3suCKRBdfVXmDKX6lj0g5aFWorj8AfryaDHyCbz7aJHsWT6e_EaSAu_xas2oY')" }}
                    ></div>
                    <div className="absolute inset-0 bg-primary/40 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="text-center text-white">
                            <span className="material-symbols-outlined text-3xl">map</span>
                            <p className="font-label-md text-label-md">Partner Map View</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Monitoring Table */}
            <div className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-xl overflow-hidden mb-10 shadow-sm">
                <div className="px-8 py-6 flex justify-between items-center border-b border-outline-variant bg-surface-container-low">
                    <h3 className="font-headline-md text-headline-md text-primary">Project Monitoring</h3>
                    <div className="flex gap-2">
                        <button className="bg-surface-container border border-outline-variant px-4 py-2 rounded-lg font-label-sm text-label-sm flex items-center gap-2 hover:bg-outline-variant/10 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
                        </button>
                        <button className="bg-surface-container border border-outline-variant px-4 py-2 rounded-lg font-label-sm text-label-sm flex items-center gap-2 hover:bg-outline-variant/10 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">download</span> Export
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-surface-container-high/50 text-on-surface-variant font-label-md text-label-md border-b border-outline-variant">
                                <th className="px-8 py-4">Student Name</th>
                                <th className="px-8 py-4">Project Title</th>
                                <th className="px-8 py-4">Current Milestone</th>
                                <th className="px-8 py-4">MSME Partner</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {projects.length > 0 ? projects.map((project, index) => {
                                // Simplified logic for mock purposes based on HTML
                                const statuses = [
                                    { label: 'Needs Review', type: 'secondary' },
                                    { label: 'On Track', type: 'primary' },
                                    { label: 'Late (3 Days)', type: 'error' }
                                ];
                                const status = statuses[index % 3];
                                const initials = project.user?.name ? project.user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'AJ';
                                
                                return (
                                    <tr key={project.id || index} className="hover:bg-primary-fixed/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full ${index % 2 === 0 ? 'bg-secondary-fixed text-on-secondary-fixed-variant' : 'bg-primary-fixed text-on-primary-fixed-variant'} flex items-center justify-center font-bold text-xs`}>
                                                    {initials}
                                                </div>
                                                <span className="font-body-md">{project.user?.name || 'Aditya Jaya'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-primary font-medium">{project.title}</td>
                                        <td className="px-8 py-5">
                                            <div className="w-full bg-surface-container-highest rounded-full h-1.5 max-w-[120px]">
                                                <div className={`h-1.5 rounded-full ${status.type === 'error' ? 'bg-error' : 'bg-primary'}`} style={{ width: `${(index + 1) * 20}%` }}></div>
                                            </div>
                                            <span className="text-[10px] text-on-surface-variant uppercase mt-1 block">Phase {index + 1}</span>
                                        </td>
                                        <td className="px-8 py-5 text-on-surface-variant">{project.umkm_name || 'Kriya Kreasi Ltd.'}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1 ${
                                                status.type === 'secondary' ? 'bg-secondary-container text-on-secondary-container' : 
                                                status.type === 'primary' ? 'bg-primary-fixed/30 text-on-primary-fixed-variant' : 
                                                'bg-error-container text-on-error-container'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    status.type === 'secondary' ? 'bg-secondary' : 
                                                    status.type === 'primary' ? 'bg-primary' : 
                                                    'bg-error'
                                                }`}></span> {status.label}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <button className="text-primary font-label-md text-label-md hover:underline">Review</button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-8 text-center text-on-surface-variant">No active projects found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Directory & Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white/80 backdrop-blur-md border border-outline-variant rounded-xl p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-headline-md text-headline-md text-primary">UMKM Partner Directory</h3>
                        <a className="text-primary font-label-md text-label-md flex items-center gap-1 hover:gap-2 transition-all" href="#">
                            View All <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 border border-outline-variant rounded-lg bg-surface-container-lowest hover:shadow-md transition-shadow">
                            <img className="w-14 h-14 rounded-md object-cover mr-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNWFoIUGsT0AgReNPIN48B9pNQEwFYjxStKvVWQgihtP5rhH6Q8V_oOW4Ig55DxBE5G-MlciTNy6cuibk2-2XtY3Nnukvh83vSV-fqDO2hyeo_K6D1WrdyUXGuZXZBM0fXt-MwUU3SmkDpAkGRkW6_hfuPwRzvkIj-cr_D1GAdFiZUm2uF3B33pPcl0wbHbMXFPf7EbeZkSpuDD1XQLl7jtANqEtR4ftAf6tU-0Fe6vB5Y_aLw9dAFYl6Uq-_u9-ey2GNBUORuQUkb" alt="Handicrafts" />
                            <div>
                                <p className="font-label-md text-label-md text-primary">Kriya Kreasi</p>
                                <p className="text-xs text-on-surface-variant">Handicrafts • Bali</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 border border-outline-variant rounded-lg bg-surface-container-lowest hover:shadow-md transition-shadow">
                            <img className="w-14 h-14 rounded-md object-cover mr-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU9z9KistK31fJecjJKRAAR-6RUcvKtJ24weKhbaWKGnEDrCJWKsyYgzNCyoThVazAoykd5oV1HHxBSHn0-mpG8yAjujOkxzF_gf1M5fwUNdpgChbAr0wOfEALec9W6taY2zRGnuZRTUs6DBRroihanaZe4QgObCI19VhyUxEFqntGMED2zg9FlNUVuGrgY5wVsLQfh5wpa5-0BZ8YCLSwnPltFZkFmk1vl6N88VQwUWMYTDISCTAZF4Q3-M_hbzfKDkJ-yfG_9MiQ" alt="Organic Harvest" />
                            <div>
                                <p className="font-label-md text-label-md text-primary">Organic Harvest</p>
                                <p className="text-xs text-on-surface-variant">Agriculture • Malang</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between overflow-hidden relative group shadow-sm">
                    <div className="relative z-10">
                        <h3 className="font-headline-md text-headline-md mb-4">Green Metrics Rubric</h3>
                        <p className="font-body-md opacity-80 mb-6">Review the 2024 sustainability standards for student assessment.</p>
                        <button className="bg-white text-primary px-6 py-3 rounded-lg font-label-md text-label-md w-full flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors">
                            <span className="material-symbols-outlined">menu_book</span>
                            Open Rubric
                        </button>
                    </div>
                    {/* Abstract visual element */}
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container rounded-full opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
