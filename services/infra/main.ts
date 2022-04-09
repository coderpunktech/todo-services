import { App } from "aws-cdk-lib";
import { TodoItemStack } from "../todo.item/infra/todo.item.stack";

const app = new App();

new TodoItemStack(app, 'TodoItemStack', {
    stackName: 'TodoItem'
});