# Portofolio Pribadi — Artha Liebe Siregar
**NIM:** 12S24010 &middot; **Kelas:** 13SI1
 **Mata Kuliah:** 12S3101 Pemrograman dan Pengujian Web

🔗 **Live demo:** https://arthasiregar.github.io/ppw-2026-week2-12S24010/
🔗 **Repositori:** `ppw-2026-week2-12S24010` (branch `week3-bootstrap`)

## Ringkasan Pembaruan Minggu 3

Melanjutkan portofolio Minggu 2 (HTML5 semantik + CSS murni), pada Minggu 3 proyek ini
direfaktor menggunakan **Bootstrap 5.3** dan Custom CSS Overrides, tanpa mengubah struktur
semantik HTML5 yang sudah ada.

## Tabel Perbandingan: Sebelum vs Sesudah Integrasi Framework

| Aspek | Sebelum (Minggu 2) | Sesudah (Minggu 3) |
|---|---|---|
| **CSS Framework** | CSS murni (`style.css`), tanpa framework | Bootstrap 5.3.3 CDN + Bootstrap Icons, di-override lewat `custom-style.css` yang dimuat setelah Bootstrap |
| **JavaScript** | Tanpa JavaScript sama sekali | Menggunakan Bootstrap JS Bundle (untuk navbar collapse & modal) + skrip validasi form standar Bootstrap |
| **Navigasi** | Menu horizontal statis, wrap manual di layar kecil | Navbar Bootstrap responsif dengan tombol hamburger (`navbar-toggler`) yang collapse/expand di layar ponsel |
| **Tampilan Proyek** | 2 kolom statis (Independen/Tim) berisi kartu tanpa interaksi tambahan | Grid responsif `row-cols-1 row-cols-md-2 row-cols-lg-3` (5 kartu), tiap kartu terhubung ke **Modal Dialog** detail proyek |
| **Formulir Kontak** | Label + input polos di atas tiap field | **Floating Labels** (`.form-floating`), **Input Group** berikon, serta umpan balik validasi visual (`.invalid-feedback`) |
| **Tata Letak** | CSS Grid & Flexbox custom, breakpoint manual (900px/768px/480px) | Sistem grid 12-kolom Bootstrap (`container`, `row`, `col-*`) dikombinasikan dengan sedikit custom CSS untuk penyesuaian |
| **Tema Warna** | 4 CSS variable (`--cream`, `--pink-soft`, `--pink-accent`, `--mauve`) | Variable dipertahankan dan ditambah (12+ variable total: radius, shadow, font, dst.), dipakai untuk menimpa warna default Bootstrap tanpa `!important` |
| **Tabel Data** | Zebra sederhana lewat `:hover` saja | Ditambah `:nth-child(even)` untuk zebra striping permanen, bukan hanya saat hover |

## Fitur Utama

- **Navbar responsif** — sticky-top, brand identity, hamburger toggle berfungsi penuh di mobile.
- **Hero Section** — proporsional dengan CTA "Hubungi Saya" dan "Lihat Proyek".
- **Grid Proyek & Modal** — 5 kartu proyek (row-cols responsif), masing-masing dengan tombol "Detail" yang membuka Modal Dialog berisi deskripsi lengkap, tools, dan tautan proyek.
- **Formulir Kontak Modern** — Floating Labels, Input Group berikon, select kategori, radio preferensi kontak, checkbox persetujuan, dan validasi visual native + Bootstrap.
- **Custom Theming** — 12+ CSS custom properties di `:root`, palet warna personal (bukan warna default Bootstrap), transisi mikro-interaksi pada kartu dan tombol.
- **Advanced Selectors** — child combinator (`>`), adjacent sibling (`+`), `:is()`, `:nth-child()`, `:focus-within`, dan selector atribut (`[data-accent="..."]`) diterapkan pada konteks yang relevan, bukan sekadar demo.

## Spesifikasi Teknis

- Struktur semantik HTML5 tetap utuh: `header`, `nav`, `main`, `section`, `article`, `footer`.
- `custom-style.css` dimuat **setelah** `bootstrap.min.css` — semua override warna/komponen memanfaatkan urutan cascade, **tanpa satu pun `!important`**.
- Minimal 6 tipe kontrol input pada form dipertahankan dari Minggu 2 (text, email, tel, select, radio, checkbox, textarea), sekarang dibungkus komponen Bootstrap modern.
- Tabel rekap proyek (caption, thead, tbody, tfoot, scope) dipertahankan dari Minggu 2.

## Palet Warna

| Warna | Hex | Peran |
|---|---|---|
| Cream | `#FFF5E4` | Dominan (60%) — latar belakang |
| Pink Lembut | `#FADADD` | Sekunder (30%) — permukaan kartu & aksen lembut |
| Pink Koral | `#FFB7B2` | Aksen (10%) — highlight, badge, banner |
| Mauve | `#A26769` | Aksen (10%) — navbar, judul, tombol utama |

## Cara Menjalankan Secara Lokal

1. Clone repositori ini, checkout ke branch `week3-bootstrap`.
2. Buka `index.html` langsung di browser, atau gunakan ekstensi **Live Server** di VS Code.
3. Bootstrap CSS/JS dan Bootstrap Icons dimuat lewat CDN — pastikan ada koneksi internet saat membuka halaman.

## Struktur Berkas

```
├── index.html
├── custom-style.css
├── assets/
│   ├── images/photo-almetdel.jpg
│   └── CV_Artha_Siregar.pdf
└── README.md
```

Disusun oleh Artha Liebe Siregar untuk Mata Kuliah Pemrograman dan Pengujian Web (12S3101),
Institut Teknologi Del.