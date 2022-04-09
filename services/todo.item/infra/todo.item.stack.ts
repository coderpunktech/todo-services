import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { DynamoTable } from "../../infra/dynamo/dynamo";
import { ApiBinder } from "../../infra/api/api.binder";
import { join } from "path";

export class TodoItemStack extends Stack {
    private restApi: RestApi;
    private dynamoTable: DynamoTable;

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);
    }
}