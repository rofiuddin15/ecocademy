import React from 'react';
import { useSelector } from 'react-redux';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    if (user?.role === 'instructor') {
        return <InstructorDashboard />;
    }

    // Default to student (or admin can be added later)
    return <StudentDashboard />;
};

export default Dashboard;
