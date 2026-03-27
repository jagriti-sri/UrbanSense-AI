from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import db
import os

complaint_bp = Blueprint('complaint', __name__)

# 📁 Folder to store images
UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@complaint_bp.route('/add', methods=['POST'])
@jwt_required()
def add_complaint():
    user_id = get_jwt_identity()

    # 🧾 Get form data (NOT JSON anymore)
    waste_type = request.form.get("waste_type")
    description = request.form.get("description")
    location = request.form.get("location")

    # 📸 Get image file
    file = request.files.get("image")

    image_path = None

    if file:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        image_path = file_path

    complaint = {
        "user_id": user_id,
        "waste_type": waste_type,
        "description": description,
        "location": location,
        "image": image_path,
        "status": "pending"
    }

    db.complaints.insert_one(complaint)

    return jsonify({"msg": "Complaint with image added"})