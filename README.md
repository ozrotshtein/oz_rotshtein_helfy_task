# oz_rotshtein_helfy_task
This project was developed as a Full-Stack Junior Developer Home Assignment.
It implements full task management capabilities alongside a smooth endless carousel interface for displaying tasks.

Features

Endless animated carousel (no external carousel libraries)

Add new tasks (title, description, priority: low/medium/high)

Edit tasks inline

Delete tasks with confirmation

Toggle task status (completed / pending)

Filter tasks: All / Completed / Pending

Search tasks by text

Sort tasks by date, priority, or title

Responsive design for desktop and mobile

Loading and error states

Clean and maintainable code structure using React Hooks

In-memory backend storage (no database required)

Technology Stack
Area	Technology
Frontend	React, Vite, CSS
Backend	Node.js, Express.js
State & UI Logic	React Hooks: useState, useEffect, useRef, useMemo
Animation	requestAnimationFrame
Data format	JSON over REST API
Folder Structure
task-manager/
 ├─ backend/
 │   ├─ server.js
 │   └─ package.json
 ├─ frontend/
 │   ├─ src/
 │   │   ├─ App.jsx
 │   │   ├─ main.jsx
 │   │   ├─ index.css
 │   │   └─ components/
 │   │       ├─ TaskCarousel.jsx
 │   │       ├─ TaskItem.jsx
 │   │       ├─ TaskForm.jsx
 │   │       └─ TaskFilter.jsx
 │   └─ package.json
 └─ README.md

Backend Setup
cd backend
npm install
npm start


The backend server will run at:

http://localhost:4000

Frontend Setup
cd frontend
npm install
npm start


The frontend will run at:

http://localhost:3000

The frontend accesses the backend at:

http://localhost:4000

Configuration located in: frontend/src/services/api.js

API Endpoints

Base URL:

http://localhost:4000/api/tasks

Method	Endpoint	Description
GET	/api/tasks	List all tasks (supports filtering and sorting)
POST	/api/tasks	Create a new task
PUT	/api/tasks/:id	Update a task
DELETE	/api/tasks/:id	Delete a task
PATCH	/api/tasks/:id/toggle	Toggle completion status
Task Data Structure
{
  "id": 1,
  "title": "Example Task",
  "description": "",
  "priority": "medium",
  "completed": false,
  "createdAt": "2025-10-25T11:00:00.000Z"
}

Assignment Requirements Checklist
Requirement	Status
CRUD endpoints	Completed
Toggle status	Completed
Input validation	Completed
Proper HTTP status codes	Completed
No database (in-memory storage)	Completed
React Hooks	Completed
Animated endless carousel	Completed
Filtering and searching	Completed
Responsive design	Completed
Error handling	Completed
Clean code and maintainability	Completed
Carousel Implementation Details

Continuous automatic scrolling without pagination

Array rotation ensures endless looping with a single copy of data in DOM

Smooth animation using transform and requestAnimationFrame

Pauses on hover for safe interaction (edit, delete, toggle)

Handles empty states, small task lists, and frequent updates
