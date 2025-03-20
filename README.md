# Task Management Application

A full-stack task management application built with React, Node.js, Express, and AWS services. The application allows users to create, update, delete, and view tasks with their respective statuses.

> **Note**: A live demo of the application is available. The URL will be provided separately.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- AWS CLI configured with appropriate credentials
- AWS Account with necessary permissions

## Optional: Local DynamoDB Setup

For local development, you can optionally set up a local DynamoDB instance using Docker:

1. Install Docker if you haven't already

2. Run DynamoDB Local:

   ```bash
   docker run -p 8000:8000 amazon/dynamodb-local
   ```

3. Create the tasks table locally:

   ```bash
   aws dynamodb create-table \
     --endpoint-url http://localhost:8000 \
     --table-name your-table-name \
     --attribute-definitions AttributeName=id,AttributeType=S \
     --key-schema AttributeName=id,KeyType=HASH \
     --billing-mode PAY_PER_REQUEST
   ```

4. Update your backend `.env` file to use local DynamoDB:

   ```env
   AWS_REGION=your-aws-region
   AWS_PROFILE=your-aws-profile
   NODE_ENV=development
   PORT=3001
   TASKS_TABLE=your-table-name
   DYNAMODB_ENDPOINT=http://localhost:8000
   ```

Note: The application is configured to use AWS DynamoDB by default. Local DynamoDB setup is optional and only needed if you want to develop without AWS connectivity.

## Project Structure

```text
.
├── frontend/          # React frontend application
├── backend/          # Node.js/Express backend API
└── package.json      # Root package.json for workspace management
```

## Local Development Setup

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

   ```env
   AWS_REGION=your-aws-region
   AWS_PROFILE=your-aws-profile
   NODE_ENV=development
   PORT=3001
   TASKS_TABLE=your-table-name
   ```

4. Start the backend server:

   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:

   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

### Running Both Services

From the root directory, you can run both services concurrently:

```bash
npm run dev
```

## AWS Deployment

### Backend Deployment

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Deploy to AWS Lambda and API Gateway:

   ```bash
   npm run deploy:dev    # For development environment
   npm run deploy:prod   # For production environment
   ```

### Frontend Deployment

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Deploy to AWS S3:

   ```bash
   npm run deploy:dev    # For development environment
   npm run deploy:prod   # For production environment
   ```

## Assumptions

1. AWS Credentials:
   - AWS CLI is configured with appropriate credentials
   - AWS profile is set up with necessary permissions
   - User has necessary permissions for DynamoDB, Lambda, API Gateway, and S3

2. Environment:
   - Development environment uses local DynamoDB table
   - Production environment uses AWS DynamoDB table
   - AWS region is configured appropriately

3. Infrastructure:
   - DynamoDB table is created with appropriate name pattern
   - S3 bucket for frontend hosting is configured
   - API Gateway endpoints are configured with CORS enabled

## AWS Deployment Steps

1. **Backend Deployment**:
   - The backend is deployed using Serverless Framework
   - Creates/updates Lambda functions and API Gateway endpoints
   - Sets up DynamoDB table with necessary permissions
   - Configures environment variables for different stages

2. **Frontend Deployment**:
   - Builds the React application
   - Deploys static files to S3 bucket
   - Configures bucket for static website hosting
   - Updates API endpoint configuration based on environment

3. **Infrastructure**:
   - DynamoDB table is created with the following schema:
     - Primary key: `id` (String)
     - Billing mode: PAY_PER_REQUEST
   - IAM roles are configured for Lambda to access DynamoDB
   - CORS is enabled for API Gateway endpoints

## API Endpoints

- `GET /api/tasks` - Retrieve all tasks
- `GET /api/tasks/{id}` - Retrieve a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update an existing task
- `DELETE /api/tasks/{id}` - Delete a task
- `GET /health` - Health check endpoint

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - TailwindCSS
  - Axios
  - Vite

- Backend:
  - Node.js
  - Express
  - TypeScript
  - AWS SDK
  - Serverless Framework

- AWS Services:
  - Lambda
  - API Gateway
  - DynamoDB
  - S3
  - IAM
  