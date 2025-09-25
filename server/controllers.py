from flask import request, jsonify
from functools import wraps
from .extensions import db

from .models import Patient, Doctor, Appointment, PatientSchema, DoctorSchema, AppointmentSchema

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
# ROLE DECORATOR
# -----------------------------
def require_role(role):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user_role = request.headers.get('Role', '')
            if user_role != role:
                return jsonify({"message": "Forbidden"}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

# -----------------------------
# PATIENT ENDPOINTS
# -----------------------------
def get_patients():
    patients = Patient.query.all()
    return patients_schema.jsonify(patients), 200

@require_role('admin')
def create_patient():
    data = request.get_json()
    errors = patient_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    new_patient = Patient(name=data['name'], age=data['age'])
    db.session.add(new_patient)
    db.session.commit()
    return patient_schema.jsonify(new_patient), 201

@require_role('admin')
def update_patient(patient_id):
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"message": "Patient not found"}), 404
    data = request.get_json()
    errors = patient_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    patient.name = data['name']
    patient.age = data['age']
    db.session.commit()
    return patient_schema.jsonify(patient), 200

@require_role('admin')
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
def get_doctors():
    doctors = Doctor.query.all()
    return doctors_schema.jsonify(doctors), 200

@require_role('admin')
def create_doctor():
    data = request.get_json()
    errors = doctor_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    new_doctor = Doctor(name=data['name'], specialization=data['specialization'])
    db.session.add(new_doctor)
    db.session.commit()
    return doctor_schema.jsonify(new_doctor), 201

@require_role('admin')
def update_doctor(doctor_id):
    doctor = Doctor.query.get(doctor_id)
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404
    data = request.get_json()
    errors = doctor_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    doctor.name = data['name']
    doctor.specialization = data['specialization']
    db.session.commit()
    return doctor_schema.jsonify(doctor), 200

@require_role('admin')
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
def get_appointments():
    appointments = Appointment.query.all()
    return appointments_schema.jsonify(appointments), 200

@require_role('admin')
def create_appointment():
    data = request.get_json()
    errors = appointment_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    patient = Patient.query.get(data['patient_id'])
    doctor = Doctor.query.get(data['doctor_id'])
    if not patient or not doctor:
        return jsonify({"message": "Patient or Doctor not found"}), 404

    new_appt = Appointment(date=data['date'], time=data['time'], patient=patient, doctor=doctor)
    db.session.add(new_appt)
    db.session.commit()
    return appointment_schema.jsonify(new_appt), 201

@require_role('admin')
def update_appointment(appointment_id):
    appt = Appointment.query.get(appointment_id)
    if not appt:
        return jsonify({"message": "Appointment not found"}), 404
    data = request.get_json()
    errors = appointment_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    patient = Patient.query.get(data['patient_id'])
    doctor = Doctor.query.get(data['doctor_id'])
    if not patient or not doctor:
        return jsonify({"message": "Patient or Doctor not found"}), 404
    appt.date = data['date']
    appt.time = data['time']
    appt.patient = patient
    appt.doctor = doctor
    db.session.commit()
    return appointment_schema.jsonify(appt), 200

@require_role('admin')
def delete_appointment(appointment_id):
    appt = Appointment.query.get(appointment_id)
    if not appt:
        return jsonify({"message": "Appointment not found"}), 404
    db.session.delete(appt)
    db.session.commit()
    return '', 204
