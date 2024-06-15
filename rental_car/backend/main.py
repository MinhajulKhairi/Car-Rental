from datetime import datetime
from flask import Flask, jsonify, request
from model.models import db, Admin, User, Pemesanan, Pembayaran, Mobil
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from werkzeug.utils import secure_filename


app = Flask(__name__)
app.secret_key = "secret key"
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root@localhost/car_rental"
app.config['JWT_SECRET_KEY'] = "your_secret_key"
app.config['UPLOAD_FOLDER'] = 'uploads/'

db.init_app(app)

jwt = JWTManager(app)


@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({"message": "Akses gagal. Harap berikan token yang valid"}), 401


@jwt.expired_token_loader
def expired_token_response(jwt_header, jwt_payload):
    return jsonify({"message": "Token expired. Silahkan login ulang"}), 401


@app.route("/users/register", methods=["POST"])
def register_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('nama_lengkap'):
        return jsonify({"message": "Data tidak lengkap"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email sudah terdaftar"}), 400

    new_user = User(
        nama_lengkap=data['nama_lengkap'],
        email=data['email'],
        alamat=data.get('alamat'),
        password=data.get('password'),
        nomor_telepon=data.get('nomor_telepon')
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Pengguna berhasil didaftarkan"}), 201


@app.route("/users/login", methods=["POST"])
def login_user():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Data tidak lengkap"}), 400

    user = User.query.filter_by(email=data.get("email")).first()
    if user and user.verify_password(data['password']):
        access_token = create_access_token(identity=user.pengguna_id)
        return jsonify({
            "pengguna_id": user.pengguna_id,
            "nama_lengkap": user.nama_lengkap,
            "email": user.email,
            "alamat": user.alamat,
            "nomor_telepon": user.nomor_telepon,
            "access_token": access_token
        }), 200
    else:
        return jsonify({"message": "Email atau password salah"}), 401


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
        "nomor_telepon": user.nomor_telepon,
    }
    return jsonify({"user": user_data}), 200


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


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}


@app.route('/cars', methods=['POST'])
@jwt_required()
def add_car():
    data = request.form
    if 'gambar' not in request.files or not allowed_file(request.files['gambar'].filename):
        return jsonify({"message": "File gambar tidak valid"}), 400

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

    return jsonify({"message": "Mobil berhasil ditambahkan"}), 201


@app.route('/cars', methods=['GET'])
def get_all_cars():
    cars = Mobil.query.all()
    cars_list = []
    for car in cars:
        car_data = {
            'mobil_id': car.mobil_id,
            'nama_mobil': car.nama_mobil,
            'warna': car.warna,
            'transmisi': car.transmisi,
            'harga_sewa': car.harga_sewa,
            'fasilitas': car.fasilitas,
            'jumlah_kursi': car.jumlah_kursi,
            'gambar': car.gambar
        }
        cars_list.append(car_data)

    return jsonify(cars_list), 200


@app.route('/cars/<int:car_id>', methods=['GET'])
def get_car_by_id(car_id):
    car = Mobil.query.get(car_id)
    if car is None:
        return jsonify({"message": "Mobil tidak ditemukan"}), 404

    car_data = {
        'mobil_id': car.mobil_id,
        'nama_mobil': car.nama_mobil,
        'warna': car.warna,
        'transmisi': car.transmisi,
        'harga_sewa': car.harga_sewa,
        'fasilitas': car.fasilitas,
        'jumlah_kursi': car.jumlah_kursi,
        'gambar': car.gambar
    }
    return jsonify(car_data), 200


@app.route('/cars/<int:car_id>', methods=['PUT'])
@jwt_required()
def update_car(car_id):
    car = Mobil.query.get(car_id)
    if car is None:
        return jsonify({"message": "Mobil tidak ditemukan"}), 404

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

    return jsonify({"message": "Mobil berhasil diperbarui"}), 200


@app.route('/cars/<int:car_id>', methods=['DELETE'])
@jwt_required()
def delete_car(car_id):
    car = Mobil.query.get(car_id)
    if car is None:
        return jsonify({"message": "Mobil tidak ditemukan"}), 404

    db.session.delete(car)
    db.session.commit()

    return jsonify({"message": "Mobil berhasil dihapus"}), 200


@app.route("/pemesanan", methods=["POST"])
@jwt_required()
def create_pemesanan():
    data = request.get_json()
    new_pemesanan = Pemesanan(
        pengguna_id=data['pengguna_id'],
        mobil_id=data['mobil_id'],
        tanggal_pemesanan=datetime.strptime(data['tanggal_pemesanan'], "%Y-%m-%d"),
        tanggal_pengembalian=datetime.strptime(data['tanggal_pengembalian'], "%Y-%m-%d"),
        status_pemesanan=data['status_pemesanan'],
        total_harga=data['total_harga']
    )
    db.session.add(new_pemesanan)
    db.session.commit()
    return jsonify({"message": "Pemesanan berhasil dibuat"}), 201


@app.route("/pemesanan", methods=["GET"])
@jwt_required()
def get_all_pemesanan():
    pemesanan_list = Pemesanan.query.all()
    result = []
    for pemesanan in pemesanan_list:
        pemesanan_data = {
            "pemesanan_id": pemesanan.pemesanan_id,
            "pengguna_id": pemesanan.pengguna_id,
            "mobil_id": pemesanan.mobil_id,
            "tanggal_pemesanan": pemesanan.tanggal_pemesanan.strftime("%Y-%m-%d"),
            "tanggal_pengembalian": pemesanan.tanggal_pengembalian.strftime("%Y-%m-%d"),
            "status_pemesanan": pemesanan.status_pemesanan,
            "total_harga": pemesanan.total_harga
        }
        result.append(pemesanan_data)
    return jsonify(result), 200


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


@app.route("/pemesanan/<int:pemesanan_id>", methods=["DELETE"])
@jwt_required()
def delete_pemesanan(pemesanan_id):
    pemesanan = Pemesanan.query.get(pemesanan_id)
    if not pemesanan:
        return jsonify({"message": "Pemesanan tidak ditemukan"}), 404

    db.session.delete(pemesanan)
    db.session.commit()
    return jsonify({"message": "Pemesanan berhasil dihapus"}), 200


@app.route("/pembayaran", methods=["POST"])
@jwt_required()
def create_pembayaran():
    data = request.get_json()
    new_pembayaran = Pembayaran(
        pemesanan_id=data['pemesanan_id'],
        tanggal_pembayaran=datetime.strptime(data['tanggal_pembayaran'], "%Y-%m-%d"),
        jumlah_pembayaran=data['jumlah_pembayaran'],
        metode_pembayaran=data['metode_pembayaran'],
        status_pembayaran=data['status_pembayaran']
    )
    db.session.add(new_pembayaran)
    db.session.commit()
    return jsonify({"message": "Pembayaran berhasil dibuat"}), 201


@app.route("/pembayaran", methods=["GET"])
@jwt_required()
def get_all_pembayaran():
    pembayaran_list = Pembayaran.query.all()
    result = []
    for pembayaran in pembayaran_list:
        pembayaran_data = {
            "pembayaran_id": pembayaran.pembayaran_id,
            "pemesanan_id": pembayaran.pemesanan_id,
            "tanggal_pembayaran": pembayaran.tanggal_pembayaran.strftime("%Y-%m-%d"),
            "jumlah_pembayaran": pembayaran.jumlah_pembayaran,
            "metode_pembayaran": pembayaran.metode_pembayaran,
            "status_pembayaran": pembayaran.status_pembayaran
        }
        result.append(pembayaran_data)
    return jsonify(result), 200


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


@app.route("/pembayaran/<int:pembayaran_id>", methods=["DELETE"])
@jwt_required()
def delete_pembayaran(pembayaran_id):
    pembayaran = Pembayaran.query.get(pembayaran_id)
    if not pembayaran:
        return jsonify({"message": "Pembayaran tidak ditemukan"}), 404

    db.session.delete(pembayaran)
    db.session.commit()
    return jsonify({"message": "Pembayaran berhasil dihapus"}), 200


if __name__ == '__main__':
    app.run(debug=True)
