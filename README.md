# Dementia Screening Tool

A comprehensive web-based tool for dementia screening using MMSE (Mini-Mental State Examination) scoring and machine learning prediction.

## Stage 1: Patient Registration Form ✅

### Features Implemented
- Professional clinical patient registration form (black & white design)
- PostgreSQL database integration with Docker
- Patient information collection:
  - Patient name, gender, date of birth
  - Father's name
  - Education years
  - Contact information (phone, address)
  - Hobbies
- Dynamic relatives management:
  - Add/remove multiple relatives
  - Relative name, age, relation
  - Additional information (optional)
- Data validation and error handling
- RESTful API endpoints

### Tech Stack
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL 15
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Containerization**: Docker & Docker Compose

### Project Structure
```
dementia-screening-tool/
├── app/
│   ├── models/
│   │   └── database.py          # SQLAlchemy models
│   ├── static/
│   │   ├── css/
│   │   │   └── styles.css       # Clinical styling
│   │   └── js/
│   │       └── script.js        # Form handling
│   ├── templates/
│   │   └── index.html           # Registration form
│   ├── database.py              # DB configuration
│   ├── main.py                  # FastAPI app
│   └── schemas.py               # Pydantic schemas
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── README.md
```

## Setup Instructions

### Prerequisites
- Docker
- Docker Compose

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd dementia-screening-tool
```

2. Create `.env` file (optional - defaults are set in docker-compose.yml):
```bash
cp .env.example .env
```

3. Build and start the containers:
```bash
docker-compose up --build
```

4. Access the application:
- **Web Interface**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### Database Connection
- **Host**: localhost
- **Port**: 5432
- **Database**: dementia_screening
- **Username**: dementia_user
- **Password**: dementia_pass

## API Endpoints

### POST /api/patients
Create a new patient with relatives
```json
{
  "patient_name": "John Doe",
  "gender": "Male",
  "date_of_birth": "1960-05-15",
  "father_name": "James Doe",
  "education_years": 12,
  "hobbies": "Reading, gardening",
  "address": "123 Main St",
  "phone": "555-0123",
  "relatives": [
    {
      "relative_name": "Jane Doe",
      "age": 58,
      "relation": "Spouse",
      "additional_info": "Primary caregiver"
    }
  ]
}
```

### GET /api/patients/{patient_id}
Retrieve patient by ID

### GET /api/patients
List all patients

### GET /health
Health check endpoint

## Usage

1. Open http://localhost:8000 in your browser
2. Fill out the patient registration form
3. Add relatives using the "+ Add Relative" button
4. Submit the form
5. Patient ID will be displayed upon successful registration

## Development

### Stop containers:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

### Rebuild containers:
```bash
docker-compose up --build
```

### Access PostgreSQL:
```bash
docker exec -it dementia_postgres psql -U dementia_user -d dementia_screening
```

## Next Stages (Planned)

### Stage 2: MMSE Screening Chatbot
- Groq LLM integration for conversational interface
- 50 questions across categories:
  - Orientation (date, time, month)
  - Math reasoning
  - Object recognition (with image display via S3)
  - Memory/recall questions
  - Shape recognition
  - Family information cross-validation

### Stage 3: Scoring Mechanism
- Three criteria scoring:
  - Completeness
  - Accuracy
  - Relevance
- Weight-based scoring system
- Cross-validation with patient database
- Real-time score calculation (max 30 marks)

### Stage 4: ML Prediction
- AWS Lambda integration
- RandomForest classifier
- Input parameters:
  - Gender (M/F)
  - Age
  - Education years (EDUC)
  - Socioeconomic status (SES)
  - MMSE score
- Output: Dementia prediction (CDR score)

### Stage 5: Reporting
- Comprehensive PDF report generation
- Question-by-question analysis
- Accuracy, completeness, relevance scores
- ML prediction results
- Recommendations

### Stage 6: Voice Integration
- AWS Polly (text-to-speech)
- AWS Transcribe (speech-to-text)
- Voice-based screening interface

## License
MIT

## Author
Resume Project - Built in One Day
