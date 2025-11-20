export const parseExpenseData = (textractResponse) => {
  const expenseDocuments = textractResponse.ExpenseDocuments || [];
  if (expenseDocuments.length === 0) {
    return null;
  }

  // We'll take the first document found
  const doc = expenseDocuments[0];
  const summaryFields = doc.SummaryFields || [];
  const lineItemGroups = doc.LineItemGroups || [];

  let total = 0;
  let date = null;
  let merchant = "Unknown";
  let rawText = "";

  // Extract Summary Fields
  summaryFields.forEach((field) => {
    const type = field.Type?.Text;
    const value = field.ValueDetection?.Text;

    if (type === "TOTAL") {
      // Clean up currency symbols
      const cleanTotal = value.replace(/[^0-9.]/g, "");
      total = parseFloat(cleanTotal) || 0;
    } else if (type === "INVOICE_RECEIPT_DATE" || type === "RECEIPT_DATE") {
      date = value;
    } else if (type === "VENDOR_NAME") {
      merchant = value;
    }
    
    if (value) rawText += value + " ";
  });

  // Fallback: If no date found, use today
  if (!date) {
    date = new Date().toISOString().split('T')[0];
  }

  // Simple category detection based on merchant or keywords (Optional enhancement)
  const category = detectCategory(merchant, rawText);

  return {
    total,
    date,
    merchant,
    category,
    rawText: rawText.trim()
  };
};

const detectCategory = (merchant, text) => {
  const lowerText = (merchant + " " + text).toLowerCase();
  
  if (lowerText.includes("restaurant") || lowerText.includes("food") || lowerText.includes("cafe") || lowerText.includes("burger")) return "Food";
  if (lowerText.includes("uber") || lowerText.includes("lyft") || lowerText.includes("taxi") || lowerText.includes("gas")) return "Transport";
  if (lowerText.includes("hotel") || lowerText.includes("airbnb")) return "Travel";
  if (lowerText.includes("market") || lowerText.includes("grocery")) return "Groceries";
  
  return "General";
};
