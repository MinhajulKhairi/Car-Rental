from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash


db = SQLAlchemy()

class Admin(db.Model):
    __tablename__ = 'admin'
    admin_id = db.Column(db.Integer, primary_key=True)
    nama_admin = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

class User(db.Model):
    __tablename__ = 'pengguna'
    pengguna_id = db.Column(db.Integer, primary_key=True)
    nama_lengkap = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    alamat = db.Column(db.String(255), nullable=True)
    nomor_telepon = db.Column(db.String(20), nullable=True)
    role = db.Column(db.String(50), nullable=False)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

class Pemesanan(db.Model):
    pemesanan_id = db.Column(db.Integer, primary_key=True)
    mobil_id = db.Column(db.Integer, db.ForeignKey('mobil.mobil_id'), nullable=False)
    pengguna_id = db.Column(db.Integer, db.ForeignKey('pengguna.pengguna_id'), nullable=False)
    tanggal_pemesanan = db.Column(db.DateTime, nullable=False)
    tanggal_pengambilan = db.Column(db.DateTime, nullable=False)
    tanggal_pengembalian = db.Column(db.DateTime, nullable=False)
    total_pembayaran = db.Column(db.Float, nullable=False)  # Changed from total_pembayaran to total_harga
    status_pemesanan = db.Column(db.String(50), nullable=False)
    ktp = db.Column(db.String(255), nullable=False)
    sim = db.Column(db.String(255), nullable=False)

    mobil = db.relationship('Mobil', backref=db.backref('pemesanans', lazy=True))
    pengguna = db.relationship('User', backref=db.backref('pemesanans', lazy=True))

    def __init__(self, mobil_id, pengguna_id, tanggal_pemesanan, tanggal_pengambilan, tanggal_pengembalian, total_pembayaran, status_pemesanan, ktp, sim):
        self.mobil_id = mobil_id
        self.pengguna_id = pengguna_id
        self.tanggal_pemesanan = tanggal_pemesanan
        self.tanggal_pengambilan = tanggal_pengambilan
        self.tanggal_pengembalian = tanggal_pengembalian
        self.total_pembayaran = total_pembayaran  # Assign total_harga to total_pembayaran
        self.status_pemesanan = status_pemesanan
        self.ktp = ktp
        self.sim = sim


class Pembayaran(db.Model):
    pembayaran_id = db.Column(db.Integer, primary_key=True)
    pemesanan_id = db.Column(db.Integer, db.ForeignKey('pemesanan.pemesanan_id'), nullable=False)
    bukti_pembayaran = db.Column(db.String(255), nullable=False)
    jumlah_pembayaran = db.Column(db.Float, nullable=False)
    status_pembayaran = db.Column(db.String(50), nullable=False)

    pemesanan = db.relationship('Pemesanan', backref=db.backref('pembayarans', lazy=True))

class Mobil(db.Model):
    mobil_id = db.Column(db.Integer, primary_key=True)
    nama_mobil = db.Column(db.String(100), nullable=False)
    warna = db.Column(db.String(50), nullable=False)
    transmisi = db.Column(db.String(50), nullable=False)
    harga_sewa = db.Column(db.Float, nullable=False)
    fasilitas = db.Column(db.String(255), nullable=True)
    jumlah_kursi = db.Column(db.Integer, nullable=False)
    gambar = db.Column(db.String(255), nullable=True)
