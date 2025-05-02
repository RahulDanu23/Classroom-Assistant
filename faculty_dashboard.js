// Navigation functionality
function initializeNavigation() {
    document.querySelectorAll('.sidebar li').forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Department type and subject handling
function initializeDepartmentTypeHandling() {
    document.getElementById('department-type').addEventListener('change', function() {
        const coreSubjects = document.getElementById('core-subjects');
        const aimlSubjects = document.getElementById('aiml-subjects');
        const cyberSubjects = document.getElementById('cyber-subjects');
        const aidsSubjects = document.getElementById('aids-subjects');
        const selectedType = this.value;

        // Reset subject selection
        document.getElementById('subject-department').value = '';

        // Hide all subject groups first
        [coreSubjects, aimlSubjects, cyberSubjects, aidsSubjects].forEach(group => {
            if (group) {
                group.style.display = 'none';
                group.querySelectorAll('option').forEach(opt => opt.disabled = true);
            }
        });

        // Show and enable the selected department's subjects
        const subjectGroups = {
            'core': coreSubjects,
            'aiml': aimlSubjects,
            'cyber': cyberSubjects,
            'aids': aidsSubjects
        };

        if (subjectGroups[selectedType]) {
            subjectGroups[selectedType].style.display = 'block';
            subjectGroups[selectedType].querySelectorAll('option').forEach(opt => opt.disabled = false);
        }
    });
}

// Quiz functionality
function initializeQuizFunctionality() {
    // Add Question Button
    document.querySelector('.add-question-btn').addEventListener('click', function() {
        const questionsContainer = document.querySelector('.questions-container');
        const questionCount = questionsContainer.children.length + 1;
        
        const newQuestion = document.createElement('div');
        newQuestion.className = 'question';
        newQuestion.innerHTML = `
            <div class="form-group">
                <label>Question ${questionCount}</label>
                <input type="text" placeholder="Enter question" required>
            </div>
            <div class="options">
                <input type="text" placeholder="Option A" required>
                <input type="text" placeholder="Option B" required>
                <input type="text" placeholder="Option C" required>
                <input type="text" placeholder="Option D" required>
            </div>
            <div class="form-group">
                <label>Correct Answer</label>
                <select required>
                    <option value="">Select correct option</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>
            </div>
        `;
        
        questionsContainer.appendChild(newQuestion);
    });

    // Quiz Form Submission
    document.getElementById('quizForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your quiz generation logic here
        alert('Quiz generated successfully!');
    });
}

// File handling utilities
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Notes display and delete functionality
function displayFacultyNotes() {
    const notesGrid = document.getElementById('faculty-notes-grid');
    if (!notesGrid) return; // Guard clause if element doesn't exist

    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    console.log('Current notes:', notes); // Debug log

    // Clear existing notes
    notesGrid.innerHTML = '';

    if (notes.length === 0) {
        const noNotesMessage = document.createElement('div');
        noNotesMessage.className = 'no-notes-message';
        noNotesMessage.innerHTML = `
            <i class="fas fa-book-open"></i>
            <p>No notes uploaded yet</p>
        `;
        notesGrid.appendChild(noNotesMessage);
        return;
    }

    // Sort notes by upload date (newest first)
    notes.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    // Display notes
    notes.forEach(note => {
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
                    <button class="view-btn" onclick="viewFacultyNote('${note.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="delete-btn" onclick="deleteNote('${note.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        notesGrid.appendChild(noteCard);
    });
}

// Helper functions for formatting
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Enhanced delete note functionality
function deleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
        return;
    }

    try {
        // Get existing notes
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        
        // Find the note to delete
        const noteIndex = notes.findIndex(n => n.id.toString() === noteId);
        if (noteIndex === -1) {
            alert('Note not found');
            return;
        }

        // Store note info for success message
        const deletedNote = notes[noteIndex];

        // Remove note from array
        notes.splice(noteIndex, 1);
        
        // Update notes in localStorage
        localStorage.setItem('notes', JSON.stringify(notes));
        
        // Remove the file content
        localStorage.removeItem(`note_file_${noteId}`);

        // Show success message with animation
        const successMessage = document.createElement('div');
        successMessage.className = 'delete-success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <p>Note "${deletedNote.topic}" has been deleted successfully!</p>
                <div class="note-details">
                    <small>Subject: ${deletedNote.subject}</small>
                    <small>Semester: ${deletedNote.semester}</small>
                </div>
            </div>
        `;
        document.body.appendChild(successMessage);

        // Add fade-out animation before removing
        setTimeout(() => {
            successMessage.style.opacity = '0';
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }, 2700);

        // Refresh the notes display
        displayFacultyNotes();

        // Log for debugging
        console.log('Note deleted successfully:', deletedNote);
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Error deleting note. Please try again.');
    }
}

function viewFacultyNote(noteId) {
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

    // Open file in new tab
    window.open(fileContent, '_blank');
}

// Notes upload functionality
function initializeNotesUpload() {
    document.getElementById('uploadForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const departmentType = document.getElementById('department-type').value;
        const semester = document.getElementById('profile-semester').value;
        const subject = document.getElementById('subject-department').value;
        const topic = document.getElementById('topic').value;
        const file = document.getElementById('file').files[0];

        if (!departmentType || !semester || !subject || !topic || !file) {
            alert('Please fill in all required fields and select a file');
            return;
        }

        // Show loading message
        const uploadBtn = document.querySelector('.upload-btn');
        const originalBtnText = uploadBtn.innerHTML;
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        uploadBtn.disabled = true;

        try {
            // Convert file to base64 for storage
            const base64File = await fileToBase64(file);
            
            // Create a new note object
            const note = {
                id: Date.now(),
                departmentType,
                semester,
                subject,
                topic,
                fileName: file.name,
                fileSize: file.size,
                uploadDate: new Date().toISOString(),
                fileType: file.type
            };

            // Get existing notes or initialize empty array
            const existingNotes = JSON.parse(localStorage.getItem('notes') || '[]');
            
            // Add new note
            existingNotes.push(note);
            
            // Store notes metadata
            localStorage.setItem('notes', JSON.stringify(existingNotes));
            
            // Store file content separately
            localStorage.setItem(`note_file_${note.id}`, base64File);

            // Show success message
            showUploadSuccessMessage(subject, topic, semester);

            // Reset form
            this.reset();
            document.getElementById('subject-department').value = '';
            document.getElementById('department-type').value = '';
            document.getElementById('profile-semester').value = '';

            // Refresh the notes display
            displayFacultyNotes();
            
        } catch (error) {
            console.error('Error uploading note:', error);
            alert('Error uploading note. Please try again.');
        } finally {
            // Restore upload button
            uploadBtn.innerHTML = originalBtnText;
            uploadBtn.disabled = false;
        }
    });
}

function showUploadSuccessMessage(subject, topic, semester) {
    const successMessage = document.createElement('div');
    successMessage.className = 'upload-success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Notes Uploaded Successfully!</h3>
            <p>Your notes have been uploaded and are now available to students.</p>
            <div class="note-details">
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Topic:</strong> ${topic}</p>
                <p><strong>Semester:</strong> ${semester}</p>
            </div>
        </div>
    `;
    
    document.querySelector('.upload-container').appendChild(successMessage);

    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Add styles for the notes list and delete functionality
const style = document.createElement('style');
style.textContent = `
    .notes-list-container {
        margin-top: 30px;
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .notes-list-container h3 {
        margin-bottom: 20px;
        color: #333;
        text-align: left;
    }

    #faculty-notes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        padding: 20px 0;
    }

    .note-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 15px;
        transition: transform 0.2s;
    }

    .note-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .note-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
    }

    .note-title h3 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.1em;
    }

    .semester-badge {
        display: inline-block;
        padding: 3px 8px;
        background: #e1f5fe;
        color: #0288d1;
        border-radius: 12px;
        font-size: 0.8em;
        margin-top: 5px;
    }

    .department-badge {
        padding: 3px 8px;
        background: #f3e5f5;
        color: #7b1fa2;
        border-radius: 12px;
        font-size: 0.8em;
    }

    .note-content h4 {
        margin: 0 0 10px 0;
        color: #455a64;
        font-size: 1em;
    }

    .note-info {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 15px;
        font-size: 0.9em;
        color: #666;
    }

    .note-info span {
        display: flex;
        align-items: center;
    }

    .note-info i {
        margin-right: 5px;
    }

    .note-actions {
        display: flex;
        gap: 10px;
    }

    .view-btn, .delete-btn {
        padding: 8px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9em;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: background-color 0.3s;
    }

    .view-btn {
        background-color: #4CAF50;
        color: white;
    }

    .view-btn:hover {
        background-color: #43A047;
    }

    .delete-btn {
        background-color: #dc3545;
        color: white;
    }

    .delete-btn:hover {
        background-color: #c82333;
    }

    .delete-success-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
        transition: opacity 0.3s ease-out;
    }

    .delete-success-message .success-content {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .delete-success-message i {
        margin-right: 10px;
    }

    .delete-success-message .note-details {
        display: flex;
        flex-direction: column;
        font-size: 0.85em;
        opacity: 0.9;
        margin-top: 5px;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .no-notes-message {
        text-align: center;
        padding: 40px;
        color: #666;
        grid-column: 1 / -1;
    }

    .no-notes-message i {
        font-size: 48px;
        margin-bottom: 10px;
        color: #ccc;
        display: block;
    }
`;
document.head.appendChild(style);

// Add additional styles for enhanced delete functionality
const deleteStyles = document.createElement('style');
deleteStyles.textContent = `
    .delete-btn {
        position: relative;
        overflow: hidden;
    }

    .delete-btn::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 5px;
        background: rgba(255, 255, 255, 0.5);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1, 1) translate(-50%);
        transform-origin: 50% 50%;
    }

    .delete-btn:focus:not(:active)::after {
        animation: ripple 1s ease-out;
    }

    @keyframes ripple {
        0% {
            transform: scale(0, 0);
            opacity: 0.5;
        }
        20% {
            transform: scale(25, 25);
            opacity: 0.3;
        }
        100% {
            opacity: 0;
            transform: scale(40, 40);
        }
    }
`;
document.head.appendChild(deleteStyles);

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeDepartmentTypeHandling();
    initializeQuizFunctionality();
    initializeNotesUpload();
    displayFacultyNotes();
    
    // Debug log to check if notes exist
    console.log('Initial notes:', JSON.parse(localStorage.getItem('notes') || '[]'));
}); 