# SIT725 Group 88 - Campus Lost and Found

Group project for SIT725 Applied Software Engineering: Campus Lost and Found System.

## Project Description

The Campus Lost and Found System is a web application that allows users to report lost and found items on campus.

The application uses Node.js, Express.js and MongoDB. Docker and Docker Compose are used to provide a reproducible environment for running the application.

## Student Information

Name: Gulireba-Maierdan  
Student ID: 224414026

Student information can also be accessed through:

`GET /api/student`

Example response:

```json
{
  "name": "Gulireba-Maierdan",
  "studentId": "224414026"
}
```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Docker
- Docker Compose
- Jenkins
- ESLint
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

```bash
docker compose up --build -d
```

4. Check that the containers are running:

```bash
docker compose ps
```

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

`3000`

MongoDB runs on port:

`27017`

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

`Frontend -> Express API -> MongoDB -> API response`

## Stop the Application

To stop the Docker containers, run:

```bash
docker compose down
```

## Rebuild After Code Changes

If application files are changed, rebuild and restart the containers using:

```bash
docker compose down
docker compose up --build -d
```

## API Endpoints

### GET /api/student

Returns the student name and student ID.

### GET /api/items

Returns all lost and found reports stored in MongoDB.

### POST /api/items

Creates and stores a new lost or found report in MongoDB.

## CI/CD Pipeline with Jenkins

A Jenkins CI pipeline has been implemented to automate code quality checking, security scanning, testing, Docker image building, deployment, release management, and post-deployment monitoring.

The pipeline is defined as code in the `Jenkinsfile` and retrieves the latest source code from the GitHub repository.

The pipeline contains the following stages:

1. **Checkout** - Retrieves the latest source code from the GitHub repository.
2. **Install Dependencies** - Installs the required Node.js dependencies using `npm ci`.
3. **Lint** - Performs static code analysis using ESLint.
4. **Security** - Performs dependency vulnerability scanning using `npm audit --audit-level=high`.
5. **Test** - Runs the automated test suite using `npm test`.
6. **Docker Build** - Builds the application image using Docker Compose.
7. **Deploy** - Automatically starts the application and MongoDB services using Docker Compose.
8. **Release** - Creates a versioned Docker image tagged with the Jenkins build number for traceability.
9. **Monitoring** - Performs a post-deployment HTTP health check and verifies that the Docker services remain operational.

The pipeline follows a fail-fast approach. If a quality check, security scan, automated test, or Docker build fails, Jenkins reports the failed stage and prevents the workflow from progressing normally. This helps identify problems earlier in the CI/CD process.

## Static Code Analysis

ESLint is integrated into the project to automatically check JavaScript source code for syntax and code-quality issues.

The ESLint configuration distinguishes between Node.js server-side files and browser-side JavaScript files so that the appropriate global environments are applied.

To run the static analysis manually:

```bash
npx eslint .
```

A successful command with no reported errors indicates that the source code has passed the configured ESLint checks.

## Security Scanning

Dependency security scanning is integrated into the Jenkins pipeline using:

```bash
npm audit --audit-level=high
```

The Security stage checks the project's npm dependencies for known high-severity and critical vulnerabilities.

The final pipeline execution completed successfully with no high-severity vulnerability causing the security gate to fail.

If a high-severity or critical vulnerability is detected in a future build, the Security stage will return a failure status and prevent the pipeline from progressing to later stages. The dependency and vulnerability report can then be reviewed before updating or replacing the affected dependency and rerunning the pipeline.

## Automated Testing

Automated tests are executed as part of the Jenkins pipeline using:

```bash
npm test
```

The Test stage must complete successfully before the pipeline proceeds to the Docker Build and deployment stages.

## Docker Build

After the application passes the quality, security, and testing stages, Jenkins builds the Docker image using:

```bash
docker compose build
```

This verifies that the application can be successfully packaged using the project's Docker configuration.

## Automated Deployment

After a successful Docker build, Jenkins automatically deploys the application and MongoDB services using Docker Compose:

```bash
docker compose down
docker compose up -d
docker compose ps
```

This allows the pipeline to verify that both application services can start successfully after the build.

## Release Management

The Release stage creates a versioned Docker image based on the Jenkins build number.

For example, Jenkins Build #7 generated:

```text
sit753-73hd-devops-app:build-7
```

This provides traceability between a Jenkins pipeline execution and its corresponding Docker image.

## Post-Deployment Monitoring

After deployment and release, Jenkins performs a post-deployment health check using:

```bash
curl --fail http://localhost:3000/api/student
```

Jenkins also executes:

```bash
docker compose ps
```

The HTTP health check verifies that the deployed application is responding successfully, while the Docker Compose status check verifies that the application and MongoDB services remain operational.

If the HTTP health check fails, the Monitoring stage returns a failure status.

## Pipeline Verification

The final Jenkins pipeline was successfully executed with all configured stages passing:

`Checkout -> Install Dependencies -> Lint -> Security -> Test -> Docker Build -> Deploy -> Release -> Monitoring`

The successful pipeline demonstrates automated code quality analysis, dependency security scanning, automated testing, container building, deployment, versioned release creation, and post-deployment health monitoring.