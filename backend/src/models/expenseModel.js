import { v4 as uuidv4 } from 'uuid';

export const createExpenseItem = (userId, extractedData, receiptUrl) => {
  const timestamp = new Date().toISOString();
  const expenseId = `${timestamp}-${uuidv4()}`;

  return {
    userId, // PK
    expenseId, // SK
    createdAt: timestamp,
    receiptUrl,
    ...extractedData, // amount, date, merchant, category, rawText
  };
};
