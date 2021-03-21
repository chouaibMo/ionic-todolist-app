export class Todo {
    id: string;
    title: string;
    description?: string;
    isDone: boolean;
    longitude?: string
    latitude?: string
    address?: string;
    date?: any;


    constructor(name: string, description: string){
        this.title = name;
        this.description = description;
        this.isDone = false;
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
