import { Todo } from "./todo";

export class List {
    id: string;
    name: string;
    nbChecked: number;
    progress: number
    todos: Todo[];


    constructor(name : string){
        this.id = Math.random().toString(20).substr(2, 6)
        this.nbChecked = 0;
        this.progress = 0;
        this.name = name;
        this.todos = [];
    }

    public addTodo(todo: Todo): void {
        this.todos.push(todo);
    }

    public removeTodo(todo: Todo): void {
        this.todos.splice(this.todos.indexOf(todo), 1);
    }
}
