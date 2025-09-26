from flask import Blueprint
from controllers import (
    # Patient Controllers
    get_patients, create_patient, update_patient, delete_patient,
    # Doctor Controllers
    get_doctors, create_doctor, update_doctor, delete_doctor,
    # Appointment Controllers
    get_appointments, create_appointment, delete_appointment,
    # NEW Controllers
    login, # <<< IMPORTED LOGIN
    assign_doctor_to_appointment, # <<< IMPORTED ASSIGN DOCTOR
    update_appointment_status # <<< IMPORTED UPDATE STATUS
)

api = Blueprint('api', __name__)

# -----------------------------
# AUTHENTICATION ROUTES (NEW)
# -----------------------------
# POST /login/admin, POST /login/doctor, POST /login/patient
api.route('/login/<string:role>', methods=['POST'])(login)


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
# APPOINTMENT ROUTES (UPDATED)
# -----------------------------
api.route('/appointments', methods=['GET'])(get_appointments)
api.route('/appointments', methods=['POST'])(create_appointment)

# PATCH /appointments/<id> - Used by Admin to assign a doctor (Replaces old generic update)
api.route('/appointments/<int:appointment_id>', methods=['PATCH'])(assign_doctor_to_appointment) # <<< FIXED ROUTE

# PATCH /appointments/<id>/status - Used by Doctor to update status
api.route('/appointments/<int:appointment_id>/status', methods=['PATCH'])(update_appointment_status) # <<< NEW ROUTE

# DELETE /appointments/<id> - Used by Admin to delete
api.route('/appointments/<int:appointment_id>', methods=['DELETE'])(delete_appointment)