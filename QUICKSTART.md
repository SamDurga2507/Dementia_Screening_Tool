# STAGE 1 - QUICK START GUIDE

## ✅ What's Complete

Stage 1 of your Dementia Screening Tool is ready! This includes:

1. **Professional Clinical Form** (black & white design)
   - Patient information collection
   - Dynamic relatives management
   - Clean, clinical interface

2. **Database Setup**
   - PostgreSQL with Docker
   - Patient and Relative models
   - Automated database initialization

3. **FastAPI Backend**
   - RESTful API endpoints
   - Data validation with Pydantic
   - Complete CRUD operations

## 🚀 How to Run

### Step 1: Navigate to project
```bash
cd dementia-screening-tool
```

### Step 2: Start the application
```bash
docker-compose up --build
```

Wait for:
```
dementia_web     | INFO:     Uvicorn running on http://0.0.0.0:8000
dementia_postgres | database system is ready to accept connections
```

### Step 3: Access the application
Open your browser to: **http://localhost:8000**

## 📝 Testing the Form

1. Fill in patient details:
   - Patient Name: "John Doe"
   - Gender: Male
   - Date of Birth: 1960-05-15
   - Father's Name: "James Doe"
   - Education: 12 years
   - Phone: "555-0123"

2. Click "+ Add Relative" to add family members

3. Submit the form

4. You'll see: "Patient registered successfully! Patient ID: 1"

## 🔍 Verify Database

```bash
# Connect to PostgreSQL
docker exec -it dementia_postgres psql -U dementia_user -d dementia_screening

# View patients
SELECT * FROM patients;

# View relatives
SELECT * FROM relatives;

# Exit
\q
```

## 📡 API Testing

Visit http://localhost:8000/docs for interactive API documentation

Or use curl:
```bash
# Get all patients
curl http://localhost:8000/api/patients

# Get specific patient
curl http://localhost:8000/api/patients/1
```

## 🛑 Stop the Application

```bash
docker-compose down
```

## 📂 Project Structure

```
dementia-screening-tool/
├── app/
│   ├── models/database.py       # Patient & Relative models
│   ├── static/
│   │   ├── css/styles.css       # Clinical styling
│   │   └── js/script.js         # Form handling
│   ├── templates/index.html     # Registration form
│   ├── database.py              # DB setup
│   ├── main.py                  # FastAPI routes
│   └── schemas.py               # Validation schemas
├── docker-compose.yml           # Docker orchestration
├── Dockerfile                   # App container
└── requirements.txt             # Python dependencies
```

## 🎯 Next Steps

Stage 1 is complete! Ready for:

**Stage 2**: MMSE Chatbot with Groq LLM
**Stage 3**: Scoring mechanism (completeness, accuracy, relevance)
**Stage 4**: ML prediction with RandomForest
**Stage 5**: Report generation
**Stage 6**: Voice integration (AWS Polly/Transcribe)

## 💡 Tips for GitHub

1. Initialize git:
```bash
cd dementia-screening-tool
git init
git add .
git commit -m "Stage 1: Patient registration form with PostgreSQL"
```

2. Create repository on GitHub

3. Push code:
```bash
git remote add origin <your-repo-url>
git push -u origin main
```

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Change ports in docker-compose.yml
ports:
  - "8001:8000"  # Change 8000 to 8001
```

**Database connection issues?**
```bash
# Restart containers
docker-compose down
docker-compose up --build
```

**Want to reset database?**
```bash
docker-compose down -v  # Removes volumes
docker-compose up --build
```

---

**Ready for Stage 2?** Let me know when you want to implement the MMSE chatbot!
