# HAKI Version Control

HAKI is a web-based version control system developed as a college minor project.

The purpose of HAKI is to demonstrate the fundamental concepts behind version control systems such as Git through a simplified web application. It allows users to create repositories, manage files, create commits, store file snapshots, view commit history, and track the current state of a repository using `HEAD`.

HAKI is built using a React frontend, a Node.js and Express backend, and JSON files for data persistence.

---

## Table of Contents

- [About HAKI](#about-haki)
- [Features](#features)
- [Technology Used](#technology-used)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [How HAKI Works](#how-haki-works)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Running the Project](#running-the-project)
- [How to Use HAKI](#how-to-use-haki)
- [Repository Management](#repository-management)
- [File Management](#file-management)
- [Creating a Commit](#creating-a-commit)
- [Viewing Commit History](#viewing-commit-history)
- [Understanding HEAD](#understanding-head)
- [REST API](#rest-api)
- [Data Storage](#data-storage)
- [Development Milestones](#development-milestones)
- [Future Scope](#future-scope)
- [Limitations](#limitations)
- [Educational Purpose](#educational-purpose)
- [Author](#author)

---

# About HAKI

HAKI is a simplified version control system that provides a graphical interface for performing basic version-control operations.

Traditional version-control systems can be difficult for beginners to understand because many of their operations are performed through command-line tools and involve several internal concepts.

HAKI attempts to make these concepts easier to understand by representing them through a web interface.

The main concepts implemented in HAKI are:

- Repository
- Files
- File contents
- Commits
- Snapshots
- Parent commits
- Commit history
- HEAD

The project does not use Git internally for its version-control operations. Instead, these concepts are implemented using application logic and JSON-based storage.

---

# Features

## Repository Management

HAKI allows users to:

- Create repositories
- View repositories
- Edit repositories
- Delete repositories
- Open a repository workspace

## File Management

Inside a repository, users can:

- Create files
- View files
- Edit files
- Delete files
- Modify file contents

## Commit Management

HAKI supports:

- Creating commits
- Adding commit messages
- Capturing repository files as snapshots
- Storing commit timestamps
- Maintaining parent commit relationships

## Commit History

Users can:

- View previous commits
- View commit messages
- View commit timestamps
- Inspect stored snapshots
- Retrieve individual commits

## HEAD Tracking

HAKI maintains a `HEAD` reference for each repository.

When a new commit is created, `HEAD` is updated to point to that commit.

---

# Technology Used

## Frontend

### React.js

React is used to build the user interface of HAKI.

It provides a component-based architecture for building pages such as:

- Dashboard
- Repository workspace
- File management interface
- Commit interface
- Commit history

### Tailwind CSS

Tailwind CSS is used for styling the frontend.

It provides utility classes for:

- Layout
- Spacing
- Typography
- Colors
- Responsive design
- Buttons
- Forms
- Cards
- Navigation

### React Router

React Router is used for client-side navigation between different pages of the application.

### Vite

Vite is used as the frontend development server and build tool.

It provides:

- Fast development startup
- Hot module replacement
- Production builds
- Frontend asset bundling

---

# Backend

## Node.js

Node.js provides the runtime environment for the backend.

It allows the project to execute JavaScript outside the browser and interact with the filesystem.

## Express.js

Express.js is used to build the REST API.

It handles:

- HTTP requests
- Routes
- Controllers
- Responses
- Middleware

## REST API

The frontend communicates with the backend through REST API endpoints.

Example:

```text
React Frontend
      ↓
HTTP Request
      ↓
Express REST API