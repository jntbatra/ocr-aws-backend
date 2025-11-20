import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { successResponse, errorResponse } from "../utils/response.js";

const cognitoClient = new CognitoIdentityProviderClient({});
const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

export const signup = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email, password, username } = body;

    if (!email || !password || !username) {
      return errorResponse("Email, password, and username are required", 400);
    }

    const command = new SignUpCommand({
      ClientId: clientId,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    });

    await cognitoClient.send(command);

    return successResponse({
      message:
        "User created successfully. Please check your email to confirm your account.",
      username,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return errorResponse(error.message || "Signup failed", 400);
  }
};

export const confirmSignup = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { username, confirmationCode } = body;

    if (!username || !confirmationCode) {
      return errorResponse("Username and confirmation code are required", 400);
    }

    const command = new ConfirmSignUpCommand({
      ClientId: clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
    });

    await cognitoClient.send(command);

    return successResponse({
      message: "Account confirmed successfully",
    });
  } catch (error) {
    console.error("Confirm signup error:", error);
    return errorResponse(error.message || "Confirmation failed", 400);
  }
};

export const login = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { username, password } = body;

    if (!username || !password) {
      return errorResponse("Username and password are required", 400);
    }

    const command = new InitiateAuthCommand({
      ClientId: clientId,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);

    return successResponse({
      accessToken: response.AuthenticationResult.AccessToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
      idToken: response.AuthenticationResult.IdToken,
      expiresIn: response.AuthenticationResult.ExpiresIn,
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Invalid credentials", 401);
  }
};
