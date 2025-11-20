import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const saveExpense = async (expense) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: expense,
  });
  return docClient.send(command);
};

export const getExpensesByUser = async (userId) => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  });
  const response = await docClient.send(command);
  return response.Items;
};

export const getAllExpenses = async () => {
    // Scan is expensive, but for monthly aggregation across all users (if needed) or debugging.
    // For specific user aggregation, we should use Query.
    const command = new ScanCommand({
        TableName: TABLE_NAME,
    });
    const response = await docClient.send(command);
    return response.Items;
};
