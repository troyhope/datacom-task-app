import { Handler } from "aws-lambda";
import serverless from "serverless-http";
import app from "./server";

// Wrap the handler to add better error logging
const handler: Handler = async (event, context) => {
  try {
    console.log("Lambda event:", JSON.stringify(event, null, 2));
    console.log("Lambda context:", JSON.stringify(context, null, 2));

    const result = await serverless(app)(event, context);
    console.log("Lambda response:", JSON.stringify(result, null, 2));
    return result;
  } catch (error: any) {
    console.error("Lambda error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      requestId: error.$metadata?.requestId,
      cfId: error.$metadata?.cfId,
      httpStatusCode: error.$metadata?.httpStatusCode,
    });
    throw error;
  }
};

export { handler };
