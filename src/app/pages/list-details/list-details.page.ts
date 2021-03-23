import { UserService } from './../../services/user/user.service';
import { UserData } from './../../models/userData';
import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import {List} from "../../models/list";
import {ListService} from "../../services/list/list.service";
import {AlertController, ModalController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {CreateTodoComponent} from "../../modals/create-todo/create-todo.component";
import {Todo} from "../../models/todo";
import {SettingService} from "../../services/setting/setting.service";
import {UiService} from "../../services/ui/ui.service";
import { CallNumber } from '@ionic-native/call-number/ngx';



@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.page.html',
  styleUrls: ['./list-details.page.scss'],
})
export class ListDetailsPage implements OnInit {
  public list: List
  private todos: Todo[]
  private searchResult: Todo[]
  private deleteConfirmation : boolean
  
  private selectedSegment : string
  private ownerData : UserData
  private membersData: UserData[]


  constructor(private listService: ListService,
              private uiService : UiService,
              private callNumber: CallNumber,
              private AuthService: AuthService,
              private userService: UserService,
              private settingService : SettingService,
              private alertController : AlertController,
              private activatedRoute: ActivatedRoute,
              private modalController: ModalController) {

    this.selectedSegment = 'tasks'            
    this.settingService.getSettings().subscribe((value) => {
      this.deleteConfirmation = value.confirmation;
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('listId');
      if (id) {
        this.listService.getOne(id).subscribe(values => {
          this.list = values
          this.updateListMembers()
        });
        this.listService.getAllTodos(id).subscribe(values => {
          this.todos = values
          this.searchResult = this.todos
        })
      }
    });
  }

  /**
   * Triggered when the user move to another segment
   * @param ev 
   */
  segmentChanged(ev: any) {
    this.selectedSegment = ev.detail.value
  }

  /**
   * Update
   * @returns 
   */
  updateListMembers(){
    this.membersData = []
    let users = this.removeDuplicate([...this.list.readers, ...this.list.writers, ...this.list.sharers])
    users.map(user =>{
      const data = this.userService.getUserByEmail(user)
      if(data)
        this.membersData.push(data)
    })
  }

  /**
   * Present a modal to add a new todo
   * @returns 
   */
  async addTodoModal() {
      if(this.listService.hasWritePermission(this.list, this.AuthService.getCurrentUser().email)){
      const modal = await this.modalController.create({
        component: CreateTodoComponent,
        componentProps: { list: this.list }
      });
      return await modal.present();
    }
    else{
      this.uiService.presentToast("You don't have permission to perform this operation", "danger", 3000)
    }  
  }


  /**
   * Triggered when the user delete a todo
   * @param todo 
   */
  removeTodo(todo: Todo): void {
    if(this.listService.hasWritePermission(this.list, this.AuthService.getCurrentUser().email)){
      if(this.deleteConfirmation)
        this.presentTodoAlert(todo)
      else
        this.listService.deleteTodo(this.list, todo);
    }
    else{
        this.uiService.presentToast("You don't have permission to perform this operation", "danger", 3000)
    }
  }

  /**
   *  Triggered when a task's checkbox is checked/unchecked.
   *  Update progress of the current list
   */
  changed(todo: Todo) {
    if(this.listService.hasWritePermission(this.list, this.AuthService.getCurrentUser().email)){
      todo.isDone ? this.list.nbChecked++ : this.list.nbChecked--;
      this.listService.listsCollection.doc(this.list.id).update({
        nbChecked: this.list.nbChecked
      })
      this.listService.listsCollection.doc(this.list.id).collection('todos').doc(todo.id).update({
        isDone: todo.isDone
      })
      this.listService.updateProgress(this.list);
    }    
    else{
      this.uiService.presentToast("You don't have permission to perform this operation", "danger", 3000)
    }
  }

  /**
   *  Show an alert when delete button is clicked
   */
  async presentTodoAlert(todo: Todo) {
    this.uiService.vibration()
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete '+todo.title + " ?",
      message: 'This todo will be permanently deleted.\nAre you sure you want to delete it?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.listService.deleteTodo(this.list, todo);
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   *  Triggered when a keyword is typed in the searchbar,
   *  and show tasks matching this keyword
   */
  onSearchChange(event: any) {
    const keyword = event.detail.value
    this.searchResult = this.todos
    if(keyword == '')
      return this.list.todos
    if(keyword && keyword.trim() != ''){
      this.searchResult = this.searchResult.filter((item) => {
        return (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1)
      })
    }
  }

  removeMember(email:string){
    this.list.readers = this.list.readers.filter(user => user !== email)
    this.list.writers = this.list.writers.filter(user => user !== email)
    this.list.sharers = this.list.sharers.filter(user => user !== email)
    console.log(this.list)
    this.listService.update(this.list)
    this.membersData.filter(data => data.email !== email)
  }

  private removeDuplicate(data){
    let array = data.reduce((arr, item) => {
      let exists = !!arr.find(x => x === item);
      if(!exists){
        arr.push(item);
      }
      return arr;
    }, []);
    return array
  }

  /**
   * Triggered when user click on a member's phone number
   */
  onCallNumber(number: string){
    console.log("calling")
    this.callNumber.callNumber(number, true)
      .then(res => {
        console.log('Launched dialer!', res)
      })
      .catch(err => {
        console.log('Error launching dialer', err) 
        this.uiService.presentToast("Failed to call "+number, "danger", 1000)
        this.uiService.presentToast(""+err, "danger", 3000)
      });
  }
}
