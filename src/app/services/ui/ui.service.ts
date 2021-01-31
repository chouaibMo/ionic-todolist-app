import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor( private toastController: ToastController) { }

  async presentToast(message : string, color: string, duration : number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.color = color
    await toast.present();
  }

}
