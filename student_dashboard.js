// Student data management
const studentData = JSON.parse(localStorage.getItem('studentData')) || {
    name: 'Student Name',
    id: '123456',
    section: 'A1',
    email: 'student@example.com'
};

// Initialize student data in the UI
function initializeStudentData() {
    document.getElementById('student-name').textContent = studentData.name;
    document.getElementById('student-id').textContent = `ID: ${studentData.id}`;
    document.getElementById('student-section').textContent = `Section: ${studentData.section}`;

    document.getElementById('profile-name').value = studentData.name;
    document.getElementById('profile-email').value = studentData.email;
    document.getElementById('profile-rollno').value = studentData.rollno || '';
    document.getElementById('profile-section').value = studentData.section || '';
    document.getElementById('profile-semester').value = studentData.semester || '';
}

// Navigation functionality
function initializeNavigation() {
    document.querySelectorAll('.sidebar-nav li').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            const sectionId = this.getAttribute('data-section') + '-section';
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Feedback functionality
function initializeFeedback() {
    document.querySelector('.submit-feedback-btn').addEventListener('click', function() {
        const teacher = document.getElementById('teacher-select').value;
        const message = document.getElementById('feedback-message').value;
        
        if (!teacher || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        console.log('Feedback submitted:', { teacher, message });
        alert('Feedback submitted successfully!');
    });
}

// Profile functionality
function initializeProfile() {
    document.querySelector('.save-profile-btn').addEventListener('click', function() {
        const newName = document.getElementById('profile-name').value;
        const newEmail = document.getElementById('profile-email').value;
        const newRollno = document.getElementById('profile-rollno').value;
        const newSection = document.getElementById('profile-section').value;
        const newSemester = document.getElementById('profile-semester').value;
        
        // Update student data
        studentData.name = newName;
        studentData.email = newEmail;
        studentData.rollno = newRollno;
        studentData.section = newSection;
        studentData.semester = newSemester;
        
        // Update localStorage
        localStorage.setItem('studentData', JSON.stringify(studentData));
        
        // Update displayed information
        document.getElementById('student-name').textContent = studentData.name;
        document.getElementById('student-id').textContent = `ID: ${studentData.rollno}`;
        document.getElementById('student-section').textContent = `Section: ${studentData.section}`;
        
        alert('Profile changes saved successfully!');
    });
}

// Logout functionality
function initializeLogout() {
    const logoutBtn = document.createElement('li');
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Logout</span>';
    logoutBtn.style.marginTop = '20px';
    logoutBtn.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
    logoutBtn.style.paddingTop = '20px';
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('studentData');
        window.location.href = 'student_login.html';
    });
    document.querySelector('.sidebar-nav ul').appendChild(logoutBtn);
}

// Notes functionality
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function displayNotes() {
    const notesGrid = document.getElementById('notes-grid');
    const selectFiltersMessage = document.getElementById('select-filters-message');
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const searchTerm = document.getElementById('notes-search').value.toLowerCase();
    const departmentFilter = document.getElementById('notes-department').value;
    const subjectFilter = document.getElementById('subject-department').value;
    const semesterFilter = document.getElementById('notes-semester').value;

    // Check if all filters are selected
    if (!departmentFilter || !semesterFilter || !subjectFilter) {
        notesGrid.style.display = 'none';
        selectFiltersMessage.style.display = 'flex';
        return;
    }

    notesGrid.style.display = 'grid';
    selectFiltersMessage.style.display = 'none';

    // Filter notes based on search and filters
    const filteredNotes = notes.filter(note => {
        const matchesSearch = 
            note.topic.toLowerCase().includes(searchTerm) ||
            note.subject.toLowerCase().includes(searchTerm);
        
        const matchesDepartment = note.departmentType === departmentFilter;
        const matchesSubject = note.subject === subjectFilter;
        const matchesSemester = note.semester === semesterFilter;

        return matchesSearch && matchesDepartment && matchesSubject && matchesSemester;
    });

    // Sort notes by upload date (newest first)
    filteredNotes.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    // Clear existing notes
    notesGrid.innerHTML = '';

    if (filteredNotes.length === 0) {
        const noNotesMessage = document.createElement('div');
        noNotesMessage.className = 'no-notes-message';
        noNotesMessage.innerHTML = `
            <i class="fas fa-book-open"></i>
            <p>No notes found for the selected criteria</p>
            <p class="sub-text">Try selecting different filters</p>
        `;
        notesGrid.appendChild(noNotesMessage);
        return;
    }

    // Display filtered notes
    filteredNotes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
            <div class="note-header">
                <div class="note-title">
                    <h3>${note.subject}</h3>
                    <span class="semester-badge">Semester ${note.semester}</span>
                </div>
                <div class="department-badge">${note.departmentType.toUpperCase()}</div>
            </div>
            <div class="note-content">
                <h4>${note.topic}</h4>
                <div class="note-info">
                    <span><i class="fas fa-file"></i> ${note.fileName}</span>
                    <span><i class="fas fa-hdd"></i> ${formatFileSize(note.fileSize)}</span>
                    <span><i class="fas fa-clock"></i> ${formatDate(note.uploadDate)}</span>
                </div>
                <div class="note-actions">
                    <button class="download-btn" onclick="downloadNote('${note.id}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="view-btn" onclick="viewNote('${note.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        `;
        notesGrid.appendChild(noteCard);
    });
}

function downloadNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const note = notes.find(n => n.id.toString() === noteId);
    if (!note) return;

    const fileContent = localStorage.getItem(`note_file_${noteId}`);
    if (!fileContent) {
        alert('File content not found');
        return;
    }

    // Create download link
    const link = document.createElement('a');
    link.href = fileContent;
    link.download = note.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function viewNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const note = notes.find(n => n.id.toString() === noteId);
    if (!note) {
        alert('Note not found');
        return;
    }

    const fileContent = localStorage.getItem(`note_file_${noteId}`);
    if (!fileContent) {
        alert('File content not found');
        return;
    }

    // Update modal content
    document.getElementById('modal-title').textContent = note.topic;
    document.getElementById('modal-subject').textContent = note.subject;
    document.getElementById('modal-department').textContent = note.departmentType.toUpperCase();
    document.getElementById('modal-semester').textContent = `Semester ${note.semester}`;

    // Set iframe source
    const viewer = document.getElementById('note-viewer-frame');
    viewer.src = fileContent;

    // Show modal
    const modal = document.getElementById('notes-viewer-modal');
    modal.style.display = 'block';
}

function initializeNotesViewer() {
    // Close modal when clicking the close button or outside the modal
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('notes-viewer-modal').style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        const modal = document.getElementById('notes-viewer-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function initializeNotesFilters() {
    // Handle department type selection
    document.getElementById('notes-department').addEventListener('change', function() {
        const selectedType = this.value;
        const subjectSelect = document.getElementById('subject-department');
        const coreSubjects = document.getElementById('core-subjects');
        const aimlSubjects = document.getElementById('aiml-subjects');
        const cyberSubjects = document.getElementById('cyber-subjects');
        const aidsSubjects = document.getElementById('aids-subjects');

        // Reset subject selection
        subjectSelect.value = '';

        // Hide all subject groups first
        [coreSubjects, aimlSubjects, cyberSubjects, aidsSubjects].forEach(group => {
            if (group) {
                group.style.display = 'none';
                group.querySelectorAll('option').forEach(opt => opt.disabled = true);
            }
        });

        // Show and enable only the selected department's subjects
        if (selectedType) {
            const selectedGroup = document.getElementById(`${selectedType}-subjects`);
            if (selectedGroup) {
                selectedGroup.style.display = '';
                selectedGroup.querySelectorAll('option').forEach(opt => opt.disabled = false);
            }
        }

        // Trigger notes display update
        displayNotes();
    });

    // Add event listeners for filters
    document.getElementById('notes-search').addEventListener('input', displayNotes);
    document.getElementById('notes-department').addEventListener('change', displayNotes);
    document.getElementById('notes-semester').addEventListener('change', displayNotes);
    document.getElementById('subject-department').addEventListener('change', displayNotes);
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeStudentData();
    initializeNavigation();
    initializeFeedback();
    initializeProfile();
    initializeLogout();
    initializeNotesViewer();
    initializeNotesFilters();
    displayNotes(); // Initial display call
}); 