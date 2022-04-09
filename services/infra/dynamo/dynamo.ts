import { Stack } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb"

/**
 * Table properties required for creating a DynamoDB table
 */
export interface TableProperties {
    name: string,
    primaryKey: string,
    primaryKeyType: AttributeType,
    secondaryIndexes: SecondaryIndex[]
}

/**
 * Secondary index type definition
 */
export class SecondaryIndex {
    private name: string;
    private type: AttributeType;

    constructor(name: string, type: AttributeType) {
        this.name = name;
        this.type = type;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): AttributeType {
        return this.type;
    }
}

/**
 * Template for creating a DynamoDB table
 */
export class DynamoTable {
    private stack: Stack;
    private table: Table;
    private tableProperties: TableProperties

    constructor(stack: Stack, tableProperties: TableProperties) {
        this.stack = stack;
        this.tableProperties = tableProperties;

        // create the table
        this.table = new Table(this.stack, this.tableProperties.name, {
            partitionKey: {
                name: this.tableProperties.primaryKey,
                type: this.tableProperties.primaryKeyType
            },
            tableName: this.tableProperties.name
        });

        // add secondary indexes if any
        this.tableProperties.secondaryIndexes.forEach((secondaryIndex) => {
            this.table.addGlobalSecondaryIndex({
                indexName: secondaryIndex.getName(),
                partitionKey: {
                    name: secondaryIndex.getName(),
                    type: secondaryIndex.getType()
                }
            })
        });
    }

    public getTable(): Table {
        return this.table;
    }
}