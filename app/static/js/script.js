let relativeCount = 0;

// Add relative button handler
document.getElementById('addRelative').addEventListener('click', function() {
    addRelativeForm();
});

// Add initial relative form on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set max date to today for date of birth
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date_of_birth').setAttribute('max', today);
});

function addRelativeForm() {
    relativeCount++;
    const container = document.getElementById('relativesContainer');
    
    const relativeDiv = document.createElement('div');
    relativeDiv.className = 'relative-item';
    relativeDiv.id = `relative-${relativeCount}`;
    
    relativeDiv.innerHTML = `
        <div class="relative-header">
            <span class="relative-number">Relative ${relativeCount}</span>
            <button type="button" class="btn-remove" onclick="removeRelative(${relativeCount})">Remove</button>
        </div>
        
        <div class="form-group">
            <label for="relative_name_${relativeCount}">Relative Name <span class="required">*</span></label>
            <input type="text" id="relative_name_${relativeCount}" class="relative-name" required>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="relative_age_${relativeCount}">Age</label>
                <input type="number" id="relative_age_${relativeCount}" class="relative-age" min="0" max="120">
            </div>
            
            <div class="form-group">
                <label for="relative_relation_${relativeCount}">Relation <span class="required">*</span></label>
                <select id="relative_relation_${relativeCount}" class="relative-relation" required>
                    <option value="">Select Relation</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Grandchild">Grandchild</option>
                    <option value="Other">Other</option>
                </select>
            </div>
        </div>
        
        <div class="form-group">
            <label for="relative_info_${relativeCount}">Additional Information (Optional)</label>
            <textarea id="relative_info_${relativeCount}" class="relative-info" rows="2"></textarea>
        </div>
    `;
    
    container.appendChild(relativeDiv);
}

function removeRelative(id) {
    const relativeDiv = document.getElementById(`relative-${id}`);
    if (relativeDiv) {
        relativeDiv.remove();
    }
}

// Form submission handler
document.getElementById('patientForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Collect patient data
    const patientData = {
        patient_name: document.getElementById('patient_name').value,
        gender: document.getElementById('gender').value,
        date_of_birth: document.getElementById('date_of_birth').value,
        father_name: document.getElementById('father_name').value,
        education_years: parseInt(document.getElementById('education_years').value),
        hobbies: document.getElementById('hobbies').value || null,
        address: document.getElementById('address').value || null,
        phone: document.getElementById('phone').value || null,
        relatives: []
    };
    
    // Collect relatives data
    const relativeItems = document.querySelectorAll('.relative-item');
    relativeItems.forEach((item, index) => {
        const relativeName = item.querySelector('.relative-name').value;
        const relativeAge = item.querySelector('.relative-age').value;
        const relativeRelation = item.querySelector('.relative-relation').value;
        const relativeInfo = item.querySelector('.relative-info').value;
        
        if (relativeName && relativeRelation) {
            patientData.relatives.push({
                relative_name: relativeName,
                age: relativeAge ? parseInt(relativeAge) : null,
                relation: relativeRelation,
                additional_info: relativeInfo || null,
                image_path: null
            });
        }
    });
    
    try {
        // Submit to API
        const response = await fetch('/api/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to register patient');
        }
        
        const result = await response.json();
        
        // Show success message
        document.getElementById('patientId').textContent = result.id;
        document.getElementById('patientForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
    } catch (error) {
        // Show error message
        document.getElementById('errorText').textContent = error.message;
        document.getElementById('errorMessage').style.display = 'block';
    }
});

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}
