import { LambdaIntegration, Resource, RestApi } from "aws-cdk-lib/aws-apigateway";

export class ApiBinder {
    private api: RestApi;
    private resource: Resource | undefined;
    private lambdaIntegrations: Map<string, LambdaIntegration>;

    constructor(api: RestApi) {
        this.api = api;
        this.lambdaIntegrations = new Map();
    }

    public toResource(name: string): ApiBinder {
        this.resource = this.api.root.addResource(name);
        return this;
    }

    public withCRUDOperation(method: string, lambdaIntegrations: LambdaIntegration): ApiBinder {
        this.lambdaIntegrations.set(method, lambdaIntegrations);
        return this;
    }

    public bind(): void {
        const keys: IterableIterator<string> = this.lambdaIntegrations.keys();
        
        let key = keys.next();

        while(key.done === false) {
            const lambdaIntegrations: LambdaIntegration = this.lambdaIntegrations.get(key.value);
            this.resource?.addMethod(key.value, lambdaIntegrations);
            key = keys.next();
        }
    }
}