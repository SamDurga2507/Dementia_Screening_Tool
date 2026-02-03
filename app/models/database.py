from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String(255), nullable=False)
    gender = Column(String(10), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    father_name = Column(String(255), nullable=False)
    education_years = Column(Integer, nullable=False)
    hobbies = Column(Text, nullable=True)
    address = Column(Text, nullable=True)
    phone = Column(String(20), nullable=True)
    
    # Relationship with relatives
    relatives = relationship("Relative", back_populates="patient", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Patient(id={self.id}, name={self.patient_name})>"


class Relative(Base):
    __tablename__ = "relatives"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    relative_name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    relation = Column(String(100), nullable=False)
    additional_info = Column(Text, nullable=True)
    image_path = Column(String(500), nullable=True)
    
    # Relationship with patient
    patient = relationship("Patient", back_populates="relatives")
    
    def __repr__(self):
        return f"<Relative(id={self.id}, name={self.relative_name}, relation={self.relation})>"
