from flask import request, jsonify
from app.models import db, app
from app.models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


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
        nomor_telepon=data.get('nomor_telepon')
    )
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Pengguna berhasil didaftarkan"}), 201


@app.route("/users/login", methods=["POST"])
def login_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Data tidak lengkap"}), 400

    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.pengguna_id)
        return jsonify({
            "pengguna_id": user.pengguna_id,
            "nama_lengkap": user.nama_lengkap,
            "email": user.email,
            "alamat": user.alamat,
            "nomor_telepon": user.nomor_telepon,
            "access_token": access_token
        }), 200

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


@app.route("/users/profile", methods=["PUT"])
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
