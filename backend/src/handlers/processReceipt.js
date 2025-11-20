import { analyzeReceipt } from '../utils/textract.js';
import { parseExpenseData } from '../utils/parser.js';
import { saveExpense } from '../utils/dynamo.js';
import { createExpenseItem } from '../models/expenseModel.js';

export const handler = async (event) => {
  console.log("Processing S3 event:", JSON.stringify(event, null, 2));

  try {
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

      console.log(`Analyzing receipt: ${bucket}/${key}`);

      // 1. Call Textract
      const textractResponse = await analyzeReceipt(bucket, key);
      
      // 2. Parse Data
      const extractedData = parseExpenseData(textractResponse);
      
      if (!extractedData) {
        console.warn(`No expense data found for ${key}`);
        continue;
      }

      // 3. Save to DynamoDB
      // Note: In a real app, we need to associate the upload with a user.
      // For this demo, we might extract userId from the key if we structured it like `receipts/{userId}/{uuid}`.
      // Or we can assume a default user for the demo if auth isn't fully set up.
      // Let's assume the key structure is `receipts/{userId}/{uuid}` OR we just use a hardcoded "demo-user" for now 
      // since the prompt didn't specify how to pass userId during upload-url generation to the S3 event.
      // BETTER APPROACH: Metadata on the S3 object. But S3 events don't always pass metadata.
      // Let's use a placeholder "default-user" or try to extract from path if we change getUploadUrl.
      // For simplicity and robustness in this specific prompt context:
      const userId = "default-user"; 

      const receiptUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
      const expenseItem = createExpenseItem(userId, extractedData, receiptUrl);

      await saveExpense(expenseItem);
      console.log(`Expense saved: ${expenseItem.expenseId}`);
    }
  } catch (error) {
    console.error("Error processing receipt:", error);
    throw error; // Retry logic handled by Lambda/SQS
  }
};
