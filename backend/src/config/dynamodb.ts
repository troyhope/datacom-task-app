import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const isLocal = process.env.NODE_ENV !== "production";

export const dynamoClient = new DynamoDBClient({
  ...(isLocal && {
    endpoint: "http://localhost:8000",
    region: "local",
    credentials: {
      accessKeyId: "local",
      secretAccessKey: "local",
    },
  }),
});

export const TABLE_NAME = "tasks";
