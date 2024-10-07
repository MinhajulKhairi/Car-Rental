# Car-Rental Project Using Python Flask and React.js

# Deskripsi Sistem
Sistem ini merupakan platform yang menyediakan proses pengumpulan data dan penyajian informasi secara otomatis mengenai daftar harga mobil, ketersediaan mobil, data pemesanan, dan informasi pengguna. Input data dilakukan oleh admin, yang akan diproses untuk menghasilkan data yang akurat. Keluaran dari sistem ini berupa informasi yang terus diperbarui, memudahkan staf dalam pengelolaan dan pelayanan kepada pelanggan. Sistem ini akan membantu meningkatkan efisiensi dalam operasional penyewaan mobil.

# Perangkat yang digunakan
Flask: Digunakan untuk backend
ReactJs: Digunakan untuk front end
Untuk backend dan frontend dihubungkan menggunakan api
Komputer: Diperlukan untuk pengembangan dan penggunaan aplikasi rental mobil.

# Panduan Menjalankan Aplikasi Web

Persiapan Awal
1. Import Database:
Import file SQL car_rental ke dalam phpMyAdmin terlebih dahulu.

2. Konfigurasi IP Jaringan:
Sesuaikan IP jaringan pada berkas frontendd/src/app/config.js dengan IP jaringan yang digunakan pada laptop Anda. Contoh http://192.168.1.59:5000 , ganti 192.168.1.59 dengan jaringan anda.

3. Menyalakan XAMPP:
Pastikan XAMPP dalam keadaan menyala untuk menjalankan server MySQL dan Apache.

Run Backend menggunakan CMD
1. cd backend
2. myenv\Scripts\activate
3. python main.py

Run Frontend menggunakan CMD
1. cd frontendd
2. npm start
