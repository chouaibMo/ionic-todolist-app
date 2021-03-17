import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Todo} from "../../models/todo";
import {ActivatedRoute} from "@angular/router";
import {ListService} from "../../services/list/list.service";
import {List} from "../../models/list";
import {Settings} from "../../models/settings";
import '@capacitor-community/text-to-speech';
import { TTSOptions } from '@capacitor-community/text-to-speech';
import {Geolocation, Plugins} from '@capacitor/core';
import {SettingService} from "../../services/setting/setting.service";
const { TextToSpeech } = Plugins;

import * as mapboxgl from 'mapbox-gl';
import {environment} from "../../../environments/environment";
import {MapService} from "../../services/map/map.service";

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})

export class TodoDetailsPage implements OnInit {
  /* Todolist fields*/
  private todo : Todo
  private list : List
  private settings : Settings

  /* Text to speech fields */
  private supportedVoices: SpeechSynthesisVoice[] = [];
  private currentlySpeaking = false

  /* Mapbox fields */
  @ViewChild('map') mapElement: ElementRef;
  private map: mapboxgl.Map;
  private userCoords
  private latitude
  private longitude


  constructor(private listService: ListService,
              private mapService : MapService,
              private settingService: SettingService,
              private activatedRoute: ActivatedRoute) {

    TextToSpeech.getSupportedVoices().then(result => {
      this.supportedVoices = result.voices;
    });
  }

  ngOnInit() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.settingService.getSettings().subscribe(value => this.settings = value)
  }

  ngAfterViewInit(){
    this.activatedRoute.paramMap.subscribe(params => {
      const list_id = params.get('listId');
      const todo_id = params.get('todoId');
      if (list_id && todo_id) {
        this.listService.getOne(list_id).subscribe(list => this.list = list);
        this.listService.getTodo(list_id, todo_id).subscribe(todo => {
          this.todo = todo
          if(this.todo.address){
            this.latitude = this.todo?.latitude ? this.todo.latitude : ''
            this.longitude = this.todo?.longitude ? this.todo.longitude : ''
            setTimeout(() => this.initializeMap(), 10) 
            
          }
        })
      }
    })
  }

  ngAfterViewChecked() {
    //console.log('after View Checked')
  }


  speech(text) {
    if(this.currentlySpeaking){
      this.stop()
    }
    else {
      this.speak(text)
    }
  }
  async stop(): Promise<void> {
    await TextToSpeech.stop();
  }

  async speak(text: string){
    if(this.settings.textToSpeech){
      const options: TTSOptions = {
        text: text,
        speechRate: this.settings.speechVolume,
        pitchRate: 0.9,
        volume: 1.0,
        voice: this.supportedVoices[this.settings.speechLangId],  // supported only for WEB platforms
        //voice: this.settings.speechLangId,
        category: 'ambient',
      };

      this.currentlySpeaking = true;
      await TextToSpeech.speak(options).then(() => {
        this.currentlySpeaking = false;
      });
    }
  }

  async initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      anchor: 'bottom',
      style: 'mapbox://styles/koppzer/ckm9xjp0r79m717pg93ozcp48',
      zoom: 13,
      center: [this.todo.longitude, this.todo.latitude]
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    //Task coords
    new mapboxgl.Marker({  color: "#363636"  })
        .setLngLat([this.longitude, this.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + this.todo.address+ '</h3>'))
        .addTo(this.map);

    //user coords
    this.userCoords = await Geolocation.getCurrentPosition();
    if(this.userCoords){
      new mapboxgl.Marker({  color: "#C40000"  })
          .setLngLat([this.userCoords.coords.longitude, this.userCoords.coords.latitude])
          .addTo(this.map);
    }
  }

/*
  async lines(){
    this.userCoords = await Geolocation.getCurrentPosition();
    //console.log(this.userCoords.coords.longitude, this.userCoords.coords.latitude, this.longitude, this.latitude)
    this.mapService.search_directions(this.userCoords.coords.longitude, this.userCoords.coords.latitude, this.longitude, this.latitude)
        .subscribe(value => {
          console.log(value)
          var json = JSON.parse(JSON.stringify(value));
          var data = json.routes[0];
          var route = data.geometry.coordinates;

          var geojson = {
            'type': 'FeatureCollection',
            'features': [
              {
                'type': 'Feature',
                'geometry': {
                  'type': 'LineString',
                  'properties': {},
                  'coordinates': route
                }
              }
            ]
          };

          var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v10',
            center: [(this.userCoords.coords.longitude+this.longitude)/2, (this.userCoords.coords.latitude+this.latitude)/2],
            zoom: 12
          });

          map.on('load', function () {
            map.addSource('LineString', {
              'type': 'geojson',
              'data': geojson
            });
            map.addLayer({
              'id': 'LineString',
              'type': 'line',
              'source': 'LineString',
              'layout': {
                'line-join': 'round',
                'line-cap': 'round'
              },
              'paint': {
                'line-color': '#BF93E4',
                'line-width': 5
              }
            });

            document
                .getElementById('zoomto')
                .addEventListener('click', function () {
                  var coordinates = geojson.features[0].geometry.coordinates;
                  var bounds = coordinates.reduce(function (bounds, coord) {
                    return bounds.extend(coord);
                  }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

                  map.fitBounds(bounds, {
                    padding: 20
                  });
                });
          });
        })
  }


 */
}
