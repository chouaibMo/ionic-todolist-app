import { Injectable } from '@angular/core';
import { LocalNotificationSchedule, Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  public async requestPermission(){
    await LocalNotifications.requestPermission()
  }
  
  public async setNotifications(id: number, title: string, body: string) {
    const mySchedule: LocalNotificationSchedule = {
      repeats: true,
      every: 'minute',

    };
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: id,
          schedule: mySchedule,
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  }
}
