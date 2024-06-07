from flask import request, jsonify
from app.models import db, app
from app.models import Mobil
from flask_jwt_extended import jwt_required
import os
from werkzeug.utils import secure_filename

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
