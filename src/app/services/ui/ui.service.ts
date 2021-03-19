import { Injectable } from '@angular/core';
import {LoadingController, ToastController} from "@ionic/angular";
import { Plugins, HapticsImpactStyle } from '@capacitor/core';

const { Haptics } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class UiService {


  constructor( private toastController: ToastController,
               private loadingController: LoadingController) { }

  async presentToast(message : string, color: string, duration : number) {
    const toast = await this.toastController.create({
      animated: true,
      keyboardClose: true,
      message: message,
      duration: duration,
    });
    toast.color = color
    await toast.present();
  }
  async LoadingSpinner() {
    await this.loadingController.create({ message: 'Please wait...'}).then((loading) => {
      return loading
    })

  }

  public vibration(){
    Haptics.vibrate()
  }

}
