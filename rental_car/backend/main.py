from datetime import datetime
from flask import Flask, jsonify, request
from backend.model.models import db
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from backend.model.models import Mobil, Admin, Pembayaran, Pemesanan, User
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = "secret key"
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root@localhost/car_rental"
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = "your_secret_key"
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['UPLOAD_FOLDER'] = 'uploads/'


db.init_app(app)

jwt = JWTManager(app)
# CORS(app)

# Define your routes below this line


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
        password= data.get('password'),
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
    if user and user.password == data['password']:
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
        user.set_password(data['password'])

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
    if admin and admin.password == data['password']:
        access_token = create_access_token(identity=admin.admin_id)
        return jsonify({
            "admin_id": admin.admin_id,
            "nama_admin": admin.nama_admin,
            "email": admin.email,
            "access_token": access_token
        }), 200

    return jsonify({"message": "Email atau password salah"}), 401






UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/mobil", methods=["POST"])
@jwt_required()
def create_mobil():
    if 'gambar' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['gambar']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        data = request.form
        nama_mobil = data.get('nama_mobil')
        warna = data.get('warna')
        transmisi = data.get('transmisi')
        harga_sewa = data.get('harga_sewa')
        fasilitas = data.get('fasilitas')
        jumlah_kursi = data.get('jumlah_kursi')
        gambar = data.get('gambar')

        mobil = Mobil(
            nama_mobil=nama_mobil,
            warna=warna,
            transmisi=transmisi,
            harga_sewa=harga_sewa,
            fasilitas=fasilitas,
            jumlah_kursi=jumlah_kursi,
            gambar=filename
        )

        db.session.add(mobil)
        db.session.commit()

        return jsonify({"message": "Mobil berhasil ditambahkan", "mobil_id": mobil.mobil_id}), 201

    return jsonify({"message": "Invalid file type"}), 400




@app.route("/mobil/<int:mobil_id>", methods=["GET"])
@jwt_required()
def get_mobil(mobil_id):
    mobil = Mobil.query.get(mobil_id)
    if not mobil:
        return jsonify({"message": "Mobil tidak ditemukan"}), 404

    mobil_data = {
        "mobil_id": mobil.mobil_id,
        "nama_mobil": mobil.nama_mobil,
        "warna": mobil.warna,
        "transmisi": mobil.transmisi,
        "harga_sewa": mobil.harga_sewa,
        "fasilitas": mobil.fasilitas,
        "jumlah_kursi": mobil.jumlah_kursi,
        "gambar": mobil.gambar,
    }
    return jsonify({"mobil": mobil_data}), 200


@app.route("/mobil", methods=["GET"])
@jwt_required()
def get_all_mobil():
    mobil_list = Mobil.query.all()
    mobil_data = []
    for mobil in mobil_list:
        mobil_data.append({
            "mobil_id": mobil.mobil_id,
            "nama_mobil": mobil.nama_mobil,
            "warna": mobil.warna,
            "transmisi": mobil.transmisi,
            "harga_sewa": mobil.harga_sewa,
            "fasilitas": mobil.fasilitas,
            "jumlah_kursi": mobil.jumlah_kursi,
            "gambar": mobil.gambar,
        })
    return jsonify({"mobils": mobil_data}), 200



@app.route("/mobil/<int:mobil_id>", methods=["PUT"])
@jwt_required()
def update_mobil(mobil_id):
    mobil = Mobil.query.get(mobil_id)
    if not mobil:
        return jsonify({"message": "Mobil tidak ditemukan"}), 404

    data = request.form
    if 'nama_mobil' in data:
        mobil.nama_mobil = data['nama_mobil']
    if 'warna' in data:
        mobil.warna = data['warna']
    if 'transmisi' in data:
        mobil.transmisi = data['transmisi']
    if 'harga_sewa' in data:
        mobil.harga_sewa = data['harga_sewa']
    if 'fasilitas' in data:
        mobil.fasilitas = data['fasilitas']
    if 'jumlah_kursi' in data:
        mobil.jumlah_kursi = data['jumlah_kursi']

    if 'gambar' in request.files:
        file = request.files['gambar']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            mobil.gambar = filename

    db.session.commit()

    mobil_data = {
        "mobil_id": mobil.mobil_id,
        "nama_mobil": mobil.nama_mobil,
        "warna": mobil.warna,
        "transmisi": mobil.transmisi,
        "harga_sewa": mobil.harga_sewa,
        "fasilitas": mobil.fasilitas,
        "jumlah_kursi": mobil.jumlah_kursi,
        "gambar": mobil.gambar,
    }
    return jsonify({"mobil": mobil_data, "message": "Mobil berhasil diperbarui"}), 200




@app.route("/mobil/<int:mobil_id>", methods=["DELETE"])
@jwt_required()
def delete_mobil(mobil_id):
    mobil = Mobil.query.get(mobil_id)
    if not mobil:
        return jsonify({"message": "Mobil tidak ditemukan"}), 404

    db.session.delete(mobil)
    db.session.commit()
    return jsonify({"message": "Mobil berhasil dihapus"}), 200







UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/pembayaran", methods=["POST"])
@jwt_required()
def create_pembayaran():
    if 'bukti_pembayaran' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['bukti_pembayaran']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        data = request.form
        pemesanan_id = data.get('pemesanan_id')
        jumlah_pembayaran = data.get('jumlah_pembayaran')

        pembayaran = Pembayaran(
            pemesanan_id=pemesanan_id,
            bukti_pembayaran=filename,
            jumlah_pembayaran=jumlah_pembayaran,
            status_pembayaran='terbayar'
        )

        db.session.add(pembayaran)
        db.session.commit()

        return jsonify({"message": "Pembayaran berhasil dilakukan", "pembayaran_id": pembayaran.pembayaran_id}), 201

    return jsonify({"message": "Invalid file type"}), 400




@app.route("/pembayaran/<int:pembayaran_id>", methods=["GET"])
@jwt_required()
def get_pembayaran(pembayaran_id):
    pembayaran = Pembayaran.query.get(pembayaran_id)
    if not pembayaran:
        return jsonify({"message": "Pembayaran tidak ditemukan"}), 404

    pembayaran_data = {
        "pembayaran_id": pembayaran.pembayaran_id,
        "pemesanan_id": pembayaran.pemesanan_id,
        "bukti_pembayaran": pembayaran.bukti_pembayaran,
        "jumlah_pembayaran": pembayaran.jumlah_pembayaran,
        "status_pembayaran": pembayaran.status_pembayaran,
    }
    return jsonify({"pembayaran": pembayaran_data}), 200



@app.route("/pembayaran/<int:pembayaran_id>", methods=["PUT"])
@jwt_required()
def update_pembayaran(pembayaran_id):
    pembayaran = Pembayaran.query.get(pembayaran_id)
    if not pembayaran:
        return jsonify({"message": "Pembayaran tidak ditemukan"}), 404

    data = request.form
    if 'jumlah_pembayaran' in data:
        pembayaran.jumlah_pembayaran = data['jumlah_pembayaran']
    if 'status_pembayaran' in data:
        pembayaran.status_pembayaran = data['status_pembayaran']

    db.session.commit()

    pembayaran_data = {
        "pembayaran_id": pembayaran.pembayaran_id,
        "pemesanan_id": pembayaran.pemesanan_id,
        "bukti_pembayaran": pembayaran.bukti_pembayaran,
        "jumlah_pembayaran": pembayaran.jumlah_pembayaran,
        "status_pembayaran": pembayaran.status_pembayaran,
    }
    return jsonify({"pembayaran": pembayaran_data, "message": "Pembayaran berhasil diperbarui"}), 200



@app.route("/pembayaran/<int:pembayaran_id>", methods=["DELETE"])
@jwt_required()
def delete_pembayaran(pembayaran_id):
    pembayaran = Pembayaran.query.get(pembayaran_id)
    if not pembayaran:
        return jsonify({"message": "Pembayaran tidak ditemukan"}), 404

    db.session.delete(pembayaran)
    db.session.commit()
    return jsonify({"message": "Pembayaran berhasil dihapus"}), 200





@app.route("/pemesanan", methods=["POST"])
@jwt_required()
def create_pemesanan():
    current_user_id = get_jwt_identity()
    data = request.json  # Assuming JSON input for simplicity and consistency

    try:
        mobil_id = data.get('mobil_id')
        tanggal_pemesanan = datetime.strptime(data.get('tanggal_pemesanan'), '%Y-%m-%dT%H:%M:%S')
        tanggal_pengambilan = datetime.strptime(data.get('tanggal_pengambilan'), '%Y-%m-%dT%H:%M:%S')
        tanggal_pengembalian = datetime.strptime(data.get('tanggal_pengembalian'), '%Y-%m-%dT%H:%M:%S')
    except (ValueError, TypeError) as e:
        return jsonify({"message": "Invalid date format, expected format is 'YYYY-MM-DDTHH:MM:SS'"}), 400

    # Calculate total pembayaran
    mobil = Mobil.query.get(mobil_id)
    if not mobil:
        return jsonify({"message": "Mobil tidak ditemukan"}), 404

    days_rented = (tanggal_pengembalian - tanggal_pengambilan).days
    if days_rented < 1:
        return jsonify({"message": "Tanggal pengembalian harus setelah tanggal pengambilan"}), 400

    total_pembayaran = mobil.harga_sewa * days_rented

    new_pemesanan = Pemesanan(
        mobil_id=mobil_id,
        pengguna_id=current_user_id,
        tanggal_pemesanan=tanggal_pemesanan,
        tanggal_pengambilan=tanggal_pengambilan,
        tanggal_pengembalian=tanggal_pengembalian,
        total_pembayaran=total_pembayaran,
        status_pemesanan='aktif'
    )
    db.session.add(new_pemesanan)
    db.session.commit()

    return jsonify({"message": "Pemesanan berhasil dibuat", "pemesanan_id": new_pemesanan.pemesanan_id}), 201




@app.route("/pemesanan/<int:pemesanan_id>", methods=["GET"])
@jwt_required()
def get_pemesanan(pemesanan_id):
    pemesanan = Pemesanan.query.get(pemesanan_id)
    if not pemesanan:
        return jsonify({"message": "Pemesanan tidak ditemukan"}), 404

    pemesanan_data = {
        "pemesanan_id": pemesanan.pemesanan_id,
        "mobil_id": pemesanan.mobil_id,
        "pengguna_id": pemesanan.pengguna_id,
        "tanggal_pemesanan": pemesanan.tanggal_pemesanan.strftime('%Y-%m-%dT%H:%M:%S'),
        "tanggal_pengambilan": pemesanan.tanggal_pengambilan.strftime('%Y-%m-%dT%H:%M:%S'),
        "tanggal_pengembalian": pemesanan.tanggal_pengembalian.strftime('%Y-%m-%dT%H:%M:%S'),
        "total_pembayaran": pemesanan.total_pembayaran,
        "status_pemesanan": pemesanan.status_pemesanan,
    }
    return jsonify({"pemesanan": pemesanan_data}), 200



@app.route("/pemesanan/<int:pemesanan_id>", methods=["PUT"])
@jwt_required()
def update_pemesanan(pemesanan_id):
    pemesanan = Pemesanan.query.get(pemesanan_id)
    if not pemesanan:
        return jsonify({"message": "Pemesanan tidak ditemukan"}), 404

    data = request.json  # Assuming JSON input for simplicity and consistency

    try:
        if 'tanggal_pengembalian' in data:
            pemesanan.tanggal_pengembalian = datetime.strptime(data['tanggal_pengembalian'], '%Y-%m-%dT%H:%M:%S')
            days_rented = (pemesanan.tanggal_pengembalian - pemesanan.tanggal_pengambilan).days
            if days_rented < 1:
                return jsonify({"message": "Tanggal pengembalian harus setelah tanggal pengambilan"}), 400
            pemesanan.total_pembayaran = pemesanan.mobil.harga_sewa * days_rented

        if 'status_pemesanan' in data:
            pemesanan.status_pemesanan = data['status_pemesanan']
    except (ValueError, TypeError) as e:
        return jsonify({"message": "Invalid date format, expected format is 'YYYY-MM-DDTHH:MM:SS'"}), 400

    db.session.commit()

    pemesanan_data = {
        "pemesanan_id": pemesanan.pemesanan_id,
        "mobil_id": pemesanan.mobil_id,
        "pengguna_id": pemesanan.pengguna_id,
        "tanggal_pemesanan": pemesanan.tanggal_pemesanan.strftime('%Y-%m-%dT%H:%M:%S'),
        "tanggal_pengambilan": pemesanan.tanggal_pengambilan.strftime('%Y-%m-%dT%H:%M:%S'),
        "tanggal_pengembalian": pemesanan.tanggal_pengembalian.strftime('%Y-%m-%dT%H:%M:%S'),
        "total_pembayaran": pemesanan.total_pembayaran,
        "status_pemesanan": pemesanan.status_pemesanan,
    }
    return jsonify({"pemesanan": pemesanan_data, "message": "Pemesanan berhasil diperbarui"}), 200




@app.route("/pemesanan/<int:pemesanan_id>", methods=["DELETE"])
@jwt_required()
def delete_pemesanan(pemesanan_id):
    pemesanan = Pemesanan.query.get(pemesanan_id)
    if not pemesanan:
        return jsonify({"message": "Pemesanan tidak ditemukan"}), 404

    db.session.delete(pemesanan)
    db.session.commit()
    return jsonify({"message": "Pemesanan berhasil dihapus"}), 200



if __name__ == '__main__':
    app.run(debug=True)
