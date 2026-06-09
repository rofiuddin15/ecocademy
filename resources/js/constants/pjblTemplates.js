export const GREENPRENEURSHIP_TEMPLATES = [
    {
        title: 'Tahap 1: Menentukan Pertanyaan Esensial',
        instructions: 'Mengidentifikasi permasalahan lingkungan dan sosial di Jawa Timur untuk merumuskan pertanyaan esensial.',
        student_activities: "1. Mengidentifikasi permasalahan lingkungan dan sosial di Jawa Timur.\n2. Menentukan potensi lokal yang dapat dikembangkan.\n3. Menyusun pertanyaan esensial proyek.",
        lms_deliverable: 'Unggah dokumen "Essential Question Project" (2-3 halaman).',
        content_format: "1. Permasalahan lingkungan yang dipilih.\n2. Potensi lokal yang digunakan.\n3. Alasan pemilihan masalah.\n4. Pertanyaan esensial proyek.",
        assessment_indicators: "1. Ketepatan identifikasi masalah lingkungan.\n2. Relevansi dengan potensi lokal.\n3. Kualitas pertanyaan esensial.\n4. Kebaruan ide.",
        weight: 10,
        duration_hours: 20,
        report_type: 'document'
    },
    {
        title: 'Tahap 2: Merencanakan Proyek',
        instructions: 'Merencanakan proyek secara komprehensif, mulai dari tujuan hingga strategi keberlanjutan.',
        student_activities: "1. Menyusun tujuan proyek.\n2. Menentukan target konsumen.\n3. Menyusun jadwal kegiatan.\n4. Menentukan kebutuhan sumber daya.\n5. Menyusun strategi keberlanjutan.",
        lms_deliverable: 'Unggah Proposal Perencanaan Proyek.',
        content_format: "1. Nama usaha hijau.\n2. Tujuan usaha.\n3. Target pasar.\n4. Jadwal proyek.\n5. Pembagian tugas anggota.\n6. Strategi keberlanjutan lingkungan.",
        assessment_indicators: "1. Kelengkapan rencana proyek.\n2. Kelayakan ide usaha.\n3. Integrasi aspek ekonomi, sosial, dan lingkungan.\n4. Ketepatan jadwal kerja.",
        weight: 15,
        duration_hours: 20,
        report_type: 'document'
    },
    {
        title: 'Tahap 3: Penelitian dan Investigasi',
        instructions: 'Melakukan studi literatur dan investigasi lapangan untuk memvalidasi peluang usaha.',
        student_activities: "1. Studi literatur.\n2. Observasi lapangan.\n3. Wawancara narasumber.\n4. Survei calon konsumen.\n5. Analisis kebutuhan pasar.",
        lms_deliverable: 'Unggah Laporan Investigasi.',
        content_format: "1. Hasil studi literatur.\n2. Hasil observasi.\n3. Hasil wawancara.\n4. Hasil survei.\n5. Analisis peluang usaha.\n6. Analisis dampak lingkungan.",
        assessment_indicators: "1. Kualitas data.\n2. Ketepatan metode pengumpulan data.\n3. Analisis peluang usaha.\n4. Analisis dampak lingkungan.\n5. Validitas temuan.",
        weight: 20,
        duration_hours: 40,
        report_type: 'document'
    },
    {
        title: 'Tahap 4: Pengembangan Produk atau Solusi',
        instructions: 'Mengembangkan prototipe dan model bisnis yang akan diimplementasikan.',
        student_activities: "1. Mengembangkan prototipe.\n2. Menyusun model bisnis.\n3. Menentukan strategi pemasaran.\n4. Menghitung kelayakan usaha sederhana.",
        lms_deliverable: 'Unggah Green Business Plan dan Dokumentasi Prototipe.',
        content_format: "1. Executive Summary.\n2. Deskripsi produk.\n3. Value Proposition.\n4. Sustainable Business Model Canvas.\n5. Analisis pasar.\n6. Strategi pemasaran.\n7. Analisis biaya dan keuntungan.\n8. Dampak lingkungan dan sosial.",
        assessment_indicators: "1. Kreativitas produk.\n2. Inovasi ramah lingkungan.\n3. Kebermanfaatan sosial.\n4. Kualitas prototipe.\n5. Kelayakan bisnis.",
        weight: 30,
        duration_hours: 40,
        report_type: 'document'
    },
    {
        title: 'Tahap 5: Presentasi Hasil',
        instructions: 'Mempresentasikan hasil proyek melalui pitch deck dan video pitching.',
        student_activities: "1. Menyusun presentasi bisnis.\n2. Menyusun video pitching.\n3. Melakukan presentasi proyek.",
        lms_deliverable: 'File Presentasi dan Video Pitching (5-10 menit).',
        content_format: "1. Latar belakang masalah.\n2. Solusi yang ditawarkan.\n3. Model bisnis.\n4. Hasil analisis pasar.\n5. Dampak lingkungan.\n6. Dampak sosial.\n7. Potensi keuntungan usaha.",
        assessment_indicators: "1. Penguasaan materi.\n2. Kualitas presentasi.\n3. Kemampuan argumentasi.\n4. Penggunaan data pendukung.\n5. Kemampuan menjawab pertanyaan.",
        weight: 15,
        duration_hours: 15,
        report_type: 'link'
    },
    {
        title: 'Tahap 6: Refleksi dan Evaluasi',
        instructions: 'Merefleksikan proses belajar dan mengevaluasi pengembangan usaha di masa depan.',
        student_activities: "1. Merefleksikan proses proyek.\n2. Mengevaluasi produk yang dihasilkan.\n3. Menyusun strategi pengembangan usaha.",
        lms_deliverable: 'Unggah Laporan Refleksi Individu.',
        content_format: "1. Pengalaman belajar.\n2. Kontribusi dalam tim.\n3. Kendala yang dihadapi.\n4. Solusi yang dilakukan.\n5. Pengembangan usaha di masa depan.\n6. Pembelajaran terkait Greenpreneurship Skills.",
        assessment_indicators: "1. Kedalaman refleksi.\n2. Kemampuan evaluasi diri.\n3. Kemampuan mengidentifikasi perbaikan.\n4. Rencana pengembangan usaha.",
        weight: 10,
        duration_hours: 10,
        report_type: 'document'
    }
];

export const BANK_TEMPLATES = [
    {
        id: 'greenpreneurship',
        name: 'Greenpreneurship (6 Tahap)',
        stages: GREENPRENEURSHIP_TEMPLATES
    },
    {
        id: 'design_sprint',
        name: 'Design Sprint (5 Tahap) - Akan Datang',
        stages: []
    }
];
