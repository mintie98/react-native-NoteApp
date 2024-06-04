# NoteApp

A simple note-taking application built with React Native and a Node.js backend using Express and MySQL.

## Purpose
The purpose of this application is to provide a simple and user-friendly interface for taking, storing, and managing notes.

## Features
- User registration and login
- JWT authentication
- Add, edit, delete, and view notes
- Change user password
- Light and dark theme support
- Font size and style customization

## Getting Started

### Prerequisites
- Node.js
- MySQL
- Expo CLI (for React Native)

## Application Architecture

The application is divided into two main parts:

	1.	Backend: Built with Node.js, Express, and MySQL. It provides a RESTful API for user authentication and note management.
	•	Controllers: Contains the logic for handling requests and responses.
	•	Routes: Defines the API endpoints and links them to the corresponding controllers.
	•	Middleware: Includes middleware for JWT authentication.
	•	Config: Contains the Knex configuration for connecting to the MySQL database.
	2.	Frontend: Built with React Native using Expo. It provides a mobile interface for users to interact with the application.
	•	Screens: Contains different screens for login, signup, home, note detail, and user settings.
	•	Components: Reusable components used across various screens.
	•	Navigation: Handles the navigation between different screens.
