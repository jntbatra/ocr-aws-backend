# Expense Tracker Backend

This is a serverless backend for an Expense Tracker application using AWS Lambda, API Gateway, DynamoDB, S3, and Textract.

## Prerequisites

- Node.js 18+
- AWS CLI configured
- AWS SAM CLI installed

## Deployment

1.  **Install Dependencies**:
    ```bash
    cd backend
    npm install
    ```

2.  **Build**:
    ```bash
    sam build
    ```

3.  **Deploy**:
    ```bash
    sam deploy --guided
    ```
    Follow the prompts. You can accept defaults, but make sure to say "Y" to "Deploy this changeset?" and "SAM configuration file [samconfig.toml]:".

## API Endpoints

After deployment, you will get an `ApiEndpoint` output.

-   `POST /upload-url`: Get a signed URL to upload a receipt image.
    -   Body: `{ "contentType": "image/jpeg", "filename": "receipt.jpg" }`
-   `GET /expenses`: List all expenses.
-   `GET /summary?month=YYYY-MM`: Get monthly summary.

## Architecture

-   **Upload**: Frontend requests signed URL -> Uploads to S3.
-   **Processing**: S3 Event -> Lambda -> Textract -> DynamoDB.
-   **Notifications**: Scheduled Lambda (Monthly) -> SNS Topic.

## Local Testing

You can use `sam local start-api` to test endpoints locally (requires Docker).
