# Dokumen Perancangan Sistem Ecocademy

## 1. Deskripsi Sistem
Ecocademy adalah platform edukasi berbasis *Project-Based Learning* (PjBL) yang berfokus pada keberlanjutan lingkungan (Sustainability). Sistem ini menghubungkan siswa, instruktur, dan UMKM. Siswa tidak hanya belajar materi teoritis melalui modul dan kuis, tetapi juga diwajibkan untuk menyelesaikan proyek akhir yang memberikan dampak nyata (Green Impact) bagi UMKM mitra.

## 2. Alur Sistem (Flow System)
Berikut adalah penjelasan langkah demi langkah alur penggunaan sistem Ecocademy:

### A. Alur Siswa (Student Flow)
1. **Pendaftaran & Login:** Siswa mendaftar akun baru dan masuk ke sistem.
2. **Dashboard & Eksplorasi:** Siswa melihat ringkasan pencapaian dan mencari kursus di Katalog Kursus.
3. **Pembelajaran Modul:** 
   - Siswa memilih kursus dan mendaftar.
   - Siswa membaca materi (PDF/Teks) atau menonton video pada setiap modul.
   - Siswa mengerjakan kuis di akhir modul untuk mengukur pemahaman.
4. **Pelaksanaan Proyek (PjBL):**
   - Siswa melihat *Milestones* (tahapan) proyek akhir.
   - Siswa memilih UMKM mitra (melalui Direktori UMKM).
   - Siswa melaksanakan proyek di lapangan, lalu mengunggah laporan/dokumentasi (Submission).
5. **Penilaian & Lulus:** Siswa menunggu nilai dan *feedback* dari instruktur, kemudian dinyatakan lulus jika memenuhi syarat.

### B. Alur Instruktur (Instructor Flow)
1. **Login Instruktur:** Instruktur masuk ke Dashboard Instruktur.
2. **Manajemen Kursus:** Instruktur membuat kursus baru, mengatur deskripsi, dan kategori.
3. **Penyusunan Silabus:** Instruktur membuat modul-modul pembelajaran, mengunggah materi, menyusun soal kuis, dan mendefinisikan *Milestones* tugas proyek.
4. **Pusat Evaluasi (Evaluation Center):** Instruktur menerima notifikasi tugas yang masuk, mengevaluasi berkas submission, memberikan nilai (Score) dan *Green Impact Score*, serta menulis *feedback*.

---

## 3. Daftar Modul Sistem

1. **Manajemen Autentikasi & Profil**
   - *Fungsi:* Mengelola pendaftaran, login, pengaturan *password*, dan pembaruan profil pengguna.
2. **Katalog & Pembelajaran (LMS - Learning Management System)**
   - *Fungsi:* Menampilkan daftar kursus yang tersedia, fitur pendaftaran kursus (enrollment), dan *viewer* materi (Modal Reader untuk video dan PDF).
3. **Manajemen Kursus (Instructor Dashboard)**
   - *Fungsi:* Fasilitas khusus instruktur (Course Builder) untuk membuat kursus, mengatur urutan modul, dan membuat kuis pilihan ganda.
4. **Project-Based Learning (PjBL) Workspace**
   - *Fungsi:* Ruang kerja bagi siswa untuk melihat instruksi tugas akhir, melacak progres *milestone*, dan mengunggah tugas (*Submission*).
5. **Pusat Evaluasi (Evaluation Center)**
   - *Fungsi:* Modul bagi instruktur untuk meninjau seluruh tugas proyek yang dikirimkan siswa secara terpusat, dan memberikan penilaian formatif.
6. **Forum Diskusi**
   - *Fungsi:* Ruang komunikasi asinkron (mirip papan buletin) untuk tanya jawab antar anggota komunitas Ecocademy.
7. **Direktori UMKM & Green Showcase**
   - *Fungsi:* Database profil UMKM mitra untuk PjBL, dan etalase digital (*Showcase*) yang menampilkan hasil karya atau proyek terbaik dari para siswa.

---

## 4. Struktur Data (Kerangka Basisdata)

Berikut adalah struktur tabel (Data Dictionary) utama yang digunakan dalam sistem:

### Tabel `users`
Menyimpan data pengguna (siswa, instruktur, admin).
- `id` (UUID, Primary Key)
- `name` (String) - Nama lengkap
- `email` (String, Unique) - Alamat email
- `password` (String) - Kata sandi terenkripsi
- `role` (Enum: 'student', 'instructor', 'admin') - Peran pengguna
- `bio` (Text) - Deskripsi singkat profil
- `avatar` (String, Nullable) - Foto profil

### Tabel `courses`
Menyimpan data kursus yang dibuat oleh instruktur.
- `id` (UUID, Primary Key)
- `title` (String) - Judul kursus
- `description` (Text) - Deskripsi kursus
- `category_id` (UUID, Foreign Key ke `categories`)
- `instructor_id` (UUID, Foreign Key ke `users`)
- `is_published` (Boolean) - Status publikasi

### Tabel `modules`
Menyimpan bab/modul di dalam sebuah kursus.
- `id` (UUID, Primary Key)
- `course_id` (UUID, Foreign Key ke `courses`)
- `title` (String) - Judul modul
- `description` (Text) - Deskripsi singkat
- `sequence` (Integer) - Urutan modul
- `is_project_based` (Boolean) - Penanda jika modul ini adalah modul proyek (PjBL)

### Tabel `materials`
Menyimpan materi spesifik dalam modul.
- `id` (UUID, Primary Key)
- `module_id` (UUID, Foreign Key ke `modules`)
- `title` (String) - Judul materi
- `content_type` (Enum: 'video', 'article', 'pdf') - Jenis materi
- `content_url` (String) - Tautan ke file/video
- `body_text` (Text) - Isi teks materi (jika tipe article)
- `sequence` (Integer) - Urutan materi

### Tabel `quizzes` & `quiz_questions`
Menyimpan kuis dan pertanyaannya.
- **quizzes:** `id`, `module_id`, `title`, `instructions`
- **quiz_questions:** `id`, `quiz_id`, `question_text`, `sequence`
- **quiz_options:** `id`, `question_id`, `option_text`, `is_correct`

### Tabel `milestones`
Menyimpan target tahapan proyek PjBL.
- `id` (UUID, Primary Key)
- `course_id` (UUID, Foreign Key ke `courses`)
- `title` (String) - Nama tahapan
- `instructions` (Text) - Instruksi pengerjaan
- `report_type` (String) - Tipe file laporan (text, document, link)
- `sequence` (Integer) - Urutan tahapan pengerjaan

### Tabel `projects` (Proyek Siswa)
Menyimpan data kelompok/individu yang mengerjakan proyek bersama UMKM.
- `id` (UUID, Primary Key)
- `course_id` (UUID, Foreign Key ke `courses`)
- `student_id` (UUID, Foreign Key ke `users`)
- `title` (String) - Judul proyek
- `umkm_name` (String) - Nama UMKM mitra
- `umkm_sector` (String) - Sektor UMKM
- `status` (Enum: 'pending', 'approved', 'rejected', 'planning', 'executing', 'completed')

### Tabel `submissions`
Menyimpan file tugas yang diunggah siswa untuk suatu milestone proyek.
- `id` (UUID, Primary Key)
- `project_id` (UUID, Foreign Key ke `projects`)
- `milestone_id` (UUID, Foreign Key ke `milestones`)
- `submitted_by` (UUID, Foreign Key ke `users`)
- `file_url` (String) - Tautan file laporan yang diunggah
- `student_notes` (Text) - Catatan dari siswa

### Tabel `feedbacks`
Menyimpan evaluasi instruktur terhadap submission siswa.
- `id` (UUID, Primary Key)
- `submission_id` (UUID, Foreign Key ke `submissions`)
- `evaluator_id` (UUID, Foreign Key ke `users`)
- `grade` (Decimal) - Nilai akademik (0-100)
- `green_impact_score` (Integer) - Nilai dampak keberlanjutan (1-5)
- `comments` (Text) - Komentar/saran perbaikan

### Tabel `forum_threads` & `forum_comments`
Menyimpan diskusi komunitas.
- **forum_threads:** `id`, `user_id`, `title`, `body`
- **forum_comments:** `id`, `thread_id`, `user_id`, `body`
