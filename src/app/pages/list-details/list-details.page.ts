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
  private list: List;
  private searchResult
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
        this.list = this.listService.getOne(id);
        this.searchResult = this.list.todos
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
    this.listService.deleteTodo(this.list.id, todo);
  }

  changed(todo: Todo) {
    todo.isDone ? this.list.nbChecked++ : this.list.nbChecked--;
    this.listService.updateProgress(this.list.id);
  }

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
            this.listService.deleteTodo(this.list.id, todo);
          }
        }
      ]
    });

    await alert.present();
  }

  onSearchChange(event: any) {
    const keyword = event.detail.value
    this.searchResult = this.list.todos
    if(keyword == '')
      return this.list.todos
    if(keyword && keyword.trim() != ''){
      this.searchResult = this.searchResult.filter((item) => {
        return (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1)
      })
    }
  }
}
