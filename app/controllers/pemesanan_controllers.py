from flask import request, jsonify
from app.models import db, app
from app.models import Pemesanan, Mobil
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

@app.route("/pemesanan", methods=["POST"])
@jwt_required()
def create_pemesanan():
    current_user_id = get_jwt_identity()
    data = request.form
    mobil_id = data.get('mobil_id')
    tanggal_pemesanan = datetime.strptime(data.get('tanggal_pemesanan'), '%d/%m/%Y')
    tanggal_pengambilan = datetime.strptime(data.get('tanggal_pengambilan'), '%d/%m/%Y')
    tanggal_pengembalian = datetime.strptime(data.get('tanggal_pengembalian'), '%d/%m/%Y')

    # Calculate total pembayaran
    mobil = Mobil.query.get(mobil_id)
    if not mobil:
        return jsonify({"message": "Mobil tidak ditemukan"}), 404

    days_rented = (tanggal_pengembalian - tanggal_pengambilan).days
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
        "tanggal_pemesanan": pemesanan.tanggal_pemesanan.strftime('%d/%m/%Y'),
        "tanggal_pengambilan": pemesanan.tanggal_pengambilan.strftime('%d/%m/%Y'),
        "tanggal_pengembalian": pemesanan.tanggal_pengembalian.strftime('%d/%m/%Y'),
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

    data = request.form
    if 'tanggal_pengembalian' in data:
        pemesanan.tanggal_pengembalian = datetime.strptime(data['tanggal_pengembalian'], '%d/%m/%Y')
        days_rented = (pemesanan.tanggal_pengembalian - pemesanan.tanggal_pengambilan).days
        pemesanan.total_pembayaran = pemesanan.mobil.harga_sewa * days_rented
    if 'status_pemesanan' in data:
        pemesanan.status_pemesanan = data['status_pemesanan']

    db.session.commit()

    pemesanan_data = {
        "pemesanan_id": pemesanan.pemesanan_id,
        "mobil_id": pemesanan.mobil_id,
        "pengguna_id": pemesanan.pengguna_id,
        "tanggal_pemesanan": pemesanan.tanggal_pemesanan.strftime('%d/%m/%Y'),
        "tanggal_pengambilan": pemesanan.tanggal_pengambilan.strftime('%d/%m/%Y'),
        "tanggal_pengembalian": pemesanan.tanggal_pengembalian.strftime('%d/%m/%Y'),
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
