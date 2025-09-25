from server import db, ma

class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    appointments = db.relationship("Appointment", backref="doctor", lazy=True)

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    appointments = db.relationship("Appointment", backref="patient", lazy=True)

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default="pending")
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctor.id"), nullable=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patient.id"), nullable=False)

# Schemas
class DoctorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Doctor
        include_relationships = True
        load_instance = True

class PatientSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Patient
        include_relationships = True
        load_instance = True

class AppointmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Appointment
        include_fk = True
        load_instance = True
