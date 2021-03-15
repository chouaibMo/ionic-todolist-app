import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Todo} from "../../models/todo";
import {ActivatedRoute} from "@angular/router";
import {ListService} from "../../services/list/list.service";
import {Geolocation} from "@capacitor/core";
import {List} from "../../models/list";
import {Settings} from "../../models/settings";
import '@capacitor-community/text-to-speech';
import { Plugins } from '@capacitor/core';
import {SettingService} from "../../services/setting/setting.service";
const { TextToSpeech } = Plugins;

declare var google;


import * as mapboxgl from 'mapbox-gl';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})

export class TodoDetailsPage implements OnInit {
  private todo : Todo
  private list : List
  private settings : Settings

  map: mapboxgl.Map;
  coordinates;
  

  constructor(private listService: ListService,
              private settingService: SettingService,
              private activatedRoute: ActivatedRoute) {

    TextToSpeech.getSupportedVoices().then(data => {
      console.log(data)
    })
  }

  ngOnInit() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.settingService.getSettings().subscribe(value => this.settings = value)
    this.activatedRoute.paramMap.subscribe(params => {
       const list_id = params.get('listId');
       const todo_id = params.get('todoId');
       if (list_id && todo_id) {
          this.listService.getOne(list_id).subscribe(list => this.list = list);
          this.listService.getTodo(list_id, todo_id).subscribe(todo => this.todo = todo)
       }
    });
  }

  onDoneClick(todo : Todo) {
  }


  speak(text: string){
    if(this.settings.textToSpeech){
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
        speechRate: this.settings.speechVolume,
        pitchRate: 0.9,
        volume: 1.0,
        voice: TextToSpeech.getSupportedVoices()[Math.floor(Math.random() * Math.floor(67))],
        category: 'ambient',
      });
    }
  }


  ionViewWillEnter(){
    this.initializeMap()
  }


  async initializeMap() {
    //this.coordinates = await Geolocation.getCurrentPosition();
    //console.log(this.coordinates)
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/koppzer/ckm9xjp0r79m717pg93ozcp48',
      zoom: 12,
      center: [5.7167, 45.1667]
    });
    this.map.addControl(new mapboxgl.NavigationControl());

    var marker = new mapboxgl.Marker({
      color: "#ED0000",
    }).setLngLat([5.7167, 45.1667])
        .addTo(this.map);
  }

    
}
