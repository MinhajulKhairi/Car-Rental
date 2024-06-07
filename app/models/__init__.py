from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS
# from app.controllers import user_controllers
# from app.controllers import admin_controllers
# from app.controllers import pemesanan_controllers
#
# # Import all controllers to register the routes
# from app.controllers import user_controllers
# from app.controllers import admin_controllers
# from app.controllers import user_controllers
# from app.controllers import admin_controllers
# from app.controllers import pemesanan_controllers
# from app.controllers import pembayaran_controllers
# from app.controllers import user_controllers
# from app.controllers import admin_controllers
# from app.controllers import pemesanan_controllers
# from app.controllers import pembayaran_controllers
# from app.controllers import mobil_controllers



app = Flask(__name__)
app.secret_key = "secret key"
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:root@localhost/car_rental"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_secret_key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

db = SQLAlchemy(app)
jwt = JWTManager(app)

CORS(app)

@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({"message": "Akses gagal. Harap berikan token yang valid"}), 401

@jwt.expired_token_loader
def expired_token_response(jwt_header, jwt_payload):
    return jsonify({"message": "Token expired. Silahkan login ulang"}), 401

from app.controllers import user_controllers, admin_controllers