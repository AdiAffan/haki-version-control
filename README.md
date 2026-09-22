# HAKI Version Control

HAKI is a web-based version control system developed as a college minor project.

The purpose of HAKI is to demonstrate the fundamental concepts behind version control systems such as Git through a simplified web application. It allows users to create repositories, manage files and folders, create commits, store file snapshots, view commit history, and track the current state of a repository using `HEAD`.

HAKI is built using a React frontend, a Node.js and Express backend, and JSON files for data persistence. Repository files and folders are also stored as actual directories and files on the server filesystem.

---

## Table of Contents

* [About HAKI](#about-haki)
* [Features](#features)
* [Technology Used](#technology-used)
* [System Architecture](#system-architecture)
* [Project Structure](#project-structure)
* [How HAKI Works](#how-haki-works)
* [Prerequisites](#prerequisites)
* [Installation and Setup](#installation-and-setup)
* [Running the Project](#running-the-project)
* [How to Use HAKI](#how-to-use-haki)
* [Repository Management](#repository-management)
* [Folder Management](#folder-management)
* [File Management](#file-management)
* [Creating a Commit](#creating-a-commit)
* [Viewing Commit History](#viewing-commit-history)
* [Understanding HEAD](#understanding-head)
* [REST API](#rest-api)
* [Data Storage](#data-storage)
* [Development Milestones](#development-milestones)
* [Future Scope](#future-scope)
* [Limitations](#limitations)
* [Educational Purpose](#educational-purpose)
* [Author](#author)

---

# About HAKI

HAKI is a simplified version control system that provides a graphical interface for performing basic version-control operations.

Traditional version-control systems can be difficult for beginners to understand because many of their operations are performed through command-line tools and involve several internal concepts.

HAKI attempts to make these concepts easier to understand by representing them through a web interface.

The main concepts implemented in HAKI are:

* Repository
* Folders
* Files
* File contents
* Commits
* Snapshots
* Parent commits
* Commit history
* HEAD

The project does not use Git internally for its version-control operations. Instead, these concepts are implemented using application logic, JSON-based storage, and the Node.js filesystem.

---

# Features

## Repository Management

HAKI allows users to:

* Create repositories
* View repositories
* Edit repositories
* Delete repositories
* Open a repository workspace

## Folder Management

Inside a repository, users can:

* Create folders
* Create folders inside other folders
* Select a folder
* Use a folder as the location for new files
* View folders in the repository workspace

When a folder is created, HAKI creates an actual directory on the server filesystem.

For example:

```text
Repository
│
├── src/
│
├── components/
│
└── README.md
```

The folders are not only visual entries in the interface. They correspond to actual directories stored inside the repository's storage location.

## File Management

Inside a repository, users can:

* Create files
* Create files inside folders
* View files
* Edit files
* Delete files
* Modify file contents
* Store file contents on the server filesystem

Files can be created either in the repository root or inside a selected folder.

For example:

```text
Repository
│
├── src/
│   ├── app.js
│   └── index.js
│
├── components/
│   └── Navbar.jsx
│
└── README.md
```

When a file is created inside a folder, HAKI stores the file inside the corresponding physical directory on the server.

---

# Commit Management

HAKI supports:

* Creating commits
* Adding commit messages
* Capturing repository files as snapshots
* Storing commit timestamps
* Maintaining parent commit relationships
* Updating the repository `HEAD`

When a commit is created, the current repository state is captured and stored as a snapshot.

---

# Commit History

Users can:

* View previous commits
* View commit messages
* View commit timestamps
* Inspect stored snapshots
* Retrieve individual commits
* Understand the relationship between commits

Each commit can contain information about its parent commit, allowing the commit history to form a chain.

---

# HEAD Tracking

HAKI maintains a `HEAD` reference for each repository.

`HEAD` represents the current commit of the repository.

When a new commit is created, `HEAD` is updated to point to the newly created commit.

Conceptually:

```text
Commit 1
   ↓
Commit 2
   ↓
Commit 3
   ↓
  HEAD
```

This demonstrates the basic concept of how version-control systems maintain the current state of a repository.

---

# Technology Used

## Frontend

### React.js

React is used to build the user interface of HAKI.

It provides a component-based architecture for building pages such as:

* Dashboard
* Repository workspace
* Repository cards
* File management interface
* Folder management interface
* Commit interface
* Commit history

### Tailwind CSS

Tailwind CSS is used for styling the frontend.

It provides utility classes for:

* Layout
* Spacing
* Typography
* Colors
* Responsive design
* Buttons
* Forms
* Cards
* Navigation
* Modals

### React Router

React Router is used for client-side navigation between different pages of the application.

### Vite

Vite is used as the frontend development server and build tool.

It provides:

* Fast development startup
* Hot module replacement
* Production builds
* Frontend asset bundling

---

# Backend

## Node.js

Node.js provides the runtime environment for the backend.

It allows the project to execute JavaScript outside the browser and interact with the filesystem.

The Node.js filesystem module is also used to create actual repository directories and files.

## Express.js

Express.js is used to build the REST API.

It handles:

* HTTP requests
* Routes
* Controllers
* Responses
* Middleware
* Repository operations
* File operations
* Folder operations

## REST API

The frontend communicates with the backend through REST API endpoints.

The basic communication flow is:

```text
React Frontend
      ↓
HTTP Request
      ↓
Express REST API
      ↓
Controller
      ↓
Service
      ↓
JSON Storage / Filesystem
```

---

# System Architecture

HAKI follows a basic frontend-backend architecture.

```text
                    HAKI
                     │
          ┌──────────┴──────────┐
          │                     │
     React Frontend        Node.js Backend
          │                     │
     React Router            Express.js
          │                     │
     UI Components          REST API
          │                     │
          └──────────┬──────────┘
                     │
               Service Layer
                     │
          ┌──────────┴──────────┐
          │                     │
     JSON Data Storage      Filesystem
          │                     │
     Repository Data       Real Folders
     File Metadata         Real Files
     Commits
     HEAD
```

---

# Project Structure

The project is organized into frontend and backend components.

```text
HAKI Version Control
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── server/
    ├── controllers/
    │   ├── repositoryController.js
    │   ├── fileController.js
    │   ├── folderController.js
    │   └── commitController.js
    │
    ├── routes/
    │   ├── repositoryRoutes.js
    │   ├── fileRoutes.js
    │   ├── folderRoutes.js
    │   └── commitRoutes.js
    │
    ├── services/
    │   ├── repositoryService.js
    │   ├── fileService.js
    │   ├── folderService.js
    │   └── commitService.js
    │
    ├── data/
    │   ├── repositories.json
    │   ├── repositoryFiles.json
    │   ├── repositoryFolders.json
    │   └── commits.json
    │
    ├── storage/
    │   └── <repositoryId>/
    │       ├── folders/
    │       └── files
    │
    ├── server.js
    └── package.json
```

The exact project structure may contain additional files depending on the current implementation.

---

# How HAKI Works

The basic workflow of HAKI is:

```text
Create Repository
       ↓
Open Repository
       ↓
Create Folder / File
       ↓
Edit File
       ↓
Create Commit
       ↓
Store Snapshot
       ↓
Update HEAD
       ↓
View Commit History
```

Folders and files are represented in the application using metadata while the actual folders and files are maintained on the server filesystem.

---

# Prerequisites

Before running HAKI, make sure the following software is installed:

* Node.js
* npm
* A modern web browser
* Code editor such as Visual Studio Code

You can verify Node.js and npm using:

```bash
node -v
npm -v
```

---

# Installation and Setup

Clone or download the HAKI project.

Navigate to the project directory:

```bash
cd haki-version-control-main
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

---

# Running the Project

## Start the Backend

Navigate to the server directory:

```bash
cd server
```

Start the backend:

```bash
npm start
```

The backend runs on the configured server port.

## Start the Frontend

Open another terminal and navigate to:

```bash
cd client
```

Start the frontend:

```bash
npm run dev
```

Vite will provide the local development URL.

Open the URL in a web browser to access HAKI.

---

# How to Use HAKI

## Step 1: Create a Repository

Create a new repository from the dashboard.

Provide the repository information and create it.

## Step 2: Open the Repository

Open the repository to access the workspace.

The workspace provides access to:

* Files
* Folders
* File editor
* Commit history
* Repository information

## Step 3: Create a Folder

Use the **Create Folder** button.

Enter a folder name such as:

```text
src
```

HAKI creates the folder in the repository.

The folder can then be selected as the location for new files.

## Step 4: Create a File

Select a folder and use the **Create File** option.

For example:

```text
src/
└── app.js
```

If no folder is selected, the file is created in the repository root.

## Step 5: Edit the File

Select a file from the workspace.

The file content can be viewed and modified using the editor.

## Step 6: Create a Commit

Enter a commit message and create the commit.

HAKI captures the current repository state and stores the snapshot.

---

# Repository Management

Repository management is handled through the repository API.

The main repository operations are:

```text
Create Repository
View Repository
Update Repository
Delete Repository
Open Repository
```

Each repository has its own identifier that is used by the backend when managing files, folders, and commits.

---

# Folder Management

Folder management was added to allow repositories to maintain a directory structure.

A folder contains:

* Folder ID
* Repository ID
* Folder name
* Parent folder ID
* Creation timestamp
* Update timestamp

Example:

```text
src/
│
├── components/
│   ├── Navbar.jsx
│   └── Footer.jsx
│
└── App.jsx
```

The `parentId` value allows folders to be associated with another folder.

A folder without a `parentId` belongs directly to the repository root.

When a folder is created, the backend uses Node.js filesystem operations to create the corresponding physical directory.

---

# File Management

File management is responsible for creating, reading, updating, and deleting repository files.

Each file contains metadata such as:

* File ID
* Repository ID
* Folder ID
* File name
* File path
* File content
* Storage path
* Creation timestamp
* Update timestamp

For example:

```text
Repository
│
└── src/
    └── app.js
```

The file metadata identifies the repository and folder while the actual file is stored on the server filesystem.

The `folderId` property connects a file to its parent folder.

If `folderId` is `null`, the file belongs to the repository root.

---

# Creating a Commit

When a commit is created, HAKI captures the current state of repository files.

A commit contains information such as:

* Commit ID
* Repository ID
* Commit message
* Snapshot
* Parent commit
* Timestamp

Example:

```text
Commit 1
Message: Initial project
       ↓
Commit 2
Message: Added authentication
       ↓
Commit 3
Message: Added repository folders
```

This structure demonstrates the basic concept of commit history.

---

# Viewing Commit History

The commit history allows users to view previous repository states.

Users can inspect:

* Commit messages
* Commit IDs
* Commit timestamps
* Parent commits
* Stored snapshots

This helps demonstrate how version-control systems maintain historical versions of a project.

---

# Understanding HEAD

`HEAD` is a reference to the latest commit of a repository.

For example:

```text
Commit A
   ↓
Commit B
   ↓
Commit C
   ↓
 HEAD
```

After another commit:

```text
Commit A
   ↓
Commit B
   ↓
Commit C
   ↓
Commit D
   ↓
 HEAD
```

HAKI updates `HEAD` whenever a new commit is created.

---

# REST API

HAKI uses REST API endpoints for communication between the frontend and backend.

## Repository API

Repository operations include:

```text
GET     /api/repositories
POST    /api/repositories
GET     /api/repositories/:id
PUT     /api/repositories/:id
DELETE  /api/repositories/:id
```

## File API

File operations include:

```text
GET     /api/files/:repositoryId
GET     /api/files/:repositoryId/:fileId
POST    /api/files/:repositoryId
PUT     /api/files/:repositoryId/:fileId
DELETE  /api/files/:repositoryId/:fileId
```

## Folder API

Folder operations include:

```text
GET     /api/folders/:repositoryId
POST    /api/folders/:repositoryId
```

The folder API is responsible for retrieving repository folders and creating new directories.

## Commit API

Commit operations provide functionality for:

```text
Create Commit
Get Commits
Get Individual Commit
```

The exact commit endpoints depend on the current backend route configuration.

---

# Data Storage

HAKI uses two forms of storage.

## JSON Data Storage

JSON files are used to store application metadata.

Examples include:

```text
repositories.json
repositoryFiles.json
repositoryFolders.json
commits.json
```

These files contain information required by the application.

## Filesystem Storage

Actual repository folders and files are stored on the server filesystem.

The storage follows the repository structure:

```text
server/
└── storage/
    └── <repositoryId>/
        ├── src/
        │   ├── app.js
        │   └── index.js
        │
        └── components/
            └── Navbar.jsx
```

This means the folder structure created from the HAKI interface corresponds to actual directories on the server.

---

# Development Milestones

The project has been developed through several stages.

## Milestone 1

Basic project setup:

* React frontend
* Node.js backend
* Express server
* REST API

## Milestone 2

Repository management:

* Create repository
* View repositories
* Update repository
* Delete repository

## Milestone 3

File management:

* Create file
* View file
* Edit file
* Delete file
* Store file content

## Milestone 4

Version control functionality:

* Create commits
* Commit messages
* Snapshots
* Parent commits
* Commit history
* HEAD tracking

## Milestone 5

Folder and directory support:

* Create folders
* Parent-child folder relationships
* Select folders
* Create files inside folders
* Actual filesystem directories
* Actual filesystem files
* Folder metadata storage

---

# Future Scope

Possible future improvements include:

* User authentication
* Multiple branches
* Branch switching
* Merge functionality
* Pull and push functionality
* Remote repositories
* Improved diff viewer
* File search
* Folder deletion
* Folder renaming
* File moving
* Drag-and-drop file management
* Conflict detection
* Improved snapshot storage
* Database-based persistence
* User permissions
* Repository collaboration

---

# Limitations

HAKI is an educational implementation and is not intended to replace production version-control systems such as Git.

Current limitations include:

* JSON-based data persistence
* Local filesystem storage
* Limited collaboration functionality
* No distributed repository support
* No complete Git compatibility
* No advanced branching and merging system
* Limited authentication and authorization
* Snapshot functionality is simplified compared with Git

The project focuses on demonstrating the fundamental concepts of version control rather than implementing the complete Git architecture.

---

# Educational Purpose

HAKI was developed as a college minor project to demonstrate the fundamental concepts of version-control systems.

The project provides practical understanding of:

* Repository management
* File management
* Directory structures
* REST APIs
* Backend services
* Filesystem operations
* JSON data persistence
* Commits
* Snapshots
* Parent commits
* Commit history
* HEAD references
* Frontend-backend communication

By implementing these concepts manually, students can better understand the basic principles behind systems such as Git.

---

# Author

**Rohit Yadav**

MCA Student
Kanpur Institute of Technology (KIT), Kanpur
AKTU | 2025–2027

**Project:** HAKI Version Control

**Project Type:** College Minor Project
