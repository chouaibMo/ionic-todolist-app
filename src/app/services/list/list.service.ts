import { Injectable } from '@angular/core';
import {List} from "../../models/list";
import {Todo} from "../../models/todo";

@Injectable({
  providedIn: 'root'
})
export class ListService {
  public lists: List[]

  constructor() {
    this.lists = []
  }

  /*
   *  Get all lists
   */
  public getAll() : List[] {
    return this.lists;
  }

  /*
   *  Get a list by id
   */
  public getOne(id: string) : List{
    return this.lists.find(l => l.id === id);
  }

  /*
   *  Add a  list of todos (already created)
   */
  public add(list : List) : void {
    this.lists.push(list);
  }

  /*
   *  Create a new list of todos
   */
  public create(name: string): void {
    this.lists.push(new List(name));
  }

  /*
   *  Delete a list of todos
   */
  public delete(list : List) : void{
    this.lists.splice(this.lists.indexOf(list), 1);
  }

  /*
   *  Add a new task to a list
   */
  public addTodo(id: string, todo: Todo) {
    const list = this.lists.find(l => l.id === id)
    this.lists.find(l => l.id === id).addTodo(todo);
    this.updateProgress(id);
  }

  /*
   *  Remove a toto from a list
   */
  public deleteTodo(id: string, todo: Todo){
    const list = this.lists.find(l => l.id === id)
    this.lists.find(l => l.id === id).removeTodo(todo);
    if(todo.isDone)
      list.nbChecked--;
    this.updateProgress(id);
  }

  /*
   *  Get a task from a list by id
   */
  public getTodo(list_id: string, todo_id : string) : Todo{
    const list = this.lists.find(l => l.id === list_id);
    return list.todos.find(l => l.id === todo_id);
  }



  public updateProgress(id :string){
    const list = this.getOne(id);
    if(list)
      list.progress = (list.nbChecked / list.todos.length)*100 | 0;
  }
}
