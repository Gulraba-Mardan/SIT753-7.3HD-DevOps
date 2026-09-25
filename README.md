# SIT725 Group 88 - Campus Lost and Found

Group project for SIT725 Applied Software Engineering: Campus Lost and Found System.

## Project Description

The Campus Lost and Found System is a web application that allows users to report lost and found items on campus.

The application uses Node.js, Express.js and MongoDB. Docker and Docker Compose are used to provide a reproducible environment for running the application.

## Student Information

Name: Gulireba-Maierdan  
Student ID: 224414026

Student information can also be accessed through:

GET /api/student

Example response:

{
  "name": "Gulireba-Maierdan",
  "studentId": "224414026"
}

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Docker
- Docker Compose
- HTML
- CSS
- JavaScript

## Prerequisites

Before running the application, make sure Docker Desktop is installed and running.

No local MongoDB installation is required because MongoDB runs inside a Docker container.

## Build and Run the Application

1. Clone or download the repository.

2. Open a terminal in the project root directory.

3. Build and start the application using:

docker compose up --build -d

4. Check that the containers are running:

docker compose ps

Both the application container and MongoDB container should show a running status.

## Access the Application

Open the application in a web browser:

http://localhost:3000

Student information endpoint:

http://localhost:3000/api/student

Items API endpoint:

http://localhost:3000/api/items

## Application Port

The application runs on port:

3000

MongoDB runs on port:

27017

## MongoDB Configuration

MongoDB is provided through Docker Compose.

The application connects to the MongoDB container through the Docker network, so users do not need to manually install or configure a local MongoDB database.

The database is used to store lost and found item reports submitted through the application.

## Testing the Database Integration

1. Open:

http://localhost:3000/report.html

2. Complete the report form and submit a lost or found item.

3. Open:

http://localhost:3000/api/items

4. The submitted item should appear in the JSON response.

This confirms the following integration:

Frontend -> Express API -> MongoDB -> API response

## Stop the Application

To stop the Docker containers, run:

docker compose down

## Rebuild After Code Changes

If application files are changed, rebuild and restart the containers using:

docker compose down

docker compose up --build -d

## API Endpoints

GET /api/student  
Returns the student name and student ID.

GET /api/items  
Returns all lost and found reports stored in MongoDB.

POST /api/items  
Creates and stores a new lost or found report in MongoDB.

## CI/CD Pipeline with Jenkins

A Jenkins CI pipeline has been implemented to automate code quality checking, testing, and Docker image building.

The pipeline is defined as code in the `Jenkinsfile` and retrieves the latest source code from the GitHub repository.

The pipeline contains the following stages:

1. **Checkout** - Retrieves the latest source code from the GitHub repository.
2. **Install Dependencies** - Installs the required Node.js dependencies using `npm ci`.
3. **Lint** - Performs static code analysis using ESLint with `npx eslint .`.
4. **Test** - Runs the automated test suite using `npm test`.
5. **Docker Build** - Builds the application container using `docker compose build`.

The pipeline follows a fail-fast approach. If linting, automated testing, or the Docker build fails, Jenkins stops the pipeline and reports the failed stage. This helps prevent code that does not meet the required quality checks from progressing further through the pipeline.

## Static Code Analysis

ESLint is integrated into the project to automatically check JavaScript source code for syntax and code-quality issues.

The ESLint configuration distinguishes between Node.js server-side files and browser-side JavaScript files so that the appropriate global environments are applied.

To run the static analysis manually:

```bash
npx eslint .