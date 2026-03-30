from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import qrcode
import os

qr_bp = Blueprint('qr', __name__)

QR_FOLDER = "qrcodes"

if not os.path.exists(QR_FOLDER):
    os.makedirs(QR_FOLDER)


@qr_bp.route('/generate', methods=['GET'])
@jwt_required()
def generate_qr():
    user_id = get_jwt_identity()

    file_path = f"{QR_FOLDER}/{user_id}.png"

    qr = qrcode.make(user_id)
    qr.save(file_path)

    return jsonify({
        "msg": "QR generated",
        "qr_path": file_path
    })