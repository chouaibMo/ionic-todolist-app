import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Todo} from "../../models/todo";
import {ActivatedRoute} from "@angular/router";
import {ListService} from "../../services/list/list.service";
import {Geolocation} from "@capacitor/core";
import {List} from "../../models/list";

import '@capacitor-community/text-to-speech';
import { Plugins } from '@capacitor/core';
const { TextToSpeech } = Plugins;

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
              //private tts: TextToSpeech,
              private activatedRoute: ActivatedRoute) {

    TextToSpeech.getSupportedVoices().then(data => {
      console.log(data)
    })
    TextToSpeech.getSupportedLanguages().then(data => {
      console.log(data)
    })

  }

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
/*
  speak(text: string){
    switch (text) {
      case 'title':
        this.todo?.title ? this.tts.speak(this.todo?.title) : this.tts.speak('title not available')
        break;
      case 'description':
        this.todo?.description ? this.tts.speak(this.todo?.description) : this.tts.speak('description not available')
        break;
      case 'date':
        this.todo?.date ? this.tts.speak(this.todo?.date.toString()) : this.tts.speak('date not available')
        break;
    }
  }
 */

  speak(text: string){
    let speak = ''
    switch (text) {
      case 'title':
        this.todo?.title ? speak = this.todo?.title : speak = 'title not available'
        break;
      case 'description':
        this.todo?.description ? speak = this.todo?.description : speak = 'title not available'
        break;
      case 'date':
        this.todo?.date ? speak = this.todo?.date.toString() : speak = 'title not available'
        break;
    }

    TextToSpeech.speak({
      text: speak ,
      locale: 'en_US',
      speechRate: 0.8,
      pitchRate: 0.9,
      volume: 1.0,
      voice: 33,
      category: 'ambient',
    });

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
