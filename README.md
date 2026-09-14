# COM Cybersecurity Learning Platform

Platform pembelajaran digital untuk mata kuliah **Keamanan Siber (P)** — kode `63350300`,
3 SKS, Semester V — Program Studi Teknik Komputer, Fakultas Teknik dan Perencanaan,
Universitas Warmadewa. Static website (HTML/CSS/JS), deploy langsung ke GitHub Pages.

> **Update besar (revisi ini):** konten dan struktur kurikulum diganti total menjadi
> kurikulum 16 minggu cybersecurity fundamentals (Introduction to Cybersecurity →
> Final Project & Security Assessment). Desain, logo COM, dan seluruh fitur (progress,
> search, dark mode, sidebar, admin/content control, coming soon) **dipertahankan**
> dari versi sebelumnya.

## Learning Path — 16 Minggu

| Minggu | Modul | Default Status |
|---|---|---|
| 01 | Introduction to Cybersecurity | Published |
| 02 | Asset, Threat, Vulnerability & Risk | Published |
| 03 | Threat Landscape & Attack Surface | Published |
| 04 | Authentication & Access Control | Published |
| 05 | Cryptography & Data Protection | Published |
| 06 | Network Security Fundamentals | Published |
| 07 | Secure Architecture & Zero Trust | Published |
| 08 | **UTS** | 🔒 Coming Soon |
| 09 | Web & Application Security | Published |
| 10 | Endpoint & Malware Security | Published |
| 11 | Vulnerability Management | Published |
| 12 | Security Monitoring & Incident Response | Published |
| 13 | Cyber Attack Lifecycle | Published |
| 14 | Digital Forensics Fundamentals | Published |
| 15 | Current Cybersecurity Trends | Published |
| 16 | **Final Project & Security Assessment** | 🔒 Coming Soon |

Setiap minggu memiliki **Material status** dan **Practice status** yang independen satu
sama lain (`material` / `practice` pada `course-config.js`).

## Features

- Homepage menampilkan **seluruh 16 minggu** (termasuk UTS & Final Project) sehingga
  mahasiswa selalu melihat roadmap lengkap — bukan hanya minggu yang sudah published.
- Setiap minggu punya **dua halaman terpisah**: `weeks/weekXX.html` (Materi: learning
  objectives, theory, ilustrasi SVG, example, case study, key takeaways) dan
  `practical/practical-XX.html` (Praktik: objective, scenario, tools, environment,
  instructions, expected output, analysis, questions, assignment, checklist).
- Blok "READY FOR PRACTICE?" di akhir tiap materi menautkan ke lab praktik minggu itu.
- **Hide ≠ Delete**: ketika sebuah bagian di-set `false`, kontennya tetap ada di HTML —
  hanya disembunyikan secara visual dan diganti panel 🔒 COMING SOON (lihat
  `content-control.js` + aturan CSS `[data-locked="true"]`).
- Status visual: 🟢 Available · 🔵 In Progress · ✓ Completed · 🔒 Coming Soon.
- Progress (Dashboard & tiap kartu minggu) hanya dihitung dari minggu yang aktif
  (published) — minggu Coming Soon **tidak** dihitung sebagai tugas belum selesai.
- Search & filter topik tetap menampilkan semua minggu; minggu Coming Soon muncul di
  hasil pencarian tanpa membuka isinya.
- Admin Panel: tabel **Content Control** untuk seluruh 16 minggu (Materi & Praktik
  terpisah) dengan tombol Publish/Hide untuk preview instan.
- Dark mode, responsive, copy-code, seluruh path relatif (siap GitHub Pages).

## Cara Dosen Membuka / Menutup Materi

### Cara permanen (direkomendasikan) — edit `assets/js/course-config.js`

Buka file tersebut, cari minggu yang dimaksud, lalu ubah `true`/`false`:

```js
// Membuka UTS saat ujian dimulai:
week08: {
  title: "UTS",
  material: true,   // <-- diubah dari false
  practice: true    // <-- diubah dari false
}
```

```js
// Menutup kembali Final Project setelah periode pengumpulan berakhir:
week16: {
  title: "Final Project & Security Assessment",
  material: false,  // <-- diubah dari true
  practice: false   // <-- diubah dari true
}
```

Simpan file, commit, push ke GitHub — perubahan berlaku untuk **semua pengunjung**
setelah GitHub Pages redeploy (otomatis setelah push ke branch `main`).

### Cara cepat untuk demo — Admin Panel (`admin/login.html` → `admin/index.html`)

Tombol **Toggle** pada tabel Content Control membuat *preview override* instan pada
browser tersebut (disimpan di `localStorage`). Berguna untuk mendemokan tampilan
Publish/Hide tanpa harus edit kode, **tetapi**:
- hanya berlaku di browser admin yang menekan tombol tersebut,
- tidak mengubah `course-config.js`,
- tidak terlihat oleh mahasiswa lain,
- akan hilang jika localStorage dibersihkan.

Gunakan tombol **Reset Preview Override** di Admin Panel untuk kembali mengikuti nilai
default `course-config.js`.

## Folder Structure

```
/
├── index.html            (Homepage — semua 16 minggu ditampilkan)
├── dashboard.html
├── about.html
├── references.html
├── weeks/
│   ├── week01.html ... week16.html      (halaman Materi per minggu)
├── practical/
│   ├── practical-01.html ... practical-16.html   (halaman Praktik per minggu)
├── admin/
│   ├── login.html
│   ├── index.html        (Content Control table, 16 minggu × Materi/Praktik)
│   └── admin.js
├── assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── course-config.js     (SATU FILE untuk buka/tutup materi secara manual)
│   │   ├── content-control.js   (baca course-config.js + override demo, render lock)
│   │   ├── main.js              (nav, theme, search, filter, live status badges)
│   │   ├── progress.js          (progress per minggu, dikecualikan jika Coming Soon)
│   │   ├── quiz.js              (quiz engine + scoring, reusable)
│   │   └── notes.js             (notes + bookmarks)
│   └── img/logo-TKOM.svg        (placeholder — ganti dengan logo-TKOM.png asli)
└── README.md
```

## Local Development

```bash
python3 -m http.server 8000
```

Buka `http://localhost:8000`. Tidak ada build step.

## GitHub Pages Deployment

```bash
git init
git add .
git commit -m "Update: 16-week cybersecurity curriculum"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Lalu: **Settings → Pages → Deploy from branch → main → /(root) → Save**.
Seluruh referensi CSS/JS/gambar/link antar-halaman menggunakan path relatif
(`./assets/...`, `../assets/...`), sehingga kompatibel dengan subpath GitHub Pages.

## Security Limitations (Penting)

Ini adalah **static site tanpa backend**:

- **Admin login demo** menerima username/password apa pun yang tidak kosong — tidak
  ada kredensial sungguhan yang dicek atau disimpan di JavaScript.
- **Status publikasi permanen** (`course-config.js`) adalah bagian dari kode sumber —
  jika repository bersifat publik, siapa pun dapat membacanya (termasuk melihat minggu
  mana yang masih Coming Soon). ***Ini bukan mekanisme keamanan yang kuat.***
- **Preview override** Admin Panel tersimpan di `localStorage` browser tersebut —
  dapat diubah siapa pun lewat devtools, dan tidak disinkronkan ke pengunjung lain.
- **Progress, notes, dan bookmark** adalah data personal per-browser (`localStorage`),
  tidak dicadangkan ke server dan hilang jika penyimpanan browser dibersihkan.

### Rekomendasi Upgrade untuk Produksi

Untuk kontrol akses dan autentikasi yang sesungguhnya:

1. **Firebase Authentication + Firestore** — login dosen/mahasiswa sungguhan; koleksi
   Firestore untuk status publikasi, progress, dan nilai quiz, diamankan dengan
   Firestore Security Rules.
2. **Supabase Auth + Supabase Database (Postgres)** — pendekatan setara memakai
   row-level security policies.

Front-end tetap bisa statis (tetap dapat di-deploy di GitHub Pages) sementara
autentikasi dan data bersama dipindahkan ke server.

## Prinsip Keamanan pada Praktik

Seluruh Practical Lab pada Minggu 1–15 dirancang untuk **local lab / simulated
environment / intentionally vulnerable application milik sendiri**. Tidak ada instruksi
yang mengarahkan mahasiswa menyerang website publik, IP publik tanpa izin, sistem
organisasi nyata, atau akun orang lain — cybersecurity diajarkan secara defensif.

## Content Notes

Materi Minggu 1–7 dan 9–15 sudah lengkap: learning objectives, theory (dengan ilustrasi
SVG), example, case study, key takeaways, serta practical lab lengkap (objective,
scenario, tools, environment, instructions, expected output, analysis, questions,
assignment, checklist) — seluruhnya ditulis orisinal, bukan lorem ipsum maupun kutipan
langsung dari sumber mana pun.

Minggu 8 (UTS) dan Minggu 16 (Final Project) sengaja dibuat sebagai halaman **Coming
Soon minimal** sesuai instruksi — soal/instruksi lengkap belum dibuka agar tidak bocor
sebelum jadwalnya; dosen mengisi/membuka detailnya menjelang periode ujian atau
pengerjaan proyek akhir melalui `course-config.js`.
