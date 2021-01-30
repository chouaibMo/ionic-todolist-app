import { Injectable } from '@angular/core';
import {List} from "../models/list";
import {Todo} from "../models/todo";

@Injectable({
  providedIn: 'root'
})
export class ListService {
  public lists: List[]

  constructor() {
      this.lists = []
  }

  public getAll() : List[] {
    return this.lists;
  }

  public getOne(id: string) : List{
    return this.lists.find(l => l.id === id);
  }

  public add(list : List) : void {
    this.lists.push(list);
  }

  public create(name: string): void {
    this.lists.push(new List(name));
  }

  public delete(list : List) : void{
    this.lists.splice(this.lists.indexOf(list), 1);
  }

  public addTodo(id: string, todo: Todo) {
    this.lists.find(l => l.id === id).addTodo(todo);
    this.updateProgress(id);
}

  public deleteTodo(id: string, todo: Todo){
    this.lists.find(l => l.id === id).removeTodo(todo);
    this.updateProgress(id);
  }

  public updateProgress(id :string){
    const list = this.getOne(id);
    if(list)
      list.progress = (list.nbChecked / list.todos.length)*100  | 0;
  }
}
