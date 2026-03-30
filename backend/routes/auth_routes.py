from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from config import db
import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("DATA RECEIVED:", data)

        if not data:
            return jsonify({"error": "No data received"}), 400

        if 'password' not in data:
            return jsonify({"error": "Password missing"}), 400

        hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

        user = {
            "name": data.get('name'),
            "email": data.get('email'),
            "password": hashed_pw,
            "role": "user"
        }

        db.users.insert_one(user)

        return jsonify({"msg": "User registered"})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json

    user = db.users.find_one({"email": data['email']})

    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
        token = create_access_token(identity=str(user['_id']))
        return jsonify(token=token)

    return jsonify({"msg": "Invalid credentials"}), 401