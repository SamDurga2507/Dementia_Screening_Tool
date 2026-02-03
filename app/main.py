from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db, init_db
from app.models.database import Patient, Relative
from app.schemas import PatientCreate, PatientResponse

app = FastAPI(title="Dementia Screening Tool")

# Mount static files and templates
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """Serve the patient registration form"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):
    """Serve the dashboard page"""
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.post("/api/patients", response_model=PatientResponse)
async def create_patient(patient_data: PatientCreate, db: Session = Depends(get_db)):
    """Create a new patient with relatives"""
    try:
        # Create patient
        patient = Patient(
            patient_name=patient_data.patient_name,
            gender=patient_data.gender,
            date_of_birth=patient_data.date_of_birth,
            father_name=patient_data.father_name,
            education_years=patient_data.education_years,
            hobbies=patient_data.hobbies,
            address=patient_data.address,
            phone=patient_data.phone
        )
        
        db.add(patient)
        db.flush()  # Get patient ID
        
        # Create relatives
        for relative_data in patient_data.relatives:
            relative = Relative(
                patient_id=patient.id,
                relative_name=relative_data.relative_name,
                age=relative_data.age,
                relation=relative_data.relation,
                additional_info=relative_data.additional_info,
                image_path=relative_data.image_path
            )
            db.add(relative)
        
        db.commit()
        db.refresh(patient)
        
        return patient
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating patient: {str(e)}")

@app.get("/api/patients/{patient_id}", response_model=PatientResponse)
async def get_patient(patient_id: int, db: Session = Depends(get_db)):
    """Retrieve a patient by ID"""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@app.get("/api/patients", response_model=list[PatientResponse])
async def list_patients(db: Session = Depends(get_db)):
    """List all patients"""
    patients = db.query(Patient).all()
    return patients

@app.put("/api/patients/{patient_id}", response_model=PatientResponse)
async def update_patient(patient_id: int, patient_data: PatientCreate, db: Session = Depends(get_db)):
    """Update an existing patient"""
    try:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        # Update patient fields
        patient.patient_name = patient_data.patient_name
        patient.gender = patient_data.gender
        patient.date_of_birth = patient_data.date_of_birth
        patient.father_name = patient_data.father_name
        patient.education_years = patient_data.education_years
        patient.hobbies = patient_data.hobbies
        patient.address = patient_data.address
        patient.phone = patient_data.phone
        
        # Delete existing relatives and add new ones
        db.query(Relative).filter(Relative.patient_id == patient_id).delete()
        
        for relative_data in patient_data.relatives:
            relative = Relative(
                patient_id=patient.id,
                relative_name=relative_data.relative_name,
                age=relative_data.age,
                relation=relative_data.relation,
                additional_info=relative_data.additional_info,
                image_path=relative_data.image_path
            )
            db.add(relative)
        
        db.commit()
        db.refresh(patient)
        return patient
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating patient: {str(e)}")

@app.delete("/api/patients/{patient_id}")
async def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    """Delete a patient and their relatives"""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db.delete(patient)
    db.commit()
    return {"message": "Patient deleted successfully", "id": patient_id}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
