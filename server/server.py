from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
import os

from extensions import db, ma
from models import seed_data
from routes import api

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Fixed CORS for sessions

# -----------------------------
# Config
# -----------------------------
# Use DATABASE_URL from environment, fallback to local SQLite
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL", "sqlite:///healthcare.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "your-secret-key-here"

# -----------------------------
# Init extensions
# -----------------------------
db.init_app(app)
ma.init_app(app)

# Setup Flask-Migrate
migrate = Migrate(app, db)

# -----------------------------
# Register blueprint
# -----------------------------
app.register_blueprint(api, url_prefix="/api")

# -----------------------------
# Seed data only if needed
# -----------------------------
with app.app_context():
    db.create_all()
    seed_data(db)

# -----------------------------
# Test route
# -----------------------------
@app.route("/")
def home():
    return {"message": "Healthcare API is running!"}, 200


if __name__ == "__main__":
    app.run(debug=True, port=5555)
