# Expense Tracker Backend

This is the backend for an Expense Tracker application using AWS services for OCR processing.

## Prerequisites

- Node.js 18+
- AWS CLI configured
- Elastic Beanstalk CLI (EB CLI) installed
- AWS Account with necessary permissions

## AWS Resources Setup

Before deploying the application, you need to create the following AWS resources manually or via CloudFormation:

### 1. S3 Bucket

Create an S3 bucket for storing receipt images:

```bash
aws s3 mb s3://expense-tracker-receipts-<your-account-id>-<region>
```

Replace `<your-account-id>` and `<region>` with your AWS account ID and region.

Configure CORS on the bucket (via AWS Console or CLI):

- Allowed Origins: \*
- Allowed Methods: GET, PUT, HEAD
- Allowed Headers: \*

### 2. DynamoDB Table

Create a DynamoDB table for expenses:

```bash
aws dynamodb create-table \
  --table-name expense-tracker-expenses \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=expenseId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=expenseId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

### 3. SNS Topic

Create an SNS topic for monthly summaries:

```bash
aws sns create-topic --name monthly-expense-summary
```

Note the TopicArn for environment variables.

### 4. IAM Role

Create an IAM role for the EC2 instance with the following policies:

- AmazonS3FullAccess (or restrict to the bucket)
- AmazonDynamoDBFullAccess (or restrict to the table)
- AmazonTextractFullAccess
- AmazonSNSFullAccess (or restrict to the topic)

Attach the role to the Elastic Beanstalk environment.

## Deployment

1. **Install Dependencies**:

   ```bash
   cd backend
   npm install
   ```

2. **Initialize Elastic Beanstalk**:

   ```bash
   eb init
   ```

   - Select your region
   - Choose "Node.js" as platform
   - Accept defaults or configure as needed

3. **Create Environment**:

   ```bash
   eb create expense-tracker-backend-env
   ```

   Follow the prompts.

4. **Set Environment Variables**:

   ```bash
   eb setenv TABLE_NAME=expense-tracker-expenses
   eb setenv UPLOAD_BUCKET=expense-tracker-receipts-<your-account-id>-<region>
   eb setenv SNS_TOPIC_ARN=<your-sns-topic-arn>
   ```

5. **Deploy**:

   ```bash
   eb deploy
   ```

6. **Get the Application URL**:
   ```bash
   eb open
   ```
   Or check the EB console for the URL.

## API Endpoints

The API will be available at the Elastic Beanstalk environment URL.

- `POST /upload-url`: Get a signed URL to upload a receipt image.
  - Body: `{ "contentType": "image/jpeg", "filename": "receipt.jpg" }`
- `GET /expenses`: List all expenses.
- `GET /summary?month=YYYY-MM`: Get monthly summary.
- `POST /process`: Process a receipt (call after uploading to S3).
  - Body: `{ "key": "receipts/uuid.jpg" }`
- `POST /trigger-summary`: Trigger monthly summary notification.

## Architecture

- **Upload**: Frontend requests signed URL -> Uploads to S3 -> Calls /process to analyze.
- **Processing**: POST /process -> Textract -> DynamoDB.
- **Notifications**: POST /trigger-summary (can be scheduled via cron or manually).

## Local Development

1. Set environment variables in a `.env` file or export them:

   ```bash
   export TABLE_NAME=expense-tracker-expenses
   export UPLOAD_BUCKET=expense-tracker-receipts-<your-account-id>-<region>
   export SNS_TOPIC_ARN=<your-sns-topic-arn>
   ```

2. Run locally:
   ```bash
   npm start
   ```

The server will run on port 3000.
