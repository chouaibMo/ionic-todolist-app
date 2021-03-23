import {Component, Input, OnInit} from '@angular/core';
import {List} from "../../models/list";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListService} from "../../services/list/list.service";
import {ModalController} from "@ionic/angular";
import {Todo} from "../../models/todo";
import {MapService, Feature} from "../../services/map/map.service";

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.scss'],
})
export class CreateTodoComponent implements OnInit {
  @Input()
  list: List;
  todoForm: FormGroup;
  minDate = new Date().toISOString();

  todoDate
  addresses = [];
  selectedAddress = null;

  constructor(private listService: ListService,
              private formBuilder: FormBuilder,
              private mapService: MapService,
              private modalController: ModalController) {

    this.todoForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['',Validators.required],
      date: ['']
    });
  }

  ngOnInit() {}

  onSubmit(){
    const name = this.todoForm.get('name').value;
    const description = this.todoForm.get('description').value;
    const date = this.todoForm.get('date').value;
    let todo = new Todo(name, description)

    if(this.selectedAddress){
      todo.address = this.selectedAddress?.place_name
      todo.latitude = this.selectedAddress?.center[1]
      todo.longitude =  this.selectedAddress?.center[0]
    }

    if(date){
      todo.date = new Date(date)
    }

    this.listService.addTodo(this.list, todo);
    this.listService.updateProgress(this.list);
    this.modalController.dismiss();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapService.search_word(searchTerm).subscribe((features: Feature[]) => {
            this.addresses = features //.map(feat => feat.place_name);
          });
    } else {
      this.addresses = [];
    }
  }

  onAdressSelect(address) {
    this.selectedAddress = address;
    this.addresses = [];
  }

  showdate(){
    console.log(this.todoDate);
  }

}
