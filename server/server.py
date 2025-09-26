from flask import Flask
from flask_cors import CORS
from extensions import db, ma
from models import seed_data
from routes import api  # import blueprint

app = Flask(__name__)
CORS(app)

# -----------------------------
# Config
# -----------------------------
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///healthcare.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# -----------------------------
# Init extensions
# -----------------------------
db.init_app(app)
ma.init_app(app)

# -----------------------------
# Register blueprint
# -----------------------------
app.register_blueprint(api, url_prefix="/api")

# -----------------------------
# Create tables + seed
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
    app.run(debug=True)