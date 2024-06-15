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
    total_pembayaran = db.Column(db.Float, nullable=False)
    status_pemesanan = db.Column(db.String(50), nullable=False)

    mobil = db.relationship('Mobil', backref=db.backref('pemesanans', lazy=True))
    pengguna = db.relationship('User', backref=db.backref('pemesanans', lazy=True))

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
