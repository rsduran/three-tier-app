## Description

A basic three-tier to-do webapp built as an end-to-end DevOps project, showcasing containerization, CI/CD, and Kubernetes orchestration. This project demonstrates modern DevOps practices like Infrastructure as Code (IaC), automated testing, and monitoring, deployed on a Kubernetes cluster.

## Project Structure

Here’s an overview of the repository:

- **.github/workflows/**: Contains CI/CD pipeline definitions using GitHub Actions.
- **Jenkins-Terraform/**: Holds Jenkins and Terraform configurations for infrastructure setup.
- **Jenkinsfiles/**: Pipeline scripts used by Jenkins for CI/CD.
- **Kubernetes-Manifests/**: Kubernetes configuration files for deploying the backend, frontend, and database services.
- **backend/**: The Go-based backend microservice.
- **frontend/**: The Next.js frontend for the to-do application.
- **docker-compose.yml**: Docker Compose file for running services locally during development.

## Technologies Used

- **Frontend**: TypeScript, JavaScript, Next.js
- **Backend**: Go, Python
- **Infrastructure**: Kubernetes, Terraform
- **CI/CD**: Jenkins, GitHub Actions
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Other**: Shell scripting, HCL (HashiCorp Configuration Language)

## Setup Instructions

### Prerequisites

- Docker
- Kubernetes (Minikube or any cluster)
- Jenkins (if using Jenkins pipelines)
- Terraform (for infrastructure as code)
- Node.js and npm (for frontend)

### Running Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/rsduran/three-tier-app.git
   ```
2. Navigate to the directory:

   ```bash
   cd three-tier-app
   ```
3. Start the services locally using Docker Compose:

   ```bash
   docker-compose up --build
   ```
5. Access the app in your browser at:

   ```bash
   http://localhost:3000
   ```
