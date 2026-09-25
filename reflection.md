After completing the Docker integration, I extended the project by implementing a Jenkins CI pipeline. I configured Jenkins to retrieve the project from the GitHub repository and created a Jenkinsfile so that the CI process is defined as code and can be reproduced. The pipeline automatically performs source code checkout, dependency installation, static code analysis, automated testing, and Docker image building.

Another challenge was integrating Jenkins with my local development environment. Initially, the Jenkins build failed because the npm command could not be found in the Jenkins execution environment even though Node.js and npm were available from my normal terminal. I investigated the failure through the Jenkins build logs and updated the pipeline environment so that Jenkins could access npm correctly. After this change, the pipeline was able to install dependencies and execute the required commands successfully.

I also integrated ESLint as a static code analysis tool. During the initial configuration, ESLint reported many errors because the project contains both server-side Node.js code and browser-side JavaScript. I learned that these environments require different global configurations. I updated the ESLint configuration so that server-side files use Node.js globals while files under public/js use browser globals. I then resolved the remaining unused variable and syntax issues until the linting process completed successfully.

The final Jenkins pipeline contains Checkout, Install Dependencies, Lint, Test, and Docker Build stages. The Lint stage runs ESLint, the Test stage executes the automated tests, and the Docker Build stage verifies that the application can still be successfully containerized. These stages provide automated quality gates because a failure in an earlier stage prevents the pipeline from progressing normally.

This task improved my understanding of continuous integration and showed me how different DevOps practices work together rather than as separate tools. GitHub provides source control, Jenkins automates the workflow, ESLint checks code quality, automated tests verify application behaviour, and Docker provides a consistent build environment. The most valuable learning outcome was understanding how an automated pipeline can detect problems early and provide repeatable evidence that the application has passed multiple quality checks before it is built.

After extending the pipeline further, I implemented Security, Deploy, Release, and Monitoring stages to create a more complete CI/CD workflow. The Security stage uses `npm audit --audit-level=high` to detect high-severity dependency vulnerabilities before the application progresses further through the pipeline.

The Deploy stage automatically starts the application and MongoDB services using Docker Compose and verifies their running status. The Release stage creates a versioned Docker image using the Jenkins build number, which improves traceability between a Jenkins build and its corresponding application image. For example, Jenkins build 7 generated the `sit753-73hd-devops-app:build-7` image.

Finally, I implemented a Monitoring stage as a post-deployment health check. Jenkins waits for the deployed application to start and then sends an HTTP request to the `/api/student` endpoint using `curl --fail`. It also checks the Docker Compose service status. This means the pipeline does not only confirm that the application can be built; it also verifies that the deployed application is running and responding successfully.

The final pipeline successfully completed the following workflow:

`Checkout -> Install Dependencies -> Lint -> Security -> Test -> Docker Build -> Deploy -> Release -> Monitoring`

Completing the full pipeline helped me understand how code quality, security, testing, containerisation, deployment, release traceability, and post-deployment monitoring can be combined into one automated DevOps process.
