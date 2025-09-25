from flask import Blueprint
from controllers import (
    get_patients, create_patient, update_patient, delete_patient,
    get_doctors, create_doctor, update_doctor, delete_doctor,
    get_appointments, create_appointment, update_appointment, delete_appointment
)

api = Blueprint('api', __name__)

# -----------------------------
# PATIENT ROUTES
# -----------------------------
api.route('/patients', methods=['GET'])(get_patients)
api.route('/patients', methods=['POST'])(create_patient)
api.route('/patients/<int:patient_id>', methods=['PATCH'])(update_patient)
api.route('/patients/<int:patient_id>', methods=['DELETE'])(delete_patient)

# -----------------------------
# DOCTOR ROUTES
# -----------------------------
api.route('/doctors', methods=['GET'])(get_doctors)
api.route('/doctors', methods=['POST'])(create_doctor)
api.route('/doctors/<int:doctor_id>', methods=['PATCH'])(update_doctor)
api.route('/doctors/<int:doctor_id>', methods=['DELETE'])(delete_doctor)

# -----------------------------
# APPOINTMENT ROUTES
# -----------------------------
api.route('/appointments', methods=['GET'])(get_appointments)
api.route('/appointments', methods=['POST'])(create_appointment)
api.route('/appointments/<int:appointment_id>', methods=['PATCH'])(update_appointment)
api.route('/appointments/<int:appointment_id>', methods=['DELETE'])(delete_appointment)
