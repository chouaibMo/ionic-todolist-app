import { Component, OnInit } from '@angular/core';
import {List} from "../../models/list";
import {ListService} from "../../services/list/list.service";
import {AlertController, ModalController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {CreateTodoComponent} from "../../modals/create-todo/create-todo.component";
import {Todo} from "../../models/todo";
import {SettingService} from "../../services/setting/setting.service";

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

  constructor(
      private listService: ListService,
      private settingService : SettingService,
      private alertController : AlertController,
      private activatedRoute: ActivatedRoute,
      private modalController: ModalController
  ) {
    this.settingService.getDeleteConfirmationValue().subscribe((value) => {
      this.deleteConfirmation = value;
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('listId');
      if (id) {
        this.listService.getOne(id).subscribe(values => {
          this.list = values
        });
        this.listService.getAllTodos(id).subscribe(values => {
          this.todos = values
          this.searchResult = this.todos
        })
      }
    });
  }

  async addTodoModal() {
    const modal = await this.modalController.create({
      component: CreateTodoComponent,
      componentProps: { list: this.list }
    });
    return await modal.present();
  }


  removeTodo(todo: Todo): void {
    if(this.deleteConfirmation)
      this.presentTodoAlert(todo)
    else
    this.listService.deleteTodo(this.list, todo);
  }

  /**
   *  Triggered when a task's checkbox is checked/unchecked.
   *  Update progress of the current list
   */
  changed(todo: Todo) {
    todo.isDone ? this.list.nbChecked++ : this.list.nbChecked--;
    this.listService.listsCollection.doc(this.list.id).update({
      nbChecked: this.list.nbChecked
    })
    this.listService.listsCollection.doc(this.list.id).collection('todos').doc(todo.id).update({
      isDone: todo.isDone
    })
    this.listService.updateProgress(this.list);
  }

  /**
   *  Show an alert when delete button is clicked
   *
   */
  async presentTodoAlert(todo: Todo) {
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
}
