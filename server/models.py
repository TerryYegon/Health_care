from extensions import db, ma

# Example model for patients
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    condition = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"<Patient {self.name}>"

# Schema for serialization
class PatientSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Patient
        load_instance = True

# Function to seed data
def seed_data():
    if not Patient.query.first():  # only seed if empty
        p1 = Patient(name="John Doe", age=30, condition="Flu")
        p2 = Patient(name="Jane Smith", age=25, condition="Asthma")
        db.session.add_all([p1, p2])
        db.session.commit()
