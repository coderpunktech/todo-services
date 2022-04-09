import { DynamoTable, SecondaryIndex } from "./dynamo";
import { Stack } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";

describe('The DynamoDB table template', () => {
    let stack: Stack;
    let mockTable: jest.Mock<typeof Table>

    beforeEach(() => {
        stack = new Stack();
        jest.mock('aws-cdk-lib/aws-dynamodb/lib/table');
        mockTable = <jest.Mock<typeof Table>><unknown>Table;
        jest.spyOn(mockTable.prototype, 'addGlobalSecondaryIndex');
    });

    it('should allow to create a table with no secondary indexes', () => {
        const table: DynamoTable = new DynamoTable(stack, {
            name: 'mario',
            primaryKey: 'name',
            primaryKeyType: AttributeType.STRING,
            secondaryIndexes: []
        });

        expect(table).toBeDefined();
        expect(table.getTable()).toBeDefined();
        expect(mockTable.prototype.addGlobalSecondaryIndex).toHaveBeenCalledTimes(0);
    });

    it('should allow to create a table with secondary indexes', () => {
        const table: DynamoTable = new DynamoTable(stack, {
            name: 'mario',
            primaryKey: 'name',
            primaryKeyType: AttributeType.STRING,
            secondaryIndexes: [
                new SecondaryIndex('foo', AttributeType.STRING),
                new SecondaryIndex('count', AttributeType.NUMBER)
            ]
        });

        expect(table).toBeDefined();
        expect(table.getTable()).toBeDefined();
        expect(mockTable.prototype.addGlobalSecondaryIndex).toHaveBeenCalledTimes(2);
    });
});