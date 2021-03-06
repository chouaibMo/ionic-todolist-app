import {Injectable} from '@angular/core';
import {List} from "../../models/list";
import {Todo} from "../../models/todo";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ListService {
  public listsCollection: AngularFirestoreCollection<List>
  private lists: List[]


  constructor(public afs: AngularFirestore) {
    this.listsCollection = this.afs.collection<List>('lists');

    this.lists = []
  }

  /**
   *  Get all lists
   */
  public getAll() : Observable<List[]>{
    return this.listsCollection.snapshotChanges().pipe(
        map(value => this.multipleMapper<List>(value))
    );
  }

  /**
   *  Get a list by id
   */
  public getOne(id: string) : Observable<List>{
    return this.listsCollection.doc(id).snapshotChanges().pipe(
        map(value => this.singleMapper<List>(value))
    );
  }

  /**
   *  Add a  list of todos (already created)
   */
  public add(list : List) : void {
    this.lists.push(list);
  }

  /**
   *  Create a new list of todos
   */
  public create(name: string, owner : string): void {
    const id = this.afs.createId();
    const list = new List(id, name, owner)
    this.listsCollection.doc(id).set(Object.assign({}, list));
    this.listsCollection.doc(list.id).collection('writers').doc().set({
      email: owner
    });
    this.listsCollection.doc(list.id).collection('readers').doc().set({
      email: owner
    });
  }

  /**
   *  Delete a list of todos
   */
  public delete(list : List) : void{
    this.listsCollection.doc(list.id).collection('todos').get()
    this.listsCollection.doc(list.id).collection('readers').snapshotChanges().pipe(
        map(value => this.multipleMapper<List>(value))
    );
  }


  // ----------------------------------------------------------------------
  // ---------------------   TASK FUNCTIONS   -----------------------------
  // ----------------------------------------------------------------------

  /**
   *  Get firestore ref. of a task document
   */
  public getTodoRef(list_id:string, todo_id:string){
    return this.listsCollection.doc(list_id).collection('todos').doc(todo_id)
  }

  /**
   *  Get all tasks corresponding to a list
   */
  public getAllTodos(list_id: string) : Observable<Todo[]>{
    return this.listsCollection.doc(list_id).collection('todos')
        .snapshotChanges()
        .pipe(
          map(actions => this.multipleMapper<Todo>(actions))
    );
  }

  /**
   *  Get a task from a list by id
   */
  public getTodo(list_id: string, todo_id : string) : Observable<Todo>{
    return this.listsCollection.doc(list_id).collection('todos').doc(todo_id)
        .snapshotChanges()
        .pipe(
          map(value => this.singleMapper<Todo>(value))
    );
  }

  /**
   *  Add a new task to a list
   */
  public addTodo(list: List, todo: Todo) {
    todo.id = this.afs.createId();
    this.listsCollection.doc(list.id).collection('todos').doc(todo.id).set(Object.assign({}, todo));
    this.listsCollection.doc(list.id).update({
      size: (list.size + 1)
    })
    list.size += 1
    this.updateProgress(list);
  }

  /**
   *  Remove a task from a list
   */
  public deleteTodo(list: List, todo: Todo){
    this.listsCollection.doc(list.id).collection('todos').doc(todo.id).delete()
    this.listsCollection.doc(list.id).update({
      size: (list.size - 1)
    });

    list.size -= 1
    if(todo.isDone){
      list.nbChecked -= 1
      this.listsCollection.doc(list.id).update({
        nbChecked: list.nbChecked
      });
    }
    this.updateProgress(list);

  }

  /**
   *  Update progress percentage of a list according to it's checked tasks
   */
  public updateProgress(list :List){
    const progress = (list.nbChecked / list.size)*100 | 0;
    this.listsCollection.doc(list.id).update({
      progress: progress
    });
  }


  private singleMapper<T>(actions) {
    const data = actions.payload.data();
    const id = actions.payload.id;
    return { id, ...data} as T;
  }

  private multipleMapper<T>(data) {
    return data.map(d => {
      const id = d.payload.doc.id
      return { id, ...d.payload.doc.data() } as T;
    })
  }
}
