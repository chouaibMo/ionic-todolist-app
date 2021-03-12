import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

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
}
