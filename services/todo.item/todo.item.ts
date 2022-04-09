export class TodoItem {
    private id: string;
    private text: string;

    constructor(id: string, text: string) {
        this.id = id;
        this.text = text;
    }

    public getId(): string {
        return this.id;
    }

    public getText(): string {
        return this.text;
    }
}