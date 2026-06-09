import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { checkAuthStatus } from './store/slices/authSlice';

// Import Layouts
import LandingLayout from './components/templates/LandingLayout';
import DashboardLayout from './components/templates/DashboardLayout';

// Import Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import QuizView from './pages/QuizView';
import ProjectView from './pages/ProjectView';
import ForumView from './pages/ForumView';
import CourseManager from './pages/CourseManager';
import CourseForm from './pages/CourseForm';
import InstructorCourseDetail from './pages/InstructorCourseDetail';
import StudentModules from './pages/StudentModules';
import GreenShowcase from './pages/GreenShowcase';
import UmkmDirectory from './pages/UmkmDirectory';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-[48px] animate-spin">sync</span>
                    <p className="text-label-md text-on-surface-variant font-medium">Memuat portal...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuthStatus());
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                {/* Public Landing Page wrapped with LandingLayout */}
                <Route element={<LandingLayout />}>
                    <Route path="/" element={<Landing />} />
                </Route>

                {/* Auth Pages (Self-contained Layouts) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard & Learning routes wrapped with ProtectedRoute and DashboardLayout */}
                <Route 
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/profile" element={<Profile />} />
                    <Route path="/dashboard/courses/:id" element={<CourseDetail />} />
                    <Route path="/dashboard/courses/:courseId/modules/:moduleId/quiz" element={<QuizView />} />
                    <Route path="/dashboard/courses/:courseId/project" element={<ProjectView />} />
                    <Route path="/dashboard/forum" element={<ForumView />} />
                    <Route path="/dashboard/modules" element={<StudentModules />} />
                    <Route path="/dashboard/showcase" element={<GreenShowcase />} />
                    <Route path="/dashboard/directory" element={<UmkmDirectory />} />
                    
                    {/* Instructor Routes */}
                    <Route path="/dashboard/manager" element={<CourseManager />} />
                    <Route path="/dashboard/manager/create" element={<CourseForm />} />
                    <Route path="/dashboard/manager/edit/:id" element={<CourseForm />} />
                    <Route path="/dashboard/manager/view/:id" element={<InstructorCourseDetail />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

const Root = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
};

if (document.getElementById('app')) {
    const container = document.getElementById('app');
    const root = createRoot(container);
    root.render(<Root />);
}

export default App;
