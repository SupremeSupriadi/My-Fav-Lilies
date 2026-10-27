# Binary Poetry — panduan sederhana

Website ucapan ulang tahun interaktif dengan binary portrait, puisi, animasi 10 detik, dan navigasi slide.

## 1. Yang perlu dipasang
- Visual Studio Code (VS Code)
- Browser seperti Chrome atau Edge
- Ekstensi VS Code bernama **Live Server** (opsional, tetapi memudahkan menjalankan website)

Tidak perlu memasang Python atau Node.js untuk versi ini.

## 2. Cara membuka proyek
1. Ekstrak file ZIP ini.
2. Buka VS Code.
3. Pilih **File → Open Folder...**
4. Pilih folder `binary-poetry` yang sudah diekstrak.

## 3. Masukkan foto
Masukkan tiga foto ke folder `assets`:
- `portrait.jpg` — foto dia
- `family.jpg` — foto dia bersama orang tua
- `lilies.jpg` — foto bunga lilies

Nama file harus sama persis, termasuk huruf besar/kecil. Kalau foto kamu berformat PNG, boleh gunakan nama misalnya `portrait.png`, lalu ubah juga baris `image` yang sesuai di `content.js`.

## 4. Masukkan tulisan
Buka file `content.js`. Ganti teks contoh di dalam tanda backtick:
- `opening.title` dan `opening.subtitle` untuk halaman pembuka.
- `title` dan `text` pada setiap slide untuk judul dan tulisan.
- Kamu boleh membuat baris baru di dalam tanda backtick.
- Jangan menghapus tanda backtick, koma, atau kurung.

## 5. Jalankan di komputer
Cara paling mudah:
1. Di VS Code, buka tab Extensions (ikon kotak di sisi kiri).
2. Cari **Live Server**, lalu instal.
3. Klik kanan `index.html`.
4. Pilih **Open with Live Server**.

Browser akan membuka website. Klik **OPEN YOUR LETTER** untuk memulai.

Kamu juga bisa mencoba membuka `index.html` langsung di browser, tetapi Live Server lebih disarankan.

## 6. Ubah durasi animasi
Di bagian bawah `content.js`:
- `duration: 10000` berarti 10 detik.
- `colorRevealStart: 7000` berarti warna lilies mulai berubah pada detik ke-7.

`maxColumns` menentukan banyaknya kolom angka. Angka yang lebih besar bisa memberi detail lebih banyak tetapi lebih berat bagi perangkat.

## 7. Cara membuat link online
Cara umum:
1. Buat akun GitHub jika belum punya.
2. Buat repository untuk proyek ini dan unggah isi folder `binary-poetry`.
3. Buka Vercel atau Netlify, lalu pilih untuk mengimpor repository tersebut.
4. Deploy sebagai situs statis. Untuk proyek ini tidak perlu build command khusus; folder utama berisi `index.html`.
5. Setelah selesai, layanan hosting akan memberi URL website.

Nama menu di layanan hosting bisa berubah. Jika repository berisi foto pribadi, ingat bahwa file website dan foto yang dipublikasikan bisa diakses oleh orang yang memiliki link; jangan mengunggah foto yang tidak ingin dibagikan.

## Catatan
- Animasi dibangun dengan Canvas dan `requestAnimationFrame`.
- Foto diproses di browser; tidak dikirim ke server untuk diolah.
- Efek warna lilies terjadi selama detik ke-7 sampai ke-10 dari animasi slide lilies.
- Website ini memakai Google Fonts jika koneksi internet tersedia; jika tidak, font cadangan akan digunakan.
