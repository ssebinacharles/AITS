# Internship Logging and Evaluation System (ILES)

**Internship Logging and Evaluation System (ILES)** is a web-based
system developed as a class group project for **CSC 1206 -- Software
Development Project**. The system is designed to support and streamline
the management of student internships by providing a centralized
platform for internship placement, supervision, weekly activity logging,
feedback, evaluation, assessment, and publication of final results.

## Live Application

The frontend is deployed on Vercel:

https://iles-frontend-deploy.vercel.app

## System Overview

ILES supports the internship process through the following core user
groups:

-   **Students** -- submit placement details, maintain weekly internship
    logs, receive feedback, view evaluations, and access final results.
-   **Academic Supervisors** -- review assigned students' weekly logs,
    provide feedback, and participate in internship evaluation.
-   **Workplace Supervisors** -- review students' weekly logs, provide
    feedback, complete workplace assessments, and contribute to
    evaluation.
-   **Internship Administrators** -- manage users, review and approve
    internship placements, assign supervisors, monitor student progress,
    manage assessments, compile evaluation components, and publish final
    results.

## Key Features

-   Role-based user registration and authentication
-   Student, supervisor, and administrator profiles
-   Internship company management
-   Internship placement submission, review, and approval
-   Academic and workplace supervisor assignment
-   Weekly internship log submission
-   Weekly log review, approval, or rejection
-   Student feedback management
-   Academic and workplace evaluation workflows
-   Evaluation criteria and scoring
-   Workplace supervisor assessment
-   Administrator assessment and final score compilation
-   Final result and grade publication
-   Student progress monitoring
-   Audit/history support
-   Report definitions and generated reports

## System Workflow

The internship workflow follows the process below:

1.  A student registers and submits internship placement details.
2.  The Internship Administrator reviews the placement.
3.  The placement is approved or returned for correction/rejection.
4.  After approval, the Internship Administrator assigns an Academic
    Supervisor and a Workplace Supervisor.
5.  The student submits weekly internship logs.
6.  The assigned supervisors review the logs.
7.  A reviewed log may be approved or rejected with feedback.
8.  The Workplace Supervisor completes the workplace assessment.
9.  Academic and workplace evaluation components are submitted.
10. The Internship Administrator receives and compiles evaluation
    components.
11. A final score is computed and the final result is published.
12. The student can view feedback, evaluation scores, and the final
    result.

The repository includes the full workflow diagram:

![ILES System Workflow](ILES%20SYSTEM%20WORKFLOW%20DIAGRAM.png)

## Technology Stack

### Backend

-   Python
-   Django
-   Django REST Framework
-   PostgreSQL
-   `dj-database-url`
-   `psycopg2-binary`
-   Django CORS Headers
-   Django Simple History
-   Gunicorn
-   WhiteNoise
-   pytest

### Frontend

-   React
-   React Router
-   Redux Toolkit
-   React Redux
-   Axios
-   React Toastify
-   Create React App / `react-scripts`

### Deployment

-   Frontend: Vercel
-   Backend: Django deployment configuration supports an
    environment-based PostgreSQL connection through `DATABASE_URL`

## Repository Structure

``` text
ILES/
├── backend/
│   ├── iles_backend/              # Django project configuration
│   ├── users/                     # Authentication and user/profile management
│   ├── issues/                    # Core internship workflow and API resources
│   ├── manage.py
│   ├── requirements.txt
│   └── iles_test_data.json        # Test/sample data
│
├── frontend/
│   └── aits_frontend/
│       ├── public/
│       ├── src/
│       │   ├── api/               # Frontend API client modules
│       │   ├── components/
│       │   ├── context/
│       │   ├── layouts/
│       │   ├── pages/
│       │   └── App.js
│       ├── package.json
│       └── package-lock.json
│
├── Academic supervisor stories/
├── Student_stories/
├── ERD for ILES project.pdf
├── ILES SYSTEM WORKFLOW DIAGRAM.png
├── ILES_Technical_Documentation.pdf
├── ILES_Test_Coverage_Report.pdf
├── ILES_User_Manual.pdf
├── PSEUDOCODE For ILES workflow.txt
└── README.md
```

## API Overview

The Django backend exposes REST API resources for the major parts of the
internship workflow.

### Authentication and User Management

The backend provides endpoints for:

-   User registration
-   Login
-   Logout
-   Current authenticated user
-   User management
-   Student profiles
-   Supervisor profiles
-   Administrator profiles

### Core Internship Resources

The API includes resources for:

-   Companies
-   Internship placements
-   Supervisor assignments
-   Weekly logs
-   Feedback
-   Evaluation criteria
-   Evaluations
-   Evaluation scores
-   Final results
-   Audit logs
-   Report definitions
-   Generated reports

The frontend communicates with the backend through a configurable API
base URL.

## Local Development Setup

### Prerequisites

Install the following:

-   Python 3.10 or newer
-   Node.js and npm
-   PostgreSQL
-   Git

### 1. Clone the Repository

``` bash
git clone https://github.com/ssebinacharles/ILES.git
cd ILES
```

### 2. Set Up the Backend

Move into the backend directory:

``` bash
cd backend
```

Create and activate a virtual environment:

**macOS/Linux**

``` bash
python3 -m venv venv
source venv/bin/activate
```

**Windows**

``` bash
python -m venv venv
venv\Scripts\activate
```

Install the dependencies:

``` bash
pip install -r requirements.txt
```

### 3. Configure the Database

ILES uses PostgreSQL. For local development, configure the database
using environment variables rather than committing credentials to the
repository.

Example environment variables:

``` text
SECRET_KEY=your-django-secret-key
DEBUG=True
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000
```

Create the PostgreSQL database, then run:

``` bash
python manage.py migrate
```

Optionally, load the repository's test data:

``` bash
python manage.py loaddata iles_test_data.json
```

Start the backend server:

``` bash
python manage.py runserver
```

The local backend API will normally be available at:

``` text
http://localhost:8000/api
```

### 4. Set Up the Frontend

Open a new terminal and move into:

``` bash
cd frontend/aits_frontend
```

Install dependencies:

``` bash
npm install
```

Create a `.env` file if you need to specify a backend URL:

``` text
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

Start the frontend:

``` bash
npm start
```

The frontend development server will normally run on:

``` text
http://localhost:3000
```

## Running the Application

For local development, run the backend and frontend in separate
terminals.

### Terminal 1 --- Backend

``` bash
cd backend
source venv/bin/activate
python manage.py runserver
```

### Terminal 2 --- Frontend

``` bash
cd frontend/aits_frontend
npm start
```

## Testing

### Backend

The backend includes `pytest` in its project dependencies. Tests can be
run from the backend environment using the project's configured test
commands.

A test coverage report is also included in the repository as:

``` text
ILES_Test_Coverage_Report.pdf
```

### Frontend

Run the React test suite with:

``` bash
npm test
```

## Build for Production

### Frontend

``` bash
cd frontend/aits_frontend
npm run build
```

This creates a production-ready frontend build.

### Backend

For production, configure the required environment variables, install
dependencies, run migrations, collect static files, and serve the Django
application using an appropriate WSGI server such as Gunicorn.

``` bash
cd backend
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn iles_backend.wsgi
```

## Project Documentation

The repository includes supporting project documentation:

-   **ERD for ILES project.pdf** -- Entity Relationship Diagram
-   **ILES SYSTEM WORKFLOW DIAGRAM.png** -- System workflow
-   **ILES_Technical_Documentation.pdf** -- Technical documentation
-   **ILES_Test_Coverage_Report.pdf** -- Test coverage report
-   **ILES_User_Manual.pdf** -- User guide
-   **PSEUDOCODE For ILES workflow.txt** -- Workflow pseudocode
-   **Academic supervisor stories/** -- Academic supervisor user stories
-   **Student_stories/** -- Student user stories
-   **adinistration user storie-2.pdf** -- Administrator user stories

## Course Information

This system was developed as a **class group project** for:

**CSC 1206 -- Software Development Project**

## Contributors

This project was developed collaboratively as a class group project. The
project contributors and their contribution history are available
through the repository's GitHub commit history and contributor
information.

Repository:

https://github.com/ssebinacharles/ILES

## License

No license has currently been specified for this project.

## Project Status

ILES is a functional full-stack academic project with a React frontend,
Django REST backend, PostgreSQL support, role-based internship
workflows, and a deployed frontend application.

------------------------------------------------------------------------

**Developed for CSC 1206 -- Software Development Project**
