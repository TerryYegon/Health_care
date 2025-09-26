from flask import Blueprint, request, jsonify
from extensions import db
from controllers import (
    get_patients, create_patient, update_patient, delete_patient,
    get_doctors, create_doctor, update_doctor, delete_doctor,
    get_appointments, create_appointment, update_appointment, delete_appointment
)
from models import Doctor, Appointment

api = Blueprint('api', __name__)

# -----------------------------
# AUTHENTICATION ROUTES (SIMPLIFIED)
# -----------------------------
@api.route('/login/admin', methods=['POST'])
def admin_login():
    data = request.get_json()
    if data.get('username') == 'admin' and data.get('password') == 'admin123':
        return jsonify({"message": "Admin login successful"}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@api.route('/login/doctor', methods=['POST'])
def doctor_login():
    data = request.get_json()
    doctor = Doctor.query.filter_by(name=data.get('username')).first()
    if doctor and data.get('password') == 'doctor123':
        return jsonify({"message": "Doctor login successful", "doctor_id": doctor.id}), 200
    return jsonify({"message": "Invalid credentials"}), 401

# -----------------------------
# APPOINTMENT STATUS UPDATE (DOCTOR) - FIXED
# -----------------------------
@api.route('/appointments/<int:appointment_id>/status', methods=['PATCH'])
def update_appointment_status(appointment_id):
    user_role = request.headers.get('Role', '')  # Changed to header-based
    if user_role != 'doctor':
        return jsonify({"message": "Forbidden"}), 403
    
    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({"message": "Appointment not found"}), 404
    
    data = request.get_json()
    if 'status' not in data:
        return jsonify({"message": "Status field required"}), 400
    
    appointment.status = data['status']
    db.session.commit()
    return jsonify({"message": "Status updated successfully"}), 200

# -----------------------------
# EXISTING ROUTES
# -----------------------------
api.route('/patients', methods=['GET'])(get_patients)
api.route('/patients', methods=['POST'])(create_patient)
api.route('/patients/<int:patient_id>', methods=['PATCH'])(update_patient)
api.route('/patients/<int:patient_id>', methods=['DELETE'])(delete_patient)

api.route('/doctors', methods=['GET'])(get_doctors)
api.route('/doctors', methods=['POST'])(create_doctor)
api.route('/doctors/<int:doctor_id>', methods=['PATCH'])(update_doctor)
api.route('/doctors/<int:doctor_id>', methods=['DELETE'])(delete_doctor)

api.route('/appointments', methods=['GET'])(get_appointments)
api.route('/appointments', methods=['POST'])(create_appointment)
api.route('/appointments/<int:appointment_id>', methods=['PATCH'])(update_appointment)
api.route('/appointments/<int:appointment_id>', methods=['DELETE'])(delete_appointment)