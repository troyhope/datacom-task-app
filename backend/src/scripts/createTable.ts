import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { dynamoClient, TABLE_NAME } from "../config/dynamodb";

async function createTable() {
  const command = new CreateTableCommand({
    TableName: TABLE_NAME,
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  });

  try {
    await dynamoClient.send(command);
    console.log("Table created successfully");
  } catch (error) {
    if ((error as any).name === "ResourceInUseException") {
      console.log("Table already exists");
    } else {
      console.error("Error creating table:", error);
    }
  }
}

createTable();
