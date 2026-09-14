/* course-config.js
   ============================================================
   SATU-SATUNYA FILE YANG PERLU DIUBAH DOSEN UNTUK BUKA/TUTUP MATERI.
   ============================================================

   Cara pakai:
     - material: true  -> halaman teori minggu tsb bisa diakses (week-XX.html)
     - material: false -> halaman teori tampil sebagai "COMING SOON"
     - practice: true  -> halaman praktik minggu tsb bisa diakses (practical-XX.html)
     - practice: false -> halaman praktik tampil sebagai "COMING SOON"

   PENTING: mengubah nilai ini TIDAK menghapus konten. Konten tetap ada di
   dalam file HTML, hanya tampilannya yang dikunci (lihat content-control.js).

   Contoh membuka UTS (Week 08) saat mulai ujian:
     week08: { title: "UTS", material: true, practice: true }

   Contoh menutup kembali:
     week08: { title: "UTS", material: false, practice: false }
*/

const courseConfig = {

  week01: {
    title: "Introduction to Cybersecurity",
    material: true,
    practice: true
  },

  week02: {
    title: "Asset, Threat, Vulnerability & Risk",
    material: true,
    practice: true
  },

  week03: {
    title: "Threat Landscape & Attack Surface",
    material: true,
    practice: true
  },

  week04: {
    title: "Authentication & Access Control",
    material: true,
    practice: true
  },

  week05: {
    title: "Cryptography & Data Protection",
    material: true,
    practice: true
  },

  week06: {
    title: "Network Security Fundamentals",
    material: true,
    practice: true
  },

  week07: {
    title: "Secure Architecture & Zero Trust",
    material: true,
    practice: true
  },

  week08: {
    title: "UTS",
    material: false,
    practice: false
  },

  week09: {
    title: "Web & Application Security",
    material: true,
    practice: true
  },

  week10: {
    title: "Endpoint & Malware Security",
    material: true,
    practice: true
  },

  week11: {
    title: "Vulnerability Management",
    material: true,
    practice: true
  },

  week12: {
    title: "Security Monitoring & Incident Response",
    material: true,
    practice: true
  },

  week13: {
    title: "Cyber Attack Lifecycle",
    material: true,
    practice: true
  },

  week14: {
    title: "Digital Forensics Fundamentals",
    material: true,
    practice: true
  },

  week15: {
    title: "Current Cybersecurity Trends",
    material: true,
    practice: true
  },

  week16: {
    title: "Final Project & Security Assessment",
    material: false,
    practice: false
  }

};

/* Expose to other scripts (content-control.js, admin.js, main.js) */
if (typeof window !== "undefined") {
  window.courseConfig = courseConfig;
}
