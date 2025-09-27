# seed.py
from server import app
from extensions import db
from models import Doctor, Patient, Appointment

def seed_data():
    with app.app_context():
        if not Doctor.query.first():
            print("Seeding database...")

            doc1 = Doctor(name="Dr. Smith", specialization="Cardiology")
            doc2 = Doctor(name="Dr. Lee", specialization="Dermatology")
            doc3 = Doctor(name="Dr. Johnson", specialization="Neurology")

            pat1 = Patient(name="Alice", age=30, contact="alice@example.com")
            pat2 = Patient(name="Bob", age=45, contact="bob@example.com")

            appt1 = Appointment(
                date="2025-10-01",
                time="10:00",
                patient=pat1,
                doctor=doc1,
                status="pending",
                reason="Heart checkup"
            )
            appt2 = Appointment(
                date="2025-10-02",
                time="14:00",
                patient=pat2,
                doctor=doc2,
                status="confirmed",
                reason="Skin consultation"
            )

            db.session.add_all([doc1, doc2, doc3, pat1, pat2, appt1, appt2])
            db.session.commit()
            print("Seeding completed ✅")
        else:
            print("Database already seeded, skipping.")

if __name__ == "__main__":
    seed_data()
