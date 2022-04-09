import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { DynamoTable } from "../../infra/dynamo/dynamo";
import { ApiBinder } from "../../infra/api/api.binder";
import { join } from "path";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";

export class TodoItemStack extends Stack {
    private restApi: RestApi;
    private dynamoTable: DynamoTable;
    private static TABLE_NAME: string = 'todos';
    private static PRIMARY_KEY: string = 'id';

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        // init the rest api
        this.restApi = new RestApi(this, 'TodoItemApiGateway');
        // init the DynamoDB table
        this.dynamoTable = new DynamoTable(this, {
            name: TodoItemStack.TABLE_NAME,
            primaryKey: TodoItemStack.PRIMARY_KEY,
            primaryKeyType: AttributeType.STRING,
            secondaryIndexes: []
        });

        const createTodoItemLambda = new NodejsFunction(this, 'createTodoItemLambda', {
            entry: join(__dirname, '..', 'lambdas', 'create.ts'),
            handler: 'handler',
            environment: {
                TABLE_NAME: TodoItemStack.TABLE_NAME
            }
        });
        
        // grant dynamo db permissions
        this.dynamoTable.getTable().grantWriteData(createTodoItemLambda);

        // bind the api
        new ApiBinder(this.restApi)
            .toResource('todo')
            .withCRUDOperation('POST', new LambdaIntegration(createTodoItemLambda));
    }
}