from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from models import db, ma, seed_data

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app)
    db.init_app(app)
    ma.init_app(app)

    with app.app_context():
        db.create_all()
        seed_data()  # insert sample doctors, patients, appointments

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
