import { getExpensesByUser } from "../utils/dynamo.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const handler = async (event) => {
  try {
    // Get userId from Cognito authorizer
    const userId =
      event.requestContext?.authorizer?.claims?.sub || "default-user";

    const expenses = await getExpensesByUser(userId);

    return successResponse({
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return errorResponse("Internal Server Error");
  }
};
