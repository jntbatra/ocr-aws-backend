import { analyzeReceipt } from "../utils/textract.js";
import { parseExpenseData } from "../utils/parser.js";
import { saveExpense } from "../utils/dynamo.js";
import { createExpenseItem } from "../models/expenseModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

const BUCKET_NAME = process.env.UPLOAD_BUCKET;

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { key } = body;

    if (!key) {
      return errorResponse("Key is required", 400);
    }

    console.log(`Analyzing receipt: ${BUCKET_NAME}/${key}`);

    // 1. Call Textract
    const textractResponse = await analyzeReceipt(BUCKET_NAME, key);

    // 2. Parse Data
    const extractedData = parseExpenseData(textractResponse);

    if (!extractedData) {
      console.warn(`No expense data found for ${key}`);
      return errorResponse("No expense data found", 400);
    }

    // 3. Save to DynamoDB
    const userId = "default-user"; // Placeholder

    const receiptUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    const expenseItem = createExpenseItem(userId, extractedData, receiptUrl);

    await saveExpense(expenseItem);
    console.log(`Expense saved: ${expenseItem.expenseId}`);

    return successResponse({ message: "Receipt processed successfully" });
  } catch (error) {
    console.error("Error processing receipt:", error);
    return errorResponse("Internal Server Error");
  }
};
