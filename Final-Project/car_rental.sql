-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 20, 2024 at 07:39 PM
-- Server version: 8.0.30
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `car_rental`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int NOT NULL,
  `nama_admin` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mobil`
--

CREATE TABLE `mobil` (
  `mobil_id` int NOT NULL,
  `nama_mobil` varchar(100) NOT NULL,
  `warna` varchar(20) NOT NULL,
  `transmisi` varchar(100) NOT NULL,
  `harga_sewa` varchar(100) NOT NULL,
  `fasilitas` varchar(100) DEFAULT NULL,
  `jumlah_kursi` int NOT NULL,
  `gambar` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mobil`
--

INSERT INTO `mobil` (`mobil_id`, `nama_mobil`, `warna`, `transmisi`, `harga_sewa`, `fasilitas`, `jumlah_kursi`, `gambar`) VALUES
(1, 'Mobil 12', 'Merah', 'Manual', '120000', 'Mantap lengkap', 4, '8cabf381-c61e-49b1-b390-8272bfa35bd9-removebg-preview.png'),
(2, 'Mobil 11', 'Biru', 'CVT', '150000', 'Mantp jos', 2, 'AI-BX01.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
--

CREATE TABLE `pembayaran` (
  `pembayaran_id` int NOT NULL,
  `pemesanan_id` int DEFAULT NULL,
  `bukti_pembayaran` varchar(255) DEFAULT NULL,
  `jumlah_pembayaran` varchar(100) NOT NULL,
  `status_pembayaran` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pembayaran`
--

INSERT INTO `pembayaran` (`pembayaran_id`, `pemesanan_id`, `bukti_pembayaran`, `jumlah_pembayaran`, `status_pembayaran`) VALUES
(2, 1, '8cabf381-c61e-49b1-b390-8272bfa35bd9-removebg-preview.png', '240000', 'Menunggu Konfirmasi');

-- --------------------------------------------------------

--
-- Table structure for table `pemesanan`
--

CREATE TABLE `pemesanan` (
  `pemesanan_id` int NOT NULL,
  `mobil_id` int DEFAULT NULL,
  `pengguna_id` int DEFAULT NULL,
  `tanggal_pemesanan` datetime NOT NULL,
  `tanggal_pengambilan` datetime NOT NULL,
  `tanggal_pengembalian` datetime NOT NULL,
  `total_pembayaran` varchar(100) NOT NULL,
  `status_pemesanan` varchar(100) NOT NULL,
  `ktp` varchar(255) NOT NULL,
  `sim` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pemesanan`
--

INSERT INTO `pemesanan` (`pemesanan_id`, `mobil_id`, `pengguna_id`, `tanggal_pemesanan`, `tanggal_pengambilan`, `tanggal_pengembalian`, `total_pembayaran`, `status_pemesanan`, `ktp`, `sim`) VALUES
(1, 1, 2, '2024-06-21 00:00:00', '2024-06-21 00:00:00', '2024-06-23 00:00:00', '240000', 'Sudah Dibayar', '8cabf381-c61e-49b1-b390-8272bfa35bd9.jpg', '8cabf381-c61e-49b1-b390-8272bfa35bd9-removebg-preview.png'),
(2, 2, 2, '2024-06-27 00:00:00', '2024-06-28 00:00:00', '2024-06-30 00:00:00', '300000', 'Menunggu Pembayaran', '8cabf381-c61e-49b1-b390-8272bfa35bd9.jpg', 'AI-BX01.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

CREATE TABLE `pengguna` (
  `pengguna_id` int NOT NULL,
  `nama_lengkap` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` varchar(100) NOT NULL,
  `nomor_telepon` varchar(15) NOT NULL,
  `role` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengguna`
--

INSERT INTO `pengguna` (`pengguna_id`, `nama_lengkap`, `email`, `password_hash`, `alamat`, `nomor_telepon`, `role`) VALUES
(1, 'Ademin', 'admin@gmail.com', 'scrypt:32768:8:1$AgO8Rch6d1SCRcsy$49c1ee5119feb31f8607371e09a5e1945ee7186693db6edaed307680546cec853cdf22d2df4b49aa36e0cda7d5804336b544ba865b3e0fed8e1d8aa38db3ad86', 'Jl. Merpati No. 123, Jakarta', '081234567890', 'admin'),
(2, 'User', 'user@mobil.com', 'scrypt:32768:8:1$D5ND2L7YXBVniyjM$5bf1f59903a2e1f0fe226c44a311c70701c16952a11a67d439ff668d1256cf4bedecf98b564c477475374da630adfdd7c9d575f7668b9c225635cef9d69e1f67', 'Alamat', '0882233222', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `mobil`
--
ALTER TABLE `mobil`
  ADD PRIMARY KEY (`mobil_id`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`pembayaran_id`),
  ADD KEY `pemesanan_id` (`pemesanan_id`);

--
-- Indexes for table `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD PRIMARY KEY (`pemesanan_id`),
  ADD KEY `mobil_id` (`mobil_id`),
  ADD KEY `pengguna_id` (`pengguna_id`);

--
-- Indexes for table `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`pengguna_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mobil`
--
ALTER TABLE `mobil`
  MODIFY `mobil_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `pembayaran_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pemesanan`
--
ALTER TABLE `pemesanan`
  MODIFY `pemesanan_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `pengguna_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`pemesanan_id`) REFERENCES `pemesanan` (`pemesanan_id`);

--
-- Constraints for table `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD CONSTRAINT `pemesanan_ibfk_1` FOREIGN KEY (`mobil_id`) REFERENCES `mobil` (`mobil_id`),
  ADD CONSTRAINT `pemesanan_ibfk_2` FOREIGN KEY (`pengguna_id`) REFERENCES `pengguna` (`pengguna_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
