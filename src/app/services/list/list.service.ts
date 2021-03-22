import {Injectable} from '@angular/core';
import {List} from "../../models/list";
import {Todo} from "../../models/todo";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {combineLatest, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ListService {
  public listsCollection: AngularFirestoreCollection<List>

  constructor(public afs: AngularFirestore,
              public authService : AuthService) {
    this.listsCollection = this.afs.collection<List>('lists');
  }

  /**
   *  Get all lists
   */
  public getAll() : Observable<List[]>{
    const lists = this.afs.collection('lists',ref => ref.where('owner', '==', this.authService.getCurrentUser()?.email));
    return lists.snapshotChanges().pipe(
        map(value => this.multipleMapper<List>(value))
    );
  }

  /**
   *  Get all shared lists
   */
  public getAllShared() : Observable<List[]>{
    const readers = this.afs.collection('lists',
            ref => ref.where('readers', 'array-contains', this.authService.getCurrentUser()?.email))

    const writers = this.afs.collection('lists',
            ref => ref.where('writers', 'array-contains', this.authService.getCurrentUser()?.email))

    const readersObs =  readers.snapshotChanges().pipe(
        map(value => this.multipleMapper<List>(value))
    );
    const writersObs = writers.snapshotChanges().pipe(
        map(value => this.multipleMapper<List>(value))
    );

    return combineLatest(readersObs,writersObs).pipe(
        map(([list1, list2]) =>{
          let array = [...list1, ...list2]
          return this.removeDuplicate(array)
        })
    )
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
   *  Create a new list of todos
   */
  public create(name: string, owner : string): void {
    const id = this.afs.createId();
    const list = new List(id, name, owner)
    this.listsCollection.doc(id).set(Object.assign({}, list));
  }

  /**
   *  Delete a list of todos
   */
  public delete(list : List) : void{
    this.listsCollection.doc(list.id).delete()
  }

  /**
   *  update a list
   */
  public update(list : List) : void{
    this.listsCollection.doc(list.id).update(list)
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

  // ----------------------------------------------------------------------
  // ----------------------------  UTILS   --------------------------------
  // ----------------------------------------------------------------------

  /**
   * 
   * @param actions 
   * @returns 
   */
  private singleMapper<T>(actions) {
    const data = actions.payload.data();
    const id = actions.payload.id;
    return { id, ...data} as T;
  }

  /**
   * 
   * @param data 
   * @returns 
   */
  private multipleMapper<T>(data) {
    return data.map(d => {
      const id = d.payload.doc.id
      return { id, ...d.payload.doc.data() } as T;
    })
  }

  /**
   * Check whether a user has write permission on a list 
   * @param list a list object
   * @param email 
   * @returns true if the user had write permission, false otherwire
   */
  public hasWritePermission(list: List, email: string){
      if(list.owner == email || list.writers.includes(email))
        return true;
      else
        return false;
  }

  /**
   * Check whether a user has share permission on a list 
   * @param list a list object
   * @param email 
   * @returns true if the user had share permission, false otherwire
   */
  public hasSharePermission(list: List, email: string){
    if(list.owner == email || list.sharers.includes(email))
      return true;
    else
      return false;
  }

  /**
   * Remove duplicated values in an array
   * @param data the array of object
   * @returns new array without duplicates
   */
  private removeDuplicate(data){
    let array = data.reduce((arr, item) => {
      let exists = !!arr.find(x => x.id === item.id);
      if(!exists){
        arr.push(item);
      }
      return arr;
    }, []);

    return array
  }

}
