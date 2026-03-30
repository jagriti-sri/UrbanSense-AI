from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.qr_routes import qr_bp
from routes.auth_routes import auth_bp
from routes.complaint_routes import complaint_bp
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'secret123'

CORS(app)
jwt = JWTManager(app)
app.register_blueprint(qr_bp, url_prefix='/qr')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(complaint_bp, url_prefix='/complaint')
# ✅ ADD THIS ROUTE
@app.route('/')
def home():
    return "Backend is running 🚀"

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)