# Healthcare - Clinical Appointment Management System

A comprehensive Clinical Appointment Management System that allows clinics to manage patients, doctors, and appointments efficiently. Patients and doctors can be registered, and appointments can be scheduled by linking a patient with a doctor at a specific date and time. The system provides a robust backend API built with Flask and SQLite that supports storing and retrieving clinical data.

## 🚀 Live Demo

- **Frontend**: 
https://health-care-62pm.vercel.app/



## ✨ Features

- **User Authentication**: JWT-based authentication with role management
- **Patient Management**: Complete patient registration and profile management
- **Doctor Management**: Doctor registration with specialization tracking
- **Appointment Scheduling**: Comprehensive appointment booking system linking patients with doctors
- **Responsive Design**: Mobile-first, fully responsive UI
- **RESTful API**: Well-documented REST API with OpenAPI
- **Database Integration**: Persistent data storage with migrations
- **Real-time Updates**: Live appointment status updates
- **Search & Filtering**: Advanced search for patients, doctors, and appointments

## 🛠 Tech Stack

### Frontend
- **Framework**: Vite.js
- **Styling**: Plain CSS / Styled Components
- **Build Tool**: Vite / Webpack

### Backend
- **Framework**: Flask - Main Python framework powering the server and routes
- **ORM**: Flask-SQLAlchemy - Object Relational Mapper for database operations
- **Database**: SQLite - Lightweight, file-based database (healthcare.db)
- **Serialization**: Flask-Marshmallow + Marshmallow-SQLAlchemy - For serializing models to JSON
- **CORS**: Flask-CORS - Enables frontend-backend communication
- **Authentication**: JWT for secure authentication

### DevOps & Tools
- **Version Control**: Git and GitHub
- **Frontend Deployment**: Vercel
- **Backend Deployment**: Render
- **Testing**: Python testing framework / Vite testing tools

## 📁 Project Structure

```
HEALTH_CARE/
├── client/                    # Frontend application (Vite.js)
│   ├── .vite/                # Vite build cache
│   ├── node_modules/         # Frontend dependencies
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js      # API service functions
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Footer.jsx    # Footer component
│   │   │   ├── Login.css     # Login component styles
│   │   │   ├── Login.jsx     # Login component
│   │   │   └── NavBar.jsx    # Navigation bar component
│   │   ├── context/          # React Context providers
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── pages/            # Page components/routes
│   │   │   ├── AdminDoctors.css   # Admin doctors page styles
│   │   │   ├── AdminDoctor.jsx    # Admin doctors page
│   │   │   ├── Appointments.css   # Appointments page styles
│   │   │   ├── Appointments.jsx   # Appointments page
│   │   │   ├── Dashboard.jsx      # Dashboard page
│   │   │   ├── Doctors.css        # Doctors page styles
│   │   │   ├── Doctor.jsx         # Doctors page
│   │   │   ├── LandingPage.css    # Landing page styles
│   │   │   ├── LandingPage.jsx    # Landing page
│   │   │   └── Patients.jsx       # Patients page               
│   │   ├── .gitignore
│   │   ├── App.css           # Main app styles
│   │   ├── App.jsx           # Main app component
│   │   ├── index.css         # Global styles
│   │   ├── index.js          # App entry point
│   │   └── main.jsx          # Main React entry
│   ├── eslint.config.js      # ESLint configuration
│   ├── index.html            # HTML template
│   ├── package-lock.json     # Lock file for dependencies
│   ├── package.json          # Frontend dependencies and scripts
│   ├── README.md             # Frontend documentation
│   └── vite.config.js        # Vite configuration
├── server/                   # Backend application (Flask)
│   ├── controllers.py        # API route controllers
│   ├── extensions.py         # Flask extensions configuration
│   ├── models.py            # Database models (SQLAlchemy)
│   ├── routes.py            # API route definitions
│   ├── server.py            # Flask application entry point
│   └── healthcare.db        # SQLite database file
└── README.md                 # Main project documentation
```

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- **Git**

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/healthcare.git
cd healthcare
```

### 2. Install Backend Dependencies
```bash
cd server
pip install flask flask-sqlalchemy flask-marshmallow marshmallow-sqlalchemy flask-cors
# Or if you have requirements.txt
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
```

### 4. Database Setup
```bash
cd server
# Database will be automatically created when you first run the Flask app
# SQLite database file: healthcare.db
```

## 🔧 Environment Variables

### Server (.env)
```env
# Flask Configuration
FLASK_APP=server.py
FLASK_ENV=development
SECRET_KEY=your-super-secret-key

# Database
DATABASE_URL=sqlite:///healthcare.db

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ACCESS_TOKEN_EXPIRES=3600

# Server Configuration
PORT=5000
```

### Client (.env)
```env
VITE_API_URL=http://127.0.0.1:5000/api
VITE_APP_URL=http://localhost:5173
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Start the Backend (Flask)
```bash
cd server
python server.py
# Or
flask run
```

#### Start the Frontend (Vite.js)
```bash
cd client
npm run dev
```

### Production Mode
```bash
# Build frontend
cd client
npm run build

# Start backend in production mode
cd server
python server.py
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:5000
- **API Base URL**: http://127.0.0.1:5000/api

## 📖 API Documentation

**Base URL**: `http://127.0.0.1:5000/api`

### Patients Endpoints
- **GET** `/api/patients` → Get all patients
- **GET** `/api/patients/<id>` → Get a patient by ID
- **POST** `/api/patients` → Add a new patient

**Example Request Body:**
```json
{
  "name": "Jane Smith",
  "age": 28,
  "gender": "Female"
}
```

### Doctors Endpoints
- **GET** `/api/doctors` → Get all doctors
- **POST** `/api/doctors` → Add a new doctor

**Example Request Body:**
```json
{
  "name": "Dr. House",
  "specialization": "Cardiology"
}
```

### Appointments Endpoints
- **GET** `/api/appointments` → Get all appointments
- **POST** `/api/appointments` → Create a new appointment

**Example Request Body:**
```json
{
  "patient_id": 1,
  "doctor_id": 2,
  "appointment_date": "2024-12-01",
  "appointment_time": "14:30",
  "reason": "Regular checkup"
}
```

## 🧪 Testing

### Backend Tests (Python)
```bash
cd server
python -m pytest
# Or
python -m unittest discover tests/
```

### Frontend Tests (Vite)
```bash
cd client
npm run test
```

### Run All Tests
```bash
# From root directory
npm run test:all
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push to main branch

### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Choose "Web Service"
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python server.py`
5. Deploy automatically on push to main branch

## 🔐 Security Considerations

- JWT-based authentication for secure API access
- Input validation for all API endpoints
- SQL injection prevention through SQLAlchemy ORM
- CORS properly configured for frontend-backend communication
- Sensitive data encryption in database
- Rate limiting on API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Terry Yegon** - *Frontend Developer* - [GitHub Profile]
- **Fletcher Nyawira** - *Backend Developer* - [GitHub Profile] 
- **Mohamed Farah** - *Frontend Developer* - [GitHub Profile]
- **James Patrick** - *Backend Developer* - [GitHub Profile]

## 🙏 Acknowledgments

- Flask community for excellent documentation
- Vite.js team for fast build tooling
- SQLAlchemy for robust ORM functionality
- All healthcare professionals who provided insights for this system

## 📞 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Contact the development team
- Check our documentation

## 🗺 Roadmap

- [ ] Add appointment reminder notifications
- [ ] Implement doctor availability scheduling
- [ ] Add patient medical history tracking
- [ ] Integration with electronic health records (EHR)
- [ ] Mobile app development
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] Telemedicine integration
