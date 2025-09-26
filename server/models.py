from extensions import db, ma

# -----------------------------
# Models
# -----------------------------

class Patient(db.Model):
    __tablename__ = "patients"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    contact = db.Column(db.String(100), nullable=True)  # Added for rubric requirement

    appointments = db.relationship("Appointment", back_populates="patient", cascade="all, delete-orphan")


class Doctor(db.Model):
    __tablename__ = "doctors"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)

    appointments = db.relationship("Appointment", back_populates="doctor", cascade="all, delete-orphan")


class Appointment(db.Model):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default="pending")  # Added status field for rubric
    reason = db.Column(db.Text, nullable=True)  # Added for patient submittable attribute

    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"), nullable=False)

    patient = db.relationship("Patient", back_populates="appointments")
    doctor = db.relationship("Doctor", back_populates="appointments")


# -----------------------------
# Schemas
# -----------------------------

class PatientSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Patient
        include_relationships = True
        load_instance = True


class DoctorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Doctor
        include_relationships = True
        load_instance = True


class AppointmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Appointment
        include_fk = True
        load_instance = True


# -----------------------------
# Seed Data
# -----------------------------

def seed_data(db):
    if not Doctor.query.first():
        doc1 = Doctor(name="Dr. Smith", specialization="Cardiology")
        doc2 = Doctor(name="Dr. Lee", specialization="Dermatology")
        doc3 = Doctor(name="Dr. Johnson", specialization="Neurology")

        pat1 = Patient(name="Alice", age=30, contact="alice@example.com")
        pat2 = Patient(name="Bob", age=45, contact="bob@example.com")

        appt1 = Appointment(date="2025-10-01", time="10:00", patient=pat1, doctor=doc1, status="pending", reason="Heart checkup")
        appt2 = Appointment(date="2025-10-02", time="14:00", patient=pat2, doctor=doc2, status="confirmed", reason="Skin consultation")

        db.session.add_all([doc1, doc2, doc3, pat1, pat2, appt1, appt2])
        db.session.commit()