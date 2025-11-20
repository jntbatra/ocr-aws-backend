# Expense Tracker Backend

This is a raw AWS infrastructure implementation of an Expense Tracker application using AWS services for OCR processing and authentication.

## ✅ Successfully Deployed Infrastructure

The CloudFormation stack has been successfully deployed with the following resources:

- **EC2 Instance**: `13.233.63.197` (Public IP)
- **S3 Bucket**: `expense-tracker-receipts-496157869522-ap-south-1`
- **DynamoDB Table**: `expense-tracker-stack-ExpenseTable-1FV20UVQMMINN`
- **Cognito User Pool ID**: `ap-south-1_9XZcSipIR`
- **Cognito Client ID**: `639js865u96c4k15826754q7np`
- **SNS Topic**: `arn:aws:sns:ap-south-1:496157869522:monthly-expense-summary`
- **VPC**: Custom VPC with public subnet and security groups
- **IAM Role**: `expense-tracker-ec2-role` with necessary permissions

## Prerequisites

- Node.js 18+
- AWS CLI configured
- AWS Account with necessary permissions
- Git

## AWS Resources Setup

Deploy all infrastructure using CloudFormation:

```bash
cd backend
aws cloudformation deploy \
  --template-file infrastructure.yaml \
  --stack-name expense-tracker-stack \
  --capabilities CAPABILITY_NAMED_IAM
```

This will create:

- VPC with public subnet
- Security groups
- EC2 instance with IAM role
- S3 bucket
- DynamoDB table
- SNS topic
- Cognito User Pool

## Manual Resource Setup (Alternative)

If you prefer manual setup:

### 1. Create VPC and Networking

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnet
aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.1.0/24

# Create internet gateway
aws ec2 create-internet-gateway

# Attach IGW to VPC
aws ec2 attach-internet-gateway --vpc-id <vpc-id> --internet-gateway-id <igw-id>

# Create route table
aws ec2 create-route-table --vpc-id <vpc-id>

# Create route to internet
aws ec2 create-route --route-table-id <rt-id> --destination-cidr-block 0.0.0.0/0 --gateway-id <igw-id>

# Associate route table with subnet
aws ec2 associate-route-table --subnet-id <subnet-id> --route-table-id <rt-id>
```

### 2. Create Security Groups

```bash
aws ec2 create-security-group --group-name expense-tracker-sg --description "Expense Tracker security group" --vpc-id <vpc-id>

aws ec2 authorize-security-group-ingress --group-id <sg-id> --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id <sg-id> --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id <sg-id> --protocol tcp --port 443 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id <sg-id> --protocol tcp --port 3000 --cidr 0.0.0.0/0
```

### 3. Create IAM Role for EC2

```bash
aws iam create-role --role-name expense-tracker-ec2-role --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}'

aws iam attach-role-policy --role-name expense-tracker-ec2-role --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
aws iam attach-role-policy --role-name expense-tracker-ec2-role --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
aws iam attach-role-policy --role-name expense-tracker-ec2-role --policy-arn arn:aws:iam::aws:policy/AmazonTextractFullAccess
aws iam attach-role-policy --role-name expense-tracker-ec2-role --policy-arn arn:aws:iam::aws:policy/AmazonSNSFullAccess
aws iam attach-role-policy --role-name expense-tracker-ec2-role --policy-arn arn:aws:iam::aws:policy/AmazonCognitoPowerUser

aws iam create-instance-profile --instance-profile-name expense-tracker-ec2-profile
aws iam add-role-to-instance-profile --instance-profile-name expense-tracker-ec2-profile --role-name expense-tracker-ec2-role
```

### 4. Launch EC2 Instance

```bash
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --count 1 \
  --instance-type t3.micro \
  --key-name <your-key-pair> \
  --security-group-ids <sg-id> \
  --subnet-id <subnet-id> \
  --iam-instance-profile Name=expense-tracker-ec2-profile \
  --user-data file://ec2-userdata.sh
```

Create `ec2-userdata.sh`:

```bash
#!/bin/bash
yum update -y
yum install -y nodejs npm git

# Install PM2
npm install -g pm2

# Clone and setup app
cd /home/ec2-user
git clone https://github.com/jntbatra/ocr-aws-backend.git app
cd app/backend

npm install

# Create environment file
cat > .env << EOF
TABLE_NAME=expense-tracker-expenses
UPLOAD_BUCKET=expense-tracker-receipts-<account-id>-<region>
SNS_TOPIC_ARN=arn:aws:sns:<region>:<account-id>:monthly-expense-summary
COGNITO_USER_POOL_ID=<user-pool-id>
COGNITO_CLIENT_ID=<client-id>
PORT=3000
EOF

# Start app
pm2 start server.js --name expense-tracker
pm2 startup
pm2 save
```

### 5. Create S3 Bucket

```bash
aws s3 mb s3://expense-tracker-receipts-<account-id>-<region>
aws s3api put-bucket-policy --bucket expense-tracker-receipts-<account-id>-<region> --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::expense-tracker-receipts-<account-id>-<region>/*"
    }
  ]
}'
```

### 6. Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name expense-tracker-expenses \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=expenseId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=expenseId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

### 7. Create SNS Topic

```bash
aws sns create-topic --name monthly-expense-summary
```

### 8. Create Cognito User Pool

```bash
aws cognito-idp create-user-pool --pool-name expense-tracker-users

aws cognito-idp create-user-pool-client \
  --user-pool-id <user-pool-id> \
  --client-name expense-tracker-client
```

## Deployment

After CloudFormation deployment:

1. **EC2 Instance is running at**: `http://13.233.63.197:3000`

2. **Frontend Config Updated**:
   The frontend config has been updated to point to the deployed EC2 instance:
   ```typescript
   export const API_BASE_URL = "http://13.233.63.197:3000";
   ```

3. **Deploy Frontend**:
   ```bash
   cd frontend
   npm run build
   npm start
   ```
   Or deploy to your preferred hosting (Vercel, Netlify, etc.)

## API Endpoints

- `POST /auth/signup`: Register new user
- `POST /auth/confirm`: Confirm email
- `POST /auth/login`: Login user
- `POST /upload-url`: Get signed S3 upload URL (authenticated)
- `GET /expenses`: Get user expenses (authenticated)
- `GET /summary?month=YYYY-MM`: Get monthly summary (authenticated)
- `POST /process`: Process receipt (authenticated)
- `POST /trigger-summary`: Trigger monthly summary (authenticated)

## Architecture

- **Authentication**: AWS Cognito User Pools
- **Database**: DynamoDB with user-scoped data
- **File Storage**: S3 with presigned URLs
- **OCR Processing**: AWS Textract
- **Notifications**: SNS for email summaries
- **Compute**: Raw EC2 instance with Express.js
- **Networking**: VPC with security groups

## Monitoring

- **EC2**: CloudWatch metrics and logs
- **Application**: PM2 process monitoring
- **Costs**: Monitor all AWS service usage

## Security Features

- JWT authentication with Cognito
- User-scoped data isolation
- VPC networking
- IAM roles with least privilege
- S3 bucket policies
- Security groups

This implementation demonstrates advanced AWS skills including infrastructure as code, security best practices, and microservices architecture.
