import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Settings} from "../../models/settings";

import { Plugins } from '@capacitor/core';
import {newArray} from "@angular/compiler/src/util";
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  darkMode : BehaviorSubject<boolean>;
  secureUnlock : BehaviorSubject<boolean>;
  deleteConfirm : BehaviorSubject<boolean>;
  pushNotification : BehaviorSubject<boolean>;

  object : BehaviorSubject<Settings>

  constructor() {
    this.object = new BehaviorSubject<Settings>(new Settings());
    this.userSettings('settings')
  }

  userSettings(key : string){
    this.getObject(key).then(value => {
      if(value){
        this.object.next(value)
        if (this.object.getValue().darkMode)
          document.body.setAttribute('color-theme', 'dark');
        else
          document.body.setAttribute('color-theme', 'light');
      }
      else{
        this.setObject(key, new Settings())
        this.object.next(new Settings())
      }
    })
  }

  /**
   * Store an object in local storage
   * @param key
   * @param value
   */
  async setObject(key : string, value: any){
    await Storage.set({
      key: key,
      value: JSON.stringify(value)
    });
  }

  /**
   * Retreive an object from local storage by key
   * @param key
   */
  async getObject(key: string){
    const item = await Storage.get({ key: key });
    return JSON.parse(item.value);
  }


  // SETTERS :
  setSettings(newValue): void {
    this.setObject('settings', newValue)
    this.object.next(newValue);
    if (newValue.darkMode)
      document.body.setAttribute('color-theme', 'dark');
    else
      document.body.setAttribute('color-theme', 'light');
  }


  // GETTERS :
  getValues(){
    return this.object.getValue()
  }

  getSettings(): Observable<Settings> {
    return this.object.asObservable();
  }
}
