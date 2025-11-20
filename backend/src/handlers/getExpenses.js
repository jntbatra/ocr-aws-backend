import { getExpensesByUser } from '../utils/dynamo.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const handler = async (event) => {
  try {
    // In a real app, userId comes from the authorizer context
    // const userId = event.requestContext.authorizer.claims.sub;
    const userId = "default-user"; // Placeholder for demo

    const expenses = await getExpensesByUser(userId);

    return successResponse({
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return errorResponse("Internal Server Error");
  }
};
