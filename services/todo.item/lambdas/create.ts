import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from "uuid";
import { TodoItem } from "../todo.item";
import { DynamoDB } from "aws-sdk";

// get the table name from the env variable
const TABLE_NAME = process.env.TABLE_NAME;
// create the client outside the handler
const DB_CLIENT = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    // assume the body is never null or undefined
    const params: any = JSON.parse(event.body!);
    // create the item
    const item = new TodoItem(v4(), params.text);

    // prepare the temp response
    const response: APIGatewayProxyResult = {
        statusCode: 201,
        body: ''
    };

    try {
        // persist the item
        await DB_CLIENT.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise();

        // set the body with the created item
        response.body = JSON.stringify(item);
    } catch (error: any) {
        // catch the error and change the response
        console.error(error);
        response.statusCode = 500;
        response.body = JSON.stringify(error);
    }

    // return the response
    return response;
}

export { handler };
