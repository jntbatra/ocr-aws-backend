import { getExpensesByUser } from '../utils/dynamo.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const handler = async (event) => {
  try {
    const userId = "default-user"; // Placeholder
    const { month } = event.queryStringParameters || {}; // Format: YYYY-MM

    if (!month) {
      return errorResponse("Missing required query parameter: month (YYYY-MM)", 400);
    }

    const expenses = await getExpensesByUser(userId);

    // Filter by month
    const monthlyExpenses = expenses.filter(exp => exp.date && exp.date.startsWith(month));

    const totalAmount = monthlyExpenses.reduce((sum, exp) => sum + (exp.total || 0), 0);
    
    const categoryBreakdown = monthlyExpenses.reduce((acc, exp) => {
      const cat = exp.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + (exp.total || 0);
      return acc;
    }, {});

    return successResponse({
      month,
      totalAmount,
      count: monthlyExpenses.length,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    return errorResponse("Internal Server Error");
  }
};
