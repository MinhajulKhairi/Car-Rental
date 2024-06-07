from flask import request, jsonify
from app.models import db, app
from app.models import Admin
from flask_jwt_extended import create_access_token


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
    )
    new_admin.set_password(data['password'])
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({"message": "Admin berhasil didaftarkan"}), 201

@app.route("/admin/login", methods=["POST"])
def login_admin():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Data tidak lengkap"}), 400

    admin = Admin.query.filter_by(email=data['email']).first()
    if admin and admin.check_password(data['password']):
        access_token = create_access_token(identity=admin.admin_id)
        return jsonify({
            "admin_id": admin.admin_id,
            "nama_admin": admin.nama_admin,
            "email": admin.email,
            "access_token": access_token
        }), 200

    return jsonify({"message": "Email atau password salah"}), 401
