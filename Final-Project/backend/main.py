from datetime import datetime
from flask import Flask, jsonify, request
from model.models import db, Admin, User, Pemesanan, Pembayaran, Mobil
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from flask import send_file
from datetime import datetime

# Konfigurasi aplikasi
app = Flask(__name__)
CORS(app)
app.secret_key = "secret key"
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root@localhost/car_rental"
app.config['JWT_SECRET_KEY'] = "your_secret_key"
app.config['UPLOAD_FOLDER'] = 'uploads/'

# Inisialisasi Komponen
db.init_app(app)

jwt = JWTManager(app)


# Fungsi-fungsi dekorator
@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({"message": "Akses gagal. Harap berikan token yang valid"}), 401

@jwt.expired_token_loader
def expired_token_response(jwt_header, jwt_payload):
    return jsonify({"message": "Token expired. Silahkan login ulang"}), 401


# Endpoint register user
@app.route("/users/register", methods=["POST"])
def register_user():
    data = request.get_json()
    
    status = 400
    message = "Data tidak lengkap"
    success = False

    if not data or not data.get('email') or not data.get('password') or not data.get('nama_lengkap'):

        return jsonify({"message": "Data tidak lengkap", "success": False}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email sudah terdaftar", "success": False}), 400

    new_user = User(
        nama_lengkap=data['nama_lengkap'],
        email=data['email'],
        alamat=data.get('alamat'),
        password=data.get('password'),
        nomor_telepon=data.get('nomor_telepon'),
        role=data.get('role')
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Pengguna berhasil didaftarkan", "success": True}), 201



# Endpoint untuk autentikasi pengguna saat login, memproses permintaan login pengguna
@app.route("/users/login", methods=["POST"])
def login_user():
    status = 400
    message = "Data tidak lengkap"
    success = False
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Data tidak lengkap", "success": False}), 400

    user = User.query.filter_by(email=data.get("email")).first()
    if user and user.verify_password(data['password']):
        access_token = create_access_token(identity=user.pengguna_id)
        data = {
            "pengguna_id": user.pengguna_id,
            "nama_lengkap": user.nama_lengkap,
            "email": user.email,
            "alamat": user.alamat,
            "nomor_telepon": user.nomor_telepon,
            "access_token": access_token,
            "role": user.role
        }
        return jsonify({"user": data, "success": True}), 200
    else:
        return jsonify({"message": "Email atau password salah", "success": False}), 401


# Endpoint untuk mengambil data profil pengguna yang sedang login
@app.route("/users/profile", methods=["GET"])
@jwt_required()
def user_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    user_data = {
        "pengguna_id": user.pengguna_id,
        "nama_lengkap": user.nama_lengkap,
        "email": user.email,
        "alamat": user.alamat,
        "id": "user.pengguna_id",  # tambahkan
        "nomor_telepon": user.nomor_telepon,
        "role": "user.role"  # tambahkan
    }
    return jsonify({"user": user_data}), 200


# Endpoint untuk memperbarui/update informasi profil
@app.route("/users/profile_update", methods=["PUT"])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()
    if 'nama_lengkap' in data:
        user.nama_lengkap = data['nama_lengkap']
    if 'alamat' in data:
        user.alamat = data['alamat']
    if 'nomor_telepon' in data:
        user.nomor_telepon = data['nomor_telepon']
    if 'password' in data:
        user.password = data['password']

    db.session.commit()

    user_data = {
        "pengguna_id": user.pengguna_id,
        "nama_lengkap": user.nama_lengkap,
        "email": user.email,
        "alamat": user.alamat,
        "nomor_telepon": user.nomor_telepon,
    }
    return jsonify({"user": user_data, "message": "Profil berhasil diperbarui"}), 200


# Endpoint untuk untuk mendaftarkan admin baru dalam sistem
@app.route("/admin/register", methods=["POST"])
def register_admin():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Data tidak lengkap"}), 400

    if Admin.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email sudah terdaftar"}), 400

    new_admin = Admin(
        nama_admin=data['nama_admin'],
        email=data['email'],
        password=data['password'],
    )

    db.session.add(new_admin)
    db.session.commit()

    return jsonify({"message": "Admin berhasil didaftarkan"}), 201


# Endpoint untuk melakukan proses login admin ke dalam sistem
@app.route("/admin/login", methods=["POST"])
def login_admin():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Data tidak lengkap"}), 400

    admin = Admin.query.filter_by(email=data['email']).first()
    if admin and admin.verify_password(data['password']):
        access_token = create_access_token(identity=admin.admin_id)
        return jsonify({
            "admin_id": admin.admin_id,
            "nama_admin": admin.nama_admin,
            "email": admin.email,
            "access_token": access_token
        }), 200

    return jsonify({"message": "Email atau password salah"}), 401


#  untuk memeriksa apakah suatu file memiliki ekstensi yang diperbolehkan
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}


# Endpoint untuk menambahkan data mobil ke dalam database
@app.route('/cars', methods=['POST'])
@jwt_required()
def add_car():
    success = False
    data = request.form
    if 'gambar' not in request.files or not allowed_file(request.files['gambar'].filename):
        return jsonify({"message": "File gambar tidak valid", "success": False}), 400

    file = request.files['gambar']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    new_car = Mobil(
        nama_mobil=data.get('nama_mobil'),
        warna=data.get('warna'),
        transmisi=data.get('transmisi'),
        harga_sewa=data.get('harga_sewa'),
        fasilitas=data.get('fasilitas'),
        jumlah_kursi=data.get('jumlah_kursi'),
        gambar=filename
    )

    db.session.add(new_car)
    db.session.commit()

    return jsonify({"message": "Mobil berhasil ditambahkan", "success": True}), 201


# Endpoint untuk mengambil daftar semua mobil dari database
@app.route('/cars', methods=['GET'])
def get_all_cars():
    cars = Mobil.query.all()
    cars_list = []
    image_path = "cars_image/"
    today = datetime.today().date()

    for car in cars:
        status = 'Tersedia'
        for pemesanan in car.pemesanans:
            if pemesanan.tanggal_pengambilan.date() <= today <= pemesanan.tanggal_pengembalian.date():
                status = 'Disewa'
                break

        car_data = {
            'mobil_id': car.mobil_id,
            'nama_mobil': car.nama_mobil,
            'warna': car.warna,
            'transmisi': car.transmisi,
            'harga_sewa': car.harga_sewa,
            'fasilitas': car.fasilitas,
            'jumlah_kursi': car.jumlah_kursi,
            'gambar': image_path + car.gambar,
            'status': status
        }
        cars_list.append(car_data)

    return jsonify(cars_list), 200


# Endpoint untuk mengambil sejumlah mobil (maksimal 4 mobil) dari database untuk ditampilkan di HomePage
@app.route('/carshome', methods=['GET'])
def get_some_cars():
    # max 4 mobil
    cars = Mobil.query.limit(4).all()
    cars_list = []
    image_path = "cars_image/"
    today = datetime.today().date()

    for car in cars:
        status = 'Tersedia'
        for pemesanan in car.pemesanans:
            if pemesanan.tanggal_pengambilan.date() <= today <= pemesanan.tanggal_pengembalian.date():
                status = 'Disewa'
                break

        car_data = {
            'mobil_id': car.mobil_id,
            'nama_mobil': car.nama_mobil,
            'warna': car.warna,
            'transmisi': car.transmisi,
            'harga_sewa': car.harga_sewa,
            'fasilitas': car.fasilitas,
            'jumlah_kursi': car.jumlah_kursi,
            'gambar': image_path + car.gambar,
            'status': status
        }
        cars_list.append(car_data)

    return jsonify(cars_list), 200


# Endpoint untuk mengambil informasi sebuah mobil berdasarkan ID mobil
@app.route('/cars/<int:car_id>', methods=['GET'])
def get_car_by_id(car_id):
    car = Mobil.query.get(car_id)
    image_path = "cars_image/"
    if car is None:
        return jsonify({"message": "Mobil tidak ditemukan", "success": False}), 404

    car_data = {
        'mobil_id': car.mobil_id,
        'nama_mobil': car.nama_mobil,
        'warna': car.warna,
        'transmisi': car.transmisi,
        'harga_sewa': car.harga_sewa,
        'fasilitas': car.fasilitas,
        'jumlah_kursi': car.jumlah_kursi,
        'gambar': image_path + car.gambar
    }
    return jsonify(car_data), 200


# Endpoint  untuk memperbarui informasi mobil berdasarkan ID mobil di admin
@app.route('/cars/<int:car_id>', methods=['PUT'])
@jwt_required()
def update_car(car_id):
    car = Mobil.query.get(car_id)
    if car is None:
        return jsonify({"message": "Mobil tidak ditemukan", "success": False}), 404

    data = request.form
    if 'gambar' in request.files and allowed_file(request.files['gambar'].filename):
        file = request.files['gambar']
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        car.gambar = filename

    car.nama_mobil = data.get('nama_mobil', car.nama_mobil)
    car.warna = data.get('warna', car.warna)
    car.transmisi = data.get('transmisi', car.transmisi)
    car.harga_sewa = data.get('harga_sewa', car.harga_sewa)
    car.fasilitas = data.get('fasilitas', car.fasilitas)
    car.jumlah_kursi = data.get('jumlah_kursi', car.jumlah_kursi)

    db.session.commit()

    return jsonify({"message": "Mobil berhasil diperbarui", "success": True}), 200


# Endpoint untuk menghapus data mobil dari database berdasarkan ID mobil
@app.route('/cars/<int:car_id>', methods=['DELETE'])
@jwt_required()
def delete_car(car_id):
    car = Mobil.query.get(car_id)
    if car is None:
        return jsonify({"message": "Mobil tidak ditemukan", "success": False}), 404

    pemesanans = Pemesanan.query.filter_by(mobil_id=car_id).all()
    for pemesanan in pemesanans:
        pembayarans = Pembayaran.query.filter_by(pemesanan_id=pemesanan.pemesanan_id).all()
        for pembayaran in pembayarans:
            db.session.delete(pembayaran)
        db.session.delete(pemesanan)

    db.session.delete(car)
    db.session.commit()

    return jsonify({"message": "Mobil berhasil dihapus", "success": True}), 200


# memeriksa apakah ekstensi file yang diberikan termasuk dalam kumpulan ekstensi file yang diperbolehkan
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Endpoint untuk membuat pesanan baru
@app.route("/pemesanan", methods=["POST"])
@jwt_required()
def create_pemesanan():
    data = request.form
    if 'ktp' not in request.files or not allowed_file(request.files['ktp'].filename):
        return jsonify({"message": "File ktp tidak valid", "success": False}), 400

    file = request.files['ktp']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    if 'sim' not in request.files or not allowed_file(request.files['sim'].filename):
        return jsonify({"message": "File sim tidak valid", "success": False}), 400

    filesim = request.files['sim']
    if filesim and allowed_file(filesim.filename):
        filenamesim = secure_filename(filesim.filename)
        filesim.save(os.path.join(app.config['UPLOAD_FOLDER'], filenamesim))

    # Calculate total_harga based on rental duration and car price
    mobil = Mobil.query.get(data['mobil_id'])
    if not mobil:
        return jsonify({"message": "Mobil tidak ditemukan", "success": False}), 404

    tanggal_pemesanan = datetime.strptime(data['tanggal_pemesanan'], "%Y-%m-%d")
    tanggal_pengambilan = datetime.strptime(data['tanggal_pengambilan'], "%Y-%m-%d")
    tanggal_pengembalian = datetime.strptime(data['tanggal_pengembalian'], "%Y-%m-%d")
    
    # Calculate rental duration in days
    rental_duration = (tanggal_pengembalian - tanggal_pengambilan).days

    # Calculate total_harga
    total_harga = rental_duration * mobil.harga_sewa

    new_pemesanan = Pemesanan(
        pengguna_id=data['pengguna_id'],
        mobil_id=data['mobil_id'],
        tanggal_pemesanan=tanggal_pemesanan,
        tanggal_pengambilan=tanggal_pengambilan,
        tanggal_pengembalian=tanggal_pengembalian,
        total_pembayaran=total_harga,
        status_pemesanan=data['status_pemesanan'],
        ktp=filename,
        sim=filenamesim
    )
    db.session.add(new_pemesanan)
    db.session.commit()
    return jsonify({"message": "Pemesanan berhasil dibuat", "success": True}), 201


# Endpoint untuk mengambil semua data pemesanan dari database
@app.route("/pemesanan", methods=["GET"])
@jwt_required()
def get_all_pemesanan():
    pemesanan_list = Pemesanan.query.all()
    result = []
    for pemesanan in pemesanan_list:
        #ambil data table user
        user = db.session.get(User, pemesanan.pengguna_id)
        if not user:
            return jsonify({"message": "Pengguna tidak ditemukan", "success": False}), 404

        pemesanan_data = {
            "pemesanan_id": pemesanan.pemesanan_id,
            "pengguna_id": pemesanan.pengguna_id,
            "nama_lengkap" : user.nama_lengkap,
            "email" : user.email,
            "mobil_id": pemesanan.mobil_id,
            "tanggal_pemesanan": pemesanan.tanggal_pemesanan.strftime("%Y-%m-%d"),
            "tanggal_pengembalian": pemesanan.tanggal_pengembalian.strftime("%Y-%m-%d"),
            "status_pemesanan": pemesanan.status_pemesanan,
            "total_harga": pemesanan.total_pembayaran,
            "sim": pemesanan.sim,
            "ktp": pemesanan.ktp
        }
        result.append(pemesanan_data)
    return jsonify(result), 200


# Endpoint untuk mengambil semua data pemesanan yang berkaitan dengan pengguna tertentu berdasarkan ID pengguna
@app.route("/pemesanan/pengguna/<int:pengguna_id>", methods=["GET"])
@jwt_required()
def get_pemesanan_by_pengguna_id(pengguna_id):
    # Ambil pemesanan berdasarkan pengguna_id dengan status_pemesanan 'Menunggu Pembayaran'
    pemesanans = Pemesanan.query.filter_by(pengguna_id=pengguna_id, status_pemesanan='Menunggu Pembayaran').all()
    pemesanan_list = []
    for pemesanan in pemesanans:
        mobil = db.session.get(Mobil, pemesanan.mobil_id)  # Menggunakan db.session.get() untuk mengambil Mobil berdasarkan ID
        if not mobil:
            continue  # Skip jika mobil tidak ditemukan

        pemesanan_data = {
            'pemesanan_id': pemesanan.pemesanan_id,
            'nama_mobil': mobil.nama_mobil,
            'tanggal_pengambilan': pemesanan.tanggal_pengambilan.strftime("%Y-%m-%d"),
            'tanggal_pengembalian': pemesanan.tanggal_pengembalian.strftime("%Y-%m-%d"),
            'total_pembayaran': pemesanan.total_pembayaran,
        }
        pemesanan_list.append(pemesanan_data)
    # print(pemesanan_list)
    print (pemesanan_list)

    if not pemesanan_list:
        return jsonify({"message": "Tidak ada pemesanan yang belum dibayar", "success": False}), 404

    return jsonify({"pemesanan": pemesanan_list, "success": True}), 200


# Endpoint untuk mengambil data pemesanan berdasarkan ID pemesanan
@app.route("/pemesanan/<int:pemesanan_id>", methods=["GET"])
@jwt_required()
def get_pemesanan_by_id(pemesanan_id):
    pemesanan = Pemesanan.query.get(pemesanan_id)
    if not pemesanan:
        return jsonify({"message": "Pemesanan tidak ditemukan"}), 404

    pemesanan_data = {
        "pemesanan_id": pemesanan.pemesanan_id,
        "pengguna_id": pemesanan.pengguna_id,
        "mobil_id": pemesanan.mobil_id,
        "tanggal_pemesanan": pemesanan.tanggal_pemesanan.strftime("%Y-%m-%d"),
        "tanggal_pengembalian": pemesanan.tanggal_pengembalian.strftime("%Y-%m-%d"),
        "status_pemesanan": pemesanan.status_pemesanan,
        "total_harga": pemesanan.total_harga
    }
    return jsonify(pemesanan_data), 200


# Endpoint untuk memperbarui data pemesanan
@app.route("/pemesanan/<int:pemesanan_id>", methods=["PUT"])
@jwt_required()
def update_pemesanan(pemesanan_id):
    pemesanan = Pemesanan.query.get(pemesanan_id)
    if not pemesanan:
        return jsonify({"message": "Pemesanan tidak ditemukan"}), 404

    data = request.get_json()
    pemesanan.pengguna_id = data.get('pengguna_id', pemesanan.pengguna_id)
    pemesanan.mobil_id = data.get('mobil_id', pemesanan.mobil_id)
    pemesanan.tanggal_pemesanan = datetime.strptime(data['tanggal_pemesanan'], "%Y-%m-%d")
    pemesanan.tanggal_pengembalian = datetime.strptime(data['tanggal_pengembalian'], "%Y-%m-%d")
    pemesanan.status_pemesanan = data.get('status_pemesanan', pemesanan.status_pemesanan)
    pemesanan.total_harga = data.get('total_harga', pemesanan.total_harga)

    db.session.commit()
    return jsonify({"message": "Pemesanan berhasil diperbarui"}), 200


# Endpoint untuk menghapus data pemesanan
@app.route("/pemesanan/<int:pemesanan_id>", methods=["DELETE"])
@jwt_required()
def delete_pemesanan(pemesanan_id):
    pemesanan = Pemesanan.query.get(pemesanan_id)
    pembayaran = Pembayaran.query.filter_by(pemesanan_id=pemesanan_id).all()
    if pembayaran:
        db.session.delete(pembayaran)

    if not pemesanan:
        return jsonify({"message": "Pemesanan tidak ditemukan", "success": False}), 404

    db.session.delete(pemesanan)
    db.session.commit()
    return jsonify({"message": "Pemesanan berhasil dihapus", "success": True}), 200

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Endpoint untuk membuat data pembayaran baru
@app.route("/pembayaran", methods=["POST"])
@jwt_required()
def create_pembayaran():
    data = request.form
    # Cek apakah pemesanan_id yang diberikan valid
    pemesanan = Pemesanan.query.get(data['pemesanan_id'])
    if not pemesanan:
        # tmpilkan di log cmd
        return jsonify({"message": "Pemesanan tidak ditemukan", "success": False}), 404
    
    # Cek apakah pemesanan sudah dibayar
    if pemesanan.status_pemesanan == 'Sudah Dibayar':
        return jsonify({"message": "Pemesanan sudah dibayar", "success": False}), 400

    #cek paymentProof (file)
    if 'paymentProof' not in request.files or not allowed_file(request.files['paymentProof'].filename):
        return jsonify({"message": "File paymentProof tidak valid", "success": False}), 400

    file = request.files['paymentProof']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    # ambil tanggal hari ini
    tanggal_pembayaran = datetime.now()
    new_pembayaran = Pembayaran(
        pemesanan_id=data['pemesanan_id'],
        jumlah_pembayaran=data['jumlah_pembayaran'],
        status_pembayaran=data['status_pembayaran'],
        bukti_pembayaran=filename
    )
    db.session.add(new_pembayaran)
    db.session.commit()
    # update status pemesanan
    pemesanan.status_pemesanan = 'Sudah Dibayar'
    db.session.commit()

    return jsonify({"message": "Pembayaran berhasil dibuat"}), 201


# Endpoint  untuk mengambil semua data pembayaran dari database.
@app.route("/pembayaran", methods=["GET"])
@jwt_required()
def get_all_pembayaran():
    pembayaran_list = Pembayaran.query.all()
    result = []
    for pembayaran in pembayaran_list:
        pemesanan = db.session.get(Pemesanan, pembayaran.pemesanan_id)
        if not pemesanan:
            return jsonify({"message": "Pemesanan tidak ditemukan", "success": False}), 404
        user = db.session.get(User, pemesanan.pengguna_id)
        if not user:
            return jsonify({"message": "Pengguna tidak ditemukan", "success": False}), 404
        
        pembayaran_data = {
            "pembayaran_id": pembayaran.pembayaran_id,
            "pemesanan_id": pembayaran.pemesanan_id,
            "jumlah_pembayaran": pembayaran.jumlah_pembayaran,
            "status_pembayaran": pembayaran.status_pembayaran,
            "bukti_pembayaran": pembayaran.bukti_pembayaran,
            "nama_lengkap": user.nama_lengkap,
            "email": user.email,
        }
        result.append(pembayaran_data)
    return jsonify(result), 200


# Endpoint untuk mengambil informasi pembayaran berdasarkan ID pembayaran
@app.route("/pembayaran/<int:pembayaran_id>", methods=["GET"])
@jwt_required()
def get_pembayaran_by_id(pembayaran_id):
    pembayaran = Pembayaran.query.get(pembayaran_id)
    if not pembayaran:
        return jsonify({"message": "Pembayaran tidak ditemukan"}), 404

    pembayaran_data = {
        "pembayaran_id": pembayaran.pembayaran_id,
        "pemesanan_id": pembayaran.pemesanan_id,
        "tanggal_pembayaran": pembayaran.tanggal_pembayaran.strftime("%Y-%m-%d"),
        "jumlah_pembayaran": pembayaran.jumlah_pembayaran,
        "metode_pembayaran": pembayaran.metode_pembayaran,
        "status_pembayaran": pembayaran.status_pembayaran
    }
    return jsonify(pembayaran_data), 200


# Endpoint untuk memperbarui informasi pembayaran berdasarkan ID pembayaran
@app.route("/pembayaran/<int:pembayaran_id>", methods=["PUT"])
@jwt_required()
def update_pembayaran(pembayaran_id):
    pembayaran = Pembayaran.query.get(pembayaran_id)
    if not pembayaran:
        return jsonify({"message": "Pembayaran tidak ditemukan"}), 404

    data = request.get_json()
    pembayaran.pemesanan_id = data.get('pemesanan_id', pembayaran.pemesanan_id)
    pembayaran.tanggal_pembayaran = datetime.strptime(data['tanggal_pembayaran'], "%Y-%m-%d")
    pembayaran.jumlah_pembayaran = data.get('jumlah_pembayaran', pembayaran.jumlah_pembayaran)
    pembayaran.metode_pembayaran = data.get('metode_pembayaran', pembayaran.metode_pembayaran)
    pembayaran.status_pembayaran = data.get('status_pembayaran', pembayaran.status_pembayaran)

    db.session.commit()
    return jsonify({"message": "Pembayaran berhasil diperbarui"}), 200


# Endpoint  untuk menghapus data pembayaran berdasarkan ID pembayaran
@app.route("/pembayaran/<int:pembayaran_id>", methods=["DELETE"])
@jwt_required()
def delete_pembayaran(pembayaran_id):
    pembayaran = Pembayaran.query.get(pembayaran_id)
    if not pembayaran:
        return jsonify({"message": "Pembayaran tidak ditemukan", "success": False}), 404

    db.session.delete(pembayaran)
    db.session.commit()
    return jsonify({"message": "Pembayaran berhasil dihapus", "success": True}), 200

@app.route('/cars_image/<image_path>')
def result(image_path):
    # tampilkan gmbar hasil prediksi
    result_folder = "uploads"
    return send_file(os.path.join(result_folder, image_path), mimetype='image/jpg')


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
