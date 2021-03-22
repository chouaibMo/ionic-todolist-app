import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, combineLatest} from 'rxjs';
import { map } from 'rxjs/operators';
import { List } from 'src/app/models/list';
import { UserData } from 'src/app/models/userData';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public usersCollection: AngularFirestoreCollection<UserData>
  private users : UserData[]

  constructor(public afs: AngularFirestore) { 
    this.usersCollection = this.afs.collection<UserData>('users');
    this.getAll().subscribe(value => this.users = value)
  }


 /**
  *  Get all users (members) of a list
   */
  /*
  public getAll(list: List) : Observable<UserData[]>{
  const readers = this.afs.collection('users', ref => ref.where('email', 'in', list.readers))
  const writers = this.afs.collection('users', ref => ref.where('email', 'in', list.writers))
  const sharers = this.afs.collection('users', ref => ref.where('email', 'in', list.sharers))

  const readersObs = readers.snapshotChanges().pipe(map(value => this.multipleMapper<UserData>(value)));
  const writersObs = writers.snapshotChanges().pipe(map(value => this.multipleMapper<UserData>(value)));
  const sharersObs = sharers.snapshotChanges().pipe(map(value => this.multipleMapper<UserData>(value)));

  return combineLatest(readersObs,writersObs, sharersObs).pipe(
  map(([list1, list2, list3]) =>{
    let array = [...list1, ...list2, ...list3]
    return this.removeDuplicate(array)
  })
  )
}
*/

public getAll() : Observable<UserData[]>{
  return this.usersCollection.snapshotChanges().pipe(
      map(value => this.multipleMapper<List>(value))
  );
}

  public getUserByEmail(email: string) : UserData{
    return this.users.find(user => user.email === email)
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
}
