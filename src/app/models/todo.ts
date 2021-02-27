export class Todo {
    id: string;
    title: string;
    description?: string;
    isDone: boolean;
    date: Date;
    address: string;

    constructor(name: string, description: string){
        this.title = name;
        this.description = description;
        this.isDone = false;
        this.id = Math.random().toString(20).substr(2, 6)
    }

    public getName(): string {
        return this.title;
    }

    public setName(name: string): void {
        this.title = name;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public isdone(): boolean {
        return this.isDone;
    }

    public setDone(isDone: boolean): void {
        this.isDone = isDone;
    }

    public getId(): string {
        return this.id;
    }


}
