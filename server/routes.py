from flask import Blueprint
from server.controllers import get_patients, create_patient, update_patient, delete_patient

api = Blueprint('api', __name__)

# -----------------------------
# PATIENT ROUTES
# -----------------------------
api.route('/patients', methods=['GET'])(get_patients)
api.route('/patients', methods=['POST'])(create_patient)
api.route('/patients/<int:patient_id>', methods=['PATCH'])(update_patient)
api.route('/patients/<int:patient_id>', methods=['DELETE'])(delete_patient)
