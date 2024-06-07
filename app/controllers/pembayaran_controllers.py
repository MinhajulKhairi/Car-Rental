from flask import request, jsonify
from app.models import db, app
from app.models import Pembayaran
from flask_jwt_extended import jwt_required
import os
from werkzeug.utils import secure_filename

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
