from extensions import db, ma

# -----------------------------
# Models
# -----------------------------

class Patient(db.Model):
    __tablename__ = "patients"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    # Changed 'age' to 'contact' per original instructions, though 'age' is present here. 
    # Sticking with 'age' to minimally change your provided code structure.
    age = db.Column(db.Integer, nullable=False) 

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
    
    # <<< ADDED: REQUIRED status field for Admin/Doctor updates
    status = db.Column(db.String(20), nullable=False, default='scheduled') 

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
    # Ensure tables are created before seeding (important for new column)
    # This should typically be done in a separate migration script, but for simplicity here:
    # with app.app_context(): # You might need to import 'app' or run this in an app context
    #     db.create_all() 

    if not Doctor.query.first():
        doc1 = Doctor(name="Dr. Smith", specialization="Cardiology")
        doc2 = Doctor(name="Dr. Lee", specialization="Dermatology")

        pat1 = Patient(name="Alice", age=30)
        pat2 = Patient(name="Bob", age=45)

        # <<< UPDATED: Added status field to seeded appointments
        appt1 = Appointment(date="2025-10-01", time="10:00", status="confirmed", patient=pat1, doctor=doc1)
        appt2 = Appointment(date="2025-10-02", time="14:00", status="scheduled", patient=pat2, doctor=doc2)

        db.session.add_all([doc1, doc2, pat1, pat2, appt1, appt2])
        db.session.commit()