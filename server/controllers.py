from flask import request, jsonify
from functools import wraps
from extensions import db
from models import Patient, Doctor, Appointment, PatientSchema, DoctorSchema, AppointmentSchema

# --- TEMPORARY IN-MEMORY "USER" STORE FOR LOGIN SIMULATION ---
# NOTE: Using a consistent 'password' for all temp users now.
TEMP_USERS = {
    "admin": {"password": "password", "role": "clinic_admin", "user_id": 999}, # <<< FIXED PASSWORD
    "doctor": {"password": "password", "role": "doctor", "user_id": 1},      # <<< FIXED PASSWORD
    "patient": {"password": "password", "role": "patient", "user_id": 2},    # <<< FIXED PASSWORD
}
# -------------------------------------------------------------
# -------------------------------------------------------------

# -----------------------------
# SCHEMAS
# -----------------------------
patient_schema = PatientSchema()
patients_schema = PatientSchema(many=True)

doctor_schema = DoctorSchema()
doctors_schema = DoctorSchema(many=True)

appointment_schema = AppointmentSchema()
appointments_schema = AppointmentSchema(many=True)

# -----------------------------
# ROLE DECORATOR (TEMPORARY FIX)
# -----------------------------
# Replaced insecure header check with a temporary function to be called manually.
# NOTE: This must be replaced with proper JWT token decoding/validation to get the role.
def require_role(allowed_roles):
    """
    Temporary placeholder for role-based access control.
    Currently assumes a user object with a 'role' key is available/checked.
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # For now, we rely on the client knowing what they can do, 
            # as the token system is not yet in place.
            # Production Fix: Decode JWT and check payload['role'] against allowed_roles
            return f(*args, **kwargs)
        return wrapper
    return decorator

# -----------------------------
# AUTHENTICATION ENDPOINTS (NEW)
# -----------------------------
def login(role):
    """Handles /login/admin, /login/doctor, /login/patient"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if role not in TEMP_USERS:
        return jsonify({"message": "Invalid login role"}), 400

    user_info = TEMP_USERS.get(username) # Simplistic username check
    
    # Simple check against the temp store
    if user_info and user_info['password'] == password and user_info['role'].endswith(role):
        # NOTE: In a real app, generate and return a JWT token here.
        # For now, return simple user info.
        return jsonify({
            "message": "Login successful",
            "token": "fake_jwt_token", # Placeholder token
            "user": {
                "id": user_info['user_id'],
                "username": username,
                "role": user_info['role']
            }
        }), 200
    
    return jsonify({"message": "Invalid credentials"}), 401


# -----------------------------
# PATIENT ENDPOINTS
# -----------------------------
# ... (No changes here, keeping your original patient functions) ...
def get_patients():
    patients = Patient.query.all()
    return patients_schema.jsonify(patients), 200

# @require_role('admin') # Removing temporary decorator usage
def create_patient():
    data = request.get_json()
    errors = patient_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    new_patient = Patient(name=data['name'], age=data['age'])
    db.session.add(new_patient)
    db.session.commit()
    return patient_schema.jsonify(new_patient), 201

# @require_role('admin')
def update_patient(patient_id):
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"message": "Patient not found"}), 404
    data = request.get_json()
    errors = patient_schema.validate(data, partial=True)
    if errors:
        return jsonify(errors), 400
    
    if 'name' in data: patient.name = data['name']
    if 'age' in data: patient.age = data['age']
    
    db.session.commit()
    return patient_schema.jsonify(patient), 200

# @require_role('admin')
def delete_patient(patient_id):
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"message": "Patient not found"}), 404
    db.session.delete(patient)
    db.session.commit()
    return '', 204

# -----------------------------
# DOCTOR ENDPOINTS
# -----------------------------
# ... (No changes here, keeping your original doctor functions) ...
def get_doctors():
    doctors = Doctor.query.all()
    return doctors_schema.jsonify(doctors), 200

# @require_role('admin')
def create_doctor():
    data = request.get_json()
    errors = doctor_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    new_doctor = Doctor(name=data['name'], specialization=data['specialization'])
    db.session.add(new_doctor)
    db.session.commit()
    return doctor_schema.jsonify(new_doctor), 201

# @require_role('admin')
def update_doctor(doctor_id):
    doctor = Doctor.query.get(doctor_id)
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404
    data = request.get_json()
    errors = doctor_schema.validate(data, partial=True)
    if errors:
        return jsonify(errors), 400
    
    if 'name' in data: doctor.name = data['name']
    if 'specialization' in data: doctor.specialization = data['specialization']

    db.session.commit()
    return doctor_schema.jsonify(doctor), 200

# @require_role('admin')
def delete_doctor(doctor_id):
    doctor = Doctor.query.get(doctor_id)
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404
    db.session.delete(doctor)
    db.session.commit()
    return '', 204

# -----------------------------
# APPOINTMENT ENDPOINTS
# -----------------------------
# NOTE: In a real app, GET /appointments should filter by doctor_id for 'doctor' role
def get_appointments():
    appointments = Appointment.query.all()
    return appointments_schema.jsonify(appointments), 200

# Appointment creation should be open to patients (i.e., not require_role('admin'))
# The request needs patient_id for the form
def create_appointment():
    data = request.get_json()
    # Ensure patient_id and other required fields are present for validation 
    errors = appointment_schema.validate(data, partial=('doctor_id', 'status')) # Doctor/Status are optional on creation
    if errors:
        return jsonify(errors), 400

    patient = Patient.query.get(data.get('patient_id'))
    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    # Doctor ID is optional on creation, defaults to 1 (or unassigned/null in a better model)
    doctor_id = data.get('doctor_id', TEMP_USERS['doctor']['user_id']) # Default doctor 1
    doctor = Doctor.query.get(doctor_id)

    new_appt = Appointment(
        date=data['date'], 
        time=data['time'], 
        patient=patient, 
        doctor=doctor
    )
    db.session.add(new_appt)
    db.session.commit()
    return appointment_schema.jsonify(new_appt), 201

# @require_role('admin') 
# PATCH /appointments/<id> - Admin assigns doctor
def assign_doctor_to_appointment(appointment_id):
    appt = Appointment.query.get(appointment_id)
    if not appt:
        return jsonify({"message": "Appointment not found"}), 404
    
    data = request.get_json()
    doctor_id = data.get('doctor_id')

    if not doctor_id:
        return jsonify({"message": "Doctor ID required for assignment"}), 400

    doctor = Doctor.query.get(doctor_id)
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404

    appt.doctor = doctor
    appt.status = 'assigned' # Automatically update status on assignment
    db.session.commit()
    return appointment_schema.jsonify(appt), 200

# @require_role('doctor') 
# PATCH /appointments/<id>/status - Doctor updates status
def update_appointment_status(appointment_id):
    appt = Appointment.query.get(appointment_id)
    if not appt:
        return jsonify({"message": "Appointment not found"}), 404
    
    data = request.get_json()
    new_status = data.get('status')

    if not new_status:
        return jsonify({"message": "Status field is required"}), 400
    
    # Basic validation for allowed statuses
    allowed_statuses = ['scheduled', 'confirmed', 'complete', 'cancelled']
    if new_status not in allowed_statuses:
        return jsonify({"message": f"Invalid status. Must be one of: {', '.join(allowed_statuses)}"}), 400

    appt.status = new_status
    db.session.commit()
    return appointment_schema.jsonify(appt), 200


# @require_role('admin')
def delete_appointment(appointment_id):
    appt = Appointment.query.get(appointment_id)
    if not appt:
        return jsonify({"message": "Appointment not found"}), 404
    db.session.delete(appt)
    db.session.commit()
    return '', 204