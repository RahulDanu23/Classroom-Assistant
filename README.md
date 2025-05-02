# Classroom Assistant

A web-based educational platform that facilitates interaction between faculty and students through notes sharing, quizzes, and feedback.

## Features

### Faculty Features
- Upload and manage study notes
- Create and manage quizzes
- View student performance
- Receive and manage student feedback
- Profile management

### Student Features
- Access and download study notes
- Take quizzes
- View performance
- Submit feedback to faculty
- Profile management

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- File Storage: Local file system

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/RahulDanu23/Classroom-Assistant.git
```

2. Install dependencies:
```bash
npm install
```

3. Create an `uploads` directory in the project root:
```bash
mkdir uploads
```

4. Start MongoDB on your system

5. Start the server:
```bash
node server.js
```

6. Open the application in your browser:
- Faculty Portal: `http://localhost:5000/faculty_login.html`
- Student Portal: `http://localhost:5000/student_login.html`

## Project Structure

```
Classroom-Assistant/
├── server.js              # Backend server
├── package.json           # Project dependencies
├── uploads/              # Directory for uploaded files
├── faculty_dashboard.html # Faculty interface
├── student_dashboard.html # Student interface
├── quiz.html             # Quiz interface
└── README.md             # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 