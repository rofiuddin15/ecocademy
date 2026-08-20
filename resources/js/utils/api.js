import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Accept': 'application/json',
    }
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiry / unauthorized requests
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // We can reload or let the app state handle redirection
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Helper: Catat aktivitas pengguna ke server.
 * Dipanggil dari komponen React saat user melakukan aksi tertentu.
 * Tidak throw error agar tidak mengganggu flow utama aplikasi.
 *
 * @param {string} action - Jenis aksi: 'view_course', 'view_material', 'submit_quiz', dll.
 * @param {string|null} subjectType - Tipe subjek: 'Course', 'Module', 'Material', 'Quiz', 'Project'
 * @param {string|null} subjectId - UUID subjek
 * @param {string|null} subjectName - Nama subjek (untuk tampilan log)
 * @param {object|null} metadata - Data tambahan (opsional)
 */
export const logActivity = async (action, subjectType = null, subjectId = null, subjectName = null, metadata = null) => {
    // Hanya log jika user sudah login (ada token)
    if (!localStorage.getItem('token')) return;

    try {
        await api.post('/activity-logs', {
            action,
            subject_type: subjectType,
            subject_id:   subjectId,
            subject_name: subjectName,
            metadata,
        });
    } catch (err) {
        // Gagal log tidak boleh crash aplikasi
        console.warn('[ActivityLog] Gagal mencatat aktivitas:', action, err?.message);
    }
};

/**
 * Helper: Enroll mahasiswa ke kursus.
 * Mengembalikan { enrollment, already_enrolled } atau null jika gagal.
 */
export const enrollCourse = async (courseId) => {
    if (!localStorage.getItem('token')) return null;
    try {
        const res = await api.post(`/courses/${courseId}/enroll`);
        return res.data;
    } catch (err) {
        console.warn('[Enrollment] Gagal enroll kursus:', err?.message);
        return null;
    }
};

/**
 * Helper: Cek status enrollment user untuk kursus tertentu.
 */
export const checkEnrollmentStatus = async (courseId) => {
    if (!localStorage.getItem('token')) return { is_enrolled: false, is_completed: false };
    try {
        const res = await api.get(`/courses/${courseId}/enrollment-status`);
        return res.data;
    } catch (err) {
        return { is_enrolled: false, is_completed: false };
    }
};

export default api;

