module.exports = {
  // AWS Resources from CloudFormation
  TABLE_NAME: "expense-tracker-stack-ExpenseTable-1FV20UVQMMINN",
  UPLOAD_BUCKET: "expense-tracker-receipts-496157869522-ap-south-1",
  SNS_TOPIC_ARN: "arn:aws:sns:ap-south-1:496157869522:monthly-expense-summary",
  COGNITO_USER_POOL_ID: "ap-south-1_9XZcSipIR",
  COGNITO_CLIENT_ID: "639js865u96c4k15826754q7np",

  // Application settings
  PORT: process.env.PORT || 3000,
  REGION: "ap-south-1",

  // JWT settings
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
};
