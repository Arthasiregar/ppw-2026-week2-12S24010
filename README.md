# Portofolio Pribadi — Artha Liebe Siregar

Halaman web portofolio profil profesional (single page showcase) yang dibangun untuk memenuhi
Tugas Mandiri Mata Kuliah **12S3101 — Pemrograman dan Pengujian Web**, Institut Teknologi Del.

🔗 **Live demo:** _tambahkan tautan GitHub Pages di sini setelah deployment_
🔗 **Repositori:** `ppw-2026-week2-[NIM]`

## Fitur Utama

- **Tentang Saya** — foto profil, ringkasan singkat, dan info cepat (aside).
- **Keahlian** — tech stack dan daftar kemampuan.
- **Proyek** — dikelompokkan menjadi Proyek Independen dan Proyek Tim, lengkap dengan tools,
  peran, dan tautan ke masing-masing proyek; disertai tabel rekapitulasi proyek/matakuliah.
- **Pengalaman** — riwayat organisasi dalam format timeline.
- **Pendidikan** — riwayat SMA dan perkuliahan.
- **Sertifikat & Pencapaian** — sertifikat yang telah diperoleh.
- **Kontak** — email, telepon, media sosial, dan formulir kontak interaktif.

## Spesifikasi Teknis

- HTML5 semantik: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`.
- Tabel data semantik lengkap (`caption`, `thead`, `tbody`, `tfoot`, `scope`).
- Dua jenis HTML list (`ul` dan `ol`) digunakan sesuai konteks (skill, timeline, dsb).
- Formulir kontak dengan 2 `fieldset`/`legend`, 7 tipe kontrol input (text, email, tel, number,
  select, radio, checkbox, textarea), label eksplisit (`label for`), dan validasi native (`required`).
- CSS eksternal (`style.css`) dengan universal box-sizing reset, palet warna 60-30-10, border-radius,
  box-shadow, CSS Flexbox & Grid, serta responsif melalui media queries (768px, 900px, 480px).
- Dibangun murni dengan HTML5 & CSS3 sesuai cakupan modul (tanpa JavaScript) — navigasi mobile,
  tombol kembali ke atas, dan pengiriman pesan kontak seluruhnya berjalan dengan HTML/CSS native.

## Palet Warna

| Warna | Hex | Peran |
|---|---|---|
| Cream | `#FFF5E4` | Warna dominan (60%) — latar belakang |
| Pink Lembut | `#FADADD` | Warna sekunder (30%) — permukaan kartu & aksen lembut |
| Pink Koral | `#FFB7B2` | Aksen (10%) — highlight, badge, border |
| Mauve | `#A26769` | Aksen (10%) — judul, tombol utama, footer |

## Cara Menjalankan Secara Lokal

1. Clone repositori ini.
2. Buka `index.html` langsung di browser, atau gunakan ekstensi **Live Server** di VS Code.

## Struktur Berkas

```
├── index.html
├── style.css
├── assets/
│   ├── profile.jpg        (ganti dengan foto profil asli)
│   └── CV_Artha_Liebe_Siregar.pdf   (ganti dengan file CV asli)
└── README.md
```

## Catatan Sebelum Dipublikasikan

- Ganti `assets/profile.jpg` dengan foto profil asli.
- Tambahkan file CV di `assets/CV_Artha_Liebe_Siregar.pdf` (atau perbarui tautannya di `index.html`).
- Lengkapi tautan media sosial TikTok dan tautan repositori/dokumen tiap proyek.
- Lengkapi bagian Pendidikan (SMA) dan tambahkan pencapaian lain di bagian Sertifikat & Pencapaian.
- Perbarui tautan live demo di bagian atas README setelah GitHub Pages aktif.

---
Disusun oleh Artha Liebe Siregar untuk Mata Kuliah Pemrograman dan Pengujian Web (12S3101),
Institut Teknologi Del.