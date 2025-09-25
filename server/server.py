from flask import Flask
from extensions import db, ma
from models import seed_data

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///healthcare.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
ma.init_app(app)

# Setup database
with app.app_context():
    db.create_all()
    seed_data()

@app.route('/')
def home():
    return {"message": "Healthcare API is running!"}

if __name__ == '__main__':
    app.run(debug=True)
