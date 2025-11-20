import express from "express";
import cors from "cors";
import { authenticateToken } from "./src/middleware/auth.js";
import { signup, confirmSignup, login } from "./src/handlers/auth.js";
import { handler as getUploadUrlHandler } from "./src/handlers/getUploadUrl.js";
import { handler as getExpensesHandler } from "./src/handlers/getExpenses.js";
import { handler as getMonthlySummaryHandler } from "./src/handlers/getMonthlySummary.js";
import { handler as processReceiptHandler } from "./src/handlers/processReceipt.js";
import { handler as monthlySummaryTriggerHandler } from "./src/handlers/monthlySummaryTrigger.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes (public)
app.post("/auth/signup", async (req, res) => {
  try {
    const event = { body: JSON.stringify(req.body) };
    const result = await signup(event);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/auth/confirm", async (req, res) => {
  try {
    const event = { body: JSON.stringify(req.body) };
    const result = await confirmSignup(event);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const event = { body: JSON.stringify(req.body) };
    const result = await login(event);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Protected routes
app.post("/upload-url", authenticateToken, async (req, res) => {
  try {
    const event = { body: JSON.stringify(req.body) };
    const result = await getUploadUrlHandler(event);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/expenses", authenticateToken, async (req, res) => {
  try {
    const event = {
      requestContext: { authorizer: { claims: { sub: req.user.id } } },
    };
    const result = await getExpensesHandler(event);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/summary", authenticateToken, async (req, res) => {
  try {
    const event = {
      queryStringParameters: req.query,
      requestContext: { authorizer: { claims: { sub: req.user.id } } },
    };
    const result = await getMonthlySummaryHandler(event);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/process", authenticateToken, async (req, res) => {
  try {
    const event = { body: JSON.stringify(req.body) };
    const result = await processReceiptHandler(event);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/trigger-summary", authenticateToken, async (req, res) => {
  try {
    const event = {};
    const result = await monthlySummaryTriggerHandler(event);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
