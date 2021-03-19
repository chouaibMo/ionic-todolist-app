import { Todo } from "./todo";

export class List {
    id: string;
    name: string;
    owner: string
    readers?: string[];
    writers?: string[];
    sharers?: string[];
    nbChecked: number;
    progress: number;
    size: number;
    todos?: Todo[];

    constructor(id: string, name : string, owner : string){
        this.name = name;
        this.owner = owner;
        this.id = id;
        this.size = 0;
        this.nbChecked = 0;
        this.progress = 0;
        this.readers = [];
        this.writers = [];
        this.sharers = [];
    }
}
