import { getAllExpenses } from "../utils/dynamo.js";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { successResponse, errorResponse } from "../utils/response.js";

const snsClient = new SNSClient({});
const TOPIC_ARN = process.env.SNS_TOPIC_ARN;

export const handler = async (event) => {
  console.log("Running monthly summary trigger...");

  try {
    // In a real app, we would iterate over all users.
    // For this demo, we'll just aggregate everything or focus on our default user.
    // Let's do a simple aggregation for the "default-user" to demonstrate the flow.

    const expenses = await getAllExpenses(); // Warning: Scan operation

    // Group by user
    const userExpenses = {};
    expenses.forEach((exp) => {
      const uid = exp.userId;
      if (!userExpenses[uid]) userExpenses[uid] = [];
      userExpenses[uid].push(exp);
    });

    // For each user, calculate last month's summary and publish
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthStr = lastMonth.toISOString().slice(0, 7); // YYYY-MM

    for (const [userId, userExps] of Object.entries(userExpenses)) {
      const monthlyExps = userExps.filter(
        (exp) => exp.date && exp.date.startsWith(lastMonthStr)
      );

      if (monthlyExps.length === 0) continue;

      const total = monthlyExps.reduce((sum, e) => sum + (e.total || 0), 0);

      const message = `Expense Summary for ${lastMonthStr}\n\nUser: ${userId}\nTotal Spent: $${total.toFixed(
        2
      )}\nTotal Transactions: ${monthlyExps.length}`;

      await snsClient.send(
        new PublishCommand({
          TopicArn: TOPIC_ARN,
          Message: message,
          Subject: `Monthly Expense Summary - ${lastMonthStr}`,
        })
      );

      console.log(`Sent summary for user ${userId}`);
    }

    return successResponse({
      message: "Monthly summary triggered successfully",
    });
  } catch (error) {
    console.error("Error in monthly trigger:", error);
    return errorResponse("Internal Server Error");
  }
};
