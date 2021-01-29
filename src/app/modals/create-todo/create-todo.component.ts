import {Component, Input, OnInit} from '@angular/core';
import {List} from "../../models/list";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListService} from "../../services/list.service";
import {ModalController} from "@ionic/angular";
import {Todo} from "../../models/todo";

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.scss'],
})
export class CreateTodoComponent implements OnInit {
  @Input()
  list: List;

  todoForm: FormGroup;

  constructor(private listService: ListService,
              private formBuilder: FormBuilder,
              private modalController: ModalController) {

    this.todoForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['',Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit(){
    const name = this.todoForm.get('name').value;
    const description = this.todoForm.get('description').value;
    this.listService.addTodo(this.list.id, new Todo(name, description));
    this.modalController.dismiss();
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
