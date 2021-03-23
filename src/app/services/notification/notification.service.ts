import { Injectable } from '@angular/core';
import { LocalNotificationRequest, LocalNotificationSchedule, Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  public async requestPermission(){
    await LocalNotifications.requestPermission()
  }
  
  /**
   * Scedule a notification
   * @param id notification id
   * @param title notification title
   * @param body notification body
   */
  public async setNotifications(id: number, title: string, body: string) {
    const mySchedule: LocalNotificationSchedule = { repeats: true, every: 'minute' };
    const notifs = await LocalNotifications.schedule({
      notifications: [{
        title: title,
        body: body,
        id: id,
        schedule: mySchedule,
        sound: null,
        attachments: null,
        actionTypeId: "",
        extra: null
      }]
    });
  }


  /**
   * Cancel a notification by id
   * @param id notification id
   */
  public async cancelNotifications(id : string){
    const notifications: LocalNotificationRequest[] = [{ id : id }];
    await LocalNotifications.cancel({notifications});
  }
}
