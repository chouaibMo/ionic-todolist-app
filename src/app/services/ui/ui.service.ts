import { Settings } from './../../models/settings';
import { SettingService } from './../setting/setting.service';
import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";
import { Plugins, HapticsImpactStyle, Capacitor } from '@capacitor/core';

const { Haptics } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private settings : Settings

  constructor(private settingService: SettingService,
              private toastController: ToastController) { 

    this.settingService.getSettings().subscribe(value => this.settings = value)              
  }

  /**
   * Present a toast
   * @param message toast message
   * @param color teast color (primary, warning, success ...)
   * @param duration duration of the toast (in ms)
   */
  async presentToast(message : string, color: string, duration : number) {
    const toast = await this.toastController.create({
      animated: true,
      keyboardClose: true,
      message: message,
      duration: duration,
    });
    toast.color = color

    if(this.settings.haptics)
      this.hapticsImpactHeavy()
    await toast.present();
  }

  
  public async vibration(){
    if(Capacitor.isPluginAvailable('Haptics'))
        await Haptics.vibrate()
  }

  public async hapticsImpactMedium(){
    if(Capacitor.isPluginAvailable('Haptics'))
      await Haptics.impact({ style: HapticsImpactStyle.Medium });
  }

  public async hapticsImpactHeavy(){
    if(Capacitor.isPluginAvailable('Haptics'))
      await Haptics.impact({ style: HapticsImpactStyle.Heavy });
  }
  
  public async hapticsImpactLight(){
    if(Capacitor.isPluginAvailable('Haptics'))
      await Haptics.impact({ style: HapticsImpactStyle.Light });
  }

}
