import {Component, OnInit} from '@angular/core';
import {SettingService} from "../../services/setting/setting.service";
import {PickerController} from "@ionic/angular";
import {Settings} from "../../models/settings";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  settings : Settings
  language = 'english (UK)';

  constructor(private settingService : SettingService,
              private pickerController: PickerController) {


    this.settingService.getSettings().subscribe((value) => {
      this.settings = value;
      console.log("settings page :")
      console.log(this.settings)
    });
  }

  ngOnInit() { }


  async showPicker() {
    let options = {
      buttons: [
        {
          text:'ok',
          handler:(value:any) => {
            console.log(value);
            this.language = value.languages.text
          }
        }
      ],
      columns:[{
        name:'languages',
        options: [  {text: "arabic (AR)", value: 'AR'},
                    {text: "english (UK)", value: 'UK'},
                    {text: "english (USA)", value: 'USA'},
                    {text: "french (FR)", value: 'FR'},
                 ]
      }]
    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }

  /**
   * Enable/disable dark mode
   * @param event
   */
  onDarkModeToggle(event) {
    this.settings.darkMode = !!event.detail.checked
    this.settingService.setSettings(this.settings);

  }

  /**
   * Enable/disable push notif
   * @param event
   */
  onNotificationToggle(event) {
    this.settings.notification = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable delete confirmation
   * @param event
   */
  onConfirmDeleteToggle(event) {
    this.settings.confirmation = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable secure unlock
   * @param event
   */
  onSecureUnlockToggle(event) {
    this.settings.passcode = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable haptics
   * @param event
   */
  onHapticsToggle(event) {
    this.settings.haptics = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Enable/disable vibrations
   * @param event
   */
  onVibrationsToggle(event) {
    this.settings.vibrations = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

  /**
   * Change speech language
   * @param event
   */
  onSpeechLanguageChange(event) {
  }

  /**
   * Enable/disable text to speech
   * @param event
   */
  onSpeechToggle(event) {
    this.settings.textToSpeech = !!event.detail.checked
    this.settingService.setSettings(this.settings);
  }

}
