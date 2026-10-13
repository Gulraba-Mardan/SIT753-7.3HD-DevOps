
# SIT725 Group 88 - Campus Lost and Found

Group project for SIT725 Applied Software Engineering, extended for the SIT753 7.3HD DevOps assessment.

## Project Description

The Campus Lost and Found System is a web application that allows users to report lost and found items on campus.

The application uses Node.js, Express.js, MongoDB, and Mongoose. Docker and Docker Compose provide reproducible environments for running the application.

For SIT753 7.3HD, the project was extended with a Jenkins CI/CD pipeline, automated testing, ESLint, SonarQube analysis, security scanning, separate development and production deployments, and Uptime Kuma monitoring.

## Student Information

**Name:** Gulireba-Maierdan  
**Student ID:** 224414026

Student information is available through:

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
- HTML, CSS, JavaScript
- Docker and Docker Compose
- Jenkins
- ESLint
- Mocha and Supertest
- SonarQube
- npm audit
- Uptime Kuma v2
- Gmail SMTP notifications

## Prerequisites

Docker Desktop must be installed and running before starting the containerized application.

MongoDB runs inside a Docker container, so a separate local MongoDB installation is not required.

Jenkins and SonarQube are configured separately for the CI/CD workflow. Uptime Kuma is also deployed as an independent Docker service for continuous monitoring.

## Build and Run the Application

1. Clone or download the GitHub repository.
2. Open a terminal in the project root directory.
3. Build and start the development application:

```bash
docker compose up --build -d
```

4. Verify the running containers:

```bash
docker compose ps
```

5. Open the application:

http://localhost:3000

### Development API Endpoints

Student information:

http://localhost:3000/api/student

Lost and found reports:

http://localhost:3000/api/items

### Stop the Application

```bash
docker compose down
```

### Rebuild After Changes

```bash
docker compose down
docker compose up --build -d
```

## MongoDB Configuration

MongoDB runs as a Docker Compose service.

The application communicates with MongoDB through the Docker network. Lost and found reports submitted through the web application are stored in the database.

### Database Integration Verification

1. Open http://localhost:3000/report.html
2. Complete and submit a lost or found report.
3. Open http://localhost:3000/api/items
4. Verify that the submitted report appears in the JSON response.

This demonstrates the following integration:

`Frontend -> Express API -> MongoDB -> API Response`

## API Endpoints

### GET /api/student

Returns the student name and student ID.

### GET /api/items

Returns the lost and found reports stored in MongoDB.

### POST /api/items

Creates and stores a new lost or found report in MongoDB.

## CI/CD Pipeline with Jenkins

A Jenkins CI/CD pipeline was implemented to automate source-code verification, code-quality analysis, security scanning, API testing, Docker image building, deployment, release management, and post-deployment checks.

The pipeline is defined in the `Jenkinsfile` and retrieves the latest source code from GitHub.

### Pipeline Stages

1. **Checkout** - Retrieves the latest source code from GitHub.
2. **Install Dependencies** - Installs Node.js dependencies using `npm ci`.
3. **Lint** - Checks JavaScript source code using ESLint.
4. **SonarQube Analysis** - Performs additional static code analysis using SonarQube.
5. **Quality Gate** - Verifies the SonarQube quality gate before continuing.
6. **Security** - Checks npm dependencies for known vulnerabilities.
7. **Test** - Executes automated tests using Mocha and Supertest.
8. **Docker Build** - Builds the application Docker image.
9. **Deploy** - Deploys the development application using Docker Compose.
10. **Release** - Creates a build-specific Docker image tag, deploys to a separate production environment, checks the production API, and runs the configured Git tagging command.
11. **Monitoring** - Performs post-deployment API availability and container checks.

Jenkins may also display an automatically generated `Checkout SCM` step.

### Pipeline Execution

Jenkins Build #19 completed successfully.

All displayed stages passed, including:

- SonarQube Analysis
- Quality Gate
- Security
- Test
- Docker Build
- Deploy
- Release
- Monitoring

The pipeline follows a fail-fast approach. When an enforced check fails, subsequent stages do not continue normally.

## Static Code Analysis with ESLint

ESLint checks JavaScript source code for configured syntax and code-quality issues.

The configuration distinguishes between server-side Node.js files and browser-side JavaScript files.

Run ESLint manually:

```bash
npx eslint .
```

A successful execution without reported errors indicates that the project passes the configured ESLint rules.

## SonarQube Analysis and Quality Gate

SonarQube was integrated into the Jenkins pipeline to provide additional static code analysis.

The SonarQube Analysis stage submits the project for analysis.

The Quality Gate stage verifies the analysis result before the pipeline continues.

In Jenkins Build #19:

- SonarQube Analysis completed successfully.
- Quality Gate passed.
- The pipeline continued to the Security and Test stages.

The SonarQube dashboard provides detailed information about the configured analysis results and quality conditions.

## Security Scanning

Dependency security scanning is integrated into the Jenkins pipeline using:

```bash
npm audit --audit-level=high
```

This command checks npm dependencies for known vulnerabilities and returns a failure when high-severity or critical findings meet the configured threshold.

The Security stage passed in Jenkins Build #19.

This stage performs dependency scanning. It should not be considered Docker image scanning unless a separate container image scanner is configured.

Security findings and any remediation decisions should be documented using the actual npm audit report.

## Automated API Testing

Automated tests are executed using:

```bash
npm test
```

The project uses Mocha and Supertest for API testing.

The test infrastructure includes a database helper located at:

`test/helpers/db.js`

This helper manages the test database connection, clears test collections between test cases, and disconnects after testing.

The test database must remain separate from development and production databases.

The Jenkins Test stage passed in Build #19.

The test execution output, including the actual number of passing tests, should be shown in the resubmission video as evidence of functional testing.

## Docker Build

After the code-quality, security, and testing stages pass, Jenkins builds the application image using Docker Compose.

```bash
docker compose build
```

The Docker Build stage passed successfully in Jenkins Build #19.

This demonstrates that the application can be packaged into a Docker image using the configured Dockerfile and Compose configuration.

## Development Deployment

The Deploy stage starts the development application and MongoDB services using Docker Compose.

Development application:

http://localhost:3000

Development student API:

http://localhost:3000/api/student

The deployment is verified through the configured pipeline checks and subsequent HTTP availability testing.

Jenkins Build #19 successfully completed the Deploy stage.

## Production Release

The Release stage extends the deployment process by using a build-specific Docker image tag and a separate production environment.

### Versioned Docker Image

The application image is tagged using the Jenkins build number.

For example:

```text
sit753-73hd-devops-app:build-19
```

This allows a Docker image to be associated with a specific Jenkins pipeline execution.

### Separate Production Environment

The production deployment uses:

`docker-compose.prod.yml`

The production application is exposed on port `3002`.

Production API:

http://localhost:3002/api/student

The production configuration uses a separate MongoDB database from the development environment.

### Release Verification

The Release stage includes an HTTP availability check against the production API.

It also runs a Git tagging command based on the Jenkins build number.

The configured Git tag is local unless it is explicitly pushed to GitHub.

Jenkins Build #19 completed the Release stage successfully.

The successful release demonstrates deployment of the tagged application image into a separate local production environment.

## Jenkins Post-Deployment Monitoring

The Jenkins Monitoring stage performs an HTTP request to verify that the development API remains accessible.

Example:

```bash
curl --fail http://localhost:3000/api/student
```

It also checks the development Docker Compose services:

```bash
docker compose ps
```

These checks provide immediate post-deployment verification.

Continuous monitoring and alerting are provided separately by Uptime Kuma.

## Production Monitoring with Uptime Kuma

Uptime Kuma v2 was configured as an independent monitoring tool running in Docker.

It continuously checks the production API and records availability and response-time information.

### Monitoring Configuration

| Setting | Configuration |
| --- | --- |
| Monitoring Tool | Uptime Kuma v2 |
| Dashboard | http://localhost:3001 |
| Monitor Name | SIT753 Production API |
| Monitor Type | HTTP(s) |
| Monitored URL | http://host.docker.internal:3002/api/student |
| Heartbeat Interval | 60 seconds |
| Healthy Response | HTTP 200 |
| Alert Channel | Gmail SMTP |

The hostname `host.docker.internal` allows the Uptime Kuma container to access the production API published on the local Docker host.

### Availability Monitoring

Uptime Kuma checks the production API every 60 seconds.

When the API is available and responds successfully, the monitor displays an UP status.

When the API becomes unavailable, the monitor records a DOWN event.

The dashboard provides:

- Current service availability
- Response-time measurements
- Uptime history
- Downtime events
- Monitoring status

## Gmail SMTP Email Alerts

Gmail SMTP notifications were configured in Uptime Kuma using an application-specific password.

The notification channel is named:

`SIT753 Gmail Alert`

The alert configuration is enabled for the production API monitor.

SMTP credentials are stored in the local monitoring configuration and are not included in the GitHub repository.

### Failure Detection Test

The production application container was manually stopped to simulate an application outage.

Uptime Kuma detected that the production API was unavailable and changed the monitor status to DOWN.

An automatic DOWN notification was generated.

### Recovery Detection Test

After the production application container was restarted, Uptime Kuma detected that the API was responding again.

The monitor returned to UP status with HTTP 200.

An automatic recovery notification was generated.

### Email Notification Verification

Both DOWN and UP notification emails were successfully received.

This demonstrates that the monitoring system can detect service failures and recoveries and notify the configured recipient.

## CI/CD and Monitoring Verification

The final verified Jenkins execution was Build #19.

The pipeline successfully completed its configured stages:

`Checkout -> Install Dependencies -> Lint -> SonarQube Analysis -> Quality Gate -> Security -> Test -> Docker Build -> Deploy -> Release -> Monitoring`

Additional verification included:

- Development API responding on port 3000.
- Production API responding on port 3002.
- A separate production Docker Compose deployment.
- A build-specific Docker image tag.
- SonarQube analysis and Quality Gate passing.
- Uptime Kuma monitoring the production API.
- A simulated production outage detected as DOWN.
- Production recovery detected as UP.
- Successful Gmail SMTP failure and recovery notifications.

## Evidence for SIT753 7.3HD Resubmission

The resubmission video and supporting documentation should demonstrate the actual results of the implemented workflow.

Relevant evidence includes:

1. Jenkins Build #19 with all stages passing.
2. Actual automated API test results.
3. SonarQube dashboard and Quality Gate status.
4. Security scanning results.
5. Development application running on port 3000.
6. Production application running on port 3002.
7. Versioned Docker image and Git tag evidence.
8. Uptime Kuma monitoring dashboard.
9. Production DOWN and UP events.
10. Successful Gmail SMTP alert emails.

## Conclusion

The SIT753 7.3HD extension demonstrates a local CI/CD workflow integrating Jenkins, ESLint, SonarQube, automated testing, dependency security checks, Docker image building, development deployment, production release, and monitoring.

The addition of a separate production environment and Uptime Kuma monitoring addresses important limitations identified during the initial assessment.

The successful Jenkins Build #19 and verified monitoring failure/recovery tests provide evidence of the implemented DevOps workflow.

The project demonstrates practical experience with continuous integration, automated deployment, release traceability, software quality checks, and operational monitoring.
