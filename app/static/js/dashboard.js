let patients = [];
let currentPatientId = null;
let editRelativeCount = 0;

// Load patients on page load
document.addEventListener('DOMContentLoaded', function() {
    loadPatients();
});

async function loadPatients() {
    try {
        const response = await fetch('/api/patients');
        if (!response.ok) throw new Error('Failed to load patients');
        
        patients = await response.json();
        renderPatientsTable();
        updateStats();
    } catch (error) {
        showToast('Error loading patients: ' + error.message, 'error');
    }
}

function renderPatientsTable() {
    const tbody = document.getElementById('patientsTableBody');
    
    if (patients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">No patient records found. <a href="/">Add a new patient</a></td></tr>';
        return;
    }
    
    tbody.innerHTML = patients.map(patient => {
        const age = calculateAge(patient.date_of_birth);
        const relativesCount = patient.relatives ? patient.relatives.length : 0;
        
        return `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.patient_name}</td>
                <td>${patient.gender}</td>
                <td>${formatDate(patient.date_of_birth)}</td>
                <td>${age}</td>
                <td>${patient.education_years}</td>
                <td>${patient.father_name}</td>
                <td>${relativesCount}</td>
                <td>
                    <button class="action-btn btn-view" onclick="viewPatient(${patient.id})">View</button>
                    <button class="action-btn btn-edit" onclick="editPatient(${patient.id})">Edit</button>
                    <button class="action-btn btn-delete" onclick="deletePatient(${patient.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateStats() {
    document.getElementById('totalPatients').textContent = patients.length;
    
    const totalRelatives = patients.reduce((sum, patient) => {
        return sum + (patient.relatives ? patient.relatives.length : 0);
    }, 0);
    document.getElementById('totalRelatives').textContent = totalRelatives;
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// View Patient
function viewPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (!patient) return;
    
    const age = calculateAge(patient.date_of_birth);
    
    let relativesHtml = '';
    if (patient.relatives && patient.relatives.length > 0) {
        relativesHtml = patient.relatives.map(rel => `
            <div class="relative-item-view">
                <strong>${rel.relative_name}</strong>
                Relation: ${rel.relation}<br>
                ${rel.age ? `Age: ${rel.age}<br>` : ''}
                ${rel.additional_info ? `Info: ${rel.additional_info}` : ''}
            </div>
        `).join('');
    } else {
        relativesHtml = '<p>No relatives recorded</p>';
    }
    
    document.getElementById('viewModalBody').innerHTML = `
        <div class="detail-group">
            <span class="detail-label">Patient ID:</span>
            <span class="detail-value">${patient.id}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Patient Name:</span>
            <span class="detail-value">${patient.patient_name}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Gender:</span>
            <span class="detail-value">${patient.gender}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Date of Birth:</span>
            <span class="detail-value">${formatDate(patient.date_of_birth)} (Age: ${age})</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Father's Name:</span>
            <span class="detail-value">${patient.father_name}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Education:</span>
            <span class="detail-value">${patient.education_years} years</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${patient.phone || 'Not provided'}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Address:</span>
            <span class="detail-value">${patient.address || 'Not provided'}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Hobbies:</span>
            <span class="detail-value">${patient.hobbies || 'Not provided'}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Relatives:</span>
            <div class="relatives-list">${relativesHtml}</div>
        </div>
    `;
    
    document.getElementById('viewModal').style.display = 'block';
}

function closeViewModal() {
    document.getElementById('viewModal').style.display = 'none';
}

// Edit Patient
function editPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (!patient) return;
    
    currentPatientId = id;
    
    // Populate form
    document.getElementById('edit_patient_id').value = patient.id;
    document.getElementById('edit_patient_name').value = patient.patient_name;
    document.getElementById('edit_gender').value = patient.gender;
    document.getElementById('edit_date_of_birth').value = patient.date_of_birth;
    document.getElementById('edit_father_name').value = patient.father_name;
    document.getElementById('edit_education_years').value = patient.education_years;
    document.getElementById('edit_phone').value = patient.phone || '';
    document.getElementById('edit_hobbies').value = patient.hobbies || '';
    document.getElementById('edit_address').value = patient.address || '';
    
    // Load relatives
    const container = document.getElementById('editRelativesContainer');
    container.innerHTML = '';
    editRelativeCount = 0;
    
    if (patient.relatives && patient.relatives.length > 0) {
        patient.relatives.forEach(relative => {
            addEditRelative(relative);
        });
    }
    
    document.getElementById('editModal').style.display = 'block';
}

function addEditRelative(relativeData = null) {
    editRelativeCount++;
    const container = document.getElementById('editRelativesContainer');
    
    const relativeDiv = document.createElement('div');
    relativeDiv.className = 'relative-item';
    relativeDiv.id = `edit-relative-${editRelativeCount}`;
    
    relativeDiv.innerHTML = `
        <div class="relative-header">
            <span class="relative-number">Relative ${editRelativeCount}</span>
            <button type="button" class="btn-remove" onclick="removeEditRelative(${editRelativeCount})">Remove</button>
        </div>
        
        <div class="form-group">
            <label>Relative Name <span class="required">*</span></label>
            <input type="text" class="edit-relative-name" value="${relativeData ? relativeData.relative_name : ''}" required>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>Age</label>
                <input type="number" class="edit-relative-age" value="${relativeData && relativeData.age ? relativeData.age : ''}" min="0" max="120">
            </div>
            
            <div class="form-group">
                <label>Relation <span class="required">*</span></label>
                <select class="edit-relative-relation" required>
                    <option value="">Select Relation</option>
                    <option value="Spouse" ${relativeData && relativeData.relation === 'Spouse' ? 'selected' : ''}>Spouse</option>
                    <option value="Son" ${relativeData && relativeData.relation === 'Son' ? 'selected' : ''}>Son</option>
                    <option value="Daughter" ${relativeData && relativeData.relation === 'Daughter' ? 'selected' : ''}>Daughter</option>
                    <option value="Father" ${relativeData && relativeData.relation === 'Father' ? 'selected' : ''}>Father</option>
                    <option value="Mother" ${relativeData && relativeData.relation === 'Mother' ? 'selected' : ''}>Mother</option>
                    <option value="Brother" ${relativeData && relativeData.relation === 'Brother' ? 'selected' : ''}>Brother</option>
                    <option value="Sister" ${relativeData && relativeData.relation === 'Sister' ? 'selected' : ''}>Sister</option>
                    <option value="Grandchild" ${relativeData && relativeData.relation === 'Grandchild' ? 'selected' : ''}>Grandchild</option>
                    <option value="Other" ${relativeData && relativeData.relation === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
        </div>
        
        <div class="form-group">
            <label>Additional Information (Optional)</label>
            <textarea class="edit-relative-info" rows="2">${relativeData && relativeData.additional_info ? relativeData.additional_info : ''}</textarea>
        </div>
    `;
    
    container.appendChild(relativeDiv);
}

function removeEditRelative(id) {
    const relativeDiv = document.getElementById(`edit-relative-${id}`);
    if (relativeDiv) {
        relativeDiv.remove();
    }
}

async function savePatient() {
    const patientId = currentPatientId;
    
    // Collect patient data
    const patientData = {
        patient_name: document.getElementById('edit_patient_name').value,
        gender: document.getElementById('edit_gender').value,
        date_of_birth: document.getElementById('edit_date_of_birth').value,
        father_name: document.getElementById('edit_father_name').value,
        education_years: parseInt(document.getElementById('edit_education_years').value),
        hobbies: document.getElementById('edit_hobbies').value || null,
        address: document.getElementById('edit_address').value || null,
        phone: document.getElementById('edit_phone').value || null,
        relatives: []
    };
    
    // Collect relatives
    const relativeItems = document.querySelectorAll('#editRelativesContainer .relative-item');
    relativeItems.forEach(item => {
        const name = item.querySelector('.edit-relative-name').value;
        const age = item.querySelector('.edit-relative-age').value;
        const relation = item.querySelector('.edit-relative-relation').value;
        const info = item.querySelector('.edit-relative-info').value;
        
        if (name && relation) {
            patientData.relatives.push({
                relative_name: name,
                age: age ? parseInt(age) : null,
                relation: relation,
                additional_info: info || null,
                image_path: null
            });
        }
    });
    
    try {
        const response = await fetch(`/api/patients/${patientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to update patient');
        }
        
        showToast('Patient updated successfully!');
        closeEditModal();
        loadPatients();
    } catch (error) {
        showToast('Error updating patient: ' + error.message, 'error');
    }
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentPatientId = null;
}

// Delete Patient
function deletePatient(id) {
    const patient = patients.find(p => p.id === id);
    if (!patient) return;
    
    currentPatientId = id;
    document.getElementById('deletePatientName').textContent = patient.patient_name;
    document.getElementById('deleteModal').style.display = 'block';
}

async function confirmDelete() {
    const patientId = currentPatientId;
    
    try {
        const response = await fetch(`/api/patients/${patientId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to delete patient');
        }
        
        showToast('Patient deleted successfully!');
        closeDeleteModal();
        loadPatients();
    } catch (error) {
        showToast('Error deleting patient: ' + error.message, 'error');
    }
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    currentPatientId = null;
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show' + (type === 'error' ? ' error' : '');
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const viewModal = document.getElementById('viewModal');
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');
    
    if (event.target === viewModal) {
        closeViewModal();
    }
    if (event.target === editModal) {
        closeEditModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}
