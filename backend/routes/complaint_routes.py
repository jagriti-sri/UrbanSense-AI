from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import db
import os
from bson import ObjectId

complaint_bp = Blueprint('complaint', __name__)

# 📁 Folder to store images
UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# 🚀 ADD COMPLAINT (WITH IMAGE)
@complaint_bp.route('/add', methods=['POST'])
@jwt_required()
def add_complaint():
    user_id = get_jwt_identity()

    waste_type = request.form.get("waste_type")
    description = request.form.get("description")
    location = request.form.get("location")

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

    return jsonify({"msg": "Complaint added successfully"})


# 📊 GET MY COMPLAINTS (USER)
@complaint_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_complaints():
    user_id = get_jwt_identity()

    complaints = list(db.complaints.find(
        {"user_id": user_id},
        {"_id": 0}
    ))

    return jsonify(complaints)


# 🏢 GET ALL COMPLAINTS (ADMIN)
@complaint_bp.route('/all', methods=['GET'])
def get_all_complaints():
    complaints = list(db.complaints.find({}, {"_id": 0}))
    return jsonify(complaints)


# ✅ RESOLVE COMPLAINT (ADMIN)
@complaint_bp.route('/resolve/<id>', methods=['PUT'])
def resolve_complaint(id):
    db.complaints.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": "resolved"}}
    )

    return jsonify({"msg": "Complaint resolved"})


# 📊 DASHBOARD STATS
@complaint_bp.route('/stats', methods=['GET'])
def stats():
    total = db.complaints.count_documents({})
    resolved = db.complaints.count_documents({"status": "resolved"})
    pending = db.complaints.count_documents({"status": "pending"})

    return jsonify({
        "total_complaints": total,
        "resolved": resolved,
        "pending": pending
    })