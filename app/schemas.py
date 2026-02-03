from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class RelativeCreate(BaseModel):
    relative_name: str = Field(..., min_length=1, max_length=255)
    age: Optional[int] = Field(None, ge=0, le=120)
    relation: str = Field(..., min_length=1, max_length=100)
    additional_info: Optional[str] = None
    image_path: Optional[str] = None

class RelativeResponse(RelativeCreate):
    id: int
    patient_id: int
    
    class Config:
        from_attributes = True

class PatientCreate(BaseModel):
    patient_name: str = Field(..., min_length=1, max_length=255)
    gender: str = Field(..., pattern="^(Male|Female|Other)$")
    date_of_birth: date
    father_name: str = Field(..., min_length=1, max_length=255)
    education_years: int = Field(..., ge=0, le=30)
    hobbies: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = Field(None, max_length=20)
    relatives: List[RelativeCreate] = []

class PatientResponse(BaseModel):
    id: int
    patient_name: str
    gender: str
    date_of_birth: date
    father_name: str
    education_years: int
    hobbies: Optional[str]
    address: Optional[str]
    phone: Optional[str]
    relatives: List[RelativeResponse] = []
    
    class Config:
        from_attributes = True
