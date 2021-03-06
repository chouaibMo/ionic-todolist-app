import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Todo} from "../../models/todo";
import {ActivatedRoute} from "@angular/router";
import {ListService} from "../../services/list/list.service";
import {Geolocation} from "@capacitor/core";
import {List} from "../../models/list";

declare var google;

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})

export class TodoDetailsPage implements OnInit {
  private todo : Todo
  private list : List

  // Map related
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  coordinates;

  constructor(private listService: ListService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const list_id = params.get('listId');
      const todo_id = params.get('todoId');
      if (list_id && todo_id) {
        this.listService.getOne(list_id).subscribe(list => {
          this.list = list
        });
        this.listService.getTodo(list_id, todo_id).subscribe(todo => {
          this.todo = todo
        })
      }
    });
  }

  onDoneClick(todo : Todo) {
    todo.isDone = !todo.isDone
    todo.isDone ? this.list.nbChecked++ : this.list.nbChecked--;
    this.listService.updateProgress(this.list);
  }

  ionViewWillEnter(){
    //this.loadMap()
  }

  // Initialize a blank map
  async loadMap() {
    this.coordinates = await Geolocation.getCurrentPosition();
    console.log(this.coordinates)
    let latLng = new google.maps.LatLng(this.coordinates.coords.latitude, this.coordinates.coords.longitude);

    let mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
}
