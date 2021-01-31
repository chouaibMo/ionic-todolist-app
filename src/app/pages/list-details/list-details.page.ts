import { Component, OnInit } from '@angular/core';
import {List} from "../../models/list";
import {ListService} from "../../services/list/list.service";
import {ModalController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {CreateTodoComponent} from "../../modals/create-todo/create-todo.component";
import {Todo} from "../../models/todo";

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.page.html',
  styleUrls: ['./list-details.page.scss'],
})
export class ListDetailsPage implements OnInit {
  private list: List;

  constructor(
      private listService: ListService,
      private activatedRoute: ActivatedRoute,
      private modalController: ModalController
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('listId');
      if (id) {
        this.list = this.listService.getOne(id);
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
    this.listService.deleteTodo(this.list.id, todo);
  }

  changed(todo: Todo) {
    if(todo.isDone)
      this.list.nbChecked++;
    else
      this.list.nbChecked--;

    this.listService.updateProgress(this.list.id);  }
}
